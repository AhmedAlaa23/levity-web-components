import {lwcWriteCSSRule} from '../utils.js'

const lvInput = customElements.define('lv-input', class extends HTMLElement {
	//<input-outlined value='' label='' type='text'>
	//	<i class="material-icons" slot='left'>favorite</i>
	//	<i class="material-icons" slot='right'>visibility</i>
	//</input-outlined>

	constructor() {
		super();

		this.type = 'text';
		this.label = '';
		this.width = '100%';

		// Attach a shadow root to.
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `
		<style>
			:host{
				display: block;
				overflow: hidden;
				box-sizing: border-box;
				width: ${this.width};
			}

			#container{
				margin-top: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: relative;
				box-sizing: border-box;
				border: 1px solid gray;
				border-radius: 3px;
				padding: 10px 0px;
				background-color: inherit;
			}

			#container:hover{
				border: 1px solid #222;
			}

			#left, #right{
				display: flex;
			}

			#left{
				margin-left: 10px;
			}

			#right{
				margin-right: 10px;
			}

			#center{
				position: relative;
				flex: 1;
				margin: 0px 10px;
				line-height: 1.3;
				background-color: inherit;
			}

			#label{
				position: absolute;
				top: 0;
				left: 0;
				transition: all 0.2s;
				background-color: white;
				backdrop-filter: blur(20px);
				font-family: sans-serif;
				font-size: 20px;
			}

			#input{
				border: 0;
				outline: none;
				width: 100%;
				background-color: inherit;
				font-family: sans-serif;
				font-size: 20px;
			}

			#input::-webkit-outer-spin-button,
			#input::-webkit-inner-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}
		</style>

		<div id='container'>
			<div id='left'>
				<slot name='left'></slot>
			</div>
			
			<div id='center'>
				<input id='input'/>
				<div id='label'></div>
			</div>
			
			<div id='right'>
				<slot name='right'></slot>
			</div>
		</div>
		`;
	}

	get value(){
		if( this.hasAttribute('value') ){
			return this.getAttribute('value');
		}
		else{
			return "";
		}
	}

	set value(val) {
		if(this.type == 'number' && !isNaN(val) && isNaN(Number(val)) ){
			val = Number(val);
			if( !(val >= this.min && val <= this.max) ){
				if(val > this.max && this.max != null){
					val = this.max;
				}
				else if(val < this.min && this.min != null){
					val = this.min;
				}
			}
		}

		this.setAttribute('value',val);
		this.shadowRoot.getElementById('input').value = this.value;
	}

	static get observedAttributes() {
		return ['value','label','max','min','width'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			if(attrName == "value"){
				this.value = newValue;
			}
			else{
				this.updateComponent();
			}
		}
	}

	checkValidity(){
		if(this.hasAttribute('readonly')){
			return true;
		}
		return this.shadowRoot.querySelector('#input').checkValidity();
	}

	reportValidity(msg=null){
		return this.shadowRoot.querySelector('#input').reportValidity();
	}

	focus(){
		this.shadowRoot.getElementById('input').focus();
	}

	updateComponent(){
		this.type = this.hasAttribute('type')? this.getAttribute('type'):'text';
		let required = this.hasAttribute('required')? true:false;
		let readonly = this.hasAttribute('readonly')? true:false;
		this.width = this.getAttribute('width') ?? this.width;
		this.label = this.getAttribute('label') ?? this.label;


		this.shadowRoot.getElementById('input').setAttribute('placeholder', this.label);

		this.shadowRoot.getElementById('input').setAttribute('type',this.type);
		if(required){this.shadowRoot.getElementById('input').setAttribute('required','')}
		if(readonly){this.shadowRoot.getElementById('input').setAttribute('readonly','')}

		if(this.hasAttribute('min')){
			this.shadowRoot.getElementById('input').setAttribute('min', this.getAttribute('min'));
		}
		if(this.hasAttribute('max')){
			this.shadowRoot.getElementById('input').setAttribute('max', this.getAttribute('max'));
		}

		const hostStyle = `{
			display: block;
			overflow: hidden;
			box-sizing: border-box;
			width: ${this.width};
		}`

		const inputStyle = `{
			border: 0;
			outline: none;
			width: 100%;
			background-color: inherit;
			font-family: sans-serif;
			font-size: 20px;
		}`;

		lwcWriteCSSRule(`:host`, hostStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`:host > input`, inputStyle, this.shadowRoot.styleSheets[0]);
	}

	connectedCallback() {
		this.updateComponent();

		// if(readonly){
		// 	// this is a workaround because html doesn't support validation on readonly inputs
		// 	this.shadowRoot.getElementById('input').addEventListener('keydown',(e)=>{
		// 		e.preventDefault();
		// 	})
		// }

		//==========================

		this.shadowRoot.getElementById('input').addEventListener('change',(e)=>{
			this.value = e.target.value;
			// on input change trigger the onchange event in the custom elem
			this.dispatchEvent(new Event('change', { 'bubbles': false }));
		});

		this.shadowRoot.getElementById('input').addEventListener('keyup',(e)=>{
			// this.value = e.target.value;
			this.setAttribute('value', e.target.value);
		});

		this.shadowRoot.getElementById('container').addEventListener('click',()=>{
			this.shadowRoot.getElementById('input').focus();
		});

		this.shadowRoot.getElementById('input').addEventListener('focus',()=>{
			this.shadowRoot.getElementById('container').style.border = "2px solid #222";
		});

		this.shadowRoot.getElementById('input').addEventListener('focusout',()=>{
			this.dispatchEvent(new Event('change', { 'bubbles': false }));
			this.shadowRoot.getElementById('container').style.border = "1px solid gray";
		});

	}

	disconnectedCallback(){
		this.shadowRoot.getElementById('input').removeEventListener('keyup',()=>{});
		this.shadowRoot.getElementById('container').removeEventListener('click',()=>{});
		this.shadowRoot.getElementById('input').addEventListener('focus',()=>{});
		this.shadowRoot.getElementById('input').addEventListener('focusout',()=>{});
		let readonly = this.hasAttribute('readonly')? true:false;
		
		if(readonly){
			this.shadowRoot.getElementById('input').removeEventListener('keydown',(e)=>{})
		}
	}

});

export default lvInput