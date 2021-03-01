
import {lwcWriteCSSRule} from '../utils.js'

const lvBars = customElements.define('lv-bars', class extends HTMLElement {
	constructor() {
		super();
		
		this['type'] = 'close';
		this['color'] = '#000';
		this['width'] = 30;
		this['bar-height'] = 4;

		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `
		<style></style>

		<div id='container'>
			<span id='top'></span>
			<span id='middle'></span>
			<span id='bottom'></span>
		</div>
		`;
	}

	static get observedAttributes() {
		return ['open','size','color'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.updateComponent();
		}
	}

	updateComponent(){
		this['open'] = this.hasAttribute('open')? true:false;
		this['type'] = this.getAttribute('type') ?? this['type'];
		this['width'] = this.getAttribute('width') ?? this['width'];
		this['bar-height'] = this.getAttribute('bar-height') ?? this['bar-height'];
		this['color'] = this.getAttribute('color') ?? this['color'];

		if(this.open){this.shadowRoot.querySelector('#container').classList.add('open')}
		else{this.shadowRoot.querySelector('#container').classList.remove('open')}

		const gap = this['bar-height'];

		const hostStyle = `{
			display: inline-block;
			width: ${this['width']}px;
			cursor: pointer;
			overflow: hidden;
			box-sizing: border-box;
		}`;

		const containerStyle = `{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			gap: ${gap}px;
			transition: .2s ease-in-out;
		}`;
		const containerHoverStyle = `{
			opacity: 0.8;
		}`;

		const barsStyle = `{
			display: block;
			width: 100%;
			height: ${this['bar-height']}px;
			background: ${this.color};
			border-radius: 10px;
			opacity: 1;
			transform: rotate(0deg);
			transition: .25s ease-in-out;
		}`;

		const topBarStyle = `{
			transform-origin: center center;
		}`;
		const topBarOpenStyle = `{
			${this.type=='close'? `transform: translateY(${(((this['bar-height']*3)+(gap*2))/2)-(this['bar-height']/2)}px) rotate(45deg)`:''};
		}`;

		const middleBarOpenStyle = `{
			${this.type=='close'? `opacity: 0`:''};
		}`;

		const bottomBarStyle = `{
			transform-origin: center center;
		}`;
		const bottomBarOpenStyle = `{
			${this.type=='close'? `transform: translateY(-${(((this['bar-height']*3)+(gap*2))/2)-(this['bar-height']/2)}px) rotate(-45deg)`:''};
		}`;

		lwcWriteCSSRule(`:host`, hostStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`div`, containerStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`div:hover`, containerHoverStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`span`, barsStyle, this.shadowRoot.styleSheets[0]);
		
		lwcWriteCSSRule(`div span:nth-child(1)`, topBarStyle, this.shadowRoot.styleSheets[0]);
		// lwcWriteCSSRule(`div span:nth-child(2)`, middleBarStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`div span:nth-child(3)`, bottomBarStyle, this.shadowRoot.styleSheets[0]);

		lwcWriteCSSRule(`div.open span:nth-child(1)`, topBarOpenStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`div.open span:nth-child(2)`, middleBarOpenStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`div.open span:nth-child(3)`, bottomBarOpenStyle, this.shadowRoot.styleSheets[0]);
	}

	connectedCallback() {
		this.updateComponent();
	
		this.addEventListener('click', (e)=>{
			if(!this.hasAttribute('static')){
				this.toggleAttribute('open');
			}

			if(this.hasAttribute('entangled')){
				const entangledElemSelectorToToggleOpen = this.getAttribute('entangled');
				document.querySelector(entangledElemSelectorToToggleOpen).toggleAttribute('open', this.open);
			}

			if(this.hasAttribute('click-open')){
				const elemSelectorToToggleOpen = this.getAttribute('click-open');
				document.querySelector(elemSelectorToToggleOpen).toggleAttribute('open');
			}
		})
	}

	disconnectedCallback(){}

});

export default lvBars