# About

This is a set of JavaScript snippets to be used with ActionKit.

## confirm_big_donations.js

Adds a confirmation modal to donation pages when donation amount is greater than $250.

### Assumptions

* Using jQuery
* Using Bootstrap
* Modal DIV is `#confirm-big-donation`
* Other amount field is `#amount_other_field`

## error_catch.js

Saves errors to a variable, which can then be read by tools like Selenium.

### Assumptions

* _None_

## form_prefill.js

Pre-fills form elements with values from query string, matching input name. ActionKit does this by automatically on some fields, but not all.

### Assumptions

* Using jQuery

## randomize.js

Uses "randomize-options" and "option" classes to randomize the order of elements in groups. Useful to avoid order bias in survey results.

### Assumptions

* Using jQuery
* Randomized options are in container `.randomized-options`
* Each option is `.option`

## retired_checkbox.js

Adds checkbox that hides employer and occupation inputs, pre-fills with "Retired" when checked.

### Assumptions

* Using jQuery
* Employer and occupation inputs are in container `#employer-occupation-info`

## validate_cc.js

Uses included ccvalidator.js to display credit card type and validation.

### Assumptions

* Using jQuery
* Using Bootstrap
* Credit card input is `#card_num`
* Credit card input and icons are in `#card_num_box`
* Credit card icons are in `.cc-icons`
* Each credit card icon is `.wf-icon` and `.icon-{type}`, e.g. `.icon-visa`

# Contributing

These scripts are compiled with gulp. To install gulp:

* Install NPM
* `npm install`
* `npm install -g gulp`

Then to compile:

* `gulp`
