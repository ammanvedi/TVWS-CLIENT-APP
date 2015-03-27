'use strict';

/**
 * @ngdoc function
 * @name clientAngularApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the clientAngularApp
 */
angular.module('clientAngularApp')
  .controller('LogoutCtrl', [ '$scope','MeasureSpaceAPIService', 'CookieService', '$location',function ($scope, MeasureSpaceAPIService, CookieService, $location) {

  	CookieService.Logout();
  	$location.path("/");

  }]);
