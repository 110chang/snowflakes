
/*
 * vm.js
 **/

var ko = require('knockout');
var extend = require('extend');

var REG_URL = /(https?):\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=#]*)?/;

function VM() {
  this.url = ko.observable('http://google.co.jp');
  this.url.subscribe(function(val) {
    this.onceValidated(true);
  }, this);

  this.onceValidated = ko.observable(false);

  this.urlValid = ko.computed(function() {
    return REG_URL.test(this.url());
  }, this);

  this.apiSuccess = ko.observable(true);
  this.inAction = ko.observable(false);
  this.apiLoading = ko.observable(false);
  this.currentCount = ko.observable(0);
  this.totalCount = ko.observable(0);

  ko.applyBindings(this);

  this.validate = function() {
    this.onceValidated(true);
    return this.urlValid();
  };
}

module.exports = VM;