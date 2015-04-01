'use strict';

/**
 * @ngdoc function
 * @name clientAngularApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the clientAngularApp
 */
angular.module('clientAngularApp')
  .controller('UploadCtrl', ['$rootScope', '$upload', '$scope','MeasureSpaceAPIService', 'CookieService',function ($rootScope, $upload, $scope, MeasureSpaceAPIService, CookieService) {
console.log($scope);
console.log($rootScope);
  }]);
