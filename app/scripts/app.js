'use strict';

/**
 * @ngdoc overview
 * @name clientAngularApp
 * @description
 * # clientAngularApp
 *
 * Main module of the application.
 */
angular
  .module('clientAngularApp', [
    'ngAnimate',
    'ipCookie',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'angularFileUpload',
    'ngMap',
    'highcharts-ng',
    'angularMoment'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/Home.html',
        controller: 'HomeCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/upload', {
        templateUrl: 'views/Upload.html',
        controller: 'UploadCtrl'
      })
      .when('/map/:DatasetID?', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        reloadOnSearch: false
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/me', {
        templateUrl: 'views/userhome.html',
        controller: 'UserHomeCtrl'
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl'
      })
      .when('/api', {
        templateUrl: 'views/api.html',
        controller: 'APICtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
