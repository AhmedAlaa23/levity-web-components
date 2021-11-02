
import {lwcWriteCSSRule} from '../utils.js'

const lvListRender = customElements.define('lv-list-render', class extends HTMLElement {
	constructor() {
		super();

		this.list = [];
  	this.renderFunction = function(item){return `<p>${item}</p>`};

		// this['bg'] = '#1565C0';
		// this['color'] = 'white';
		// this['font-size'] = '20px';
		// this.shape = 'square';
		// this.rounded = '4px';
		// this.mar = '10px';
	}

	get list(){
		return this._list;
	}
	set list(val){
		if(val != this._list){
			this._list = val;
			this.renderList();
		}
	}

	get renderFunction(){
		return this._renderFunction;
	}
	set renderFunction(val){
		if(val != null && val != this._renderFunction){
			this._renderFunction = val;
			this.renderList();
		}
	}

	static get observedAttributes() {
		return ['font-size','shape','bg','color','rounded'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.updateComponent();
		}
	}

	renderList(){
		if(this.isConnected){
			if(this.list != null && typeof this.list[Symbol.iterator] === 'function'){
				this.innerHTML = "";
				if(this.list.length > 0){
					for(let item of this.list){
						this.innerHTML += this.renderFunction(item);
					}
				}
				else{
					// this.innerHTML += "<div style='padding: 10px;'>No Results</div>";
				}
			}
			else{
				console.log(this, "list-view: dataList is not iterable");
			}
		}
	}

	updateComponent(){
		// this.bg = this.getAttribute('bg') ?? this.bg;
		// this.color = this.getAttribute('color') ?? this.color;
		// this['font-size'] = this.getAttribute('font-size') ?? this['font-size'];
		// this.shape = this.getAttribute('shape') ?? this.shape;
		// this.rounded = this.getAttribute('rounded') ?? this.rounded;
		// this.mar = this.getAttribute('mar') ?? this.mar;
		// this.link = this.getAttribute('link');
		// this.target = this.getAttribute('target');

		// const hostStyle = `{
			
		// }`;

		// lwcWriteCSSRule(`:host`, hostStyle, this.shadowRoot.styleSheets[0]);
	}

	connectedCallback() {
		this.updateComponent()
	}

	disconnectedCallback(){}

});

export default lvListRender