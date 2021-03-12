import {lwcWriteCSSRule} from '../utils.js'

const lvNav = customElements.define('lv-nav', class extends HTMLElement {
	constructor() {
		super();

		this['mobile-breakpoint'] = '800px';
		this['direction'] = 'h'; // ['v','h']
		this['color'] = 'black';
		this['f-size'] = '18px';
		this['bg'] = 'inherit';
		this['gaps'] = '20px';

		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `
		<style>
		</style>

		<slot></slot>
		`;
	}

	static get observedAttributes() {
		return ['gaps', 'bg', 'color', 'f-size'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.updateComponent();
		}
	}

	updateComponent(){
		this['mobile-breakpoint'] = this.getAttribute('mobile-breakpoint') ?? this['mobile-breakpoint'];
		this['direction'] = this.getAttribute('direction') ?? this['direction'];
		this['color'] = this.getAttribute('color') ?? this['color'];
		this['f-size'] = this.getAttribute('f-size') ?? this['f-size'];
		this['bg'] = this.getAttribute('bg') ?? this['bg'];
		this['gaps'] = this.getAttribute('gaps') ?? this['gaps'];

		let elemStyle = `{
			width: auto;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			flex-direction: ${this['direction']==='v'? 'column':'row'};
			gap: ${this['gaps']};
			background: ${this['bg']};
		}
		`;

		let childrenStyle = `{
			color: ${this['color']};
			font-size: ${this['f-size']};
			transition: all 0.2s;
		}`;

		let childrenHoverStyle = `{
			transform: scale(1.05);
		}`;

		let mediaQuery = `{
			#nav{
				flex-direction: column;
			}
		}`;

		lwcWriteCSSRule(`:host`, elemStyle, this.shadowRoot.styleSheets[0])
		lwcWriteCSSRule(`:host > *`, childrenStyle, this.shadowRoot.styleSheets[0])
		lwcWriteCSSRule(`:host > *:hover`, childrenHoverStyle, this.shadowRoot.styleSheets[0])
		lwcWriteCSSRule(`@media (max-width:${this['mobile-breakpoint']})`, mediaQuery, this.shadowRoot.styleSheets[0])
		lwcWriteCSSRule(`:host a`, '{text-decoration: none;}', this.shadowRoot.styleSheets[0])
	}

	connectedCallback() {
		this.updateComponent();
	}

	disconnectedCallback(){}
});

export default lvNav