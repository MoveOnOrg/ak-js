$(document).ready(function() {

  var $checkboxCol = $('<div class="col-md-8 checkbox"></div>');
  var $checkbox = $('<input type="checkbox" name="retired" />')
    .click(function() {
      var $this = $(this);
      var $info = $('#employer-occupation-info');
      if ($this.is(':checked')) {
        $info.addClass('hidden');
        $info.find('#action_employer').val('None');
        $info.find('#action_occupation').val('Not employed');
      }
      else {
        $info.removeClass('hidden');
      }
    });
  var $checkboxLabel = $('<label for="retired"> </label>');
  var $checkboxSpan = $('<span>I am retired or unemployed</span>')
    .click(function() {
      $('input[name=retired]').click();
    });
  $checkboxLabel.prepend($checkbox).append($checkboxSpan);
  $checkboxCol.append($checkboxLabel);
  $('#retired-checkbox').append($checkboxCol);

});
