'use strict';

/**
 * @ngdoc function
 * @name clientAngularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientAngularApp
 */
angular.module('clientAngularApp')
  .controller('AboutCtrl', 'CookieService', function ($scope, CookieService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
