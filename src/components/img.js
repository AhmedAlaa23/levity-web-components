
import {lwcWriteCSSRule} from '../utils.js'

const lvImg = customElements.define('lv-img', class extends HTMLElement {
	constructor() {
		super();

		this.width = 'auto';
		this.height = 'auto';
		this.src = '';
		this.fit = 'cover';

		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `
		<style>
			
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
		this.width = this.getAttribute('width') ?? this.width;
		this.height = this.getAttribute('height') ?? this.height;
		this.fit = this.getAttribute('fit') ?? this.fit;
		this.src = this.getAttribute('src') ?? this.src;
	
		const hostStyle = `{
			display: block;
			overflow: hidden;
			width: ${this.width};
			height: ${this.height};
		}`;

		const imgStyle =`{
			width: 100%;
			height: auto;
			object-fit: ${this.fit};
		}`;

		this.shadowRoot.querySelector('img').setAttribute('src', this.src);
		lwcWriteCSSRule(`:host`, hostStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`img`, imgStyle, this.shadowRoot.styleSheets[0]);
	}

	connectedCallback() {
		this.rewriteStyle()
	}

	disconnectedCallback(){}

});

export default lvImg