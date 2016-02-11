$(document).ready(function() {

  /**
   * If donation amount is large and we haven't already confirmed, halt
   * form submission to confirm amount.
   */
  $('form').data('confirmed', false).submit(function(event) {
    var $splitTotal = $('#total-to-split');
    var $other = $('#amount_other_field');
    var donationAmount = parseFloat($other.val());
    if ($splitTotal.length > 0) {
      donationAmount = parseFloat($splitTotal.val());
    }
    if (donationAmount >= 250) {
      if (!confirmLargeDonation(donationAmount)) {
        event.preventDefault();
      }
    }
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
    $('form').data('confirmed', true).trigger('submit');
  });
  $('#confirm-big-donation').modal();

  return false;
}
