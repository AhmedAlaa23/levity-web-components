import {lwcWriteCSSRule} from '../utils.js'

const lvExpand = customElements.define('lv-expand', class extends HTMLElement {

  constructor() {
		super();

		this.expandHeight = 0;
		this.animTime = 0.2;
	}

	get expandState(){
		if( this.hasAttribute('expand') ){return this.getAttribute('expand')=='true'? true:false}
		else{return false}
	}
	set expandState(val){
		this.setAttribute('expand',`${val? 'true':'false'}`);
	}

	static get observedAttributes() {
    return ['expand','animtime'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			if(attrName == "expand"){
				if(newValue == 'true'){this.expandState = true}
				else{this.expandState = false}
			}
			if(attrName == "animtime"){
				this.animTime = newValue;
			}
		}
	}

	expand(){
		if(this.isConnected){
			let expandableElem = this.querySelector("[expandable]");
			// expandableElem.style.height = `${this.expandHeight}px`;
			expandableElem.style.maxHeight = '1000px';
			this.expandState = true;
		}
	}
	collapse(){
		if(this.isConnected){
			let expandableElem = this.querySelector("[expandable]");
			expandableElem.style.maxHeight = '0px';
			this.expandState = false;
		}
	}

	toggleExpand(){
		if(this.isConnected){
			if(this.expandState){
				this.collapse();
			}
			else{
				this.expand();
			}
		}
	}

	connectedCallback() {
		// this.style = 'display: block;';

		let expandableElem = this.querySelector("[expandable]");
		if(expandableElem){
			expandableElem.style.height = 'auto';
			expandableElem.style.transition = `all ${this.animTime}s`;
			expandableElem.style.overflow = 'hidden';
			expandableElem.style.boxSizing = 'border-box';
			// this.expandHeight = expandableElem.getBoundingClientRect().height;
			
			this.collapse();
		}


		if(this.querySelector("[expand-btn]")){
			this.querySelector("[expand-btn]").addEventListener('click',()=>{
				this.toggleExpand();
			})
		}
	}

	disconnectedCallback(){
		if(this.querySelector("[expand-btn]")){
			this.querySelector("[expand-btn]").removeEventListener('click',()=>{});
		}
	}

});

export default lvExpand