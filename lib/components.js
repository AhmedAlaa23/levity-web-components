var lwcStyleSheet = document.querySelector('[lv-style]').sheet

function lwcInsertCSSRule(ruleSelector, rule){
	let CSSRule = `${ruleSelector} ${rule}`;
	lwcStyleSheet.insertRule(CSSRule)
}

function lwcDeleteCSSRule(ruleSelector, index){
	let cssRules = Array.from(lwcStyleSheet.cssRules)

	if(index){
		lwcStyleSheet.deleteRule(index);
	}
	else{
		for(let [ruleIndex, rule] of cssRules.entries()){
			if(rule.selectorText === ruleSelector){
				lwcStyleSheet.deleteRule(ruleIndex);
			}
		}
	}
}

function lwcCheckCssRuleExist(ruleSelector){
	let cssRules = Array.from(lwcStyleSheet.cssRules)

	for(let [index, rule] of cssRules.entries()){
		if(rule.selectorText === ruleSelector){
			return index
		}
	}

	return false;
}

function lwcWriteCSSRule(ruleSelector, rule){
	let ruleIndex = lwcCheckCssRuleExist(ruleSelector);
	if(ruleIndex !== false){
		lwcDeleteCSSRule(ruleSelector, ruleIndex);
		lwcInsertCSSRule(ruleSelector, rule);
	}
	else{
		lwcInsertCSSRule(ruleSelector, rule);
	}
}

// ======================== Components ==============
// ==================================================

customElements.define('lv-header', class extends HTMLElement {
	constructor() {
		super();
	}

	static get observedAttributes() {
		return ['padding', 'bg', 'fixed'];
	}

	attributeChangedCallback(attrName, oldValue, newValue){
		if(oldValue != newValue){
			this.rewriteStyle();
		}
	}

	rewriteStyle(){
		let elemId = this.id;

		let padding = this.getAttribute('padding') ?? '10px 20px';
		let bg = this.getAttribute('bg') ?? 'white';
		let isFixed = this.hasAttribute('fixed') ?? false;

		let elemStyle = `{
			width: 100%;
			${isFixed? 'position: fixed;':''}
			display: grid;
			grid-template-columns: [left] auto [center] auto [right] auto [end];
			align-items: center;
			justify-items: center;
			padding: ${padding};
			background-color: ${bg};
			box-sizing: border-box;
			// box-shadow: 0px 1px 2px #dcdcdc;
			// border-bottom: 1px solid gray;
		}
		`;

		let leftChildElem = this.querySelector("[pos='l']");
		if(leftChildElem){
			let leftChildAlign = leftChildElem.getAttribute('align') ?? 'center';
			var leftChildStyle = `{
				width: 100%;
				grid-column: left;
				justify-self: ${leftChildAlign};
			}
			`;
		}

		let centerChildElem = this.querySelector("[pos='c']");
		if(centerChildElem){
			let centerChildAlign = centerChildElem.getAttribute('align') ?? 'center';
			var centerChildStyle = `{
				width: 100%;
				grid-column: center;
				justify-self: ${centerChildAlign};
			}
			`;
		}

		let rightChildElem = this.querySelector("[pos='r']");
		if(rightChildElem){
			let rightChildAlign = rightChildElem.getAttribute('align') ?? 'center';
			var rightChildStyle = `{
				width: 100%;
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