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
        if (!this.email_suggestion_field || !this.email_suggestion_field.length) {
            this.email_field.after('<span id="auto_email_suggestion" class="email_suggestion hidden"></span>');
            this.email_suggestion_field = $('#auto_email_suggestion');
        }

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
        this.email_field.attr( 'style', 'color:#c22326;')
    },
    coloroff: function() {
        this.email_field.attr( 'style', 'color:#555555;')
    }
};

