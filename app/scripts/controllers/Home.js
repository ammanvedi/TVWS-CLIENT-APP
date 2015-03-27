'use strict';

/**
 * @ngdoc function
 * @name clientAngularApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the clientAngularApp
 */
angular.module('clientAngularApp')
  .controller('HomeCtrl', ['CookieService',function (CookieService) {
    console.log("this is being called from homectrl");
  }]);
