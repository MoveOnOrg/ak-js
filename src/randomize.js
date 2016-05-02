function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function shuffleQuestions() {
  $('.randomized-options').each(function(){
    var $options = $(this);
    var rows = [];
    $options.find('.option').each(function() {
      var $option = $(this);
      rows.push($option.clone());
      $option.remove();
    });
    shuffle(rows);
    $.each(rows, function() {
      $options.append($(this));
    });
  });
}

$(document).ready(shuffleQuestions);
