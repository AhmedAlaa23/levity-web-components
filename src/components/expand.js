import {lwcWriteCSSRule} from '../utils.js'

const lvExpand = customElements.define('lv-expand', class extends HTMLElement {

  constructor() {
		super();

		this.expandHeight = 0;
		this.animTime = 0.2;

		this._expand = false;
	}

	get expand(){
		return this.hasAttribute('expand') ?? this._expand;
	}

	set expand(value){
		value===true? this.setAttribute('expand', '') : this.removeAttribute('expand');
		this._expand = value;
		this.updateComponent();
	}

	static get observedAttributes() {
    return ['expand','animtime'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.updateComponent();
		}
	}

	expandComponent(){
		if(this.isConnected){
			let expandableElem = this.querySelector("[expandable]");
			// expandableElem.style.height = `${this.expandHeight}px`;
			expandableElem.style.maxHeight = '1000px';
			expandableElem.style.overflow = 'initial';
			this._expand = true;
		}
	}
	collapseComponent(){
		if(this.isConnected){
			let expandableElem = this.querySelector("[expandable]");
			expandableElem.style.maxHeight = '0px';
			expandableElem.style.overflow = 'hidden';
			this._expand = false;
		}
	}

	toggleComponent(){
		if(this.isConnected){
			if(this._expand){
				this.collapseComponent();
			}
			else{
				this.expandComponent();
			}
		}
	}

	updateComponent(){

		if(this.expand){
			this.expandComponent();
		}
		else{
			this.collapseComponent();
		}

	}

	connectedCallback() {
		document.addEventListener('DOMContentLoaded', ()=>{
			this.updateComponent();
		});

		let expandableElem = this.querySelector("[expandable]");
		if(expandableElem){
			expandableElem.style.height = 'auto';
			expandableElem.style.transition = `all ${this.animTime}s`;
			expandableElem.style.overflow = 'hidden';
			expandableElem.style.boxSizing = 'border-box';
			// this.expandHeight = expandableElem.getBoundingClientRect().height;
			
			this.collapseComponent();
		}

		if(this.querySelector("[expand-btn]")){
			this.querySelector("[expand-btn]").addEventListener('click',()=>{
				this.toggleComponent();
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