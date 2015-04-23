/**
 * @ngdoc controller
 * @name clientAngularApp.controller.UserHomeCtrl
 * @description
 * Controller to mediate display of the user's homepage   
 */
angular.module('clientAngularApp')
  .controller('AllDataCtrl', ['$rootScope', '$scope', '$location', 'CookieService', 'MeasureSpaceAPIService',function ($rootScope, $scope, $location, CookieService, MeasureSpaceAPIService) {
    console.log("this is being called from user homectrl");
    console.log($rootScope);

    $scope.userDatasets = [];
    $scope.date = new Date();
    $scope.moment = moment;


    $scope.gotUserDatasets = function(data)
    {
        $scope.userDatasets = data;

    }

    $scope.failedUserDatsets = function(data)
    {
        
    }
            //get the users datasets so they can be displayed
        MeasureSpaceAPIService.getAllDatasets($rootScope.UserID, $scope.gotUserDatasets, $scope.failedUserDatasets);



  }]);