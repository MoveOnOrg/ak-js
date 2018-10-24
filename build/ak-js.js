/* NOTE: temporarily de-activated as on 10/19/18 */

// $(document).ready(function() {
//
//   /**
//    * If donation amount is large and we haven't already confirmed, halt
//    * form submission to confirm amount.
//    */
//   $('form').data('confirmed', false).submit(function(event) {
//     var $splitTotal = $('#total-to-split');
//     var donationAmount = 0;
//     var amountChecked = $('input:radio[name=amount]:checked');
//     if (amountChecked.length > 0) {
//         donationAmount = parseFloat(amountChecked.val());
//     } else {
//         donationAmount = parseFloat($('#amount_other_field').val());
//     }
//     if ($splitTotal.length > 0) {
//       donationAmount = parseFloat($splitTotal.val());
//     }
//     if (donationAmount >= 250) {
//       if (!confirmLargeDonation(donationAmount)) {
//         event.preventDefault();
//       }
//     }
//   });
//
//   $('form input').keyup(function() {
//     $('form').data('confirmed', false);
//   });
//
// });
//
// /**
//  * Show the large donation confirmation modal.
//  */
// function confirmLargeDonation(donationAmount) {
//
//   if ($('form').data('confirmed')) {
//     return true;
//   }
//
//   $('#confirm-big-donation .donation-amount').text(donationAmount);
//   $('#confirm-big-donation .btn.yes').click(function() {
//     $('#confirm-big-donation').on('hidden.bs.modal', function (e) {
//       $('form').data('confirmed', true).trigger('submit');
//     });
//     $('#confirm-big-donation').modal('hide');
//   });
//   $('#confirm-big-donation').modal();
//
//   return false;
// }
//
//
// /* NOTE: use the below when re-activated */
//
// /**
//  * If donation amount is large and we haven't already confirmed, halt
//  * form submission to confirm amount. We need to use the built-in AK error
//  * handler to do this, a regular e.preventDefault() will not work
//  */
//
// function actionkitBeforeValidation() {
//   $('form').data('confirmed', false).submit(function(event) {
//     var $splitTotal = $('#total-to-split');
//     var donationAmount = 0;
//     var amountChecked = $('input:radio[name=amount]:checked');
//     if (amountChecked.length > 0) {
//       donationAmount = parseFloat(amountChecked.val());
//     } else {
//       donationAmount = parseFloat($('#amount_other_field').val());
//     }
//     if ($splitTotal.length > 0) {
//       donationAmount = parseFloat($splitTotal.val());
//     }
//     if (donationAmount >= 250) {
//       if (!confirmLargeDonation(donationAmount)) {
//         actionkit.errors.large_donation = 'Large donation needs verification.';
//       }
//     }
//   });
//
//   $('form input').keyup(function() {
//     $('form').data('confirmed', false);
//   });
// }

/*
Email suggestion module, a wrapper around the jquery mailcheck plugin.
Use like:


  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
  <script src="/javascripts/jquery.mailcheck.js"></script> 
  <script src="/javascripts/email_suggestion.js"></script> 
  <script>$(function() { EmailSuggestion.init(); });</script>

If that can't find your email field you can specify an ID:

  EmailSuggestion.init({ 'email_id': 'my_email_id' });

All options supported:

  email_id - id of your email input

  email_selector - CSS selector of email input

  email_suggestion_id - id of the element used to display the suggestion, if not provided a span will be created after the email input

  email_suggestion_selector - CSS selector of above

  validation_error_class - defaults to set the color

  string - string used to prompt the user, default is "<br>Did you mean <a onclick="EmailSuggestion.ok()">{{email}}</a>?"

*/

var EmailSuggestion = {
    last_email_suggestion: "",
    email_field: undefined,
    email_suggestion_field: undefined,

    // top domains for MoveOn and SignOn as of 2012-04-03
    default_domains: ["gmail.com", "yahoo.com", "hotmail.com", "aol.com", "comcast.net", "msn.com", "sbcglobal.net", "verizon.net", "att.net", "bellsouth.net", "cox.net", "earthlink.net", "live.com", "mac.com", "charter.net", "me.com", "ymail.com", "optonline.net", "juno.com", "excite.com", "netscape.net", "pacbell.net"],

    init: function(args) {
        args = args || {};
        var string = args['string'] || '<div class="blurb moveon-bright-red bump-bottom-1"> Did you mean <strong><span style="cursor:pointer;"onclick="EmailSuggestion.ok()">{{email}}</span></strong>?  <a onclick="EmailSuggestion.ok()">Yes!</a> / <a onclick="EmailSuggestion.nevermind()">No</a> </div>';
        var domains = args['domains'] || this.default_domains;

    // find the email field - using args or just looking for input named email
        if (args['email_id']) {
            this.email_field = $('#'+args['email_id']);
        } else if (args['email_selector']) {
            this.email_field = $(args['email_selector']);
        } else {
            this.email_field = $('input[name="email"]')
        }
        if (!this.email_field.length) {
            throw new Error("Unable to find email field in setup_email_suggestion - please pass in email_id or email_selector.");
        }

        // find the email suggestion span - if one isn't found the
        // suggestion will be put in after the email field
        if (args['email_suggestion_id']) {
            this.email_suggestion_field = $('#'+args['email_suggestion_id']);
        } else if (args['email_suggestion_selector']) {
            this.email_suggestion_field = $(args['email_suggestion_selector']);
        }

        if (args['validation_error_class']) {
           this.validation_error_class = args['validation_error_class'];
        }
        if (!this.email_suggestion_field || !this.email_suggestion_field.length) {
            this.email_field.after('<span id="auto_email_suggestion" class="email_suggestion hidden"></span>');
            this.email_suggestion_field = $('#auto_email_suggestion');
        }
        this.email_field.keypress(function() {
            if (!/.*@.*\.\w+/.test($(this).val())) {
              EmailSuggestion.coloron();
            } else {
              EmailSuggestion.coloroff();
            }
        });
        this.email_field.blur(function() {
            $(this).mailcheck({
                domains: domains,
                suggested: function(element, suggestion) {
                    EmailSuggestion.last_email_suggestion = suggestion;
                    EmailSuggestion.email_suggestion_field.html(string.replace('{{email}}', suggestion['full'])).show().css('visibility', 'visible');
                    EmailSuggestion.coloron();
                },
                empty: function(element) { EmailSuggestion.email_suggestion_field.html(''); }
            });
        });
    },
    ok: function() {
        this.email_field.val(this.last_email_suggestion['full']);
        this.email_suggestion_field.html('');
        this.coloroff();
    },
    nevermind: function() {
        this.email_suggestion_field.html('');
        this.coloroff();
    },
    coloron: function() {
      if (this.validation_error_class) {
        this.email_field.addClass(this.validation_error_class);
      } else {
        this.email_field.attr( 'style', 'color:#c22326;')
      }
    },
    coloroff: function() {
      if (this.validation_error_class) {
        this.email_field.removeClass(this.validation_error_class);
      } else {
        this.email_field.attr( 'style', 'color:#555555;')
      }
    }
};


window.jsErrors = [];
window.onerror = function(errorMessage) {
  window.jsErrors[window.jsErrors.length] = errorMessage;
}

// Prepare toglle-all checkboxes
function toggleAll() {
    $(this)
        .closest('form')
        .find('input.toggle')
        .attr('checked', this.checked);
}

// Update "N attendee(s)" in e-mail form
function handleListChanged() {
    var $form = $(this).closest('form');
    var to_count = $('input.toggle:checked').length;
    // Mailing all recipients if none are checked
    if (to_count == 0) {
        to_count = $('input.toggle').length;
    }
    else {
        $form.find('.check-recipients-help').hide();
    }
    $form.find('.to-count').text(to_count);
}
// E-mail button
function showEmailForm() {
    var $form = $(this).closest('form');
    $form.find('.roster-controls').slideUp('fast');
    $form.find('.contact-form').slideDown('fast');
    return false;
}

// "E-mail attendee", "e-mail cohost", "invite friends" links
// Unhide if needed and fake :target on IE
function handleJumpLink() {
    var targetEl;
    if ( this.id == 'email-cohosts-link' )
        targetEl = $('.contact-cohosts');
    else if ( this.id == 'email-attendees-link' )
        targetEl = $('.contact-attendees');
    else if ( this.id == 'invite-friends-link' )
        targetEl = $('#taf');
    // Unhide e-mail form if needed
    if ( /^email-/.test(this.id) ) {
        var emailButton = targetEl.closest('form').find('input[type="submit"].email');
        showEmailForm.apply(emailButton, []);
    }
    // Highlight
    targetEl.addClass('target');
    // Allow jump to #foo to happen
    return true;
}

// Confirm a click
function confirmSubmit() {
    return confirm($(this).attr('data-confirm-message'));
}

// Stash the name of the submit button in the 'action' form field
// (helps the validation JS see which kind of action to validate for)
function setFormAction() {
    var formEl = $(this).closest('form')[0];
    if ( !formEl && !formEl.action ) return;
    formEl.action.value = this.name;
}

// Check for required fields for remove/promote/demote/e-mail
function validateRoster(form) {
    var action = form.action.value;
    // Nobody to remove/promote/demote
    if ( /(change-role|remove)/.test(action)
         && !($(form).find('input.toggle:checked').length) )
        actionkit.errors['user_id:missing'] =
            actionkit.forms.errorMessage('event_roster_user_ids:missing');
    // No message to send
    if ( action == 'send_email'
         && !form.body.value )
        actionkit.errors['body:missing'] =
            actionkit.forms.errorMessage('event_contact_body:missing');
}

// Confirm removing folks
function confirmRoster(form) {
    var action = form.action.value;
    var actionButton = $(form).find('input[name="' + action + '"]');
    var confirmMessage = actionButton.attr('confirm-message');
    if ( confirmMessage )
        return confirm(confirmMessage);
    else
        return true;
}

// Click anywhere in row to check/uncheck attendee
function toggleRow(e) {
    var toggleEl = $(this).closest('tr').find('.toggle')[0];
    if (toggleEl) {
        toggleEl.checked = !toggleEl.checked;
    }
    return false;
}

// Update the confirmation div from a different page
function updateConfirmationMessage() {
    for (var key in actionkit.args) {
        if (key.indexOf(':') > 0 && actionkit.args[key] == 1) {
            $('#ak-confirmation').text(actionkit.forms.text['error_' + key]);
            $('#ak-confirmation').show();
        }
    }
}

$(document).ready(function() {
    $('.if-js').show();
    $('a[data-confirm-message]').click(confirmSubmit);
    $('input.toggle-all').click(toggleAll);
    $('.event-roster td:not(.toggle-col)').click(toggleRow);
    $('input[type="submit"].email').click(showEmailForm);
    $('input[type="submit"]').click(setFormAction);
    $('.jump-link').click(handleJumpLink);
    $('input.toggle').click(handleListChanged);
    $('.add-more-link').shorten({
        moreText: 'see more',
        lessText: '',
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    updateConfirmationMessage();
});

// From http://snipplr.com/view/43646/prepopulate-form-with-values-from-querystring/
$(document).ready(function() {

  $('form').each(function() {
    var form = this;
    if (location.search == null || location.search.length < 1) {
      return; // no querystring
    }
    var pairs = location.search.substring(1).split("&");
    for (var p = 0; p < pairs.length; ++p ) {
      var pair = pairs[p].split("=");
      var name = pair[0];
      var value = unescape( pair[1].replace(/\+/g, " ") );
      var field = form.elements[name];
      var fieldType = null;
      var fieldIsMultivalue = false;

      if (field != null){
        if (field.length != null && field.length >= 1 && field[0].type != null && field[0].type != undefined) {
          fieldType = field[0].type;
          fieldIsMultivalue = true;
        } else {
          fieldType = field.type;
        }
      }
      switch (fieldType) {
        case "text":
        case "hidden":
        case "textarea":
          if (fieldIsMultivalue) {
            field = field[0]; // only handle first-named for this type
          }
          field.value = value;
          $(field).trigger('change');
          break;
        case "select-one":
        case "select-multiple":
          if (fieldIsMultivalue) {
            field = field[0]; // only handle first-named for this type
          }
          for (var o = 0; o < field.options.length; ++o) {
            var opt = field.options[o];
            var oval = opt.value;
            if (oval == null || oval == "" ) {
              oval = opt.text;
            }
            if (oval == value) {
              opt.selected = true;
              $(field).trigger('change');
              break;
            }
          }
          break;
        case "checkbox": case "radio":
          if (!fieldIsMultivalue) {
            // single checbox or radio of that name:
            field.checked = true;
          } else {
            for (var cr = 0; cr < field.length; ++cr) {
              if ( field[cr].value == value ) {
                field[cr].checked = true;
                $(field).trigger('change');
                break;
              }
            }
          }
          break;
        default:
          break;
      } // end of switch
    } // end of loop on fields from qs
  });
});

/*
 * Mailcheck https://github.com/Kicksend/mailcheck
 * Author
 * Derrick Ko (@derrickko)
 *
 * License
 * Copyright (c) 2012 Receivd, Inc.
 *
 * Licensed under the MIT License.
 *
 * v 1.0.1 - (plus a patch for IE6&7 from https://github.com/Kicksend/mailcheck/issues/14)
 */

(function($){
  $.fn.mailcheck = function(opts, optsAlt) {
    var defaultDomains = ["yahoo.com", "google.com", "hotmail.com", "gmail.com", "me.com", "aol.com", "mac.com",
                          "live.com", "comcast.net", "googlemail.com", "msn.com", "hotmail.co.uk", "yahoo.co.uk",
                          "facebook.com", "verizon.net", "sbcglobal.net", "att.net", "gmx.com", "mail.com"];

    if (typeof opts === 'object' && optsAlt === undefined) {
      // only opts is passed in
      opts.domains = opts.domains || defaultDomains;
    } else {
      // domains are passed in as opts
      var domains = opts;
      opts = optsAlt;
      opts.domains = domains || defaultDomains;
    }

    var result = Kicksend.mailcheck.suggest(encodeURI(this.val()), opts.domains);
    if (result) {
      if (opts.suggested) {
        opts.suggested(this, result);
      }
    } else {
      if (opts.empty) {
        opts.empty(this);
      }
    }
  };
})(jQuery);

var Kicksend = {
  mailcheck : {
    threshold: 3,

    suggest: function(email, domains) {
      email = email.toLowerCase();

      var emailParts = this.splitEmail(email);

      var closestDomain = this.findClosestDomain(emailParts.domain, domains);

      if (closestDomain) {
        return { address: emailParts.address, domain: closestDomain, full: emailParts.address + "@" + closestDomain }
      } else {
        return false;
      }
    },

    findClosestDomain: function(domain, domains) {
      var dist;
      var minDist = 99;
      var closestDomain = null;

      for (var i = 0; i < domains.length; i++) {
        if (domain === domains[i]) {
          return false;
        }
        dist = this.stringDistance(domain, domains[i]);
        if (dist < minDist) {
          minDist = dist;
          closestDomain = domains[i];
        }
      }

      if (minDist <= this.threshold && closestDomain !== null) {
        return closestDomain;
      } else {
        return false;
      }
    },

    stringDistance: function(s1, s2) {
      // sift3: http://siderite.blogspot.com/2007/04/super-fast-and-accurate-string-distance.html
      if (s1 == null || s1.length === 0) {
        if (s2 == null || s2.length === 0) {
          return 0;
        } else {
          return s2.length;
        }
      }

      if (s2 == null || s2.length === 0) {
        return s1.length;
      }

      var c = 0;
      var offset1 = 0;
      var offset2 = 0;
      var lcs = 0;
      var maxOffset = 5;

      while ((c + offset1 < s1.length) && (c + offset2 < s2.length)) {
        if (s1.charAt(c + offset1) == s2.charAt(c + offset2)) {
          lcs++;
        } else {
          offset1 = 0;
          offset2 = 0;
          for (var i = 0; i < maxOffset; i++) {
            if ((c + i < s1.length) && (s1.charAt(c + i) == s2.charAt(c))) {
              offset1 = i;
              break;
            }
            if ((c + i < s2.length) && (s1.charAt(c) == s2.charAt(c + i))) {
              offset2 = i;
              break;
            }
          }
        }
        c++;
      }
      return (s1.length + s2.length) /2 - lcs;
    },

    splitEmail: function(email) {
      var parts = email.split('@');

      if (parts.length < 2) {
        return false;
      }

      for (var i = 0; i < parts.length; i++) {
        if (parts[i] === '') {
          return false;
        }
      }

      return {
        domain: parts.pop(),
        address: parts.join('@')
      }
    }
  }
};

/*
 * jQuery Shorten plugin 1.1.0
 *
 * Copyright (c) 2014 Viral Patel
 * http://viralpatel.net
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

/*
** updated by Jeff Richardson
** Updated to use strict,
** IE 7 has a "bug" It is returning undefined when trying to reference string characters in this format
** content[i]. IE 7 allows content.charAt(i) This works fine in all modern browsers.
** I've also added brackets where they weren't added just for readability (mostly for me).
*/

(function($) {
    $.fn.shorten = function(settings) {
        "use strict";

        var config = {
            showChars: 100,
            minHideChars: 10,
            ellipsesText: "...",
            moreText: "more",
            lessText: "less",
            onLess: function() {},
            onMore: function() {},
            errMsg: null,
            force: false
        };

        if (settings) {
            $.extend(config, settings);
        }

        if ($(this).data('jquery.shorten') && !config.force) {
            return false;
        }
        $(this).data('jquery.shorten', true);

        $(document).off("click", '.morelink');

        $(document).on({
            click: function() {

                var $this = $(this);
                if ($this.hasClass('less')) {
                    $this.removeClass('less');
                    $this.html(config.moreText);
                    $this.parent().prev().animate({'height':'0'+'%'}, function () { $this.parent().prev().prev().show(); }).hide('fast', function() {
                        config.onLess();
                      });

                } else {
                    $this.addClass('less');
                    $this.html(config.lessText);
                    $this.parent().prev().animate({'height':'100'+'%'}, function () { $this.parent().prev().prev().hide(); }).show('fast', function() {
                        config.onMore();
                      });
                }
                return false;
            }
        }, '.morelink');

        return this.each(function() {
            var $this = $(this);

            var content = $this.html();
            var contentlen = $this.text().length;
            if (contentlen > config.showChars + config.minHideChars) {
                var c = content.substr(0, config.showChars);
                if (c.indexOf('<') >= 0) // If there's HTML don't want to cut it
                {
                    var inTag = false; // I'm in a tag?
                    var bag = ''; // Put the characters to be shown here
                    var countChars = 0; // Current bag size
                    var openTags = []; // Stack for opened tags, so I can close them later
                    var tagName = null;

                    for (var i = 0, r = 0; r <= config.showChars; i++) {
                        if (content[i] == '<' && !inTag) {
                            inTag = true;

                            // This could be "tag" or "/tag"
                            tagName = content.substring(i + 1, content.indexOf('>', i));

                            // If its a closing tag
                            if (tagName[0] == '/') {


                                if (tagName != '/' + openTags[0]) {
                                    config.errMsg = 'ERROR en HTML: the top of the stack should be the tag that closes';
                                } else {
                                    openTags.shift(); // Pops the last tag from the open tag stack (the tag is closed in the retult HTML!)
                                }

                            } else {
                                // There are some nasty tags that don't have a close tag like <br/>
                                if (tagName.toLowerCase() != 'br') {
                                    openTags.unshift(tagName); // Add to start the name of the tag that opens
                                }
                            }
                        }
                        if (inTag && content[i] == '>') {
                            inTag = false;
                        }

                        if (inTag) { bag += content.charAt(i); } // Add tag name chars to the result
                        else {
                            r++;
                            if (countChars <= config.showChars) {
                                bag += content.charAt(i); // Fix to ie 7 not allowing you to reference string characters using the []
                                countChars++;
                            } else // Now I have the characters needed
                            {
                                if (openTags.length > 0) // I have unclosed tags
                                {
                                    //console.log('They were open tags');
                                    //console.log(openTags);
                                    for (j = 0; j < openTags.length; j++) {
                                        //console.log('Cierro tag ' + openTags[j]);
                                        bag += '</' + openTags[j] + '>'; // Close all tags that were opened

                                        // You could shift the tag from the stack to check if you end with an empty stack, that means you have closed all open tags
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    c = $('<div/>').html(bag + '<span class="ellip">' + config.ellipsesText + '</span>').html();
                }else{
                    c+=config.ellipsesText;
                }

                var html = '<div class="shortcontent">' + c +
                    '</div><div class="allcontent">' + content +
                    '</div><span><a href="javascript://nop/" class="morelink">' + config.moreText + '</a></span>';

                $this.html(html);
                $this.find(".allcontent").hide(); // Hide all text
                $('.shortcontent p:last', $this).css('margin-bottom', 0); //Remove bottom margin on last paragraph as it's likely shortened
            }
        });

    };

})(jQuery);

/*!
 * jquery-timepicker v1.10.1 - A jQuery timepicker plugin inspired by Google Calendar. It supports both mouse and keyboard navigation.
 * Copyright (c) 2015 Jon Thornton - http://jonthornton.github.com/jquery-timepicker/
 * License: MIT
 */


(function (factory) {
    if (typeof exports === "object" && exports &&
        typeof module === "object" && module && module.exports === exports) {
        // Browserify. Attach to jQuery module.
        factory(require("jquery"));
    } else if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	var _ONE_DAY = 86400;
	var _lang = {
		am: 'am',
		pm: 'pm',
		AM: 'AM',
		PM: 'PM',
		decimal: '.',
		mins: 'mins',
		hr: 'hr',
		hrs: 'hrs'
	};

	var methods = {
		init: function(options)
		{
			return this.each(function()
			{
				var self = $(this);

				// pick up settings from data attributes
				var attributeOptions = [];
				for (var key in $.fn.timepicker.defaults) {
					if (self.data(key))  {
						attributeOptions[key] = self.data(key);
					}
				}

				var settings = $.extend({}, $.fn.timepicker.defaults, attributeOptions, options);

				if (settings.lang) {
					_lang = $.extend(_lang, settings.lang);
				}

				settings = _parseSettings(settings);
				self.data('timepicker-settings', settings);
				self.addClass('ui-timepicker-input');

				if (settings.useSelect) {
					_render(self);
				} else {
					self.prop('autocomplete', 'off');
					if (settings.showOn) {
						for (var i in settings.showOn) {
							self.on(settings.showOn[i]+'.timepicker', methods.show);
						}
					}
					self.on('change.timepicker', _formatValue);
					self.on('keydown.timepicker', _keydownhandler);
					self.on('keyup.timepicker', _keyuphandler);
					if (settings.disableTextInput) {
						self.on('keydown.timepicker', _disableTextInputHandler);
					}
					if (settings.disableInitFormat) {
					  _formatValue.call(self.get(0));
                                        }
				}
			});
		},

		show: function(e)
		{
			var self = $(this);
			var settings = self.data('timepicker-settings');

			if (e) {
				e.preventDefault();
			}

			if (settings.useSelect) {
				self.data('timepicker-list').focus();
				return;
			}

			if (_hideKeyboard(self)) {
				// block the keyboard on mobile devices
				self.blur();
			}

			var list = self.data('timepicker-list');

			// check if input is readonly
			if (self.prop('readonly')) {
				return;
			}

			// check if list needs to be rendered
			if (!list || list.length === 0 || typeof settings.durationTime === 'function') {
				_render(self);
				list = self.data('timepicker-list');
			}

			if (_isVisible(list)) {
				return;
			}

			self.data('ui-timepicker-value', self.val());
			_setSelected(self, list);

			// make sure other pickers are hidden
			methods.hide();

			// position the dropdown relative to the input
			list.show();
			var listOffset = {};

			if (settings.orientation.match(/r/)) {
				// right-align the dropdown
				listOffset.left = self.offset().left + self.outerWidth() - list.outerWidth() + parseInt(list.css('marginLeft').replace('px', ''), 10);
			} else {
				// left-align the dropdown
				listOffset.left = self.offset().left + parseInt(list.css('marginLeft').replace('px', ''), 10);
			}

			var verticalOrientation;
			if (settings.orientation.match(/t/)) {
				verticalOrientation = 't';
			} else if (settings.orientation.match(/b/)) {
				verticalOrientation = 'b';
			} else if ((self.offset().top + self.outerHeight(true) + list.outerHeight()) > $(window).height() + $(window).scrollTop()) {
				verticalOrientation = 't';
			} else {
				verticalOrientation = 'b';
			}

			if (verticalOrientation == 't') {
				// position the dropdown on top
				list.addClass('ui-timepicker-positioned-top');
				listOffset.top = self.offset().top - list.outerHeight() + parseInt(list.css('marginTop').replace('px', ''), 10);
			} else {
				// put it under the input
				list.removeClass('ui-timepicker-positioned-top');
				listOffset.top = self.offset().top + self.outerHeight() + parseInt(list.css('marginTop').replace('px', ''), 10);
			}

			list.offset(listOffset);

			// position scrolling
			var selected = list.find('.ui-timepicker-selected');

			if (!selected.length) {
				var timeInt = _time2int(_getTimeValue(self));
				if (timeInt !== null) {
					selected = _findRow(self, list, timeInt);
				} else if (settings.scrollDefault) {
					selected = _findRow(self, list, settings.scrollDefault());
				}
			}

			if (selected && selected.length) {
				var topOffset = list.scrollTop() + selected.position().top - selected.outerHeight();
				list.scrollTop(topOffset);
			} else {
				list.scrollTop(0);
			}

			// prevent scroll propagation
			if(settings.stopScrollPropagation) {
				$(document).on('wheel.ui-timepicker', '.ui-timepicker-wrapper', function(e){
					e.preventDefault();
					var currentScroll = $(this).scrollTop();
					$(this).scrollTop(currentScroll + e.originalEvent.deltaY);
				});
			}

			// attach close handlers
			$(document).on('touchstart.ui-timepicker mousedown.ui-timepicker', _closeHandler);
			$(window).on('resize.ui-timepicker', _closeHandler);
			if (settings.closeOnWindowScroll) {
				$(document).on('scroll.ui-timepicker', _closeHandler);
			}

			self.trigger('showTimepicker');

			return this;
		},

		hide: function(e)
		{
			var self = $(this);
			var settings = self.data('timepicker-settings');

			if (settings && settings.useSelect) {
				self.blur();
			}

			$('.ui-timepicker-wrapper').each(function() {
				var list = $(this);
				if (!_isVisible(list)) {
					return;
				}

				var self = list.data('timepicker-input');
				var settings = self.data('timepicker-settings');

				if (settings && settings.selectOnBlur) {
					_selectValue(self);
				}

				list.hide();
				self.trigger('hideTimepicker');
			});

			return this;
		},

		option: function(key, value)
		{
			if (typeof key == 'string' && typeof value == 'undefined') {
				return $(this).data('timepicker-settings')[key];
			}

			return this.each(function(){
				var self = $(this);
				var settings = self.data('timepicker-settings');
				var list = self.data('timepicker-list');

				if (typeof key == 'object') {
					settings = $.extend(settings, key);
				} else if (typeof key == 'string') {
					settings[key] = value;
				}

				settings = _parseSettings(settings);

				self.data('timepicker-settings', settings);

				if (list) {
					list.remove();
					self.data('timepicker-list', false);
				}

				if (settings.useSelect) {
					_render(self);
				}
			});
		},

		getSecondsFromMidnight: function()
		{
			return _time2int(_getTimeValue(this));
		},

		getTime: function(relative_date)
		{
			var self = this;

			var time_string = _getTimeValue(self);
			if (!time_string) {
				return null;
			}

			var offset = _time2int(time_string);
			if (offset === null) {
				return null;
			}

			if (!relative_date) {
				relative_date = new Date();
			}

			// construct a Date from relative date, and offset's time
			var time = new Date(relative_date);
			time.setHours(offset / 3600);
			time.setMinutes(offset % 3600 / 60);
			time.setSeconds(offset % 60);
			time.setMilliseconds(0);

			return time;
		},

		isVisible: function() {
			var self = this;
			var list = self.data('timepicker-list');
			return !!(list && _isVisible(list));
		},

		setTime: function(value)
		{
			var self = this;
			var settings = self.data('timepicker-settings');

			if (settings.forceRoundTime) {
				var prettyTime = _roundAndFormatTime(_time2int(value), settings)
			} else {
				var prettyTime = _int2time(_time2int(value), settings);
			}

			if (value && prettyTime === null && settings.noneOption) {
				prettyTime = value;
			}

			_setTimeValue(self, prettyTime);
			if (self.data('timepicker-list')) {
				_setSelected(self, self.data('timepicker-list'));
			}

			return this;
		},

		remove: function()
		{
			var self = this;

			// check if this element is a timepicker
			if (!self.hasClass('ui-timepicker-input')) {
				return;
			}

			var settings = self.data('timepicker-settings');
			self.removeAttr('autocomplete', 'off');
			self.removeClass('ui-timepicker-input');
			self.removeData('timepicker-settings');
			self.off('.timepicker');

			// timepicker-list won't be present unless the user has interacted with this timepicker
			if (self.data('timepicker-list')) {
				self.data('timepicker-list').remove();
			}

			if (settings.useSelect) {
				self.show();
			}

			self.removeData('timepicker-list');

			return this;
		}
	};

	// private methods

	function _isVisible(elem)
	{
		var el = elem[0];
		return el.offsetWidth > 0 && el.offsetHeight > 0;
	}

	function _parseSettings(settings)
	{
		if (settings.minTime) {
			settings.minTime = _time2int(settings.minTime);
		}

		if (settings.maxTime) {
			settings.maxTime = _time2int(settings.maxTime);
		}

		if (settings.durationTime && typeof settings.durationTime !== 'function') {
			settings.durationTime = _time2int(settings.durationTime);
		}

		if (settings.scrollDefault == 'now') {
			settings.scrollDefault = function() {
				return settings.roundingFunction(_time2int(new Date()), settings);
			}
		} else if (settings.scrollDefault && typeof settings.scrollDefault != 'function') {
			var val = settings.scrollDefault;
			settings.scrollDefault = function() {
				return settings.roundingFunction(_time2int(val), settings);
			}
		} else if (settings.minTime) {
			settings.scrollDefault = function() {
				return settings.roundingFunction(settings.minTime, settings);
			}
		}

		if ($.type(settings.timeFormat) === "string" && settings.timeFormat.match(/[gh]/)) {
			settings._twelveHourTime = true;
		}

		if (settings.showOnFocus === false && settings.showOn.indexOf('focus') != -1) {
			settings.showOn.splice(settings.showOn.indexOf('focus'), 1);
		}

		if (settings.disableTimeRanges.length > 0) {
			// convert string times to integers
			for (var i in settings.disableTimeRanges) {
				settings.disableTimeRanges[i] = [
					_time2int(settings.disableTimeRanges[i][0]),
					_time2int(settings.disableTimeRanges[i][1])
				];
			}

			// sort by starting time
			settings.disableTimeRanges = settings.disableTimeRanges.sort(function(a, b){
				return a[0] - b[0];
			});

			// merge any overlapping ranges
			for (var i = settings.disableTimeRanges.length-1; i > 0; i--) {
				if (settings.disableTimeRanges[i][0] <= settings.disableTimeRanges[i-1][1]) {
					settings.disableTimeRanges[i-1] = [
						Math.min(settings.disableTimeRanges[i][0], settings.disableTimeRanges[i-1][0]),
						Math.max(settings.disableTimeRanges[i][1], settings.disableTimeRanges[i-1][1])
					];
					settings.disableTimeRanges.splice(i, 1);
				}
			}
		}

		return settings;
	}

	function _render(self)
	{
		var settings = self.data('timepicker-settings');
		var list = self.data('timepicker-list');

		if (list && list.length) {
			list.remove();
			self.data('timepicker-list', false);
		}

		if (settings.useSelect) {
			list = $('<select />', { 'class': 'ui-timepicker-select' });
			var wrapped_list = list;
		} else {
			list = $('<ul />', { 'class': 'ui-timepicker-list' });

			var wrapped_list = $('<div />', { 'class': 'ui-timepicker-wrapper', 'tabindex': -1 });
			wrapped_list.css({'display':'none', 'position': 'absolute' }).append(list);
		}

		if (settings.noneOption) {
			if (settings.noneOption === true) {
				settings.noneOption = (settings.useSelect) ? 'Time...' : 'None';
			}

			if ($.isArray(settings.noneOption)) {
				for (var i in settings.noneOption) {
					if (parseInt(i, 10) == i){
						var noneElement = _generateNoneElement(settings.noneOption[i], settings.useSelect);
						list.append(noneElement);
					}
				}
			} else {
				var noneElement = _generateNoneElement(settings.noneOption, settings.useSelect);
				list.append(noneElement);
			}
		}

		if (settings.className) {
			wrapped_list.addClass(settings.className);
		}

		if ((settings.minTime !== null || settings.durationTime !== null) && settings.showDuration) {
			var stepval = typeof settings.step == 'function' ? 'function' : settings.step;
			wrapped_list.addClass('ui-timepicker-with-duration');
			wrapped_list.addClass('ui-timepicker-step-'+settings.step);
		}

		var durStart = settings.minTime;
		if (typeof settings.durationTime === 'function') {
			durStart = _time2int(settings.durationTime());
		} else if (settings.durationTime !== null) {
			durStart = settings.durationTime;
		}
		var start = (settings.minTime !== null) ? settings.minTime : 0;
		var end = (settings.maxTime !== null) ? settings.maxTime : (start + _ONE_DAY - 1);

		if (end < start) {
			// make sure the end time is greater than start time, otherwise there will be no list to show
			end += _ONE_DAY;
		}

		if (end === _ONE_DAY-1 && $.type(settings.timeFormat) === "string" && settings.show2400) {
			// show a 24:00 option when using military time
			end = _ONE_DAY;
		}

		var dr = settings.disableTimeRanges;
		var drCur = 0;
		var drLen = dr.length;

		var stepFunc = settings.step;
		if (typeof stepFunc != 'function') {
			stepFunc = function() {
				return settings.step;
			}
		}

		for (var i=start, j=0; i <= end; j++, i += stepFunc(j)*60) {
			var timeInt = i;
			var timeString = _int2time(timeInt, settings);

			if (settings.useSelect) {
				var row = $('<option />', { 'value': timeString });
				row.text(timeString);
			} else {
				var row = $('<li />');
				row.addClass(timeInt % 86400 < 43200 ? 'ui-timepicker-am' : 'ui-timepicker-pm');
				row.data('time', (timeInt <= 86400 ? timeInt : timeInt % 86400));
				row.text(timeString);
			}

			if ((settings.minTime !== null || settings.durationTime !== null) && settings.showDuration) {
				var durationString = _int2duration(i - durStart, settings.step);
				if (settings.useSelect) {
					row.text(row.text()+' ('+durationString+')');
				} else {
					var duration = $('<span />', { 'class': 'ui-timepicker-duration' });
					duration.text(' ('+durationString+')');
					row.append(duration);
				}
			}

			if (drCur < drLen) {
				if (timeInt >= dr[drCur][1]) {
					drCur += 1;
				}

				if (dr[drCur] && timeInt >= dr[drCur][0] && timeInt < dr[drCur][1]) {
					if (settings.useSelect) {
						row.prop('disabled', true);
					} else {
						row.addClass('ui-timepicker-disabled');
					}
				}
			}

			list.append(row);
		}

		wrapped_list.data('timepicker-input', self);
		self.data('timepicker-list', wrapped_list);

		if (settings.useSelect) {
			if (self.val()) {
				list.val(_roundAndFormatTime(_time2int(self.val()), settings));
			}

			list.on('focus', function(){
				$(this).data('timepicker-input').trigger('showTimepicker');
			});
			list.on('blur', function(){
				$(this).data('timepicker-input').trigger('hideTimepicker');
			});
			list.on('change', function(){
				_setTimeValue(self, $(this).val(), 'select');
			});

			_setTimeValue(self, list.val(), 'initial');
			self.hide().after(list);
		} else {
			var appendTo = settings.appendTo;
			if (typeof appendTo === 'string') {
				appendTo = $(appendTo);
			} else if (typeof appendTo === 'function') {
				appendTo = appendTo(self);
			}
			appendTo.append(wrapped_list);
			_setSelected(self, list);

			list.on('mousedown touchstart', 'li', function(e) {

				// hack: temporarily disable the focus handler
				// to deal with the fact that IE fires 'focus'
				// events asynchronously
				self.off('focus.timepicker');
				self.on('focus.timepicker-ie-hack', function(){
					self.off('focus.timepicker-ie-hack');
					self.on('focus.timepicker', methods.show);
				});

				if (!_hideKeyboard(self)) {
					self[0].focus();
				}

				// make sure only the clicked row is selected
				list.find('li').removeClass('ui-timepicker-selected');
				$(this).addClass('ui-timepicker-selected');

				if (_selectValue(self)) {
					self.trigger('hideTimepicker');

					list.on('mouseup.timepicker touchend.timepicker', 'li', function(e) {
						list.off('mouseup.timepicker touchend.timepicker');
						wrapped_list.hide();
					});
				}
			});
		}
	}

	function _generateNoneElement(optionValue, useSelect)
	{
		var label, className, value;

		if (typeof optionValue == 'object') {
			label = optionValue.label;
			className = optionValue.className;
			value = optionValue.value;
		} else if (typeof optionValue == 'string') {
			label = optionValue;
		} else {
			$.error('Invalid noneOption value');
		}

		if (useSelect) {
			return $('<option />', {
					'value': value,
					'class': className,
					'text': label
				});
		} else {
			return $('<li />', {
					'class': className,
					'text': label
				}).data('time', String(value));
		}
	}

	function _roundAndFormatTime(seconds, settings)
	{
		seconds = settings.roundingFunction(seconds, settings);
		if (seconds !== null) {
			return _int2time(seconds, settings);
		}
	}

	// event handler to decide whether to close timepicker
	function _closeHandler(e)
	{
		var target = $(e.target);
		var input = target.closest('.ui-timepicker-input');
		if (input.length === 0 && target.closest('.ui-timepicker-wrapper').length === 0) {
			methods.hide();
			$(document).unbind('.ui-timepicker');
			$(window).unbind('.ui-timepicker');
		}
	}

	function _hideKeyboard(self)
	{
		var settings = self.data('timepicker-settings');
		return ((window.navigator.msMaxTouchPoints || 'ontouchstart' in document) && settings.disableTouchKeyboard);
	}

	function _findRow(self, list, value)
	{
		if (!value && value !== 0) {
			return false;
		}

		var settings = self.data('timepicker-settings');
		var out = false;
		var value = settings.roundingFunction(value, settings);

		// loop through the menu items
		list.find('li').each(function(i, obj) {
			var jObj = $(obj);
			if (typeof jObj.data('time') != 'number') {
				return;
			}

			if (jObj.data('time') == value) {
				out = jObj;
				return false;
			}
		});

		return out;
	}

	function _setSelected(self, list)
	{
		list.find('li').removeClass('ui-timepicker-selected');

		var timeValue = _time2int(_getTimeValue(self), self.data('timepicker-settings'));
		if (timeValue === null) {
			return;
		}

		var selected = _findRow(self, list, timeValue);
		if (selected) {

			var topDelta = selected.offset().top - list.offset().top;

			if (topDelta + selected.outerHeight() > list.outerHeight() || topDelta < 0) {
				list.scrollTop(list.scrollTop() + selected.position().top - selected.outerHeight());
			}

			selected.addClass('ui-timepicker-selected');
		}
	}


	function _formatValue(e, origin)
	{
		if (this.value === '' || origin == 'timepicker') {
			return;
		}

		var self = $(this);

		if (self.is(':focus') && (!e || e.type != 'change')) {
			return;
		}

		var settings = self.data('timepicker-settings');
		var seconds = _time2int(this.value, settings);

		if (seconds === null) {
			self.trigger('timeFormatError');
			return;
		}

		var rangeError = false;
		// check that the time in within bounds
		if (settings.minTime !== null && seconds < settings.minTime
			&& settings.maxTime !== null && seconds > settings.maxTime) {
			rangeError = true;
		}

		// check that time isn't within disabled time ranges
		$.each(settings.disableTimeRanges, function(){
			if (seconds >= this[0] && seconds < this[1]) {
				rangeError = true;
				return false;
			}
		});

		if (settings.forceRoundTime) {
			seconds = settings.roundingFunction(seconds, settings);
		}

		var prettyTime = _int2time(seconds, settings);

		if (rangeError) {
			if (_setTimeValue(self, prettyTime, 'error')) {
				self.trigger('timeRangeError');
			}
		} else {
			_setTimeValue(self, prettyTime);
		}
	}

	function _getTimeValue(self)
	{
		if (self.is('input')) {
			return self.val();
		} else {
			// use the element's data attributes to store values
			return self.data('ui-timepicker-value');
		}
	}

	function _setTimeValue(self, value, source)
	{
		if (self.is('input')) {
			self.val(value);

			var settings = self.data('timepicker-settings');
			if (settings.useSelect && source != 'select' && source != 'initial') {
				self.data('timepicker-list').val(_roundAndFormatTime(_time2int(value), settings));
			}
		}

		if (self.data('ui-timepicker-value') != value) {
			self.data('ui-timepicker-value', value);
			if (source == 'select') {
				self.trigger('selectTime').trigger('changeTime').trigger('change', 'timepicker');
			} else if (source != 'error') {
				self.trigger('changeTime');
			}

			return true;
		} else {
			self.trigger('selectTime');
			return false;
		}
	}

	/*
	*  Filter freeform input
	*/
	function _disableTextInputHandler(e)
	{
		switch (e.keyCode) {
			case 13: // return
			case 9: //tab
				return;

			default:
				e.preventDefault();
		}
	}

	/*
	*  Keyboard navigation via arrow keys
	*/
	function _keydownhandler(e)
	{
		var self = $(this);
		var list = self.data('timepicker-list');

		if (!list || !_isVisible(list)) {
			if (e.keyCode == 40) {
				// show the list!
				methods.show.call(self.get(0));
				list = self.data('timepicker-list');
				if (!_hideKeyboard(self)) {
					self.focus();
				}
			} else {
				return true;
			}
		}

		switch (e.keyCode) {

			case 13: // return
				if (_selectValue(self)) {
					methods.hide.apply(this);
				}

				e.preventDefault();
				return false;

			case 38: // up
				var selected = list.find('.ui-timepicker-selected');

				if (!selected.length) {
					list.find('li').each(function(i, obj) {
						if ($(obj).position().top > 0) {
							selected = $(obj);
							return false;
						}
					});
					selected.addClass('ui-timepicker-selected');

				} else if (!selected.is(':first-child')) {
					selected.removeClass('ui-timepicker-selected');
					selected.prev().addClass('ui-timepicker-selected');

					if (selected.prev().position().top < selected.outerHeight()) {
						list.scrollTop(list.scrollTop() - selected.outerHeight());
					}
				}

				return false;

			case 40: // down
				selected = list.find('.ui-timepicker-selected');

				if (selected.length === 0) {
					list.find('li').each(function(i, obj) {
						if ($(obj).position().top > 0) {
							selected = $(obj);
							return false;
						}
					});

					selected.addClass('ui-timepicker-selected');
				} else if (!selected.is(':last-child')) {
					selected.removeClass('ui-timepicker-selected');
					selected.next().addClass('ui-timepicker-selected');

					if (selected.next().position().top + 2*selected.outerHeight() > list.outerHeight()) {
						list.scrollTop(list.scrollTop() + selected.outerHeight());
					}
				}

				return false;

			case 27: // escape
				list.find('li').removeClass('ui-timepicker-selected');
				methods.hide();
				break;

			case 9: //tab
				methods.hide();
				break;

			default:
				return true;
		}
	}

	/*
	*	Time typeahead
	*/
	function _keyuphandler(e)
	{
		var self = $(this);
		var list = self.data('timepicker-list');
		var settings = self.data('timepicker-settings');

		if (!list || !_isVisible(list) || settings.disableTextInput) {
			return true;
		}

		switch (e.keyCode) {

			case 96: // numpad numerals
			case 97:
			case 98:
			case 99:
			case 100:
			case 101:
			case 102:
			case 103:
			case 104:
			case 105:
			case 48: // numerals
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:
			case 65: // a
			case 77: // m
			case 80: // p
			case 186: // colon
			case 8: // backspace
			case 46: // delete
				if (settings.typeaheadHighlight) {
					_setSelected(self, list);
				} else {
					list.hide();
				}
				break;
		}
	}

	function _selectValue(self)
	{
		var settings = self.data('timepicker-settings');
		var list = self.data('timepicker-list');
		var timeValue = null;

		var cursor = list.find('.ui-timepicker-selected');

		if (cursor.hasClass('ui-timepicker-disabled')) {
			return false;
		}

		if (cursor.length) {
			// selected value found
			timeValue = cursor.data('time');
		}

		if (timeValue !== null) {
			if (typeof timeValue != 'string') {
				timeValue = _int2time(timeValue, settings);
			}

			_setTimeValue(self, timeValue, 'select');
		}

		return true;
	}

	function _int2duration(seconds, step)
	{
		seconds = Math.abs(seconds);
		var minutes = Math.round(seconds/60),
			duration = [],
			hours, mins;

		if (minutes < 60) {
			// Only show (x mins) under 1 hour
			duration = [minutes, _lang.mins];
		} else {
			hours = Math.floor(minutes/60);
			mins = minutes%60;

			// Show decimal notation (eg: 1.5 hrs) for 30 minute steps
			if (step == 30 && mins == 30) {
				hours += _lang.decimal + 5;
			}

			duration.push(hours);
			duration.push(hours == 1 ? _lang.hr : _lang.hrs);

			// Show remainder minutes notation (eg: 1 hr 15 mins) for non-30 minute steps
			// and only if there are remainder minutes to show
			if (step != 30 && mins) {
				duration.push(mins);
				duration.push(_lang.mins);
			}
		}

		return duration.join(' ');
	}

	function _int2time(timeInt, settings)
	{
		if (typeof timeInt != 'number') {
			return null;
		}

		var seconds = parseInt(timeInt%60)
			, minutes = parseInt((timeInt/60)%60)
			, hours = parseInt((timeInt/(60*60))%24);

		var time = new Date(1970, 0, 2, hours, minutes, seconds, 0);

		if (isNaN(time.getTime())) {
			return null;
		}

		if ($.type(settings.timeFormat) === "function") {
			return settings.timeFormat(time);
		}

		var output = '';
		var hour, code;
		for (var i=0; i<settings.timeFormat.length; i++) {

			code = settings.timeFormat.charAt(i);
			switch (code) {

				case 'a':
					output += (time.getHours() > 11) ? _lang.pm : _lang.am;
					break;

				case 'A':
					output += (time.getHours() > 11) ? _lang.PM : _lang.AM;
					break;

				case 'g':
					hour = time.getHours() % 12;
					output += (hour === 0) ? '12' : hour;
					break;

				case 'G':
					hour = time.getHours();
					if (timeInt === _ONE_DAY) hour = settings.show2400 ? 24 : 0;
					output += hour;
					break;

				case 'h':
					hour = time.getHours() % 12;

					if (hour !== 0 && hour < 10) {
						hour = '0'+hour;
					}

					output += (hour === 0) ? '12' : hour;
					break;

				case 'H':
					hour = time.getHours();
					if (timeInt === _ONE_DAY) hour = settings.show2400 ? 24 : 0;
					output += (hour > 9) ? hour : '0'+hour;
					break;

				case 'i':
					var minutes = time.getMinutes();
					output += (minutes > 9) ? minutes : '0'+minutes;
					break;

				case 's':
					seconds = time.getSeconds();
					output += (seconds > 9) ? seconds : '0'+seconds;
					break;

				case '\\':
					// escape character; add the next character and skip ahead
					i++;
					output += settings.timeFormat.charAt(i);
					break;

				default:
					output += code;
			}
		}

		return output;
	}

	function _time2int(timeString, settings)
	{
		if (timeString === '' || timeString === null) return null;
		if (typeof timeString == 'object') {
			return timeString.getHours()*3600 + timeString.getMinutes()*60 + timeString.getSeconds();
		}
		if (typeof timeString != 'string') {
			return timeString;
		}

		timeString = timeString.toLowerCase().replace(/[\s\.]/g, '');

		// if the last character is an "a" or "p", add the "m"
		if (timeString.slice(-1) == 'a' || timeString.slice(-1) == 'p') {
			timeString += 'm';
		}

		var ampmRegex = '(' +
			_lang.am.replace('.', '')+'|' +
			_lang.pm.replace('.', '')+'|' +
			_lang.AM.replace('.', '')+'|' +
			_lang.PM.replace('.', '')+')?';

		// try to parse time input
		var pattern = new RegExp('^'+ampmRegex+'([0-9]?[0-9])\\W?([0-5][0-9])?\\W?([0-5][0-9])?'+ampmRegex+'$');

		var time = timeString.match(pattern);
		if (!time) {
			return null;
		}

		var unboundedHour = parseInt(time[2]*1, 10);
		var hour = (unboundedHour > 24) ? unboundedHour % 24 : unboundedHour;
		var ampm = time[1] || time[5];
		var hours = hour;

		if (hour <= 12 && ampm) {
			var isPm = (ampm == _lang.pm || ampm == _lang.PM);

			if (hour == 12) {
				hours = isPm ? 12 : 0;
			} else {
				hours = (hour + (isPm ? 12 : 0));
			}
		}

		var minutes = ( time[3]*1 || 0 );
		var seconds = ( time[4]*1 || 0 );
		var timeInt = hours*3600 + minutes*60 + seconds;

		// if no am/pm provided, intelligently guess based on the scrollDefault
		if (hour < 12 && !ampm && settings && settings._twelveHourTime && settings.scrollDefault) {
			var delta = timeInt - settings.scrollDefault();
			if (delta < 0 && delta >= _ONE_DAY / -2) {
				timeInt = (timeInt + (_ONE_DAY / 2)) % _ONE_DAY;
			}
		}

		return timeInt;
	}

	function _pad2(n) {
		return ("0" + n).slice(-2);
	}

	// Plugin entry
	$.fn.timepicker = function(method)
	{
		if (!this.length) return this;
		if (methods[method]) {
			// check if this element is a timepicker
			if (!this.hasClass('ui-timepicker-input')) {
				return this;
			}
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === "object" || !method) { return methods.init.apply(this, arguments); }
		else { $.error("Method "+ method + " does not exist on jQuery.timepicker"); }
	};
	// Global defaults
	$.fn.timepicker.defaults = {
		appendTo: 'body',
		className: null,
		closeOnWindowScroll: false,
		disableTextInput: false,
		disableTimeRanges: [],
	  disableTouchKeyboard: false,
          disableInitFormat: false,
		durationTime: null,
		forceRoundTime: false,
		maxTime: null,
		minTime: null,
		noneOption: false,
		orientation: 'l',
		roundingFunction: function(seconds, settings) {
			if (seconds === null) {
				return null;
			} else if (typeof settings.step !== "number") {
				// TODO: nearest fit irregular steps
				return seconds;
			} else {
				var offset = seconds % (settings.step*60); // step is in minutes

				if (offset >= settings.step*30) {
					// if offset is larger than a half step, round up
					seconds += (settings.step*60) - offset;
				} else {
					// round down
					seconds -= offset;
				}

				if (seconds == _ONE_DAY && settings.show2400) {
					return seconds;
				}

				return seconds%_ONE_DAY;
			}
		},
		scrollDefault: null,
		selectOnBlur: false,
		show2400: false,
		showDuration: false,
		showOn: ['click', 'focus'],
		showOnFocus: true,
		step: 30,
		stopScrollPropagation: false,
		timeFormat: 'g:ia',
		typeaheadHighlight: true,
		useSelect: false
	};
}));

/*
  Interacts with user_form.html
  Use Cases:
  * on filling out phone field with 10 digits, rolls down a SMS subscribe checkbox
    -- checkbox should be default-checked, with phone_type="mobile"
    -- unchecking the box will remove phone_type="mobile"
  * for purposes of "pure phone subscription" have a survey form that 
    -- hides email address completely and inserts a fake email address on submit
    -- if fake email, also include suppress_subscribe="1"
  $('#id_sms_subscribe').attr('data-phonemobile') has escalating values of:
    - opt-in
    - opt-out
    - opt-out-email-optional
    - opt-out-email-hidden

  TO CONSIDER:
    * should I implement this with EmailSuggestion (see donate form)
    * how to hook in to form submission
*/

var SMS_SUBSCRIBE_DIV = '#id_subscribe_sms';

//onLOAD
(function() {
  var phonemobile = ($(SMS_SUBSCRIBE_DIV).attr('data-phonemobile') || '');
  //hide email field?
  if (/opt-out-email-/.test(phonemobile)) {
    if (/opt-out-email-hidden/.test(phonemobile)) {
      $('#id_email_box').hide();
      $('#id_sms_subscribed').change(function() {
        if (!this.checked) {
          //if they are not signing up by SMS, then we should show the email field
          $('#id_email_box').show();
        }
      });
    }
    //HACK: change actionkit.forms.email to bypass actionkit.forms.required() email test
    // note, this is actually messing with the dom-walking because .form IS the dom element
    // this depends on running AFTER actoinkit.initForm()
    // This js file should be loaded after that in wrapper.html
    // It doesn't matter if init/setupForm is run multiple times, because this hacked the dom element itself

    window.actionkit.form.email = false;

    //HACK2: monkeypatch/filter actionkit.forms.required() -- neither one is sufficient by itself
    var oldrequired = actionkit.forms.required;
    actionkit.forms.required = function() {
      var required_fields = oldrequired();
      return $(required_fields).filter(function() {return (this != 'email')});
    }
    //HACK3: and remove the form attribute
    $('#id_email').removeAttr('required');

  }
})();

var mobilePhoneUpdate = function() {
  if ($(this).val().replace(/\D/g, '').length >= 10) {
    var phonemobile = ($(SMS_SUBSCRIBE_DIV).attr('data-phonemobile') || '');
    if (/opt-out/.test(phonemobile)) {
      $('#id_sms_subscribed').prop('checked', true);
      $('#id_sms_subscribed').val('sms_subscribed');
    }
    $(SMS_SUBSCRIBE_DIV).show(); //todo: css for slide down
  }
}

//onCHANGE
$('input[name=phone],input[name=mobile_phone]')
  .on('change unfocus', mobilePhoneUpdate)
  .each(mobilePhoneUpdate);


//onSUBMIT
$('form[name=act]').on('actionkitbeforevalidation', function() {
  if (window.console) {console.log('actionkitbefore validation! (mobile check)');}
  var mobile = $('input[name=phone],input[name=mobile_phone]').val();
  var mobile_subscribe = $('#id_sms_subscribed', SMS_SUBSCRIBE_DIV).prop('checked');
  if (typeof mobile != 'string') {
    mobile = '';
  }
  mobile = mobile.replace(/\D/g, '');

  if (mobile_subscribe && mobile && mobile.length >= 10) {
    if (window.console) {console.log('in mobile pathway, before validation');}
    if ($('#id_email').val() === '') {
      $('#id_suppress_subscribe').val('1');
      $('#id_email').val(mobile+'-smssubscriber@example.com');
      $('#id_email_box').hide();
    }

    $('#id_phone_type').val('mobile');
    $('#id_sms_subscribed').val('sms_subscribed');
    $('#id_action_mobilesubscribe').val('1');
    $('#id_sms_termsandconditions').val('sms_termsandconditions');
    $('#id_robodial_termsandconditions').val('yes');
  }
});

//onSUBMIT for outside forms
$('form.external-ak').on('submit', function() {
  var mobile = $('input[name=phone],input[name=mobile_phone]').val().replace(/\D/g, '');
  var mobile_subscribe = $('#id_sms_subscribed', SMS_SUBSCRIBE_DIV).prop('checked');

  if (mobile_subscribe && mobile && mobile.length >= 10) {
    if ($('#id_email').val() === '') {
      $('#id_suppress_subscribe').val('1');
      $('#id_email').val(mobile+'-smssubscriber@example.com');
      $('#id_email_box').hide();
    }

    $('#id_phone_type').val('mobile');
    $('#id_sms_subscribed').val('sms_subscribed');
    $('#id_action_mobilesubscribe').val('1');
    $('#id_sms_termsandconditions').val('sms_termsandconditions');
    $('#id_robodial_termsandconditions').val('yes');
  }
});

/*
  Interacts with user_form.html
  Use Cases:
  * store most recent phone in recent_phone user field
  * store the phone in an actionfield in case we need it for the action
*/
var phoneFieldStorage = function() {
  if (window.console) {console.log('actionkitbefore validation (phoneFieldStorage)');}
  var phone = $('input[name=phone],input[name=mobile_phone],input[name=home_phone]').val();
  if (typeof phone != 'string') {
    phone = '';
  }
  phone = phone.replace(/\D/g, '');
  if (phone && phone.length >= 10) {
    var recent = $('input[name=user_recent_phone]', this);
    var actionphone = $('input[name=action_phone]', this);
    if (!recent.length) {
      recent = $('<input type="hidden" name="user_recent_phone" />').appendTo(this);
    }
    if (!actionphone.length) {
      actionphone = $('<input type="hidden" name="action_phone" />').appendTo(this);
    }
    actionphone.val(phone);
    recent.val(phone);
  }
};

//onSUBMIT
$('form[name=act]').on('actionkitbeforevalidation', phoneFieldStorage);
//onSUBMIT for outside forms
$('form.external-ak').on('submit', phoneFieldStorage);

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function shuffleQuestions() {
  $('.randomized-options').each(function(){
    var $options = $(this);
    var rows = [];
    $options.find('.option').each(function() {
      var $option = $(this);
      rows.push($option.clone());
      $option.remove();
    });
    shuffle(rows);
    $.each(rows, function() {
      $options.append($(this));
    });
  });
}

$(document).ready(shuffleQuestions);

$(document).ready(function() {

  var $checkboxCol = $('<div class="col-md-8 checkbox"></div>');
  var $checkbox = $('<input type="checkbox" name="retired" />')
    .click(function() {
      var $this = $(this);
      var $info = $('#employer-occupation-info');
      if ($this.is(':checked')) {
        $info.addClass('hidden');
        $info.find('#action_employer').val('None');
        $info.find('#action_occupation').val('Not employed');
      }
      else {
        $info.removeClass('hidden');
      }
    });
  var $checkboxLabel = $('<label for="retired"> </label>');
  var $checkboxSpan = $('<span>I am retired or unemployed</span>')
    .click(function() {
      $('input[name=retired]').click();
    });
  $checkboxLabel.prepend($checkbox).append($checkboxSpan);
  $checkboxCol.append($checkboxLabel);
  $('#retired-checkbox').append($checkboxCol);

});


$(document).ready(function(){

  if($("body").hasClass("mobile-survey") && $(".form-section").length > 0 && !isScrolledIntoView("[data-viewable]")) {
    makeFormButton();
  }

});

function makeFormButton() {

  var surveyButtonText = $('#take-this-survey-text').text()  
  var $t = $("body").hasClass("survey-page") ? surveyButtonText: $("button:submit").text();

  if($("body").hasClass("survey-page") && $(".form-section").length > 0) {
    $("body").addClass("has-page-footer");

    var $pageFooter = $("<div class='page-footer page-footer--toggle'></div>");

    $pageFooter.appendTo("body");

    $formToggle = $("<a href='#' class='btn-toggle toggle-form'>" + $t + "</a>").appendTo($pageFooter);
    $formToggle.click(function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: ($("[data-viewable]").offset().top - 60)
      }, 200);
    });

    $(window).scroll(function() {
      checkViewable($("[data-viewable]"));
    });
    checkViewable($("[data-viewable]"));

  }
}

function checkViewable(elem) {
  
  var $viewable = isScrolledIntoView(elem);

  $("body").removeClass("form-viewable");
  if($viewable) {
    $("body").addClass("form-viewable");
  }
}

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return (docViewBottom >= elemTop && docViewTop <= elemBottom);
}