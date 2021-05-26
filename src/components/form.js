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

	// todo: work on cascading data (Array of objects of array of objects)
	assembleBindData(){
		const assembleElements = Array.from(this.querySelectorAll('[lv-form-assemble]'));
		for(let elem of assembleElements){
			const elemAssemble = elem.getAttribute('lv-form-assemble');
			const elemAssembleType = elem.hasAttribute('lv-form-assemble-type')? elem.getAttribute('lv-form-assemble-type'):'nested';
			const elemAssemblePropName = elemAssemble.split(':')[0];
			const elemAssemblePropType = elemAssemble.split(':')[1];
			
			let assembleData = undefined;
			if(elemAssemblePropType==='obj'){assembleData = {};}
			if(elemAssemblePropType==='arr'){assembleData = [];}
			

			if(elemAssembleType==='nested'){
				const assembleDataElements = Array.from(elem.querySelectorAll('[lv-form-assemble-data]'));
				for(let elemData of assembleDataElements){
					const assembleSubDataType = elemData.getAttribute('lv-form-assemble-data');
					let assembleSubData = undefined;
					if(assembleSubDataType==='obj'){assembleSubData = {};}
					if(assembleSubDataType==='arr'){assembleSubData = [];}
					
					const subInputElements = Array.from(elemData.querySelectorAll('[lv-form-name]'));
					for(let subInputElem of subInputElements){
						const subInputName = subInputElem.getAttribute('lv-form-name');
						const subInputValue = this.bindOptions.emptyEqualsUndefined && subInputElem.value===""? undefined:subInputElem.value;
						assembleSubData[subInputName] = subInputElem.getAttribute('type')==='number'? Number(subInputValue):subInputValue;
					}
					
					// if(elemAssemblePropType==='obj'){assembleData[];}
					if(elemAssemblePropType==='arr'){assembleData.push({...assembleSubData});}
				}
				this.bindObject[elemAssemblePropName] = assembleData;
			}
		}
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
		const inputs = Array.from(this.querySelectorAll('[name]'));
		for(let input of inputs){
			// initial bind
			const inputName = input.getAttribute('name');
			const inputValue = this.bindOptions.emptyEqualsUndefined && input.value===""? undefined:input.value;
			this.bindObject[inputName] = input.getAttribute('type')==='number'? Number(inputValue):inputValue;
		}

		//*============== assemble sub and nested data ===============
		this.assembleBindData();
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