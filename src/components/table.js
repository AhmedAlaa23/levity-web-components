import {lwcWriteCSSRule} from '../utils.js'

const lvTable = customElements.define('lv-table', class extends HTMLElement {
	constructor() {
		super();

		this._properties = []; // array of objects {name: '', type: 'string|num|date', cellStyle: 'css'}
		this._rows = []; // array of arrays [[],[]]

		this._gridTemplateColumns = 'repeat(columnsNum, 1fr)';
		this._showCalculations = false;
		
		this['bg'] = 'white';
		this['padding'] = '0';

		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.innerHTML = `
		<style>
		</style>

		<div id='content-wrapper'>
		 <div id='table'>
			<div id='table-properties'></div>
			<div id='table-rows'></div>

			<div id='calculations'></div>
		 </div>
		</div>
		`;
	}

	get properties(){
		return this._properties;
	}

	set properties(value){
		this._properties = value;
		this.updateComponent();
	}

	get rows(){
		return this._rows;
	}

	set rows(value){
		this._rows = value;
		this.updateComponent();
	}

	get gridTemplateColumns(){
		return this.getAttribute('grid-template-columns') ?? this._gridTemplateColumns;
	}

	set gridTemplateColumns(value){
		this.setAttribute('grid-template-columns', value);
		this._gridTemplateColumns = value;
		this.updateComponent();
	}

	get showCalculations(){
		return this.hasAttribute('show-calculations');
	}

	set showCalculations(value){
		this.setAttribute('show-calculations', '');
		this._showCalculations = value;
		this.updateComponent();
	}

	static get observedAttributes() {
		return ['mobile-breakpoint','grid-template-columns','show-calculations','bg','padding'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue !== newValue){
			this.updateComponent();
		}
	}

	updateComponent(){
		const gridTemplateColumnsStr = this.gridTemplateColumns.replace('columnsNum', this._properties.length);
		this._gridTemplateColumns = this.gridTemplateColumns;
		this._showCalculations = this.showCalculations;

		this['padding'] = this.getAttribute('padding') ?? this['padding'];
		this['bg'] = this.getAttribute('bg') ?? this['bg'];
		
		//*======= display properties
		const tableProperties = this.shadowRoot.querySelector('#table-properties');
		tableProperties.innerHTML = '';
		for(const [i, property] of this._properties.entries()){
			tableProperties.innerHTML += `<span>${property.name}</span>`;
		}
		//*=========================

		//*========== display rows
		const tableRows = this.shadowRoot.querySelector('#table-rows');
		tableRows.innerHTML = '';
		for(const row of this._rows){
			for(const [i, cell] of Object.entries(row)){
				tableRows.innerHTML += `<span class='cell-${i}'>${cell}</span>`;
			}
		}
		//*====================

		//*========== display calculations
		const getCalculation = ({i, calc}) => {
			const columCellsElements = Array.from(this.shadowRoot.querySelectorAll(`.cell-${i}`));
			const columnCellsValues = columCellsElements.map(cell => Number(cell.innerText));
			if(calc==='sum'){ return columnCellsValues.reduce((a,b)=>a+b, 0); }
			//todo: other calculations
		}

		if(this._showCalculations){
			this.shadowRoot.querySelector('#calculations').innerHTML = '';
			for(const [i, property] of this._properties.entries()){
				this.shadowRoot.querySelector('#calculations').innerHTML += `<span>${property.calc? getCalculation({i, calc: property.calc}):''}</span>`;
			}
		}
		//*====================

		let elemStyle = `{
			display: block;
			width: 100%;
		}`;

		let contentWrapperStyle = `{
			background: ${this['bg']};
		}`;

		const tableStyle = `{
			display: grid;
			grid-template-columns: ${gridTemplateColumnsStr};
			border: 1px solid #222;
			border-radius: 4px;
		}`;

		const tablePropertiesStyle = `{
			display: contents;
		}`;

		const tablePropertiesCellsStyle = `{
			padding: 10px;
			border-right: 1px solid #ccc;
			// border-top: 1px solid #ccc;
		}`;

		const tableRowsStyle = `{
			display: contents;
		}`;

		const tableRowsCellsStyle = `{
			padding: 10px;
			border-right: 1px solid #ccc;
			border-top: 1px solid #ccc;
		}`;

		const calculationsStyle = `{
			display: contents;
		}`;

		const calculationsCellsStyle = `{
			padding: 10px;
			border-top: 2px solid #222;
			border-right: 1px solid #ccc;
		}`;

		lwcWriteCSSRule(`:host`, elemStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`#content-wrapper`, contentWrapperStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`#table`, tableStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`#table-properties`, tablePropertiesStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`#table-properties > span`, tablePropertiesCellsStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`#table-rows`, tableRowsStyle, this.shadowRoot.styleSheets[0]);
		lwcWriteCSSRule(`#table-rows > span`, tableRowsCellsStyle, this.shadowRoot.styleSheets[0]);
		// lwcWriteCSSRule(`:host > *:hover`, childrenHoverStyle, this.shadowRoot.styleSheets[0])
		// lwcWriteCSSRule(`@media (max-width:${this['mobile-breakpoint']})`, mediaQuery, this.shadowRoot.styleSheets[0])
		// lwcWriteCSSRule(`:host a`, '{text-decoration: none;}', this.shadowRoot.styleSheets[0])
		for(const [key, property] of this._properties.entries()){
			if(property.cellStyle){ lwcWriteCSSRule(`.cell-${key}`, `{${property.cellStyle}}`, this.shadowRoot.styleSheets[0]); }
		}
	
		if(this._showCalculations){
			lwcWriteCSSRule(`#calculations`, calculationsStyle, this.shadowRoot.styleSheets[0]);
			lwcWriteCSSRule(`#calculations > span`, calculationsCellsStyle, this.shadowRoot.styleSheets[0]);
		}
	}

	connectedCallback() {
		document.addEventListener('DOMContentLoaded', ()=>{
			this.updateComponent();
		});

		// this.addEventListener('click', (e)=>{
		// 	const isTheClickedTargetInsideAnyOfTheSlotAssignedElements = ()=>{
		// 		const slotAssignedElements = this.shadowRoot.querySelector('slot').assignedElements();
		// 		for(const assignedElement of slotAssignedElements){
		// 			if(assignedElement.contains(e.target)){
		// 				return true;
		// 			}
		// 		}
		// 	};

		// 	if( !isTheClickedTargetInsideAnyOfTheSlotAssignedElements() ){
		// 		this.close();
		// 	}
		// });
	}

	disconnectedCallback(){}
});

export default lvTable;