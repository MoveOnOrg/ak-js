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
    //HACK: monkeypatch/filter actionkit.forms.required()
    var oldrequired = actionkit.forms.required;
    actionkit.forms.required = function() {
      var required_fields = oldrequired();
      return $(required_fields).filter(function() {return (this != 'email')});
    }
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
  var mobile = $('input[name=phone],input[name=mobile_phone]').val().replace(/\D/g, '');
  var mobile_subscribe = $('#id_sms_subscribed', SMS_SUBSCRIBE_DIV).prop('checked');

  if (mobile_subscribe && mobile && mobile.length >= 10) {
    if ($('#id_email').val() === '') {
      $('#id_suppress_subscribe').val('1');
      $('#id_email').val(mobile+'-smssubscriber@example.com');
      $('#id_email_box').hide();
    }

    $('#id_sms_subscribed').val('sms_subscribed');
    $('#id_sms_termsandconditions').val('sms_termsandconditions');
    $('#id_robodial_termsandconditions').val('yes');
  }
});
