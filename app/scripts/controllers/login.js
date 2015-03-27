
/**
 * @ngdoc function
 * @name clientAngularApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the clientAngularApp
 */
angular.module('clientAngularApp')
  .controller('LoginCtrl', ['$scope','MeasureSpaceAPIService', 'CookieService',function ( $scope, MeasureSpaceAPIService, CookieService) {
console.log($scope);
  }]);