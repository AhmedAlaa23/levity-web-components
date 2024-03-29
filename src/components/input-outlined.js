import {lwcWriteCSSRule} from '../utils.js'

const lvInputOutlined = customElements.define('lv-input-outlined', class extends HTMLElement {
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
				/*margin-top: 10px;*/
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
				background-color: inherit;
				backdrop-filter: blur(20px);
				font-family: sans-serif;
				font-size: 20px;
				border-radius: 4px;
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
				if(this.value != ""){
					this.moveLabelUp();
				}
				else{
					// to check if the focus is on the element keep the label up
					if(document.activeElement != this){
						this.moveLabelDown();
					}
				}
			}
			else{
				this.updateComponent();
			}
		}
	}

	moveLabelUp(){
		this.shadowRoot.getElementById('center').style.position = 'initial';

		this.shadowRoot.getElementById('label').style.fontSize = '15px';
		this.shadowRoot.getElementById('label').style.transform = 'translate(12px, -11px)';
		// this.shadowRoot.getElementById('label').style.backgroundColor = 'white';
		this.shadowRoot.getElementById('label').style.padding = '0px 4px';
	}

	moveLabelDown(){
		// input with type date the label can't move down
		if(!['date','datetime-local'].includes(this.type)){
			this.shadowRoot.getElementById('center').style.position = 'relative';
			this.shadowRoot.getElementById('label').removeAttribute('style');
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
		this.width = this.getAttribute('width') ?? this.width;
		this.label = this.getAttribute('label') ?? this.label;

		this.shadowRoot.getElementById('label').innerHTML = this.label;

		if(this.hasAttribute('min')){
			this.shadowRoot.getElementById('input').setAttribute('min', this.getAttribute('min'));
		}
		if(this.hasAttribute('max')){
			this.shadowRoot.getElementById('input').setAttribute('max', this.getAttribute('max'));
		}

		const hostStyle = `{
			display: block;
			/*overflow: hidden;*/
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

		// this.style.width = this.hasAttribute('width')? this.getAttribute('width'):'';
		this.type = this.hasAttribute('type')? this.getAttribute('type'):'text';
		let label = this.hasAttribute('label')? this.getAttribute('label'):'';
		let required = this.hasAttribute('required')? true:false;
		let readonly = this.hasAttribute('readonly')? true:false;

		this.shadowRoot.getElementById('input').setAttribute('type',this.type);
		if(required){this.shadowRoot.getElementById('input').setAttribute('required','')}
		this.shadowRoot.getElementById('label').innerHTML = label;
		if(readonly){this.shadowRoot.getElementById('input').setAttribute('readonly','')}


		if(['date','datetime-local'].includes(this.type)){
			this.moveLabelUp();
			if(this.hasAttribute('date')){
				const dateValue = this.getAttribute('date');
				if(dateValue === 'now'){
					const nowStr = new Intl.DateTimeFormat('sv', {dateStyle: 'short', timeStyle: 'short'}).format(new Date()).replace(' ','T');
					this.value = nowStr;
				}
			}
		}

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
			this.dispatchEvent(new Event('change', { 'bubbles': false }));
		});

		this.shadowRoot.getElementById('container').addEventListener('click',()=>{
			this.shadowRoot.getElementById('input').focus();
		});

		this.shadowRoot.getElementById('input').addEventListener('focus',()=>{
			this.moveLabelUp();
			this.shadowRoot.getElementById('container').style.border = "2px solid #222";
		});

		this.shadowRoot.getElementById('input').addEventListener('focusout',()=>{
			this.dispatchEvent(new Event('change', { 'bubbles': false }));
			
			if(this.shadowRoot.getElementById('input').value == ""){
				this.moveLabelDown();
			}

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

export default lvInputOutlined