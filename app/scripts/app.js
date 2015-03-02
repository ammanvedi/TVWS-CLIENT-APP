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
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'angularFileUpload',
    'ngMap',
    'highcharts-ng'
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
      }).when('/upload', {
        templateUrl: 'views/Upload.html',
        controller: 'UploadCtrl'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
