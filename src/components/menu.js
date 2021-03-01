
import {lwcWriteCSSRule} from '../utils.js'

const lvMenu = customElements.define('lv-menu', class extends HTMLElement {
	constructor() {
		super();

		this['mobile-breakpoint'] = '800px';
		this['open'] = false;
		this['pos'] = 'top';
		this['type'] = 'full';
		this['style'] = 'slide';
		this['bg'] = '#fff';
		this['pad'] = '0px';

		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `
		<style>
		</style>

		<div id='container'>
			<slot></slot>
		</div>
		`;
	}

	static get observedAttributes() {
		return ['open','pos','bg'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.updateComponent();
		}
	}

	updateComponent(){
		this['disable-on'] = this.getAttribute('disable-on');
		this['open'] = this.hasAttribute('open')? true:false;
		this['pos'] = this.getAttribute('pos') ?? this['pos'];
		this['pad'] = this.getAttribute('pad') ?? this['pad'];

		let hostStyle = '{}';
		let containerStyle = '{}';

		hostStyle = `{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: auto;
			min-height: 0px;
			max-height: 0px;
			background: ${this['bg']};
			overflow: hidden;
			box-sizing: border-box;
			transition: all .3s ease-in-out;
		}`;
		
		let hostOpenStyle = `:host([open]){
			min-height: 100vh;
			max-height: 100vh;
		}`;

		containerStyle = `{
			width: 100%;
			height: 100%;
			padding: ${this.pad};
			box-sizing: border-box;
		}`;

		let mobileMediaQuery = `@media (max-width:${this['mobile-breakpoint']}){
			${this['disable-on']!='m'? `:host ${hostStyle} ${hostOpenStyle} #container ${containerStyle}`:``}
		}`;

		let desktopMediaQuery = `@media (min-width:${this['mobile-breakpoint']}){
			${this['disable-on']!='d'? `:host ${hostStyle} ${hostOpenStyle} #container ${containerStyle}`:``}
		}`;

		this.shadowRoot.querySelector('style').innerHTML = `${mobileMediaQuery} ${desktopMediaQuery}`;
		// lwcWriteCSSRule(`:host`, hostStyle, this.shadowRoot.styleSheets[0])
		// lwcWriteCSSRule(`#container`, containerStyle, this.shadowRoot.styleSheets[0])
		// lwcWriteCSSRule(`@media (max-width:${this['mobile-breakpoint']})`, mobileMediaQuery, this.shadowRoot.styleSheets[0])
		// lwcWriteCSSRule(`@media (min-width:${this['mobile-breakpoint']})`, desktopMediaQuery, this.shadowRoot.styleSheets[0])
		
		if(this.hasAttribute('entangled')){
			const entangledElemSelectorToToggleOpen = this.getAttribute('entangled');
			document.querySelector(entangledElemSelectorToToggleOpen).toggleAttribute('open', this.open);
		}
	}

	connectedCallback() {
		this.updateComponent();
	}

	disconnectedCallback(){}

});

export default lvMenu