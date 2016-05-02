// From http://snipplr.com/view/43646/prepopulate-form-with-values-from-querystring/
$(document).ready(function() {

  $('form').each(function() {
    var form = this;
    if (location.search == null || location.search.length < 1) {
      return; // no querystring
    }
    var pairs = location.search.substring(1).split("&");
    for (var p = 0; p < pairs.length; ++p ) {
      var pair = pairs[p].split("=");
      var name = pair[0];
      var value = unescape( pair[1].replace(/\+/g, " ") );
      var field = form.elements[name];
      var fieldType = null;
      var fieldIsMultivalue = false;

      if (field != null){
        if (field.length != null && field.length >= 1 && field[0].type != null && field[0].type != undefined) {
          fieldType = field[0].type;
          fieldIsMultivalue = true;
        } else {
          fieldType = field.type;
        }
      }
      switch (fieldType) {
        case "text":
        case "hidden":
        case "textarea":
          if (fieldIsMultivalue) {
            field = field[0]; // only handle first-named for this type
          }
          field.value = value;
          $(field).trigger('change');
          break;
        case "select-one":
        case "select-multiple":
          if (fieldIsMultivalue) {
            field = field[0]; // only handle first-named for this type
          }
          for (var o = 0; o < field.options.length; ++o) {
            var opt = field.options[o];
            var oval = opt.value;
            if (oval == null || oval == "" ) {
              oval = opt.text;
            }
            if (oval == value) {
              opt.selected = true;
              $(field).trigger('change');
              break;
            }
          }
          break;
        case "checkbox": case "radio":
          if (!fieldIsMultivalue) {
            // single checbox or radio of that name:
            field.checked = true;
          } else {
            for (var cr = 0; cr < field.length; ++cr) {
              if ( field[cr].value == value ) {
                field[cr].checked = true;
                $(field).trigger('change');
                break;
              }
            }
          }
          break;
        default:
          break;
      } // end of switch
    } // end of loop on fields from qs
  });
});
