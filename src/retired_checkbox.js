$(document).ready(function() {

  var $checkboxRow = $('<div class="form-group row"><div class="col-md-4 text-right"></div></div>');
  var $checkboxCol = $('<div class="col-md-8 checkbox"></div>');
  var $checkbox = $('<input type="checkbox" name="retired" />')
    .click(function() {
      var $this = $(this);
      var $info = $('#employer-occupation-info');
      if ($this.is(':checked')) {
        $info.addClass('hidden');
        $info.find('input').val('Retired');
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
  $checkboxRow
    .append($checkboxCol)
    .insertBefore('#employer-occupation-info');

});
