import {lwcWriteCSSRule} from '../utils.js'

const lvForm = customElements.define('lv-form', class extends HTMLElement {

  constructor() {
  	super();
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

	assembleBindData({formObject, options}){
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
						const subInputValue = options.emptyEqualsUndefined && subInputElem.value===""? undefined:subInputElem.value;
						assembleSubData[subInputName] = subInputElem.getAttribute('type')==='number'? Number(subInputValue):subInputValue;
					}
					
					// if(elemAssemblePropType==='obj'){assembleData[];}
					if(elemAssemblePropType==='arr'){assembleData.push({...assembleSubData});}
				}
				formObject[elemAssemblePropName] = assembleData;
			}
		}
	}

	assignChangeEventsToSubBindData({formObject, options}){
		const subInputElements = Array.from(this.querySelectorAll('[lv-form-name]'));
		for(let subInputElem of subInputElements){
			subInputElem.addEventListener('change', (e)=>{
				this.assembleBindData({formObject, options});
			})
		}
	}

	bind(formObject={}, options={emptyEqualsUndefined: true}){
		const inputs = Array.from(this.querySelectorAll('[name]'));
		for(let input of inputs){
			// initial bind
			const inputName = input.getAttribute('name');
			const inputValue = options.emptyEqualsUndefined && input.value===""? undefined:input.value;
			formObject[inputName] = input.getAttribute('type')==='number'? Number(inputValue):inputValue;

			input.addEventListener('change', (e)=>{
				const inputName = input.getAttribute('name');
				const inputValue = options.emptyEqualsUndefined && e.target.value===""? undefined:e.target.value;
				formObject[inputName] = e.target.getAttribute('type')==='number'? Number(inputValue):inputValue;
			})
		}

		//*============== assemble sub and nested data ===============
		this.assembleBindData({formObject, options});
		this.assignChangeEventsToSubBindData({formObject, options});
	}

	updateValues(formObject={}, options={emptyEqualsUndefined: true}){
		const inputs = Array.from(this.querySelectorAll('[name]'));
		for(let input of inputs){
			let inputName = input.getAttribute('name');
			input.value = formObject[inputName]===undefined? "":formObject[inputName];
			const inputValue = options.emptyEqualsUndefined && input.value===""? undefined:input.value;
			formObject[inputName] = input.getAttribute('type')==='number'? Number(inputValue):inputValue;
		}

		//*============== assemble sub and nested data ===============
		this.assembleBindData({formObject, options});
	}

	connectedCallback() {
		
	}

	disconnectedCallback(){
	}

});

export default lvForm