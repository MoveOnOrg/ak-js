// Roster toggle-all checkbox
function toggleSignups() {
    $(this)
        .closest('form')
        .find('input.toggle')
        .attr('checked', this.checked);
}
// Update "N attendee(s)" in e-mail form
function handleSignupsChanged() {
    var frm = $(this).closest('form');
    var to_count = $('input.toggle:checked').length;
    // Mailing all recipients if nobody's checked
    if ( !to_count )
        to_count = $('input.toggle').length
    // They've figured out the checkboxes; no need to advertise
    if ( to_count )
        frm.find('.check-recipients-help').hide();
    frm.find('.to-count').text(to_count);
}
// E-mail button
function handleEmail() {
    var frm = $(this).closest('form');
    frm.find('.signup-list-controls').slideUp('fast');
    frm.find('.contact-form').slideDown('fast');
    return false;
}
// "E-mail attendee", "e-mail cohost", "invite friends" links
// Unhide if needed and fake :target on IE
function handleJumpLink() {
    var targetEl;
    if ( this.id == 'email-cohosts-link' )
        targetEl = $('fieldset.contact-cohosts');
    else if ( this.id == 'email-attendees-link' )
        targetEl = $('fieldset.contact-attendees');
    else if ( this.id == 'invite-friends-link' )
        targetEl = $('#taf');
    // Unhide e-mail form if needed
    if ( /^email-/.test(this.id) ) {
        var emailButton = targetEl.closest('form').find('input[type="submit"].email');
        handleEmail.apply(emailButton, []);
    }
    // Highlight
    targetEl.addClass('target');
    // Allow jump to #foo to happen
    return true;
}
// Confirm cancelling event
function confirmSubmit() {
    return confirm($(this).attr('confirm-message'));
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
    if ( toggleEl ) toggleEl.checked = !toggleEl.checked;
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
// Set everything up onready
function initHostTools() {
    $('input.toggle-all').click(toggleSignups);
    $('input.toggle').click(handleSignupsChanged);
    $('.signup-list td:not(.toggle-col)').click(toggleRow);
    $('input[type="submit"].email').click(handleEmail);
    $('input[type="submit"]').click(setFormAction);
    $('.jump-link').click(handleJumpLink);
    $('a[confirm-message]').click(confirmSubmit);
    if ($('#manage-host').length)
        actionkit.forms.initValidation('manage-host');
    if ($('#manage-attendee').length)
        actionkit.forms.initValidation('manage-attendee');
    $(window).load(function() {
        updateConfirmationMessage();
    });
}
$(initHostTools);
