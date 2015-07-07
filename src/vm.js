
/*
 * vm.js
 **/

var ko = require('knockout');
var extend = require('extend');

var REG_URL = /(https?):\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=#]*)?/;

function VM() {
  this.url = ko.observable('http://');
  this.url.subscribe(function(val) {
    console.log(val);
    this.onceValidated(true);
  }, this);

  this.onceValidated = ko.observable(false);

  this.urlValid = ko.computed(function() {

    console.log(!REG_URL.test(this.url()));
    return REG_URL.test(this.url());
  }, this);

  ko.applyBindings(this);

  this.validate = function() {
    return this.urlValid();
  };
}

module.exports = VM;