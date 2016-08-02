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
    updateConfirmationMessage();
});
