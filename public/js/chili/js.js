/*
===============================================================================
Chili is the jQuery code highlighter plugin
...............................................................................
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/chili/

                                               Copyright 2008 / Andrea Ercolino
===============================================================================
*/

{
	  _name: 'js'
	, _case: true
	, _main: {
		  ml_comment: { 
			  _match: /\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\//
			, _style: 'color: #666;'
		}
		, sl_comment: { 
			  _match: /\/\/.*/
			, _style: 'color: green;'
		}
		, string: { 
			  _match: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/
			, _style: 'color: #a0c25f;'
		}
		, num: { 
			  _match: /\b[+-]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?\b/
			, _style: 'color: red;'
		}
		, reg_not: { //this prevents "a / b / c" to be interpreted as a reg_exp
			  _match: /(?:\w+\s*)\/[^\/\\\n]*(?:\\.[^\/\\\n]*)*\/[gim]*(?:\s*\w+)/
			, _replace: function( all ) {
				return this.x( all, '//num' );
			}
		}
		, reg_exp: { 
			  _match: /\/[^\/\\\n]*(?:\\.[^\/\\\n]*)*\/[gim]*/
			, _style: 'color: maroon;'
		}
		, brace: { 
			  _match: /[\{\}]/
			, _style: 'color: #aaa;'
		}
		, statement: { 
			  _match: /\b(with|while|var|try|throw|switch|return|if|for|finally|else|do|default|continue|const|catch|case|break)\b/
			, _style: 'color: #c96830;'
		}
		, error: { 
			  _match: /\b(URIError|TypeError|SyntaxError|ReferenceError|RangeError|EvalError|Error)\b/
			, _style: 'color: Coral;'
		}
		, object: { 
			  _match: /\b(String|RegExp|Object|Number|Math|Function|Date|Boolean|Array)\b/
			, _style: 'color: DeepPink;'
		}
		, property: { 
			  _match: /\b(undefined|arguments|NaN|Infinity)\b/
			, _style: 'color: Purple;'
		}
		, 'function': { 
			  _match: /\b(parseInt|parseFloat|isNaN|isFinite|eval|encodeURIComponent|encodeURI|decodeURIComponent|decodeURI)\b/
			, _style: 'color: #c96830;'
		}
		, operator: {
			  _match: /\b(void|typeof|new|instanceof|in|function|$|delete)\b/
			, _style: 'color: #c96830;'
		}
		, this_operator: {
			  _match: /\b(this)\b/
			, _style: 'color: #7ca9f7;'
		}
		, liveconnect: {
			  _match: /\b(sun|netscape|java|Packages|JavaPackage|JavaObject|JavaClass|JavaArray|JSObject|JSException)\b/
			, _style: 'text-decoration: overline;'
		}
	}
}

