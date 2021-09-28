import {lwcWriteCSSRule} from '../utils.js'

const lvOverlay = customElements.define('lv-overlay', class extends HTMLElement {
	constructor() {
		super();

		this['mobile-breakpoint'] = '800px';
		this['bg'] = 'rgb(204 204 204 / 0%)';
		this['attach-to'] = ''; // DOM element id or default center of page
		this['attach-style'] = 'bottom-center'; // bottom or top then left or right or center of the element 
		this['attach-gap'] = '5'; // gap between attach-to and overlay content
		this['padding'] = '0';
		this['opened'] = false;

		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `
		<style>
		</style>

		<div id='content-wrapper'>
		 <slot></slot>
		</div>
		`;
	}

	static get observedAttributes() {
		return ['mobile-breakpoint','opened','bg','attach-to','attach-style','attach-gap','pad'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.updateComponent();
		}
	}

	open(){
		this.setAttribute('opened', '');
	}

	close(){
		this.removeAttribute('opened');
	}

	toggle(){
		if(this.hasAttribute('opened')){ this.close(); }
		else{ this.open(); }
	}


	updateComponent(){
		this['mobile-breakpoint'] = this.getAttribute('mobile-breakpoint') ?? this['mobile-breakpoint'];
		this['attach-to'] = this.getAttribute('attach-to') ?? this['attach-to'];
		this['attach-style'] = this.getAttribute('attach-style') ?? this['attach-style'];
		this['attach-gap'] = this.getAttribute('attach-gap') ?? this['attach-gap'];
		this['padding'] = this.getAttribute('padding') ?? this['padding'];
		this['bg'] = this.getAttribute('bg') ?? this['bg'];
		this['opened'] = this.hasAttribute('opened')? true:false;

		var contentWrapperPosX = '50%';
		var contentWrapperPosY = '50%';

		const attachToElem = document.getElementById(this['attach-to']);
		const attachToElemRect = attachToElem.getBoundingClientRect();
		//==================
		lwcWriteCSSRule(`:host`, `{display:block}`, this.shadowRoot.styleSheets[0]);
		const contentWrapperRect = this.shadowRoot.getElementById('content-wrapper').getBoundingClientRect();

		const [attachStyleDir, attachStyleAlign] = this['attach-style'].split('-');
		
		if(attachStyleDir === 'bottom'){
			contentWrapperPosY = `${ attachToElemRect.bottom + Number(this['attach-gap']) }px`;
		}
		// //todo
		// else if(attachStyleDir === 'top'){
		// }

		if(attachStyleAlign === 'center'){
			contentWrapperPosX = `${ (attachToElemRect.left + (attachToElemRect.width/2)) - contentWrapperRect.width/2 }px`;
		}
		else if(attachStyleAlign === 'right'){
			contentWrapperPosX = `${ attachToElemRect.right - contentWrapperRect.width }px`;
		}
		else if(attachStyleAlign === 'left'){
			contentWrapperPosX = `${ attachToElemRect.left }px`;
		}

		// console.log(contentWrapperPosX, contentWrapperPosY);

		let elemStyle = `{
			display: ${this['opened']? 'block':'none'};
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			background: ${this['bg']};
		}
		`;

		let contentWrapperStyle = `{
			position: absolute;
			top: ${contentWrapperPosY};
			left: ${contentWrapperPosX};
			transform: ${this['attach-to'] ? '':'translate(-50%, -50%)'};
			padding: ${this['padding']};
		}`;

		// let childrenHoverStyle = `{
		// 	transform: scale(1.05);
		// }`;

		// let mediaQuery = `{
		// 	#nav{
		// 		flex-direction: column;
		// 	}
		// }`;

		lwcWriteCSSRule(`:host`, elemStyle, this.shadowRoot.styleSheets[0])
		lwcWriteCSSRule(`#content-wrapper`, contentWrapperStyle, this.shadowRoot.styleSheets[0])
		// lwcWriteCSSRule(`:host > *:hover`, childrenHoverStyle, this.shadowRoot.styleSheets[0])
		// lwcWriteCSSRule(`@media (max-width:${this['mobile-breakpoint']})`, mediaQuery, this.shadowRoot.styleSheets[0])
		// lwcWriteCSSRule(`:host a`, '{text-decoration: none;}', this.shadowRoot.styleSheets[0])
	}

	connectedCallback() {
		document.addEventListener('DOMContentLoaded', ()=>{
			this.updateComponent();
		});

		this.addEventListener('click', (e)=>{
			const isTheClickedTargetInsideAnyOfTheSlotAssignedElements = ()=>{
				const slotAssignedElements = this.shadowRoot.querySelector('slot').assignedElements();
				for(const assignedElement of slotAssignedElements){
					if(assignedElement.contains(e.target)){
						return true;
					}
				}
			};

			if( !isTheClickedTargetInsideAnyOfTheSlotAssignedElements() ){
				this.close();
			}
		});
	}

	disconnectedCallback(){}
});

export default lvOverlay