/**
 * Super Simple AgeChecker
 * In this Version without Age Input
 * Just decide between YES or NO
 * deps: jQuery
 */

(function ($){   

	$.ageCheck = function(options) {

		// populate the default Settings
		
		var settings = $.extend({
			minAge: '18', // minimum age to visit your website!
			exactAge: false,
			cookie: {
				enabled: false,
				days: '1',
			},
			redirectTo: '', // path to where we redirect after the check!
			redirectToDeclined: 'http://www.google.com',
			theme: 'default', // default theme .. ? :)
			themePath: 'ageCheck/themes/', //,
			templateVars: {
				title: 'Age Verification', // default
				text: 'This Website requires you to be 18 years or older to enter. Please enter your Date of Birth in the fields below in order to continue:', // default
			}
		},options);

		var _this = {
			replaceText: function(text) {
				return text.replace(/{[^{}]+}/g, function(key){
					return settings.templateVars[key.replace(/[{}]+/g, "")] || "";
				});
			},
			cancel: function() {
				//e.preventDefault();
				window.location.href = settings.redirectToDeclined;
			},
			submit: function() {
				if (settings.exactAge) {

				} else {
					if(_this.setSessionStorage("ageVerified", "true")){
						if(settings.cookie.enabled) {
							console.log('Setting Cookie!');
							_this.cookieCreate('ageVerified', 'true', settings.cookie.days);
						}
						_this.fadeOut();
					} else {
						console.log('sessionStorage not supported by your browser');
					}
					
				}
			},
			fadeOut: function() {
				$('.ac-modal').animate({
					opacity: 0
				}, 500, function() {
					if (settings.redirectTo != '') {
						window.location.replace(settings.redirectTo);
					}else{
						$('.ac-modal').remove();
					}
				});
			},
			setSessionStorage: function(key, value) {
				try {
					sessionStorage.setItem(key,value);
					return true;
				} catch (e) {
					return false;
				}
			},
			loadCss: function() {
				$("<link/>", {
						rel: "stylesheet",
						type: "text/css",
						href: settings.themePath + '/' + settings.theme + '/default.style.css'
					}).appendTo("head");
			},
			output: '',
			buildBlock: function() {
				this.loadCss();
				var opt = '';
				$.get(settings.themePath + '/' + settings.theme + '/default.html', function(data) {
						this.output = data;
						this.output = _this.replaceText(this.output);
						$(this.output).appendTo('body');
						$('.ac-modal').animate({
							opacity: 1
						}, 500, function() {
							
						});
						$('.ac-modal button[type=cancel]').on('click', _this.cancel);
						$('.ac-modal button[type=submit]').on('click', _this.submit);
					})
					.fail(function() {
						console.log('[AgeCheck] receiving template failed.')
						console.log('[AgeCheck] correct path?')
					});				
			},
			cookieCreate: function(name, value, days) {
				if (days) {
					var date = new Date();
					date.setTime(date.getTime()+(days*24*60*60*1000));
					var expires = "; expires="+date.toGMTString();
				} else {
					var expires = "";
				}
				document.cookie = name+"="+value+expires+"; path=/";
			},
			cookieRead: function(name) {
				var nameEQ = name + "=";
				var ca = document.cookie.split(';');
				for(var i=0;i < ca.length;i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
				}
				return null;
			},
			init: function() {
				if(sessionStorage.getItem("ageVerified") == "true"){
					return false;
				} else if (settings.cookie.enabled) {
					if(this.cookieRead('ageVerified')) {
						return false;
					}
				} else {
					this.buildBlock();
					
				}		
			}
		}; // end _this

		_this.init();
	}
}(jQuery));