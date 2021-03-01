
import {lwcWriteCSSRule} from '../utils.js'

const lvTeleport = customElements.define('lv-teleport', class extends HTMLElement {
	constructor() {
		super();

		this['open'] = false;
		this['pos'] = 'top';
		this['bg'] = '#fff';
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
		// let elemId = this.id;

		this['open'] = this.hasAttribute('open')? true:false;
		this['pos'] = this.getAttribute('pos') ?? this['pos'];

		
	}

	connectedCallback() {
		this.updateComponent();
	}

	disconnectedCallback(){

	}

});

export default lvTeleport