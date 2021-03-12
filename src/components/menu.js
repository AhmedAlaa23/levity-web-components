
import {lwcWriteCSSRule} from '../utils.js'

const lvMenu = customElements.define('lv-menu', class extends HTMLElement {
	constructor() {
		super();

		this['mobile-breakpoint'] = '800px';
		this['disable-on'] = null;		// ['null','m','d']
		this['open'] = false;					// [false,true]
		this['display'] = 'overlay';			// ['overlay','block']
		this['pos'] = 'top';					// ['left','top','right','bottom']
		this['toggle-type'] = 'hide';	// ['hide','partial']
		this['open-length'] = 'full';	// ['full','auto',{userInput}]
		this['open-style'] = 'slide';	// ['slide']
		this['bg'] = 'inherit';					// any valid background value
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
		this['display'] = this.getAttribute('display') ?? this['display'];
		this['pos'] = this.getAttribute('pos') ?? this['pos'];
		this['toggle-type'] = this.getAttribute('toggle-type') ?? this['toggle-type'];
		this['open-length'] = this.getAttribute('open-length') ?? this['open-length'];
		this['open-style'] = this.getAttribute('open-style') ?? this['open-style'];
		this['pad'] = this.getAttribute('pad') ?? this['pad'];
		this['bg'] = this.getAttribute('bg') ?? this['bg'];

		let hostStyle = '{}';
		let containerStyle = '{}';

		let positions = '';
		if(this['display']==='overlay'){
			if(this['pos']==='top' || this['pos']==='left'){positions = 'top:0; left:0;'}
			if(this['pos']==='bottom'){positions = 'bottom:0; left:0;'}
			if(this['pos']==='right'){positions = 'top:0; right:0;'}
		}

		let closeWidthsAndHeights = '';
		if(this['pos']==='top' || this['pos']==='bottom'){closeWidthsAndHeights = `width: 100%; height: auto; min-height: 0px; max-height: ${this['toggle-type']==='hide'? '0px':'auto'};`}
		if(this['pos']==='left' || this['pos']==='right'){closeWidthsAndHeights = `width: auto; height: 100%; min-width: 0px; max-width: ${this['toggle-type']==='hide'? '0px':'auto'};`}

		let openWidthsAndHeights = '';
		if(this['pos']==='top' || this['pos']==='bottom'){openWidthsAndHeights = `min-height: ${this['open-length']==='full'? '100vh':'auto'}; max-height: 100vh;`}
		if(this['pos']==='left' || this['pos']==='right'){openWidthsAndHeights = `min-width: ${this['open-length']==='full'? '100vw':'auto'}; max-width: 100vw;`}

		hostStyle = `{
			${this['display']==='block'? 'display: block;':'position: absolute;'};
			${positions}
			${closeWidthsAndHeights}
			background: ${this['bg']};
			overflow: hidden;
			box-sizing: border-box;
			transition: all .3s ease-in-out;
		}`;
		
		let hostOpenStyle = `:host([open]){
			${openWidthsAndHeights}
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