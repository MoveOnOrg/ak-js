
$(document).ready(function(){

  if($("body").hasClass("mobile-survey") && $(".form-section").length > 0 && !isScrolledIntoView("[data-viewable]")) {
    makeFormButton();
  }

});

function makeFormButton() {

  var surveyButtonText = $('#take-this-survey-text').text()  
  var $t = $("body").hasClass("survey-page") ? surveyButtonText: $("button:submit").text();

  if($("body").hasClass("survey-page") && $(".form-section").length > 0) {
    $("body").addClass("has-page-footer");

    var $pageFooter = $("<div class='page-footer page-footer--toggle'></div>");

    $pageFooter.appendTo("body");

    $formToggle = $("<a href='#' class='btn-toggle toggle-form'>" + $t + "</a>").appendTo($pageFooter);
    $formToggle.on('click', function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: ($("[data-viewable]").offset().top - 60)
      }, 200);
    });

    $(window).scroll(function() {
      checkViewable($("[data-viewable]"));
    });
    checkViewable($("[data-viewable]"));

  }
}

function checkViewable(elem) {
  
  var $viewable = isScrolledIntoView(elem);

  $("body").removeClass("form-viewable");
  if($viewable) {
    $("body").addClass("form-viewable");
  }
}

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return (docViewBottom >= elemTop && docViewTop <= elemBottom);
}