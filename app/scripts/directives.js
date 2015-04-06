var app = angular.module('clientAngularApp');




app.directive('mapsidebar', [ 'SidebarHelper', 'StateManager', "GraphHelper" , function(SidebarHelper, StateManager, GraphHelper)  {

    return {
      restrict: 'E',
      scope: false,
      controller: ['$scope', '$interval', function($scope, $interval){

      }],

      link: function(scope, elem, attrs, ctrl) {

        SidebarHelper.PIECHART = new Highcharts.Chart(SidebarHelper.sidebarChartConfig);
        SidebarHelper.utility.dbounds = new google.maps.LatLngBounds(new google.maps.LatLng(-33.8902, 151.1759),
                                                                     new google.maps.LatLng(-33.8474, 151.2631)
                                                                    );
        SidebarHelper.utility.placesoptions = {bounds:SidebarHelper.utility.dbounds};
        SidebarHelper.utility.autocomplete = new google.maps.places.Autocomplete(document.getElementById('pac-input'),
                                                                                 SidebarHelper.utility.placesoptions
                                                                                );
        google.maps.event.addListener(SidebarHelper.utility.autocomplete, 'place_changed', function () {
            
            SidebarHelper.deleteOverlays();
            SidebarHelper.clearFreeChannels();
            var thisplace = SidebarHelper.utility.autocomplete.getPlace();
            SidebarHelper.utility.currentposition = thisplace.geometry.location;
            SidebarHelper.getMap().setCenter(thisplace.geometry.location);
            SidebarHelper.getMap().markers[0].setPosition(thisplace.geometry.location);
            GraphHelper.clearGraph();
            SidebarHelper.showDatasetsNear();

        });
      },
      replace: false,
      templateUrl: 'views/MapSidebar.html'
    }
}]);





app.directive('uploader', [ '$rootScope', 'MeasureSpaceAPIService','$interval' , function($rootScope, MeasureSpaceAPIService, $interval)  {

    return {
      restrict: 'E',
      scope: {
        action: '@'
      },
      controller: ['$rootScope', '$scope', '$interval', function($rootScope, $scope, $interval){
        console.log("UD");
        console.log($rootScope.UserID);
        $scope.UID = $rootScope.UserID;
      $scope.UploadTableData = new Object();
      $scope.uploadtable = $('table');
      $scope.uploadbar = $('.progress');
      $scope.uploadbutton = $('#submitbutton');

      $scope.uploadtable.hide();
      $scope.uploadbar.hide();


      $scope.clickFileUpload = function()
      {
        angular.element('#fip').trigger('click');
      }

      $scope.makeButtonLoad = function()
      {
        $scope.uploadbutton.addClass("loading");
        $scope.uploadbutton.addClass("disabled");
      }

      $scope.makeButtonUnload = function()
      {
        $scope.uploadbutton.removeClass("loading");
        $scope.uploadbutton.removeClass("disabled");
      }

      $scope.adddefaultupload = function(fname)
      {
        $scope.UploadTableData[fname] = {
                                          filename: fname,
                                          status : "<i class=\"notched circle loading icon\"></i>",
                                          progress : 0,
                                          completedon: "<i class=\"notched circle loading icon\"></i>",
                                          access: "<i class=\"notched circle loading icon\"></i>",
                                          message: "File is uploading to the server.",
                                          rowclass:""
                                          };
        $scope.workingfname = fname;
      }

      $scope.updateUploadMessageTable = function(fnametoupdate, msgtext)
      {
        $scope.UploadTableData[fnametoupdate].message = msgtext;
      }

      $scope.updateUploadProgressTable = function(fnametoupdate, percentage)
      {
        $scope.UploadTableData[fnametoupdate].progress = percentage;
      }

      $scope.updateUploadStatusTable = function(fnametoupdate, statustext)
      {
        $scope.UploadTableData[fnametoupdate].status = statustext;
      }

      $scope.updateCOTable = function(fnametoupdate, statustext)
      {
        $scope.UploadTableData[fnametoupdate].completedon = statustext;
      }

      $scope.failrow= function(fnametofail)
      {
        $scope.UploadTableData[fnametofail].rowclass = "negative";
      }

      $scope.passrow = function(fnametopass)
      {
        $scope.UploadTableData[fnametopass].rowclass = "positive";
      }

      $scope.progress = 0;
      $scope.sendFile = function(el) {

        $scope.adddefaultupload($("#fip").val().replace("C:\\fakepath\\", ''));

        var $form = $(el).parents('form');
        if ($(el).val() == '') {
          return false;
        }

        $form.attr('action', $scope.action);

        $scope.$apply(function() {
          $scope.progress = 0;
          $scope.updateUploadStatusTable($scope.workingfname, "Uploading");
        });

        $form.ajaxSubmit({
          type: 'POST',
          beforeSubmit: function(arr, $form, options){
            $scope.uploadtable.fadeIn();
            $scope.uploadbar.fadeIn();
            $scope.makeButtonLoad();
          },
          uploadProgress: function(event, position, total, percentComplete) {

            $scope.$apply(function() {
              // upload the progress bar during the upload
              $scope.progress = percentComplete;
              $scope.updateProgress($scope.progress);
              $scope.updateUploadProgressTable($scope.workingfname, percentComplete);
            });
          },
          error: function(event, statusText, responseText, form) {
            $form.removeAttr('action');
            $scope.makeButtonUnload();
          },
          success: function(responseText, statusText, xhr, form) {

            $scope.updateUploadStatusTable($scope.workingfname, "Processing");
            $scope.updateUploadMessageTable($scope.workingfname, "Server has queued file for processing.");
              console.log(responseText);
              $scope.trackid = responseText.trackingid;
              $scope.startpolling();
              $scope.makeButtonUnload();
            $form.removeAttr('action');
          },
        });

        }


      }],

      link: function(scope, elem, attrs, ctrl) {



        //console.log(angular.element('.progress'));
        angular.element('#example1').progress();

        var Status;

        scope.updateProgress = function(val)
        {
          $('#example1').progress({percent: val});
        }

        scope.startpolling = function()
        {
          Status = $interval(function(){scope.pollUploadStatus()}, 1000);
        }

        scope.pollUploadStatus = function(dsid)
        {
          console.log("polling");
          MeasureSpaceAPIService.getUploadStatus(scope.trackid, scope.uploadComplete, scope.uploadFailed, scope.inProcessing);
        }

        scope.uploadComplete = function(data)
        {
          console.log("callback fired");
          console.log(data);
          scope.updateUploadStatusTable(scope.workingfname, "Processing Complete");
          scope.updateUploadMessageTable(scope.workingfname, "Processing completed successfully.");
          scope.updateCOTable(scope.workingfname, new Date(parseInt(data.CompletedOn*1000)).toString());
          scope.passrow(scope.workingfname);
          scope.setAccessURL(scope.workingfname, data.DatasetID);

          $interval.cancel(Status);
        }

        scope.setAccessURL = function(fname, dsid)
        {
          scope.UploadTableData[fname].access = "<a href=\"/#/map/" + dsid + "\">View</a>";
        }

        scope.uploadFailed = function(data)
        {
          console.log("server says failed");
          console.log(data);
          scope.updateUploadStatusTable(scope.workingfname, "Failed");
          scope.updateUploadMessageTable(scope.workingfname, data.Message);
          scope.failrow(scope.workingfname);
          $interval.cancel(Status);
        }

        scope.inProcessing = function(data)
        {
          console.log("inprocessing");
          scope.updateUploadStatusTable(scope.workingfname, "Processing");
          scope.updateUploadMessageTable(scope.workingfname, "Server is currently Processing file.");
        }

      },
      replace: false,
      templateUrl: 'views/Uploader.html'
    }
}]);
