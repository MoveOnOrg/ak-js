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
