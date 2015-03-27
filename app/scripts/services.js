var app = angular.module('clientAngularApp');



app.service( 'MeasureSpaceAPIService', ['$http', function($http){

  return{
    APIKEY: "n-a",
    APIURL: "https://api.measurespace.io",
    getUploadStatus: function(trackid, comp, fail, inprogress){
      $http.get(this.APIURL + '/upload/track/' + trackid).
        success(function(data, status, headers, config) {
          console.log(data);
          if(data.Completed)
          {
            //according to server the task was completed successfully
            comp(data);
            return;
          }

          if(data.Error)
          {
            fail(data);
            return;
          }

          if((data.Completed == 0) && (data.Error == null))
          {
            //error flag not set, completed flag not set, in midst of processing
            inprogress(data);
            return;
          }

        }).
        error(function(data, status, headers, config) {
          console.log("Angular Http get failed");
        });
    },
    getDatasetsNear: function(nearlon, nearlat, complete, failure)
    {
      $http.get(this.APIURL + '/datasets/near/' + nearlon + '/' + nearlat).
        success(function(data, status, headers, config){

          if(data.QueryError)
          {
            failure(data);
            return;
          }

          complete(data);

        }).
        error(function(data, status, headers, config){
          console.log("Angular Http get failed");
        });
    },
    getDatasetReadings: function(dsid, complete, failure)
    {

      $http.get(this.APIURL + '/datasets/' + dsid + '/readings').
        success(function(data, status, headers, config){

          if(data.QueryError)
          {
            failure(data);
            return;
          }

          complete(data);

        }).
        error(function(data, status, headers, config){
          console.log("Angular Http get failed");
        });

    },
    getRegionChannelSet: function(lon, lat, complete, failure)
    {
        $http.get(this.APIURL + '/channels/near/' + lon + '/' + lat).
        success(function(data, status, headers, config){

          if(data.QueryError)
          {
            failure(data);
            return;
          }

          complete(data);

        }).
        error(function(data, status, headers, config){
          console.log("Angular Http get failed");
        });
    },
    getDatasetByID: function(dsid, complete, failure)
    {
        $http.get(this.APIURL + '/datasets/' + dsid + '/meta').
        success(function(data, status, headers, config){

          if(data.QueryError)
          {
            failure(data);
            return;
          }
          data.DatasetID = parseInt(dsid);
          complete(data);

        }).
        error(function(data, status, headers, config){
          console.log("Angular Http get failed");
          failure(data);
        });
    },
    registerUser: function(pemail, ppassword, pfname, psname, success, failure)
    {
        $http({
          method: 'POST',
          url: this.APIURL + '/register',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: $.param({sname : psname, fname : pfname, email : pemail, password : ppassword})
          }).
        success(function(data, status, headers, config){

          if(data.QueryError)
          {
            failure(data);
            return;
          }
          success(data);

        }).
        error(function(data, status, headers, config){
          console.log("Angular Http get failed");
          failure(data);
        });
    },
    loginUser: function(username, password, success, failure)
    {
        $http({
          method: 'POST',
          url: this.APIURL + '/login',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: $.param({uname : username, pword : password})
          }).
        success(function(data, status, headers, config){

          if(data.QueryError)
          {
            failure(data);
            return;
          }
          success(data);

        }).
        error(function(data, status, headers, config){
          console.log("Angular Http get failed");
          failure(data);
        });
    },
    getDatasetsForUser: function(userid, complete, failure)
    {
        $http.get(this.APIURL + '/user/' + userid + '/datasets').
        success(function(data, status, headers, config){

          if(data.QueryError)
          {
            failure(data);
            return;
          }

          complete(data);

        }).
        error(function(data, status, headers, config){
          console.log("Angular Http get failed");
        });
    }
  }

}]);


app.service('StateManager', [function(){

  var SM = {
      SM_NODATA:0,
      SM_SEARCING:1,
      SM_HEATMAPPING:2,
      SM_STATE:0,
      SM_PIN_DROPCOUNT:0,
      setState: function(state)
      {
          SM.SM_STATE = state;
      },
      getState: function()
      {
          return SM.SM_STATE;
      },
      setNODATA: function()
      {
          //console.log("setting State  : NODATA");
          SM.SM_STATE = SM.SM_NODATA;
      },
      setHEATMAPPING: function()
      {
          //console.log("setting State  : HEATMAPPING");
          SM.SM_STATE = SM.SM_HEATMAPPING;
      },
      setSEARCHING: function()
      {
          //console.log("setting State  : SEARCHING");
          SM.resetDROPCOUNT();
          SM.SM_STATE = SM.SM_SEARCHING;
      },
      isSEARCHING: function()
      {
          if(SM.SM_STATE == SM.SM_SEARCHING)
          {
              return 1;
          }
          
          return 0;
      },
      isNODATA: function()
      {
          if(SM.SM_STATE == SM.SM_NODATA)
          {
              return 1;
          }
          
          return 0;
      },
      isHEATMAPPING: function()
      {
          if(SM.SM_STATE == SM.SM_HEATMAPPING)
          {
              return 1;
          }
          
          return 0;
      },
      getDROPCOUNT: function()
      {
          return SM.SM_PIN_DROPCOUNT;
      },
      increaseDROPCOUNT: function()
      {
          SM.SM_PIN_DROPCOUNT += 1;
      },
      resetDROPCOUNT: function()
      {
          SM.SM_PIN_DROPCOUNT = 0;
      }
      
  }

  return SM;


}]);


app.service('HeatmapHelper', [ function(){

  var HH = {
      HEATMAPCACHE:{},
      heatmap:{},
      DATASET:{},
      rawReadings:[],
      fulldataset:[],
      heatmapdatachannels:[],
      channelassignments:[],
      overallmax:0,
      overallmin:0,
      graphvisible: true,
      graphinfotext: "Find Dataset to View it's Data.",
      cacheAndRemoveHeatmap: function()
      {
          //$scope.DATASET.DatasetID
          HH.HEATMAPCACHE[HH.DATASET.DatasetID] = {
                                                            Rawdata : HH.rawReadings,
                                                            Normdata : HH.fulldataset,
                                                            Channels : HH.heatmapdatachannels,
                                                            ovmax: HH.overallmax,
                                                            ovmin: HH.overallmin
                                                        }   
        HH.heatmap.setMap(null);
          //console.log("CLEARING FROM SERVICE");
      },
      toggleGraphNodata: function()
        {
            if(HH.graphvisible)
            {
                $(".graphnodata").fadeOut("fast");
                $(".sidebarnodata").fadeOut("fast");
                $("#channelsmapmover").fadeIn("fast");
            }
            else
            {
                $(".graphnodata").fadeIn("fast");
                $(".sidebarnodata").fadeIn("fast");
                $("#channelsmapmover").fadeOut("fast");
            }

            HH.graphvisible = !HH.graphvisible;
        },
        calculatePercentageOccupancy: function(thresh)
        {
          //console.log(HH.rawReadings);
          //find point count for frequency FPC
          //iterate through points for channel
          //if power reading is less than threshold, then it is unoccupied, increase freecount by 1
          //calc the percentage, (100*freecount) / fpc
          var FPC = 0;
          var occupiedcount = 0;
          var PERCENTAGES = new Array();
          for(channelid in HH.rawReadings)
          {
            FPC = HH.rawReadings[channelid].length
            for(key in HH.rawReadings[channelid])
            {
              if(HH.rawReadings[channelid][key].CombinedPower > thresh)
              {
                occupiedcount ++;
              }
            }
            //console.log(freecount);
            PERCENTAGES.push({cid:channelid, PO : ((occupiedcount*100) / FPC)});
            occupiedcount = 0;
          }

          return PERCENTAGES;
        }
  }

  return HH;


}]);

app.service("CookieService", ['ipCookie', '$rootScope',function(ipCookie, $rootScope){

  this.storeUserData = function(usrdata)
  {
    this.LoggedIn = true;
    ipCookie("TVWS", usrdata)
  }

  this.isLoggedIn = function()
  {
    return this.LoggedIn;
  }

  this.setLoggedIn = function()
  {
    this.LoggedIn = true;
    $rootScope.LoggedIn = true;
    $rootScope.ForeName = ipCookie("TVWS").ForeName;
    $rootScope.UserID = ipCookie("TVWS").UserID;
  }

  this.setLoggedOut = function()
  {
    this.LoggedIn = false;
    $rootScope.LoggedIn = false;
    $rootScope.ForeName = null;
    $rootScope.UserID = -1;
  }

  this.Logout = function()
  {
    ipCookie.remove("TVWS");
    this.setLoggedOut();
  }

  this.getToken = function()
  {
    return ipCookie("TVWS").Token;
  }


  this.setLoggedOut();

  if(ipCookie("TVWS") != undefined)
  {
    //no cookie exists for the user, which is ok
    //but the system is logged in
    this.setLoggedIn();

  }



}]);


app.service("GraphHelper", [function(){

  GH = {
    chartConfig: {
            options: {
                chart: 
                {
                    type: 'area',
                    zoomType: 'x',
                    backgroundColor:'#2F6EB2',
                    spacingTop:40,
                    spacingRight:30,
                    selectionMarkerFill: "RGBA(78, 191, 155, 0.5)"
                },
                plotOptions: 
                {
                    area: 
                    {
                        fillColor: 
                        {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: 
                        {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: 
                        {
                            hover: 
                            {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
            },
                legend:
                {
                    enabled:false, 
                    itemStyle:
                    {
                        "display":"none"
                    }
                },
               tooltip: {
                    enabled: true,
                    headerFormat: '',
                    pointFormat: 'Channel {point.x} <br/> {point.y} dBm <b></b>'
                  }



            },
            series: [],
            title: {
                text: ''
            },
            xAxis: 
            {
                gridLineColor:"#fff", 
                labels:
                {
                    style : 
                    {
                        "color":"#fff"
                    }
                }, 
                title:
                {
                    style:
                    {
                        "color":"#fff"
                    }, 
                    text:"ITU Channel"
                }
                   },
            yAxis: {
                    gridLineColor:"#fff",
                    labels:
                    {
                        style : 
                        {
                            "color":"#fff"
                        }
                    }, 
                    title:
                    {
                        style:
                        {
                            "color":"#fff"
                        },
                        text: "Power (dBm)"
                    }
                    ,
                plotLines: [{
                  color: 'red', // Color value
                  dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                  value: 3, // Value of where the line will appear
                  width: 2 // Width of the line    
                }]

                   },
            loading: false
       
    },
    moveChartBandToChannel: function(cid)
    {
      var bandat = GH.chartConfig.xAxis.categories.indexOf(parseInt(cid));
        
        if(GH.chartConfig.xAxis.plotBands == undefined)
        {
            GH.chartConfig.xAxis.plotBands = new Array();
            GH.chartConfig.xAxis.plotBands.push({
                                                    from: bandat - 0.5,
                                                    to: bandat + 0.5,
                                                    color: 'rgba(68, 170, 213, .2)'
                                                    });
        }else
        {
            GH.chartConfig.xAxis.plotBands[0].from = bandat - 0.5;
            GH.chartConfig.xAxis.plotBands[0].to = bandat + 0.5;
        }
    },
    getCategories: function()
    {
      return GH.chartConfig.xAxis.categories;
    },
    clearGraph: function()
    {
      //console.log("should clear graph");
      delete GH.chartConfig.xAxis.categories;
      GH.chartConfig.series = [];
    },
    setSeriesData: function(CategoryData)
    {
        //console.log(GH.chartConfig);
        GH.chartConfig.series = new Array();
        GH.chartConfig.series[0] = new Object();
        GH.chartConfig.series[0].data = CategoryData;
        GH.chartConfig.series[0].color = "#fff";
        GH.chartConfig.series[0].name = "Power"
        GH.chartConfig.loading = false;

    },
    setCategories: function(catdata)
    {
      GH.chartConfig.xAxis.categories = catdata;
    },
    setThresholdLine: function(val)
    {
      GH.chartConfig.yAxis.plotLines[0].value = val;
    }

  }

  return GH;

}]);


app.service('SidebarHelper', ['MeasureSpaceAPIService', 'StateManager', "HeatmapHelper", "GraphHelper" ,function(MeasureSpaceAPIService, StateManager, HeatmapHelper, GraphHelper){

  var svc = {
    MAP:{},
    MAPVIEW:{},
    utility:{},
    OVERLAYS:[],
    PIECHART:{},
    PERCENTOCCUPIED:0,
    sidebarChartConfig: {
                chart: 
                {
                  renderTo: 'piechart',
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  backgroundColor:'',
                  colors:['#000', '#fff']
                },
                colors:['#e74c3c', '#2ecc71'],
                credits:
                {
                  enabled: false
                },
                title: 
                {
                  text: ''
                },
                tooltip: 
                {
                  enabled:false
                },
                plotOptions: 
                {
                  pie: 
                  {
                    allowPointSelect: false,
                    cursor: 'pointer',
                    dataLabels: 
                    {
                      enabled: false
                    }
                  }
                },
                series: [
                {
                  type: 'pie',
                  name: 'Browser share',
                  data: [
                          ['FreeChannels', 1],
                          ['OccupiedChannels', 8]
                  ]
                }
                ]
      },
      FreeChannels:[],
    setMap: function(mapobj)
    {
      this.MAP = mapobj;
    },
    getMap: function()
    {
      return this.MAP;
    },
    setMapView: function(mapv)
    {
      this.MAPVIEW = mapv;
    },
    getMapView: function()
    {
      return this.MAPVIEW;
    },
    showDatasetsNear: function()
    {
        if(StateManager.isHEATMAPPING())
        {
            //clear any heatmaps that are currently active
            HeatmapHelper.cacheAndRemoveHeatmap();
            //console.log("SHOULD CLEAR UN-EXITED HEATMAPS");
            //also should toggle the graph view 
            GraphHelper.clearGraph();
            HeatmapHelper.toggleGraphNodata();
            HeatmapHelper.graphinfotext = "Find Dataset to View it's Data."
        }
        StateManager.setSEARCHING();
        svc.deleteOverlays();
        MeasureSpaceAPIService.getDatasetsNear(
                                             svc.utility.currentposition.lng(), 
                                             svc.utility.currentposition.lat(), 
                                             svc.drawDatasetMarkers, 
                                             svc.failedDrawing
                                            );
    },
    drawDatasetMarkers: function(data)
    {
      //console.log(svc.MAP);
      for(dskey in data)
      {
          var overlay = new CustomMarker(
            new google.maps.LatLng(data[dskey].Lat, data[dskey].Lon),
            svc.MAP,
            {dataset: data[dskey]}
          );

          svc.OVERLAYS.push(overlay);
      }

    },
    failedDrawing: function(errdata)
    {
      console.log("ERROR : Failed To Draw Heatmaps");
      console.log(errdata);
    },
    showOverlays: function()
    {
      for(ok in svc.OVERLAYS)
      {
        svc.OVERLAYS[ok].setMap(svc.MAP);
      }
    },
    clearOverlays: function()
    {
      for(ok in svc.OVERLAYS)
      {
        svc.OVERLAYS[ok].setMap(null);
      }
       //console.log("map is");
      //console.log(svc.MAP);
    },
    deleteOverlays: function()
    {
      svc.clearOverlays();
      svc.OVERLAYS = [];
    },
    setFreeChannels: function(FC)
    {
      svc.FreeChannels = FC;
    },
    determineFreeChannels: function(threshold, nearpointindex)
    {
      var free = new Array();
      for(channelID in HeatmapHelper.rawReadings)
      {
        if(HeatmapHelper.rawReadings[channelID][nearpointindex].CombinedPower < threshold)
        {
          free.push(channelID);
        }
      }
      var fullfree = new Array();
      for(freechannelID in free)
      {
        for(idx in HeatmapHelper.channelassignments)
        {
          if(HeatmapHelper.channelassignments[idx].ChannelID == free[freechannelID])
          {
            fullfree.push(HeatmapHelper.channelassignments[idx]);
          }
        }
      }

      svc.setFreeChannels(fullfree);
      //update pie chart
      //svc.updateFreeChannelChart(fullfree, DC);
    },
    clearFreeChannels: function()
    {
      svc.FreeChannels = [];
    },
    UpdateOccupancy: function(threshold, CurrentDisplayChannel)
    {
      var percentages = HeatmapHelper.calculatePercentageOccupancy(threshold);
      //console.log(svc.PIECHART);
      //console.log(percentages);
      for(arrkey in percentages)
      {
        //console.log(percentages[arrkey].cid, CurrentDisplayChannel);
        if(percentages[arrkey].cid == CurrentDisplayChannel)
        {
          svc.updatePieChart(percentages[arrkey].PO, 100 - percentages[arrkey].PO);
          break;
        }
      }


    },
    updatePieChart: function(positive, negative)
    {
      svc.PERCENTOCCUPIED = positive;
      //console.log("updating pie chart");
      svc.PIECHART.series[0].setData([]);
      svc.PIECHART.series[0].setData([
                                      ['FreeChannels', positive],
                                      ['OccupiedChannels', negative]
                                     ]
                                     );

    }

      
  }

  return svc;
    


}]);
