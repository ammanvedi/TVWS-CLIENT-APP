'use strict';

/**
 * @ngdoc function
 * @name clientAngularApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the clientAngularApp
 */
angular.module('clientAngularApp')
  .controller('UploadCtrl', ['$upload', '$scope','MeasureSpaceAPIService', function ($upload, $scope, MeasureSpaceAPIService) {
console.log($scope);
  }]);
