'use strict';

/**
 * @ngdoc controller
 * @name clientAngularApp.controller.LogoutCtrl
 * @description
 * Controller to mediate the logout operation and redirect user to the homepage
 */
angular.module('clientAngularApp')
  .controller('LogoutCtrl', [ '$scope','MeasureSpaceAPIService', 'CookieService', '$location',function ($scope, MeasureSpaceAPIService, CookieService, $location) {

  	CookieService.Logout();
  	$location.path("/");

  }]);
