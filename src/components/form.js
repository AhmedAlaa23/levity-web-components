import {lwcWriteCSSRule} from '../utils.js'

const lvForm = customElements.define('lv-form', class extends HTMLElement {

  constructor() {
  	super();
		this.bindObject = {};
		this.bindOptions = {emptyEqualsUndefined: true};
		this.isListeningForChanges = true;
	}

	get onsubmit(){
		if( this.hasAttribute('onsubmit') ){return this.getAttribute('onsubmit')}
		else{return null}
	}
	set onsubmit(val) {
		this.setAttribute('onsubmit',val);
	}

	static get observedAttributes() {
    return ['onsubmit'];
  }

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			if(attrName == "onsubmit"){
				this.cols = newValue;
			}
		}
	}

	checkValidity(){
		let children = [...this.children];
		for(let child of children){
			if(child.tagName=='INPUT' || child.tagName.split('-').includes('INPUT')){
				if(!child.checkValidity()){
					return false;
				}
			}
		}
		return true;
	}

	reportValidity(){
		let children = [...this.children];
		for(let child of children){
			if(child.tagName=='INPUT' || child.tagName.split('-').includes('INPUT')){
				if(!child.reportValidity()){
					return false;
				}
			}
		}
		return true;
	}

	assembleSubData({parentVar, parentVarType, parentElement, assembleLevel}){
		const assembleElements = Array.from(parentElement.querySelectorAll(`[lv-form-assemble-level='${assembleLevel}']`));
		
		for(const assembleElement of assembleElements){
			const assembleElementName = assembleElement.getAttribute('lv-form-assemble').split(':')[0];
			const assembleElementType = assembleElement.getAttribute('lv-form-assemble').split(':')[1];
			let assembleVar = assembleElementType==='obj'? {}:[];
			
			//*=================
			const assembleInputs = Array.from(assembleElement.querySelectorAll('[name]'));
			for(const assembleInput of assembleInputs){
				const doesInputBelongToThisParent = (element)=>{
					let rootElement = assembleElement;
					while(element.parentElement!=rootElement){
						if(element.hasAttribute('lv-form-assemble')){ return false; }
						element = element.parentElement;
					}
					return true;
				}

				if(doesInputBelongToThisParent(assembleInput)){
					const subInputName = assembleInput.getAttribute('name');
					const subInputValue = this.bindOptions.emptyEqualsUndefined && assembleInput.value===""? undefined:assembleInput.value;
					assembleVar[subInputName] = assembleInput.getAttribute('type')==='number'? isNaN(Number(subInputValue))? undefined:Number(subInputValue) : subInputValue;
				}
			}
			//*======================

			const formSubProps = Array.from(assembleElement.querySelectorAll(`[lv-form-assemble-level='${assembleLevel+1}']`));
			for(const formSubProp of formSubProps){
				const formSubPropName = formSubProp.getAttribute('lv-form-assemble').split(':')[0];
				const formSubPropType = formSubProp.getAttribute('lv-form-assemble').split(':')[1];
				let formSubPropVar = formSubPropType==='arr'? []:{};
				if(assembleElementType==='obj'){ assembleVar[formSubPropName] = formSubPropVar; }
				// if(assembleElementType==='arr'){ assembleVar.push(formSubPropVar); }
			}

			if(parentVarType==='arr'){ parentVar.push(assembleVar); }
			else if(parentVarType==='obj'){ parentVar[assembleElementName] = assembleVar; }
			
			this.assembleSubData({parentVar: assembleVar, parentVarType: assembleElementType, parentElement: assembleElement, assembleLevel: assembleLevel+1})
		}
	}

	serializeData(){
		const directInputs = Array.from(this.querySelectorAll('[name]'));
		for(let directInput of directInputs){
			const doesInputBelongToThisParent = (element)=>{
				let root = this;
				while(element.parentElement!=root){
					if(element.hasAttribute('lv-form-assemble')){ return false; }
					element = element.parentElement;
				}
				return true;
			}

			if(doesInputBelongToThisParent(directInput)){
				const directInputName = directInput.getAttribute('name');
				const directInputValue = this.bindOptions.emptyEqualsUndefined && directInput.value===""? undefined:directInput.value;
				this.bindObject[directInputName] = directInput.getAttribute('type')==='number'? isNaN(Number(directInputValue))? undefined:Number(directInputValue) : directInputValue;
			}
		}

		//*========
		const formProps = Array.from(this.querySelectorAll("[lv-form-assemble-level='0']"));
		for(const formProp of formProps){
			const formPropName = formProp.getAttribute('lv-form-assemble').split(':')[0];
			const formPropType = formProp.getAttribute('lv-form-assemble').split(':')[1];
			if(formPropType==='arr'){ this.bindObject[formPropName] = [] }
			else if(formPropType==='obj'){ this.bindObject[formPropName] = {} }

			// todo: if there are inputs in level 0 directly, it won't be handled it will be ignored, need to handle them

			//*========
			this.assembleSubData({parentVar: this.bindObject[formPropName], parentVarType: formPropType, parentElement: formProp, assembleLevel: 1});
			//*========
		}
		//*========
	}

	assignChangeEventsListenersToInputs(){
		const inputs = Array.from(this.querySelectorAll('[name]'))
		for(const input of inputs){
			if(!input.hasAttribute('lv-form-bind-event')){
				input.addEventListener('change', ()=>{
					if(this.isListeningForChanges){
						this.serializeData();
					}
				});
				input.setAttribute('lv-form-bind-event','');
			}
		}
	}

	bind(bindObject={}, options={emptyEqualsUndefined: true}){
		this.bindObject = bindObject;
		this.bindOptions = options;

		// this.serializeData();
		// this.assignChangeEventsListenersToInputs();
	}

	updateNestedInputsValues({parentVar, parentVarType, parentElement, assembleLevel}){
		const assembleElements = Array.from(parentElement.querySelectorAll(`[lv-form-assemble-level='${assembleLevel}']`));
		for(const assembleElement of assembleElements){
			const assembleElementName = assembleElement.getAttribute('lv-form-assemble').split(':')[0];
			const assembleElementType = assembleElement.getAttribute('lv-form-assemble').split(':')[1];
			
			let currentVar = undefined;
			if(parentVarType==='arr'){
				const assembleElementIndex = Array.from( parentElement.querySelectorAll(`[lv-form-assemble-level='${assembleLevel}']`) ).findIndex((elem)=>elem===assembleElement);
				currentVar = parentVar[assembleElementIndex];
			}
			else if(parentVarType==='obj'){ currentVar = parentVar[assembleElementName] }

			//*=================
			const assembleElementInputs = Array.from(assembleElement.querySelectorAll('[name]'));
			for(const assembleElementInput of assembleElementInputs){
				const doesInputBelongToThisParent = (element)=>{
					let rootElement = assembleElement;
					while(element.parentElement != rootElement){
						if( element.parentElement.hasAttribute('lv-form-assemble-level') && element.parentElement.getAttribute('lv-form-assemble-level') > assembleLevel ){ return false; }
						element = element.parentElement;
					}
					return true;
				}

				if(doesInputBelongToThisParent(assembleElementInput)){
					const assembleElementInputName = assembleElementInput.getAttribute('name');
					assembleElementInput.value = currentVar[assembleElementInputName]===undefined? "":currentVar[assembleElementInputName];
					
					if(assembleElementInput.hasAttribute('lv-form-bind-attr')){
						const assembleElementInputAttributeName = assembleElementInput.getAttribute('lv-form-bind-attr').split(':')[0];
						const assembleElementAttributeValueVarName = assembleElementInput.getAttribute('lv-form-bind-attr').split(':')[1];
						assembleElementInput.setAttribute(assembleElementInputAttributeName, currentVar[assembleElementAttributeValueVarName]);
					}
				}
			}
			//*======================

			this.updateNestedInputsValues({parentVar: currentVar, parentVarType: assembleElementType, parentElement: assembleElement, assembleLevel: assembleLevel+1});
		}
	}

	updateInputValues(){
		this.isListeningForChanges = false;
		//*========= direct inputs
		const directInputs = Array.from(this.querySelectorAll('[name]'));
		for(let directInput of directInputs){
			const doesInputBelongToThisParent = (element)=>{
				let root = this;
				while(element.parentElement!=root){
					if(element.hasAttribute('lv-form-assemble')){ return false; }
					element = element.parentElement;
				}
				return true;
			}

			if(doesInputBelongToThisParent(directInput)){
				const directInputName = directInput.getAttribute('name');
				directInput.value = this.bindObject[directInputName]===undefined? "":this.bindObject[directInputName];
			}
		}
		//*==============

		//*========= direct attributes
		const directAttributeElements = Array.from(this.querySelectorAll('[lv-form-bind-attr]'));
		for(let directAttributeElement of directAttributeElements){
			const doesInputBelongToThisParent = (element)=>{
				let root = this;
				while(element.parentElement!=root){
					if(element.hasAttribute('lv-form-assemble')){ return false; }
					element = element.parentElement;
				}
				return true;
			}

			if(doesInputBelongToThisParent(directAttributeElement)){
				const directAttributeName = directAttributeElement.getAttribute('lv-form-bind-attr').split(':')[0];
				const directAttributeValueVarName = directAttributeElement.getAttribute('lv-form-bind-attr').split(':')[1];
				directAttributeElement.setAttribute(directAttributeName, this.bindObject[directAttributeValueVarName]);			
			}
		}
		//*=======================

		//*============== update nested assembled data ===============
		this.updateNestedInputsValues({parentVar: this.bindObject, parentVarType: 'obj', parentElement: this, assembleLevel:0});
		//*============================
		this.isListeningForChanges = true;
	}

	connectedCallback() {
	}

	disconnectedCallback(){
	}

});

export default lvForm