
import {lwcWriteCSSRule} from '../utils.js'

const lvHeader = customElements.define('lv-header', class extends HTMLElement {
	constructor() {
		super();
	}

	static get observedAttributes() {
		return ['padding', 'bg', 'pos'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.rewriteStyle();
		}
	}

	rewriteStyle(){
		let elemId = this.id;

		let pad = this.getAttribute('pad') ?? '20px 20px';
		let bg = this.getAttribute('bg') ?? 'white';
		let pos = this.getAttribute('pos') ?? 'initial';

		let elemStyle = `{
			width: 100%;
			position: ${pos};
			display: grid;
			grid-template-columns: [left] auto [center] auto [right] auto [end];
			align-items: center;
			justify-items: center;
			padding: ${pad};
			background-color: ${bg};
			box-sizing: border-box;
			// box-shadow: 0px 1px 2px #dcdcdc;
			// border-bottom: 1px solid gray;
		}
		`;

		let leftChildElem = this.querySelector("[pos='l']");
		if(leftChildElem){
			let leftChildAlign = leftChildElem.getAttribute('align') ?? 'left';
			var leftChildStyle = `{
				// width: 100%;
				grid-column: left;
				justify-self: ${leftChildAlign};
			}
			`;
		}

		let centerChildElem = this.querySelector("[pos='c']");
		if(centerChildElem){
			let centerChildAlign = centerChildElem.getAttribute('align') ?? 'center';
			var centerChildStyle = `{
				// width: 100%;
				grid-column: center;
				justify-self: ${centerChildAlign};
			}
			`;
		}

		let rightChildElem = this.querySelector("[pos='r']");
		if(rightChildElem){
			let rightChildAlign = rightChildElem.getAttribute('align') ?? 'right';
			var rightChildStyle = `{
				// width: 100%;
				grid-column: right;
				justify-self: ${rightChildAlign};
			}
			`;
		}

		lwcWriteCSSRule(`#${elemId}`,elemStyle)
		if(leftChildElem){lwcWriteCSSRule(`#${elemId} > [pos="l"]`, leftChildStyle)}
		if(centerChildElem){lwcWriteCSSRule(`#${elemId} > [pos="c"]`, centerChildStyle)}
		if(rightChildElem){lwcWriteCSSRule(`#${elemId} > [pos="r"]`, rightChildStyle)}
	}

	connectedCallback() {
		this.rewriteStyle()
	}

	disconnectedCallback(){

	}

});

export default lvHeader