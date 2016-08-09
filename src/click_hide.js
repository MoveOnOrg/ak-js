/**
 * Set the data-hide attribute of a clickable element to a selector of elements
 * that should be hidden on click. For example, this link should hide itself:
 * <a href="#" id="hide-self" data-hide="#hide-self">Hide me</a>
 */

$(document).ready(function() {
  $('a[data-hide]').click(function() {
    $($(this).attr('data-hide')).hide();
    return true;
  });
});
