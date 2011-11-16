/**
 * Add a new filter that can be used in selector expressions. The filter may optionally 
 * take a single argument, which can be unquoted, or single or double-quoted. The argument 
 * may only contain parentheses if they are balanced and not nested.
 * @name   $.addFilter
 * @type   jQuery
 * @param  String   name  name of the new filter
 * @param  Function func  filter function that takes up to four arguments:
 *             domElement - the DOM element being checked
 *             index - the index of the element in the list of elements
 *             domElementArray - list of all matched elements
 *             argument - the argument passed to the filter (unquoted and unescaped)
 * @return jQuery
 * @cat    Plugins
 * @author Bennett McElwee
*/
jQuery.addFilter = function(name, func) {
	var expression = {};
	expression[name] = function(domElement, index, match, domElementArray) {
			// match[3] is the filter argument (if any) without surrounding quotes
			return func(domElement, index, domElementArray, match[3]);
		};
	this.extend(this.expr[':'], expression);
	return this;
};

/**
 * Add a new filter that can be used in selector expressions. The filter may take 
 * any number of arguments. All arguments must be unquoted (with backslash-escaped
 * commas) or single-quoted (with escaped single quotes), or double-quoted (with 
 * escaped double quotes). The arguments may only contain parentheses if they are 
 * balanced and not nested.
 * 
 * @name   $.addFilterWithArgs
 * @type   jQuery
 * @param  String   name  name of the new filter
 * @param  Function func  filter function that takes four or more arguments:
 *             domElement - the DOM element being checked
 *             index - the index of the element in the list of elements
 *             domElementArray - list of all matched elements
 *             argument1, argument2, etc. - the arguments passed to the filter (unquoted and unescaped)
 * @return jQuery
 * @cat    Plugins
 * @author Bennett McElwee
*/
jQuery.addFilterWithArgs = function(name, func) {
	var expression = {};
	expression[name] = function(domElement, index, match, domElementArray) {
			// match[2] is the quote used, if any
			var quote = match[2];
			// match[3] is the filter argument without surrounding quotes
			var argString = quote + match[3] + quote;
			if (!quote) {
				// Arguments are unquoted, so allow for escaped commas
				args = $.map(argString.match(/([^,\\]|\\.)+/g), function(e) {
					// Unescape escaped commas
					return e.replace(/\\,/g, ",");
				});
			} else {
				// Arguments are quoted, so allow for escaped quotes
				args = $.map(argString.match(/(['"])((?!(\1|\\)).|\\.)*\1/g), function(e) {
					// Remove surrounding quotes and unescape escaped quotes
					return e.slice(1, -1).replace(/\\(['"])/g, "$1");
				});
			}
			return func.apply(null, [domElement, index, domElementArray].concat(args));
		};
	this.extend(this.expr[':'], expression);
	return this;
};
