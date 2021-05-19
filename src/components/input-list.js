import {lwcWriteCSSRule} from '../utils.js'

const lvInputList = customElements.define('lv-input-list', class extends HTMLElement {

  constructor() {
  	super();

  	this.dataList = [];
  	// this.dataListFiltered = [];
		this.renderItem = function(){};
		this._currentItem = 0;
		this.search = '';
		this.inputStyle = 'outlined';
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
		if(this.isConnected){
			this.setAttribute('value',val);
			// this.querySelector("[lv-elem-id='input']").setAttribute('value',val);
		}
	}

	get search(){
		return this.search;
	}
	set search(val) {
		if(this.isConnected){
			this.setAttribute('search',val);
		}
	}

	get dataList(){
		return this._dataList;
	}
	set dataList(val){
		if(val != this._dataList){
			this._dataList = val;
			this.dataListFiltered = val;
			this.renderList();
		}
	}

	get renderItem(){
		return this._renderItem;
	}
	set renderItem(val){
		if(val != null && val != this._renderItem){
			this._renderItem = val;
			this.renderList();
		}
	}

	get currentItem(){
		return this._currentItem;
	}

	set currentItem(val){
		if(this.dataList.length != 0 && val >= 0 && val <= this.dataList.length){
			this._currentItem = val;
			this.highlightCurrentItem();
		}
	}

	static get observedAttributes() {
		return ['value','label'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			if(attrName == "value"){
				this.value = newValue;
				let inputElem = this.querySelector("[lv-elem-id='input']");
				if(this.value != "" && inputElem!=null){
					inputElem.value = this.value;
				}
			}
			if(attrName == "label"){
				let inputElem = this.querySelector("[lv-elem-id='input']");
				if(inputElem!=null){
					inputElem.setAttribute('label',newValue);
				}
			}
		}
	}

	renderList(){
		let listElem = this.querySelector("div[lv-elem-id='list']");
		// wait until the list div is loaded
		if(listElem != null){
			if(this.dataList != null && typeof this.dataList[Symbol.iterator] === 'function'){
				listElem.innerHTML = "";
				if(this.dataList.length > 0){
					for(let [index, item] of this.dataList.entries()){
						let elemHtml = `<div item-num="${index}" >`+this.renderItem(item)+'</div>';
						listElem.innerHTML += elemHtml;
					}
				}
				else{
					listElem.innerHTML += "<div style='padding: 10px;'>No Results</div>";
				}
			}
			else{
				console.log("input-list: dataList is not iterable");
			}
			this.highlightCurrentItem();
			this.addClickEventToListItems();
		}
	}

	toggleList(state){
		if(state=='show'){
			this.querySelector("div[lv-elem-id='list']").style.display = 'block';
		}
		else{
			this.querySelector("div[lv-elem-id='list']").style.display = 'none';
		}
	}

	highlightCurrentItem(){
		if(this.isConnected){
			let listElem = this.querySelector("div[lv-elem-id='list']");
			if(listElem){
				if(this._currentItem != 0){
					// listElem.children[this._currentItem-1].style.filter = 'contrast(200%)';
					// listElem.children[this._currentItem-1].focus();
					this.querySelector(`[item-num='${this._currentItem-1}']`).style.filter = 'contrast(200%)';
					// this.querySelector(`[item-num='${this._currentItem-1}']`).focus();
				}
			}
		}
	}

	checkValidity(){
		return this.querySelector("[lv-elem-id='input']").checkValidity();
	}

	reportValidity(){
		return this.querySelector("[lv-elem-id='input']").reportValidity();
	}

	addClickEventToListItems(){
		const listItems = Array.from(this.querySelector("[lv-elem-id='list']").children);
		for(const item of listItems){
			item.addEventListener('click', (e)=>{
				const valueElem = item.querySelector('[lv-value]')
				const labelElem = item.querySelector('[lv-label]')
				if(valueElem){this.setAttribute('value', valueElem.getAttribute('lv-value'));}
				if(labelElem){this.querySelector("[lv-elem-id='input']").setAttribute('value', labelElem.getAttribute('lv-label'));}
				this.dispatchEvent(new Event('change', { 'bubbles': false }));
			})
		}
	}

	connectedCallback() {
		let type = this.hasAttribute('type')? this.getAttribute('type'):'text';
		let label = this.hasAttribute('label')? this.getAttribute('label'):'';
		this.inputStyle = this.hasAttribute('input-style')? this.getAttribute('input-style'):this.inputStyle;
		let required = this.hasAttribute('required')? true:false;
		let readonly = this.hasAttribute('readonly')? true:false;


		if(this.inputStyle==='plain'){
			this.innerHTML += `
			<lv-input lv-elem-id='input' value='' label='${label}' type='${type}' ${required? 'required':''} ${readonly? 'readonly':''}></lv-input>`;
		}
		else{
			this.innerHTML += `
			<lv-input-outlined lv-elem-id='input' value='' label='${label}' type='${type}' ${required? 'required':''} ${readonly? 'readonly':''}></lv-input-outlined>`;
		}

		this.innerHTML += `
		<div lv-elem-id='list' style='display:none; position: absolute; left:0; z-index:100; border: 1px solid gray; background-color: white; box-shadow: 1px 1px 8px #ccc; box-sizing: border-box;'></div>`;

		this.style.display = 'block';
		this.style.position = 'relative';
		this.querySelector("div[lv-elem-id='list']").style.top = (this.getBoundingClientRect().height+1)+"px";

		// set the width of the select list to the same width as the main elem
		this.querySelector("div[lv-elem-id='list']").style.width = this.offsetWidth+'px';

		this.addEventListener('keyup', (e)=>{
			if(e.key == 'ArrowUp'){
				this.currentItem = this.currentItem-1;
			}
			else if(e.key == 'ArrowDown'){
				this.currentItem = this.currentItem+1;
			}
			else if(e.key == 'Enter'){
				this.querySelector(`[item-num='${this._currentItem-1}']`).children[0].click();
				this.toggleList('hide');
			}
		});

		this.querySelector("[lv-elem-id='input']").addEventListener('keyup', (e)=>{
			// copy the value to the parent input(elem)

			// this.setAttribute('value', e.target.value);
			// this.setAttribute('search', e.target.value);
			this.search = e.target.value;
			this.dispatchEvent(new Event('change', { 'bubbles': false }));
			// filter data from the array
			// this.dataListFiltered = this.dataList.filter((item)=>{
			// 	return item.name.match( new RegExp(`.*${e.target.value}.*`,'i') );
			// });

			// this.renderList();
			// this.toggleList('show');
		});

		this.querySelector("[lv-elem-id='input']").addEventListener('focus',()=>{
			this.toggleList('show');
		});

		this.addEventListener('focusout',()=>{
			setTimeout(()=>{this.toggleList('hide')}, 300);
		});

	}

	disconnectedCallback(){
		// this.querySelector("[lv-elem-id='input']").removeEventListener('keyup',()=>{});
	}

});

export default lvInputList