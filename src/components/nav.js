
import {lwcWriteCSSRule} from '../utils.js'

const lvNav = customElements.define('lv-nav', class extends HTMLElement {
	constructor() {
		super();
	}

	static get observedAttributes() {
		return ['gaps', 'bg', 'res'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.updateComponent();
		}
	}

	updateComponent(){
		let elemId = this.id;

		let fontColor = this.getAttribute('color') ?? 'black';
		let fontSize = this.getAttribute('f-size') ?? '18px';
		let bg = this.getAttribute('bg') ?? 'rgba(0,0,0,0)';
		let gap = this.getAttribute('gap') ?? '20px';
		let mWidth = this.getAttribute('m-width') ?? '800px';

		let elemStyle = `{
			width: auto;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: ${gap};
			background: ${bg};
		}
		`;

		let childrenStyle = `{
			color: ${fontColor};
			font-size: ${fontSize};
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

		lwcWriteCSSRule(`#${elemId}`, elemStyle)
		lwcWriteCSSRule(`#${elemId} > *`, childrenStyle)
		lwcWriteCSSRule(`#${elemId} > *:hover`, childrenHoverStyle)
		lwcWriteCSSRule(`@media (max-width:${mWidth})`, mediaQuery)
		lwcWriteCSSRule(`#${elemId} a`, '{text-decoration: none;}')
	}

	connectedCallback() {
		this.updateComponent();

		// window.addEventListener('resize', (e)=>{
		// 	console.log(window.innerWidth);
		// })
	}

	disconnectedCallback(){

	}

});

export default lvNav