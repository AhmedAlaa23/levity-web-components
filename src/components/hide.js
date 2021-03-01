
import {lwcWriteCSSRule} from '../utils.js'

const lvHide = customElements.define('lv-hide', class extends HTMLElement {
	constructor() {
		super();


		this['mobile-breakpoint'] = '800px';
		this['display'] = 'inline-block';

		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `
		<style>
		</style>

		<slot></slot>
		`;
	}

	static get observedAttributes() {
		return ['hide','hide-on','display','mobile-breakpoint'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.updateComponent();
		}
	}

	_getChildrenProps(){
		let childrenProps = [];
		const children = Array.from(this.children);
		for(let [i, child] of children.entries()){
			if(child.hasAttribute('hide-on')){
				console.log(child.tagName, i+1);
				const tagName = child.tagName;
				const hideOn = child.getAttribute('hide-on');
				const display = child.getAttribute('display');
				
				let childProps = {selector: `${tagName}:nth-child(${i+1})`, hideOn, display}
				childrenProps.push(childProps);
			}
		}
		return childrenProps;
	}

	_createMediaQueries(childrenProps){
		let mobileMediaQuery = `{
			:host{
				display: ${this['hide-on']=='m'? 'none':this['display']};
			}
		`;

		let desktopMediaQuery = `{
			:host{
				display: ${this['hide-on']=='d'? 'none':this['display']};
			}
		`;

		for(let child of childrenProps){
			if(child.hideOn==='m'){
				mobileMediaQuery += `::slotted(${child.selector}){display: none !important;}`;
			}
			if(child.hideOn==='d'){
				desktopMediaQuery += `::slotted(${child.selector}){display: none !important;}`;
			}
		}

		mobileMediaQuery += '}';
		desktopMediaQuery += '}';
		return [mobileMediaQuery, desktopMediaQuery];
	}

	updateComponent(){
		this['hide'] = this.hasAttribute('hide')? true:false;
		this['hide-on'] = this.getAttribute('hide-on');
		this['display'] = this.getAttribute('display') ?? this['display'];

		let childrenProps = this._getChildrenProps();

		const hostStyle = `{
			display: inline-block;
			width: auto;
			height: auto;
			overflow: hidden;
			box-sizing: border-box;
		}`;

		let [mobileMediaQuery, desktopMediaQuery] = this._createMediaQueries(childrenProps);

		lwcWriteCSSRule(`:host`, hostStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`@media (max-width:${this['mobile-breakpoint']})`, mobileMediaQuery, this.shadowRoot.styleSheets[0])
		lwcWriteCSSRule(`@media (min-width:${this['mobile-breakpoint']})`, desktopMediaQuery, this.shadowRoot.styleSheets[0])
	}

	connectedCallback() {
		this.updateComponent();
	}

	disconnectedCallback(){}

});

export default lvHide