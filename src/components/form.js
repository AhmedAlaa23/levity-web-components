import {lwcWriteCSSRule} from '../utils.js'

const lvForm = customElements.define('lv-form', class extends HTMLElement {

  constructor() {
  	super();
		this.bindObject = {};
		this.bindOptions = {emptyEqualsUndefined: true};
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

	assembleSubData({parentVar, parentVarType, parentElement, isParentDirect=true, assembleLevel}){
		const assembleElements = Array.from(this.querySelectorAll("[lv-form-assemble-level='1']"));
		for(const assembleElement of assembleElements){
			const assembleElementType = assembleElement.getAttribute('lv-form-assemble').split(':')[1];
			let assembleVar = assembleElementType==='obj'? {}:[];
			const assembleInputs = Array.from(assembleElement.querySelectorAll('[lv-form-name]'));
			for(const assembleInput of assembleInputs){
				const directInputName = assembleInput.getAttribute('lv-form-name');
				const directInputValue = this.bindOptions.emptyEqualsUndefined && assembleInput.value===""? undefined:assembleInput.value;
				assembleVar[directInputName] = assembleInput.getAttribute('type')==='number'? Number(directInputValue):directInputValue;
			}

			if(parentVarType==='arr'){
				parentVar.push(assembleVar);
			}
		}
	}

	bindData(){
		const directInputs = Array.from(this.querySelectorAll('[name]'));
		for(let directInput of directInputs){
			const directInputName = directInput.getAttribute('name');
			const directInputValue = this.bindOptions.emptyEqualsUndefined && directInput.value===""? undefined:directInput.value;
			this.bindObject[directInputName] = directInput.getAttribute('type')==='number'? Number(directInputValue):directInputValue;
		}

		//*========
		const formProps = Array.from(this.querySelectorAll("[lv-form-assemble-level='0']"));
		for(const formProp of formProps){
			const formPropName = formProp.getAttribute('lv-form-assemble').split(':')[0];
			const formPropType = formProp.getAttribute('lv-form-assemble').split(':')[1];
			this.bindObject[formPropName] = formPropType==='arr'? []:{};
		
			//*========
			this.assembleSubData({parentVar: this.bindObject[formPropName], parentVarType: formPropType});
			//*========
		}
		//*========

		// this.assembleSubData({parentVar: assembleData, parentDataType: assembleDataType, parentElement: elem, assembleLevel: 0});
		// this.bindObject[assembleDataName] = assembleData;

		console.log('final', this.bindObject);
	}

	assignChangeEventsListenersToInputs(){
		const inputs = Array.from(this.querySelectorAll('[name]'));
		const inputElemChangeEventFunction = (e)=>{
			const inputName = e.target.getAttribute('name');
			const inputValue = this.bindOptions.emptyEqualsUndefined && e.target.value===""? undefined:e.target.value;
			this.bindObject[inputName] = e.target.getAttribute('type')==='number'? Number(inputValue):inputValue;
		}
		for(let input of inputs){
			// input.removeEventListener('change', inputElemChangeEventFunction);
			if(!input.hasAttribute('lv-form-bind-event')){
				input.addEventListener('change', inputElemChangeEventFunction);
				input.setAttribute('lv-form-bind-event','');
			}
		}
		
		//*===== sub assemble data
		const subInputElements = Array.from(this.querySelectorAll('[lv-form-name]'));
		const subInputElemChangeEventFunction = (e)=>{this.assembleBindData();}
		for(let subInputElem of subInputElements){
			// subInputElem.removeEventListener('change', subInputElemChangeEventFunction)
			if(!subInputElem.hasAttribute('lv-form-bind-event')){
				subInputElem.addEventListener('change', subInputElemChangeEventFunction)
				subInputElem.setAttribute('lv-form-bind-event','');
			}
		}
	}

	bind(bindObject={}, options={emptyEqualsUndefined: true}){
		this.bindObject = bindObject;
		this.bindOptions = options;

		this.bindData();

		//*============== assemble sub and nested data ===============
		this.assignChangeEventsListenersToInputs();
	}

	updateValues(){
		const inputs = Array.from(this.querySelectorAll('[name]'));
		for(let input of inputs){
			let inputName = input.getAttribute('name');
			input.value = this.bindObject[inputName]===undefined? "":this.bindObject[inputName];
			const inputValue = this.bindOptions.emptyEqualsUndefined && input.value===""? undefined:input.value;
			this.bindObject[inputName] = input.getAttribute('type')==='number'? Number(inputValue):inputValue;
		}

		//*============== assemble sub and nested data ===============
		this.assembleBindData();
	}

	connectedCallback() {
	}

	disconnectedCallback(){
	}

});

export default lvForm