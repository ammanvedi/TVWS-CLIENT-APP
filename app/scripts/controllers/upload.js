'use strict';

/**
 * @ngdoc function
 * @name clientAngularApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the clientAngularApp
 */
angular.module('clientAngularApp')
  .controller('UploadCtrl', ['$upload', '$scope','MeasureSpaceAPIService', 'CookieService',function ($upload, $scope, MeasureSpaceAPIService, CookieService) {
console.log($scope);
  }]);
