'use strict';

/**
 * @ngdoc overview
 * @name clientAngularApp
 * @description
 * # clientAngularApp
 *
 * Main module of the application, including routing and initial dependency injection 
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
    'angularMoment',
    'cgNotify'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/Home.html',
        controller: 'HomeCtrl'
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
      .when('/docs', {
        templateUrl: '/views/docs/index.html',
        controller: ''
      })
      .when('/all', {
        templateUrl: '/views/alldata.html',
        controller: 'AllDataCtrl'
      })
      .otherwise({
        redirectTo: '/'

      });
  });
