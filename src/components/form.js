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
	}

	updateValues(formObject={}, options={emptyEqualsUndefined: true}){
		const inputs = Array.from(this.querySelectorAll('[name]'));
		for(let input of inputs){
			let inputName = input.getAttribute('name');
			input.value = formObject[inputName]===undefined? "":formObject[inputName];
			const inputValue = options.emptyEqualsUndefined && input.value===""? undefined:input.value;
			formObject[inputName] = input.getAttribute('type')==='number'? Number(inputValue):inputValue;
		}
	}

	connectedCallback() {
		
	}

	disconnectedCallback(){
	}

});

export default lvForm