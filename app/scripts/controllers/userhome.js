/**
 * @ngdoc controller
 * @name clientAngularApp.controller.UserHomeCtrl
 * @description
 * Controller to mediate display of the user's homepage   
 */
angular.module('clientAngularApp')
  .controller('UserHomeCtrl', ['$rootScope', '$scope', '$location', 'CookieService', 'MeasureSpaceAPIService',function ($rootScope, $scope, $location, CookieService, MeasureSpaceAPIService) {
    console.log("this is being called from user homectrl");
    console.log($rootScope);

    $scope.userDatasets = [];
    $scope.date = new Date();
    $scope.moment = moment;
    console.log($scope.moment.unix(1425315273));

    $scope.gotUserDatasets = function(data)
    {
        $scope.userDatasets = data;

    }

    $scope.failedUserDatsets = function(data)
    {
        
    }

    if(CookieService.isLoggedIn())
    {
    	//get the users datasets so they can be displayed
        MeasureSpaceAPIService.getDatasetsForUser($rootScope.UserID, $scope.gotUserDatasets, $scope.failedUserDatasets);

    }else
    {
    	$location.path("/register");
    }





  }]);
