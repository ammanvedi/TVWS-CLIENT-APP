var app = angular.module('clientAngularApp');



app.service( 'MeasureSpaceAPIService', ['$http', function($http){

  return{
    APIKEY: "n-a",
    APIURL: "http://178.62.0.152:4000",
    getUploadStatus: function(trackid, comp, fail, inprogress){
      $http.get(this.APIURL + '/measurements/track/' + trackid).
        success(function(data, status, headers, config) {
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
          console.log("setting State  : NODATA");
          SM.SM_STATE = SM.SM_NODATA;
      },
      setHEATMAPPING: function()
      {
          console.log("setting State  : HEATMAPPING");
          SM.SM_STATE = SM.SM_HEATMAPPING;
      },
      setSEARCHING: function()
      {
          console.log("setting State  : SEARCHING");
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


app.service('HeatmapHelper', [function(){

  var HH = {
      HEATMAPCACHE:{},
      heatmap:{},
      DATASET:{},
      rawReadings:[],
      fulldataset:[],
      heatmapdatachannels:[],
      graphvisible: true,
      graphinfotext: "Find Dataset to View it's Data.",
      cacheAndRemoveHeatmap: function()
      {
          //$scope.DATASET.DatasetID
          HH.HEATMAPCACHE[HH.DATASET.DatasetID] = {
                                                            Rawdata : HH.rawReadings,
                                                            Normdata : HH.fulldataset,
                                                            Channels : HH.heatmapdatachannels
                                                        }   
        HH.heatmap.setMap(null);
          console.log("CLEARING FROM SERVICE");
      },
      toggleGraphNodata: function()
        {
            if(HH.graphvisible)
            {
                $(".graphnodata").fadeOut("fast");
            }
            else
            {
                $(".graphnodata").fadeIn("fast");
            }

            HH.graphvisible = !HH.graphvisible;
        }
  }

  return HH;


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
                        text: "Combined Power (dB)"
                    }
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
      console.log("should clear graph");
      delete GH.chartConfig.xAxis.categories;
      GH.chartConfig.series = [];
    },
    setSeriesData: function(CategoryData)
    {
        GH.chartConfig.series = new Array();
        GH.chartConfig.series[0] = new Object();
        GH.chartConfig.series[0].data = CategoryData;
        GH.chartConfig.series[0].color = "#fff";
        GH.chartConfig.series[0].name = "Combined Power"
        GH.chartConfig.loading = false;

    },
    setCategories: function(catdata)
    {
      GH.chartConfig.xAxis.categories = catdata;
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
    sidebarChartConfig: {
                chart: 
                {
                  renderTo: 'piechart',
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  backgroundColor:''
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
      FreeChannels:[
          {
            cnum: "1",
            topend: "994",
            lowend: "990"
          },
          {
            cnum: "2",
            topend: "996",
            lowend: "999"
          }
      ],
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
            console.log("SHOULD CLEAR UN-EXITED HEATMAPS");
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
       console.log("map is");
      console.log(svc.MAP);
    },
    deleteOverlays: function()
    {
      svc.clearOverlays();
      svc.OVERLAYS = [];
    }
      
  }

  return svc;


}]);
