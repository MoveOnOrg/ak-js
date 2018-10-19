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
