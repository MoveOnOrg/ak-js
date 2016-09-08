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
  if (/opt-out-email-hidden/.test(phonemobile)) {
    $('#id_email_box').hide();
  }
})();

//onCHANGE
$('input[name=phone],input[name=mobile_phone]').on('change', function() {
  if ((this).val().replace(/\D/g, '').length >= 10) {
    var phonemobile = ($(SMS_SUBSCRIBE_DIV).attr('data-phonemobile') || '');
    if (/opt-out/.test(phonemobile)) {
      $(SMS_SUBSCRIBE_DIV).attr('checked', 'checked');
    }
    $(SMS_SUBSCRIBE_DIV).show();
  }
})

//onSUBMIT
$('form[name=act]').on('actionkitbeforevalidation', function() {
});


  //onchange
  if ($('#mobile_phone').val().replace(/\D/g, '').length >= 10) {
      $('#id_sms_subscribed').attr('checked', 'checked');
      $('.subscribe-sms-conditions').show();
  }

  //onsubmit
  $('form#formSelection').submit(function (e) {
    var mobile = $('#mobile_phone').val().replace(/\D/g, '');
    if (mobile && mobile.length >= 10) {
      if ($('#email').val() === '') {
        $('#id_suppress_subscribe').val('1');
        $('#email').val(mobile+'-smssubscriber@example.com');
      }
      //$('#id_sms_subscribed').val('sms_subscribed');
      $('#id_sms_termsandconditions').val('sms_termsandconditions');
      $('#id_robodial_termsandconditions').val('yes');
    } 
    if (($('#email').val() === '' && $('#mobile_phone').val() === '')
        || $('#user_name').val() === '' || $('#signup-zip').val() === '') {
      e.preventDefault();
      $('span#please-fill-out').removeClass('hide');
      return !1
    }
  });
