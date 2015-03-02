'use strict';

/**
 * @ngdoc function
 * @name clientAngularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientAngularApp
 */
angular.module('clientAngularApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
