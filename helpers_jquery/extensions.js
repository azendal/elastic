jQuery.fn.computedStyle = function (pseudoElement) {
	var element = this[0];
	if (element instanceof HTMLElement) {
		if (getComputedStyle) {
			return getComputedStyle(element, pseudoElement);
		}
		else
		{
			return element.currentStyle();
		}
	}
	return this;
};
