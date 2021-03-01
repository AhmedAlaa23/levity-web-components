
import {lwcWriteCSSRule} from '../utils.js'

const lvIcon = customElements.define('lv-icon', class extends HTMLElement {
	constructor() {
		super();

		this.size = '10px';
		this.src = '';

		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `
		<style>
			img{
				width: 100%;
				height: auto;
				object-fit: cover;
			}
		</style>
		
		<img src='${this.src}' />
		`;
	}

	static get observedAttributes() {
		return ['size','src'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.rewriteStyle();
		}
	}

	rewriteStyle(){
		this.size = this.getAttribute('size') ?? '32px';
		this.src = this.getAttribute('src') ?? '';
	
		const hostStyle = `{
			display: flex;
    	justify-content: center;
    	align-items: center;
			overflow: hidden;
			width: ${this.size};
			height: ${this.size};
		}`;

		this.shadowRoot.querySelector('img').setAttribute('src', this.src);
		lwcWriteCSSRule(`:host`, hostStyle, this.shadowRoot.styleSheets[0]);
	}

	connectedCallback() {
		this.rewriteStyle()
	}

	disconnectedCallback(){}

});

export default lvIcon