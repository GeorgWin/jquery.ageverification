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
			months: [
				{'id':'00','name':'January'},
				{'id':'01','name':'February'},
				{'id':'02','name':'March'},
				{'id':'03','name':'April'},
				{'id':'04','name':'May'},
				{'id':'05','name':'June'},
				{'id':'06','name':'July'},
				{'id':'07','name':'August'},
				{'id':'08','name':'September'},
				{'id':'09','name':'October'},
				{'id':'10','name':'November'},
				{'id':'11','name':'December'},
			],
			errors: {
				invalidDay: 'Day is invalid or empty',
				invalidYear: 'Year is invalid or empty',
				tooYoung: 'You are not old enough',
			},
			theme: 'default', // default theme .. ? :)
			themePath: 'ageCheck/themes/', //,
			templateVars: {
				title: 'Age Verification', // default
				text: 'This Website requires you to be 18 years or older to enter. Please enter your Date of Birth in the fields below in order to continue:', // default
				btnCancel: 'Cancel',
				btnSubmit: 'Proceed',
			}
		},options);

		var _this = {
			day 	: '',
			month	: '',
			year 	: '',
			age 	: '',
			errors	: [],
			setValues: function() {
				var month = $('.ac-modal .date .month').val();
				var day = $('.ac-modal .date .day').val()
				_this.month = month; 
                _this.day = day.replace(/^0+/, ''); //remove leading zero
                _this.year = $('.ac-modal .date .year').val();
			},
			validate: function() {
				_this.errors = [];
				if (/^([0-9]|[12]\d|3[0-1])$/.test(_this.day) === false) {
                    _this.errors.push(settings.errors.invalidDay);
                };
                if (/^(19|20)\d{2}$/.test(_this.year) === false) {
                    _this.errors.push(settings.errors.invalidYear);
                };
                _this.errorsClear();
                if(_this.errors.length != 0){
                	_this.errorsDisplay();
                }
                return _this.errors.length < 1;
                
			},
			errorsClear: function() {
				$('.ac-modal .errors').css('display', 'none');
				$('.ac-modal .errors').html('');
			},
			errorsDisplay: function() {
				var html = '<ul>';
				for (var i = 0; i < _this.errors.length; i++) {
                    html += '<li>' + _this.errors[i] + '</li>';
                }
                html += '</ul>';
                $('.ac-modal .errors').css('display', 'block');
                setTimeout(function(){$('.ac-modal .errors').html(html)},200);
			},
			setAge: function() {
				_this.age = '';
				var birthday = new Date(_this.year, _this.month, _this.day);
				var ageDifMs = Date.now() - birthday.getTime();
				var ageDate = new Date(ageDifMs); // miliseconds from epoch
				_this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
				console.log(_this.age); 
			},
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
					_this.setValues();
					if(_this.validate() === true) {
						_this.setAge();
						if (_this.age >= settings.minAge) {
							if(_this.setSessionStorage("ageVerified", "true")){
								if(settings.cookie.enabled) {
									_this.cookieCreate('ageVerified', 'true', settings.cookie.days);
								}
								_this.fadeOut();
							} else {
								console.log('sessionStorage not supported by your browser');
							}
						} else {
							_this.errors.push(settings.errors.tooYoung);
							_this.errorsDisplay();
						}
					}
				} else {
					if(_this.setSessionStorage("ageVerified", "true")){
						if(settings.cookie.enabled) {
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
						if (settings.exactAge) {
							dt = '';
							ot = '<input class="day" maxlength="2" placeholder="01" />';
							console.log(settings.months);
							$.each(settings.months, function(index, value) {
								dt += '<option value='+value.id+'>'+value.name+'</option>';
							});
                			ot += '<select class="month">' + dt + '</select>';
                			ot += '<input class="year" maxlength="4" placeholder="1989"/>';
                			$('.ac-modal .date').append(ot);
						}
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