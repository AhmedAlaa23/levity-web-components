
import {lwcWriteCSSRule} from '../utils.js'

const lvBtn = customElements.define('lv-btn', class extends HTMLElement {
	constructor() {
		super();

		this['bg'] = '#1565C0';
		this['color'] = 'white';
		this['font-size'] = '20px';
		this.shape = 'square';
		this.rounded = '4px';
		this.mar = '10px';

		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `
		<style>
		</style>

		<slot></slot>
		`;
	}

	static get observedAttributes() {
		return ['font-size','shape','bg','color','rounded'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.updateComponent();
		}
	}

	updateComponent(){
		this.bg = this.getAttribute('bg') ?? this.bg;
		this.color = this.getAttribute('color') ?? this.color;
		this['font-size'] = this.getAttribute('font-size') ?? this['font-size'];
		this.shape = this.getAttribute('shape') ?? this.shape;
		this.rounded = this.getAttribute('rounded') ?? this.rounded;
		this.mar = this.getAttribute('mar') ?? this.mar;
		this.link = this.getAttribute('link');
		this.target = this.getAttribute('target') ?? '_self';

		if(this.link){
			this.shadowRoot.innerHTML = `
			<style>
				a{text-decoration: none; color: ${this.color};}
			</style>
			<a href='${this.link}' target='${this.target}'>
				<slot></slot>
			</a>
			`;
		}

		if(this.shape === 'rounded'){
			this.rounded = '100px';
		}

		const hostStyle = `{
			display: inline-block;
			overflow: hidden;
			background: ${this.bg};
			color: ${this.color};
			font-size: ${this['font-size']};
			border-radius: ${this.rounded};
			text-align: center;
			cursor: pointer;
			padding: 0.5rem 1.2rem !important;
			margin: ${this.mar} !important;
		}`;

		lwcWriteCSSRule(`:host`, hostStyle, this.shadowRoot.styleSheets[0]);
	}

	connectedCallback() {
		this.updateComponent();
	
		// if(this.link){
		// 	this.addEventListener('click', (e)=>{
		// 		location.href = this.link;
		// 	})
		// }
	}

	disconnectedCallback(){}

});

export default lvBtn