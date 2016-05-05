$(document).ready(function() {
  if ($('#card_num').length > 0) {
    $('#card_num').validateCreditCard(function(result) {
      $('#card_num_box .cc-icons .wf-icon').removeClass('matched');
      if (result.valid) {
        $('#card_num_box .cc-icons .icon-' + result.card_type.name).addClass('matched');
      }
      if (result.valid || $('#card_num').val().length == 0) {
        $('#card_num_box').removeClass('has-error');
      }
      else {
        $('#card_num_box').addClass('has-error');
      }
    });
  }
});
