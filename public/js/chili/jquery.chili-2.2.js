/*
===============================================================================
Chili is the jQuery code highlighter plugin
...............................................................................
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/chili/

											   Copyright 2008 / Andrea Ercolino
===============================================================================
*/


( function($) {

ChiliBook = { //implied global

	  version:            "2.2" // 2008-07-06

// options --------------------------------------------------------------------

	, automatic:          true
	, automaticSelector:  "pre"

	, lineNumbers:        true

	, codeLanguage:       function( el ) {
		var recipeName = $( el ).attr( "class" );
		return recipeName ? recipeName : '';
	}

	, recipeLoading:      true
	, recipeFolder:       "/js/chili/" // used like: recipeFolder + recipeName + '.js'

	// IE and FF convert &#160; to "&nbsp;", Safari and Opera do not
	, replaceSpace:       "&#160;"
	, replaceTab:         "&#160;&#160;&#160;&#160;"
	, replaceNewLine:     "&#160;<br/>"

	, selectionStyle:     [ "position:absolute; z-index:3000; overflow:scroll;"
						  , "width:16em;"
						  , "height:9em;"
						  , "border:1px solid gray;"
						  , "padding:15px;"
						  , "background-color:yellow;"
						  ].join( ' ' )

// ------------------------------------------------------------- end of options

	, defaultReplacement: '<span class="$0">$$</span>' // TODO: make this an option again
	, recipes:            {} //repository
	, queue:              {} //registry

	, unique:             function() {
		return (new Date()).valueOf();
	}
};

/* Escape the HTML entities because doing it by hand sucks */
if(typeof escapeHtmlEntities == 'undefined') {
  escapeHtmlEntities = function (text) {
    return text.replace(/[\u00A0-\u2666<>\&]/g, function(c) { return '&' + 
      escapeHtmlEntities.entityTable[c.charCodeAt(0)] || '#'+c.charCodeAt(0) + ';'; });
  };

  // all HTML4 entities as defined here: http://www.w3.org/TR/html4/sgml/entities.html
  // added: amp, lt, gt, quot and apos
  escapeHtmlEntities.entityTable = { 34 : 'quot', 38 : 'amp', 39 : 'apos', 60 : 'lt', 62 : 'gt', 160 : 'nbsp', 161 : 'iexcl', 162 : 'cent', 163 : 'pound', 164 : 'curren', 165 : 'yen', 166 : 'brvbar', 167 : 'sect', 168 : 'uml', 169 : 'copy', 170 : 'ordf', 171 : 'laquo', 172 : 'not', 173 : 'shy', 174 : 'reg', 175 : 'macr', 176 : 'deg', 177 : 'plusmn', 178 : 'sup2', 179 : 'sup3', 180 : 'acute', 181 : 'micro', 182 : 'para', 183 : 'middot', 184 : 'cedil', 185 : 'sup1', 186 : 'ordm', 187 : 'raquo', 188 : 'frac14', 189 : 'frac12', 190 : 'frac34', 191 : 'iquest', 192 : 'Agrave', 193 : 'Aacute', 194 : 'Acirc', 195 : 'Atilde', 196 : 'Auml', 197 : 'Aring', 198 : 'AElig', 199 : 'Ccedil', 200 : 'Egrave', 201 : 'Eacute', 202 : 'Ecirc', 203 : 'Euml', 204 : 'Igrave', 205 : 'Iacute', 206 : 'Icirc', 207 : 'Iuml', 208 : 'ETH', 209 : 'Ntilde', 210 : 'Ograve', 211 : 'Oacute', 212 : 'Ocirc', 213 : 'Otilde', 214 : 'Ouml', 215 : 'times', 216 : 'Oslash', 217 : 'Ugrave', 218 : 'Uacute', 219 : 'Ucirc', 220 : 'Uuml', 221 : 'Yacute', 222 : 'THORN', 223 : 'szlig', 224 : 'agrave', 225 : 'aacute', 226 : 'acirc', 227 : 'atilde', 228 : 'auml', 229 : 'aring', 230 : 'aelig', 231 : 'ccedil', 232 : 'egrave', 233 : 'eacute', 234 : 'ecirc', 235 : 'euml', 236 : 'igrave', 237 : 'iacute', 238 : 'icirc', 239 : 'iuml', 240 : 'eth', 241 : 'ntilde', 242 : 'ograve', 243 : 'oacute', 244 : 'ocirc', 245 : 'otilde', 246 : 'ouml', 247 : 'divide', 248 : 'oslash', 249 : 'ugrave', 250 : 'uacute', 251 : 'ucirc', 252 : 'uuml', 253 : 'yacute', 254 : 'thorn', 255 : 'yuml', 402 : 'fnof', 913 : 'Alpha', 914 : 'Beta', 915 : 'Gamma', 916 : 'Delta', 917 : 'Epsilon', 918 : 'Zeta', 919 : 'Eta', 920 : 'Theta', 921 : 'Iota', 922 : 'Kappa', 923 : 'Lambda', 924 : 'Mu', 925 : 'Nu', 926 : 'Xi', 927 : 'Omicron', 928 : 'Pi', 929 : 'Rho', 931 : 'Sigma', 932 : 'Tau', 933 : 'Upsilon', 934 : 'Phi', 935 : 'Chi', 936 : 'Psi', 937 : 'Omega', 945 : 'alpha', 946 : 'beta', 947 : 'gamma', 948 : 'delta', 949 : 'epsilon', 950 : 'zeta', 951 : 'eta', 952 : 'theta', 953 : 'iota', 954 : 'kappa', 955 : 'lambda', 956 : 'mu', 957 : 'nu', 958 : 'xi', 959 : 'omicron', 960 : 'pi', 961 : 'rho', 962 : 'sigmaf', 963 : 'sigma', 964 : 'tau', 965 : 'upsilon', 966 : 'phi', 967 : 'chi', 968 : 'psi', 969 : 'omega', 977 : 'thetasym', 978 : 'upsih', 982 : 'piv', 8226 : 'bull', 8230 : 'hellip', 8242 : 'prime', 8243 : 'Prime', 8254 : 'oline', 8260 : 'frasl', 8472 : 'weierp', 8465 : 'image', 8476 : 'real', 8482 : 'trade', 8501 : 'alefsym', 8592 : 'larr', 8593 : 'uarr', 8594 : 'rarr', 8595 : 'darr', 8596 : 'harr', 8629 : 'crarr', 8656 : 'lArr', 8657 : 'uArr', 8658 : 'rArr', 8659 : 'dArr', 8660 : 'hArr', 8704 : 'forall', 8706 : 'part', 8707 : 'exist', 8709 : 'empty', 8711 : 'nabla', 8712 : 'isin', 8713 : 'notin', 8715 : 'ni', 8719 : 'prod', 8721 : 'sum', 8722 : 'minus', 8727 : 'lowast', 8730 : 'radic', 8733 : 'prop', 8734 : 'infin', 8736 : 'ang', 8743 : 'and', 8744 : 'or', 8745 : 'cap', 8746 : 'cup', 8747 : 'int', 8756 : 'there4', 8764 : 'sim', 8773 : 'cong', 8776 : 'asymp', 8800 : 'ne', 8801 : 'equiv', 8804 : 'le', 8805 : 'ge', 8834 : 'sub', 8835 : 'sup', 8836 : 'nsub', 8838 : 'sube', 8839 : 'supe', 8853 : 'oplus', 8855 : 'otimes', 8869 : 'perp', 8901 : 'sdot', 8968 : 'lceil', 8969 : 'rceil', 8970 : 'lfloor', 8971 : 'rfloor', 9001 : 'lang', 9002 : 'rang', 9674 : 'loz', 9824 : 'spades', 9827 : 'clubs', 9829 : 'hearts', 9830 : 'diams', 34 : 'quot', 38 : 'amp', 60 : 'lt', 62 : 'gt', 338 : 'OElig', 339 : 'oelig', 352 : 'Scaron', 353 : 'scaron', 376 : 'Yuml', 710 : 'circ', 732 : 'tilde', 8194 : 'ensp', 8195 : 'emsp', 8201 : 'thinsp', 8204 : 'zwnj', 8205 : 'zwj', 8206 : 'lrm', 8207 : 'rlm', 8211 : 'ndash', 8212 : 'mdash', 8216 : 'lsquo', 8217 : 'rsquo', 8218 : 'sbquo', 8220 : 'ldquo', 8221 : 'rdquo', 8222 : 'bdquo', 8224 : 'dagger', 8225 : 'Dagger', 8240 : 'permil', 8249 : 'lsaquo', 8250 : 'rsaquo', 8364 : 'euro' };
}

$.fn.chili = function( options ) {
	var book = $.extend( {}, ChiliBook, options || {} );

	function cook( ingredients, recipe, blockName ) {

		function prepareBlock( recipe, blockName ) {
			var steps = [];
			for( var stepName in recipe[ blockName ] ) {
				steps.push( prepareStep( recipe, blockName, stepName ) );
			}
			return steps;
		} // prepareBlock

		function prepareStep( recipe, blockName, stepName ) {
			var step = recipe[ blockName ][ stepName ];
			var exp = ( typeof step._match == "string" ) ? step._match : step._match.source;
			return {
				recipe: recipe
				, blockName: blockName
				, stepName: stepName
				, exp: "(" + exp + ")"
				, length: 1                         // add 1 to account for the newly added parentheses
					+ (exp                          // count number of submatches in here
						.replace( /\\./g, "%" )     // disable any escaped character
						.replace( /\[.*?\]/g, "%" ) // disable any character class
						.match( /\((?!\?)/g )       // match any open parenthesis, not followed by a ?
					|| []                           // make sure it is an empty array if there are no matches
					).length                        // get the number of matches
				, replacement: step._replace ? step._replace : book.defaultReplacement
			};
		} // prepareStep
	
		function knowHow( steps ) {
			var prevLength = 1;
			var exps = [];
			for (var i = 0; i < steps.length; i++) {
				var exp = steps[ i ].exp;
				// adjust backreferences
				exp = exp.replace( /\\\\|\\(\d+)/g, function( m, aNum ) {
					return !aNum ? m : "\\" + ( prevLength + 1 + parseInt( aNum, 10 ) );
				} );
				exps.push( exp );
				prevLength += steps[ i ].length;
			}
			var prolog = '((?:\\s|\\S)*?)';
			var epilog = '((?:\\s|\\S)+)';
			var source = '(?:' + exps.join( "|" ) + ')';
			source = prolog + source + '|' + epilog;
			return new RegExp( source, recipe._case ? "g" : "gi" );
		} // knowHow

		function escapeHTML( str ) {
			return str.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" );
		} // escapeHTML

		function replaceSpaces( str ) {
			return str.replace( / +/g, function( spaces ) {
				return spaces.replace( / /g, replaceSpace );
			} );
		} // replaceSpaces

		function filter( str ) {
			str = escapeHTML( str );
			if( replaceSpace ) {
				str = replaceSpaces( str );
			}
			return str;
		} // filter

		function applyRecipe( subject, recipe ) {
			return cook( subject, recipe );
		} // applyRecipe

		function applyBlock( subject, recipe, blockName ) {
			return cook( subject, recipe, blockName );
		} // applyBlock

		function applyStep( subject, recipe, blockName, stepName ) {
			var replaceSpace       = book.replaceSpace;

			var step = prepareStep( recipe, blockName, stepName );
			var steps = [step];

			var perfect = subject.replace( knowHow( steps ), function() {
				return chef.apply( { steps: steps }, arguments );
			} );
			return perfect;
		} // applyStep

		function applyModule( subject, module, context ) {
			if( ! module ) {
				return filter( subject );
			}

			var sub = module.split( '/' );
			var recipeName = '';
			var blockName  = '';
			var stepName   = '';
			switch( sub.length ) {
				case 1:
					recipeName = sub[0];
					break;
				case 2:
					recipeName = sub[0]; blockName = sub[1];
					break;
				case 3:
					recipeName = sub[0]; blockName = sub[1]; stepName = sub[2];
					break;
				default:
					return filter( subject );
			}

			function getRecipe( recipeName ) {
				var path = getPath( recipeName );
				var recipe = book.recipes[ path ];
				if( ! recipe ) {
					throw {msg:"recipe not available"};
				}
				return recipe;
			}

			try {
				var recipe;
				if ( '' == stepName ) {
					if ( '' == blockName ) {
						if ( '' == recipeName ) {
							//nothing to do
						}
						else { // ( '' != recipeName )
							recipe = getRecipe( recipeName );
							return applyRecipe( subject, recipe );
						}
					}
					else { // ( '' != blockName )
						if( '' == recipeName ) {
							recipe = context.recipe;
						}
						else {
							recipe = getRecipe( recipeName );
						}
						if( ! (blockName in recipe) ) {
							return filter( subject );
						}
						return applyBlock( subject, recipe, blockName );
					}
				}
				else { // ( '' != stepName )
					if( '' == recipeName ) {
						recipe = context.recipe;
					}
					else {
						recipe = getRecipe( recipeName );
					}
					if( '' == blockName ) {
						blockName = context.blockName;
					}
					if( ! (blockName in recipe) ) {
						return filter( subject );
					}
					if( ! (stepName in recipe[blockName]) ) {
						return filter( subject );
					}
					return applyStep( subject, recipe, blockName, stepName );
				}
			}
			catch( e ) {
				if (e.msg && e.msg == "recipe not available") {
					var cue = 'chili_' + book.unique();
					if( book.recipeLoading ) {
						var path = getPath( recipeName );
						if( ! book.queue[ path ] ) {
							/* this is a new recipe to download */
							try {
								book.queue[ path ] = [ {cue: cue, subject: subject, module: module, context: context} ];
								$.getJSON( path, function( recipeLoaded ) {
									book.recipes[ path ] = recipeLoaded;
									var q = book.queue[ path ];
									for( var i = 0, iTop = q.length; i < iTop; i++ ) {
										var replacement = applyModule( q[ i ].subject, q[ i ].module, q[ i ].context );
										if( book.replaceTab ) {
											replacement = replacement.replace( /\t/g, book.replaceTab );
										}
										if( book.replaceNewLine ) {
											replacement = replacement.replace( /\n/g, book.replaceNewLine );
										}
										$( '#' + q[ i ].cue ).replaceWith( replacement );
									}
								} );
							}
							catch( recipeNotAvailable ) {
								alert( "the recipe for '" + recipeName + "' was not found in '" + path + "'" );
							}
						}
						else {
							/* not a new recipe, so just enqueue this element */
							book.queue[ path ].push( {cue: cue, subject: subject, module: module, context: context} );
						}
						return '<span id="' + cue + '">' + filter( subject ) + '</span>';
					}
					return filter( subject );
				}
				else {
					return filter( subject );
				}
			}
		} // applyModule

		function addPrefix( prefix, replacement ) {
			var aux = replacement.replace( /(<span\s+class\s*=\s*(["']))((?:(?!__)\w)+\2\s*>)/ig, "$1" + prefix + "__$3" );
			return aux;
		} // addPrefix

		function chef() {
			if (! arguments[ 0 ]) {
				return '';
			}
			var steps = this.steps;
			var i = 0;  // iterate steps
			var j = 2;	// iterate chef's arguments
			var prolog = arguments[ 1 ];
			var epilog = arguments[ arguments.length - 3 ];
			if (! epilog) {
				var step;
				while( step = steps[ i++ ] ) {
					var aux = arguments; // this unmasks chef's arguments inside the next function
					if( aux[ j ] ) {
						var replacement = '';
						if( $.isFunction( step.replacement ) ) {
							var matches = []; //Array.slice.call( aux, j, step.length );
							for (var k = 0, kTop = step.length; k < kTop; k++) {
								matches.push( aux[ j + k ] );
							}
							matches.push( aux[ aux.length - 2 ] );
							matches.push( aux[ aux.length - 1 ] );
							replacement = step.replacement
								.apply( { 
									x: function() { 
										var subject = arguments[0];
										var module  = arguments[1];
										var context = { 
											  recipe:    step.recipe
											, blockName: step.blockName 
										};
										return applyModule( subject, module, context );
									} 
								}, matches );
						}
						else { //we expect step.replacement to be a string
							replacement = step.replacement
								.replace( /(\\\$)|(?:\$\$)|(?:\$(\d+))/g, function( m, escaped, K ) {
									if( escaped ) {       /* \$ */ 
										return "$";
									}
									else if( !K ) {       /* $$ */ 
										return filter( aux[ j ] );
									}
									else if( K == "0" ) { /* $0 */ 
										return step.stepName;
									}
									else {                /* $K */
										return filter( aux[ j + parseInt( K, 10 ) ] );
									}
								} );
						}
						replacement = addPrefix( step.recipe._name, replacement );
						return filter( prolog ) + replacement;
					} 
					else {
						j+= step.length;
					}
				}
			}
			else {
				return filter( epilog );
			}
		} // chef

		if( ! blockName ) {
			blockName = '_main';
			checkSpices( recipe );
		}
		if( ! (blockName in recipe) ) {
			return filter( ingredients );
		}
		var replaceSpace = book.replaceSpace;
		var steps = prepareBlock( recipe, blockName );
		var kh = knowHow( steps );
		var perfect = ingredients.replace( kh, function() {
			return chef.apply( { steps: steps }, arguments );
		} );
		return perfect;

	} // cook

	function loadStylesheetInline( sourceCode ) { 
		if( document.createElement ) { 
			var e = document.createElement( "style" ); 
			e.type = "text/css"; 
			if( e.styleSheet ) { // IE 
				e.styleSheet.cssText = sourceCode; 
			}  
			else { 
				var t = document.createTextNode( sourceCode ); 
				e.appendChild( t ); 
			} 
			document.getElementsByTagName( "head" )[0].appendChild( e ); 
		} 
	} // loadStylesheetInline
			
	function checkSpices( recipe ) {
		var name = recipe._name;
		if( ! book.queue[ name ] ) {

			var content = ['/* Chili -- ' + name + ' */'];
			for (var blockName in recipe) {
				if( blockName.search( /^_(?!main\b)/ ) < 0 ) {
					for (var stepName in recipe[ blockName ]) {
						var step = recipe[ blockName ][ stepName ];
						if( '_style' in step ) {
							if( step[ '_style' ].constructor == String ) {
								content.push( '.' + name + '__' + stepName + ' { ' + step[ '_style' ] + ' }' );
							}
							else {
								for (var className in step[ '_style' ]) {
									content.push( '.' + name + '__' + className + ' { ' + step[ '_style' ][ className ] + ' }' );
								}
							}
						}
					}
				}
			}
			content = content.join('\n');

			loadStylesheetInline( content );

			book.queue[ name ] = true;
		}
	} // checkSpices

	function askDish( el ) {
		var recipeName = book.codeLanguage( el );
		if( '' != recipeName ) {
			var path = getPath( recipeName );
			if( book.recipeLoading ) {
				/* dynamic setups come here */
				if( ! book.queue[ path ] ) {
					/* this is a new recipe to download */
					try {
						book.queue[ path ] = [ el ];
						$.getJSON( path, function( recipeLoaded ) {
							book.recipes[ path ] = recipeLoaded;
							var q = book.queue[ path ];
							for( var i = 0, iTop = q.length; i < iTop; i++ ) {
								makeDish( q[ i ], path );
							}
						} );
					}
					catch( recipeNotAvailable ) {
						alert( "the recipe for '" + recipeName + "' was not found in '" + path + "'" );
					}
				}
				else {
					/* not a new recipe, so just enqueue this element */
					book.queue[ path ].push( el );
				}
				/* a recipe could have been already downloaded */
				makeDish( el, path ); 
			}
			else {
				/* static setups come here */
				makeDish( el, path );
			}
		}
	} // askDish

	function makeDish( el, recipePath ) {
		var recipe = book.recipes[ recipePath ];
		if( ! recipe ) {
			return;
		}
		var $el = $( el );
		var ingredients = $el.text();
		if( ! ingredients ) {
			return;
		}

		//fix for msie: \r (13) is used instead of \n (10)
		//fix for opera: \r\n is used instead of \n
		ingredients = ingredients.replace(/\r\n?/g, "\n");

		//reverse fix for safari: msie, mozilla and opera render the initial \n
		if( $el.parent().is('pre') ) {
			if( ! $.browser.safari ) {
				ingredients = ingredients.replace(/^\n/g, "");
			}
		}

		var dish = cook( ingredients, recipe ); // all happens here
	
		if( book.replaceTab ) {
			dish = dish.replace( /\t/g, book.replaceTab );
		}
		if( book.replaceNewLine ) {
			dish = dish.replace( /\n/g, book.replaceNewLine );
		}

		el.innerHTML = dish; //much faster than $el.html( dish );
		//tried also the function replaceHtml from http://blog.stevenlevithan.com/archives/faster-than-innerhtml
		//but it was not faster nor without sideffects (it was not possible to count spans into el)

		//opera and safari select PRE text correctly 
		if( $.browser.msie || $.browser.mozilla ) {
			enableSelectionHelper( el );
		}

		var $that = $el.parent();
		var classes = $that.attr( 'class' );
		var ln = /ln-(\d+)-([\w][\w\-]*)|ln-(\d+)|ln-/.exec( classes );
		if( ln ) {
			addLineNumbers( el );
			var start = 0;
			if( ln[1] ) {
				start = parseInt( ln[1], 10 );
				var $pieces = $( '.ln-' + ln[1] + '-' + ln[2] );
				var pos = $pieces.index( $that[0] );
				$pieces.slice( 0, pos ).each( function() {
					start += $( this ).find( 'li' ).length;
				} );
			}
			else if( ln[3] ) {
				start = parseInt( ln[3], 10 );
			}
			else {
				start = 1;
			}
			$el.find( 'ol' )[0].start = start;
			$('body').width( $('body').width() - 1 ).width( $('body').width() + 1 );
		}
		else if( book.lineNumbers ) {
			addLineNumbers( el );
		}

	} // makeDish

	function enableSelectionHelper( el ) {
		var element = null;
		$( el )
		.parents()
		.filter( "pre" )
		.bind( "mousedown", function() {
			element = this;
			if( $.browser.msie ) {
				document.selection.empty();
			}
			else {
				window.getSelection().removeAllRanges();
			}
		} )
		.bind( "mouseup", function( event ) {
			if( element && (element == this) ) {
				element = null;
				var selected = '';
				if( $.browser.msie ) {
					selected = document.selection.createRange().htmlText;
					if( '' == selected ) { 
						return;
					}
					selected = preserveNewLines( selected );
					var container_tag = '<textarea style="STYLE">';
				}
				else {
					selected = window.getSelection().toString(); //opera doesn't select new lines
					if( '' == selected ) {
						return;
					}
					selected = selected
						.replace( /\r/g, '' )
						.replace( /^# ?/g, '' )
						.replace( /\n# ?/g, '\n' )
					;
					var container_tag = '<pre style="STYLE">';
				}
				var $container = $( container_tag.replace( /\bSTYLE\b/, ChiliBook.selectionStyle ) )
					.appendTo( 'body' )
					.text( selected )
					.attr( 'id', 'chili_selection' )
					.click( function() { $(this).remove(); } )
				;
				var top  = event.pageY - Math.round( $container.height() / 2 ) + "px";
				var left = event.pageX - Math.round( $container.width() / 2 ) + "px";
				$container.css( { top: top, left: left } );
				if( $.browser.msie ) {
//					window.clipboardData.setData( 'Text', selected ); //I couldn't find anything similar for Mozilla
					$container[0].focus();
					$container[0].select();
				}
				else {
					var s = window.getSelection();
					s.removeAllRanges();
					var r = document.createRange();
					r.selectNodeContents( $container[0] );
					s.addRange( r );
				}
			}
		} )
		;
	} // enableSelectionHelper

	function getPath( recipeName ) {
		return book.recipeFolder + recipeName + ".js";
	} // getPath

	function getSelectedText() {
		var text = '';
		if( $.browser.msie ) {
			text = document.selection.createRange().htmlText;
		}
		else {
			text = window.getSelection().toString();
		}
		return text;
	} // getSelectedText

	function preserveNewLines( html ) {
		do { 
			var newline_flag = ChiliBook.unique();
		}
		while( html.indexOf( newline_flag ) > -1 );
		var text = '';
		if (/<br/i.test(html) || /<li/i.test(html)) {
			if (/<br/i.test(html)) {
				html = html.replace( /\<br[^>]*?\>/ig, newline_flag );
			}
			else if (/<li/i.test(html)) {
				html = html.replace( /<ol[^>]*?>|<\/ol>|<li[^>]*?>/ig, '' ).replace( /<\/li>/ig, newline_flag );
			}
			var el = $( '<pre>' ).appendTo( 'body' ).hide()[0];
			el.innerHTML = html;
			text = $( el ).text().replace( new RegExp( newline_flag, "g" ), '\r\n' );
			$( el ).remove();
		}
		return text;
	} // preserveNewLines

	function addLineNumbers( el ) {

		function makeListItem1( not_last_line, not_last, last, open ) {
			var close = open ? '</span>' : '';
			var aux = '';
			if( not_last_line ) {
				aux = '<li>' + open + not_last + close + '</li>';
			}
			else if( last ) {
				aux = '<li>' + open + last + close + '</li>';
			}
			return aux;
		} // makeListItem1

		function makeListItem2( not_last_line, not_last, last, prev_li ) {
			var aux = '';
			if( prev_li ) {
				aux = prev_li;
			}
			else {
				aux = makeListItem1( not_last_line, not_last, last, '' )
			}
			return aux;
		} // makeListItem2

		var html = $( el ).html();
		var br = /<br>/.test(html) ? '<br>' : '<BR>';
		var empty_line = '<li>' + book.replaceSpace + '</li>';
		var list_items = html
			//extract newlines at the beginning of a span
			.replace( /(<span [^>]+>)((?:(?:&nbsp;|\xA0)<br>)+)(.*?)(<\/span>)/ig, '$2$1$3$4' ) // I don't know why <span .*?> does not work here
			//transform newlines inside of a span
			.replace( /(.*?)(<span .*?>)(.*?)(?:<\/span>(?:&nbsp;|\xA0)<br>|<\/span>)/ig,       // but here it does
				function( all, before, open, content ) {
					if (/<br>/i.test(content)) {
						var pieces = before.split( br );
						var lastPiece = pieces.pop();
						before = pieces.join( br );
						var aux = (before ? before + br : '') //+ replace1( lastPiece + content, open );
							+ (lastPiece + content).replace( /((.*?)(?:&nbsp;|\xA0)<br>)|(.*)/ig, 
							function( tmp, not_last_line, not_last, last ) {
								var aux2 = makeListItem1( not_last_line, not_last, last, open );
								return aux2;
							} 
						);
						return aux;
					}
					else {
						return all;
					}
				} 
			)
			//transform newlines outside of a span
			.replace( /(<li>.*?<\/li>)|((.*?)(?:&nbsp;|\xA0)<br>)|(.+)/ig, 
				function( tmp, prev_li, not_last_line, not_last, last ) {
					var aux2 = makeListItem2( not_last_line, not_last, last, prev_li );
					return aux2;
				} 
			)
			//fix empty lines for Opera
			.replace( /<li><\/li>/ig, empty_line )
		;

		el.innerHTML = '<ol>' + list_items + '</ol>';
	} // addLineNumbers

	function revealChars( tmp ) {
		return $
			.map( tmp.split(''), 
				function(n, i) { 
					return ' ' + n + ' ' + n.charCodeAt( 0 ) + ' ';
				} )
			.join(' ');
	} // revealChars

//-----------------------------------------------------------------------------
// the coloring starts here
	this
	.each( function() {
		var $this = $( this );
		$this.trigger( 'chili.before_coloring' );
		askDish( this );
		$this.trigger( 'chili.after_coloring' );
	} );

	return this;
//-----------------------------------------------------------------------------
};



//main
$( function() {

	if( ChiliBook.automatic ) {
		
		$("pre").each(function() {
			$(this).html(
				escapeHtmlEntities( $(this).html() )
			)}
		);
		$( ChiliBook.automaticSelector ).chili();
	}

} );

} ) ( jQuery );
