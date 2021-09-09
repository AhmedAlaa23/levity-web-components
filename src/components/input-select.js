import {lwcWriteCSSRule} from '../utils.js'


const lvInputSelect = customElements.define('lv-input-select', class extends HTMLElement {
	//<input-select value='' label='' type='text'>
	//	<i class="material-icons" slot='left'>favorite</i>
	//	<i class="material-icons" slot='right'>visibility</i>
	//</input-select>

	constructor() {
		super();

		this.width = '100%';
		this.selectList = [];

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

			#select-list{
				display: none;
				position: absolute;
				background-color: white;
				border: 1px solid gray;
				border-bottom-right-radius: 3px;
				border-bottom-left-radius: 3px;
				transition: all 1s;
				overflow: hidden;
				box-sizing: border-box;
				z-index: 100;
				box-shadow: 1px 1px 8px #ccc;
			}

			.list-item{
				font-size: 20px;
				border-bottom: 1px solid gray;
				padding: 10px 10px;
				cursor: pointer;
			}
			

		</style>

		<div id='container'>
			<div id='input-container'></div>

			<div id='select-list'>
				<div id='select-search-container'></div>
				<div id='select-list-content'></div>
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
		this.setAttribute('value',val);
	}

	get dataList(){
		return this._dataList;
	}
	set dataList(val) {
		this._dataList = val;
		this.renderList();
	}

	static get observedAttributes() {
		return ['value','label','list','width'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			if(attrName == "value"){
				this.value = newValue;
				this.setValueText();
			}
			if(attrName == "label"){
				if(this.isConnected){
					let inputElem = this.shadowRoot.querySelector("[elem-name='input']");
					inputElem?.setAttribute('label',newValue);
				}
			}
			if(attrName == 'list'){
				this.setDataListFromAttribute();
			}
		}
	}

	valueSelected(value){
		// console.log(value);
		this.value = value;
		// trigger onchange event
		this.dispatchEvent(new Event('change', { 'bubbles': true }));
	}

	setValueText(){
		// set the input element (input-outlined) with the new value
		let inputElem = this.shadowRoot.querySelector("[elem-name='input']");
		if(this.value != "" && inputElem!=null){
			let valueText = this.dataList.find((item)=>{return item.value==this.value});
			if(valueText != undefined){
				valueText = valueText.text;
			}
			else{
				valueText = "";
			}
			inputElem.value = valueText;
		}
	}

	// render select list html
	renderList(){
		let listElem = this.shadowRoot.getElementById('select-list-content');
		listElem.innerHTML = "";
		for(let item of this.dataList){
			listElem.innerHTML += `
				<div class='list-item' value='${item.value}'>
					${item.text}
				</div>
			`;
		}
		this.addListItemsEventListeners();
	}

	toggleList(state){
		if(state=='show'){
			this.shadowRoot.querySelector("#select-list").style.display = 'block';
		}
		else{
			this.shadowRoot.querySelector("#select-list").style.display = 'none';
		}
	}

	// get dataList data from html attribute if set else wait for it to be set from javascript
	setDataListFromAttribute(){
		if(this.hasAttribute('list')){
			let list = this.getAttribute('list').split(',');
			list = list.map((item)=>{
				let itemsSplitted = item.split(':');
				return {value: itemsSplitted[0].trim(), text: itemsSplitted[1].trim()}
			});
			this.dataList = list;
		}
	}

	// call it every time the list changes so it's on the right html elems
	addListItemsEventListeners(){
		this.shadowRoot.querySelectorAll(".list-item").forEach((elem)=>{
			elem.addEventListener('click',(e)=>{
				this.valueSelected(e.target.getAttribute('value'));
				this.toggleList('hide');
			});
		});
	}

	checkValidity(){
		return this.shadowRoot.querySelector("[elem-name='input']").checkValidity();
	}

	reportValidity(){
		return this.shadowRoot.querySelector("[elem-name='input']").reportValidity();
	}

	connectedCallback() {
		let type = this.hasAttribute('type')? this.getAttribute('type'):'text';
		let label = this.hasAttribute('label')? this.getAttribute('label'):'';
		let required = this.hasAttribute('required')? true:false;
		let readonly = this.hasAttribute('readonly')? true:false;

		// insert the input element (input-outlined)
		this.shadowRoot.getElementById('input-container').innerHTML = `
			<lv-input-outlined elem-name='input' value='' label='${label}' width='${this.width}' ${required? 'required':''} readonly>
				<!--<span slot='right' >X</span>-->
			</lv-input-outlined>
		`;

		this.shadowRoot.getElementById('select-list').style.width = this.shadowRoot.getElementById('container').offsetWidth+'px';

		this.setDataListFromAttribute();
		this.setValueText();

		// event listeners
	// 	this.shadowRoot.getElementById('container').addEventListener('click',()=>{
		// 	this.shadowRoot.querySelector("[elem-name='input']").focus();
		// });

		this.shadowRoot.querySelector("[elem-name='input']").addEventListener('focus',()=>{
			this.toggleList('show');
		});

		this.shadowRoot.querySelector('#container').addEventListener('focusout',(e)=>{	
			setTimeout(()=>{this.toggleList('hide')}, 300);
		});
	}

	disconnectedCallback(){
		this.shadowRoot.querySelectorAll(".list-item").forEach((elem)=>{
			elem.removeEventListener('click',()=>{});
		});
	}

});

export default lvInputSelect