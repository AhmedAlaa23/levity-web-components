var lwcStyleSheet = document.querySelector('[lv-style]').sheet

function lwcInsertCSSRule(ruleSelector, rule, styleSheet=lwcStyleSheet){
	let CSSRule = `${ruleSelector} ${rule}`;
	styleSheet.insertRule(CSSRule)
}

function lwcDeleteCSSRule(ruleSelector, index, styleSheet=lwcStyleSheet){
	let cssRules = Array.from(styleSheet.cssRules)
	
	if(index){
		styleSheet.deleteRule(index);
	}
	else{
		for(let [ruleIndex, rule] of cssRules.entries()){
			if(rule.selectorText === ruleSelector){
				styleSheet.deleteRule(ruleIndex);
			}
		}
	}
}

function lwcCheckCssRuleExist(ruleSelector, styleSheet=lwcStyleSheet){
	let cssRules = Array.from(styleSheet.cssRules)

	for(let [index, rule] of cssRules.entries()){
		if(rule.selectorText === ruleSelector){
			return index
		}
	}

	return false;
}

function lwcWriteCSSRule(ruleSelector, rule, styleSheet=lwcStyleSheet){
	let ruleIndex = lwcCheckCssRuleExist(ruleSelector, styleSheet);
	if(ruleIndex !== false){
		lwcDeleteCSSRule(ruleSelector, ruleIndex, styleSheet);
		lwcInsertCSSRule(ruleSelector, rule, styleSheet);
	}
	else{
		lwcInsertCSSRule(ruleSelector, rule, styleSheet);
	}
}

export {lwcInsertCSSRule, lwcDeleteCSSRule, lwcCheckCssRuleExist, lwcWriteCSSRule}