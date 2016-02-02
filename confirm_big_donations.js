$(document).ready(function() {

  /**
   * If donation amount is large and we haven't already confirmed, halt
   * form submission to confirm amount.
   */
  $('form button[type=submit]').data('confirmed', false).click(function() {
    var $splitTotal = $('#total-to-split');
    var $other = $('#amount_other_field');
    var donationAmount = parseFloat($other.val());
    if ($splitTotal.length > 0) {
      donationAmount = parseFloat($splitTotal.val());
    }
    if (donationAmount >= 1000) {
      return confirmLargeDonation(donationAmount);
    }
    return true;
  });

});

/**
 * Show the large donation confirmation modal.
 */
function confirmLargeDonation(donationAmount) {

  if ($('form button[type=submit]').data('confirmed')) {
    return true;
  }

  $('#confirm-big-donation .donation-amount').text(donationAmount);
  $('#confirm-big-donation .btn.yes').click(function() {
    $('#confirm-big-donation').modal('hide');
    $('form button[type=submit]').data('confirmed', true).trigger('click');
  });
  $('#confirm-big-donation').modal();

}
