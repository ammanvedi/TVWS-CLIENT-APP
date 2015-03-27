
/**
 * @ngdoc function
 * @name clientAngularApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the clientAngularApp
 */
angular.module('clientAngularApp')
  .controller('MapCtrl',["MeasureSpaceAPIService","SidebarHelper", "StateManager", "HeatmapHelper", "GraphHelper" ,'$scope', "$routeParams", '$location', 'CookieService',function (MeasureSpaceAPIService, SidebarHelper, StateManager , HeatmapHelper, GraphHelper ,$scope, $routeParams, $location, CookieService) {

      

    $scope.HMCACHE = {}
    $scope.rawReadings = []
    $scope.heatmapdatachannels = []
    $scope.fulldataset = []
    $scope.graphvisible = true;
    $scope.git = HeatmapHelper.graphinfotext;
    $scope.chartConfig = GraphHelper.chartConfig;
    $scope.xAxisCategories = null
    $scope.sidebarChartConfig = SidebarHelper.sidebarChartConfig;
    $scope.FreeChannels = SidebarHelper.FreeChannels;
    $scope.ThresholdMin = -100;
    $scope.ThresholdMax = -40;
    $scope.ThresholdVal = -60;
    $scope.PERCENTOCCUPIED = 0;
    $scope.pointcount = 0;
    $scope.markeratlon = 0.0;
    $scope.markeratlat = 0.0;
    $scope.nearestpointofreference = 0.0;
    
    $scope.$watch(function(){return HeatmapHelper.graphinfotext}, function(){$scope.git = HeatmapHelper.graphinfotext});
    $scope.$watch(function(){return GraphHelper.chartConfig}, function(){$scope.chartConfig = GraphHelper.chartConfig});
    $scope.$watch(function(){return SidebarHelper.sidebarChartConfig}, function(){$scope.sidebarChartConfig = SidebarHelper.sidebarChartConfig});
    $scope.$watch(function(){return SidebarHelper.FreeChannels}, function(){$scope.FreeChannels = SidebarHelper.FreeChannels});
    $scope.$watch(function(){return SidebarHelper.PERCENTOCCUPIED}, function(){$scope.PERCENTOCCUPIED = SidebarHelper.PERCENTOCCUPIED});
    


    $scope.togglesidebar = function()
    {
        //console.log( $('#mapsidebar').css("left"));
        if( $('#mapsidebar').css("left") == "0px")
        {
            $('#mapsidebar').animate({ "left": "-500px" }, "fast");
            $('#xicon').removeClass("tilted");
            $('#chart1').css("width", "100%");
            $('#chart1').css("padding-left", "50px");
            $('.graphnodata').css("padding-left", "50px");
            $('.graphnodata').css("width", "100%");
            GraphHelper.chartConfig.options.chart.width = parseInt($( window ).width()) - 50;
            GraphHelper.chartConfig.options.marginLeft = 50;
                        $('#chart1').highcharts().redraw();
                                    $('#chart1').highcharts().reflow();


        }else
        {
            $('#mapsidebar').animate({ "left": "0px" }, "fast" );
            $('#xicon').addClass("tilted");
            $('#chart1').css("width", "calc(100% - 280px)");
            $('.graphnodata').css("width", "calc(100% - 280px)");
            $('#chart1').css("padding-left", "0px");
            $('.graphnodata').css("padding-left", "0px");
            GraphHelper.chartConfig.options.chart.width = parseInt($( window ).width()) -280;
            console.log(parseInt($( '#chart1' ).width()));
            $('#chart1').highcharts().redraw();
                                    $('#chart1').highcharts().reflow();
            //$('.highcharts-container').css("width", "calc(100% - 280px)");
        }

    }

    $scope.togglesidebarsection = function(collapse)
    {
        //passes the class of the element that should be collapsed
        $('.' + collapse).toggleClass("sidebarcollapse");
    }

    $scope.sidebarclicked = function(event)
    {
        console.log(event.target.attributes.getNamedItem("close-attr").value);
        $scope.togglesidebarsection(event.target.attributes.getNamedItem("close-attr").value);

    }

    $scope.ThresholdUpdate = function()
    {
        if(StateManager.isHEATMAPPING())
        {
            GraphHelper.setThresholdLine($scope.ThresholdVal);
            SidebarHelper.determineFreeChannels($scope.ThresholdVal, $scope.NPI);
            SidebarHelper.UpdateOccupancy($scope.ThresholdVal, $scope.displaychannel);
        }

    }

    $scope.togglegraph = function()
    {
        //console.log( $('#chart1').css("left"));
        
        if( $('#chart1').css("bottom") == "120px")
        {
            $('#chart1').animate({ "bottom": "-500px" }, "fast");
            $('.graphnodata').animate({ "bottom": "-500px" }, "fast");
        }else
        {
            $('#chart1').animate({ "bottom": "120px" }, "fast" );
            $('.graphnodata').animate({ "bottom": "120px" }, "fast" );
        }
    }
    
    $scope.togglePageLoading = function()
    {
        $("#pageloading").fadeOut("fast");
    }
    
    $scope.toggleMapLoading = function()
    {
    }
    
    $scope.toggleGraphLoading = function()
    {
    }
    
    $scope.toggleGraphNodata = function()
    {
        
        if($scope.graphvisible)
        {
            $(".graphnodata").fadeOut("fast");
            //sidebarnodata
            $(".sidebarnodata").fadeOut("fast");
        }
        else
        {
            $(".graphnodata").fadeIn("fast");
            $(".sidebarnodata").fadeIn("fast");
        }
        
        $scope.graphvisible = !$scope.graphvisible;
    }


    $scope.convertAPItoHeatmap = function(APIDATA, conversiondone)
    {
      $scope.pointcount = APIDATA[Object.keys(APIDATA)[0]].length;
      var heatmapchannels = {}
      $scope.overallmin = 100000.0;
      $scope.overallmax = -100000000.0;
      var channelkey;
      var readingkey;
      var min = 100000.0;
      var max = -100000000.0;

      for(channelkey in APIDATA)
      {

        for(readingkey in APIDATA[channelkey])
        {
          if(APIDATA[channelkey][readingkey].CombinedPower < min)
          {
            min = APIDATA[channelkey][readingkey].CombinedPower;
          }

          if(APIDATA[channelkey][readingkey].CombinedPower > max)
          {
            max = APIDATA[channelkey][readingkey].CombinedPower;
          }
        }

        if(min < $scope.overallmin)
          {
            $scope.overallmin = min;
          }

        if(max > $scope.overallmax)
          {
            $scope.overallmax = max;
          }

        //console.log(min);
        //console.log(max);

        HeatmapHelper.overallmin = $scope.overallmin;
        HeatmapHelper.overallmax = $scope.overallmax;


        heatmapchannels[channelkey] = new Array();

        for(readingkey in APIDATA[channelkey])
        {
            var heatmapobj =
            {
                    location: new google.maps.LatLng(APIDATA[channelkey][readingkey].Lat,
                                                     APIDATA[channelkey][readingkey].Lon),
                    weight: -1*(100.0*(APIDATA[channelkey][readingkey].CombinedPower - min))/(max*10)
            }
          heatmapchannels[channelkey].push(heatmapobj)
        }
      }

        conversiondone(heatmapchannels);
        //console.log(heatmapchannels);
    }

    $scope.findNearPointIndex = function(lon, lat)
    {
        var smallestdist = Infinity;
        var closestidx;
        var calcdist;
        var compareto = new google.maps.LatLng(lat,lon);
        var channelkey,itmidx;
        for(channelkey  in HeatmapHelper.fulldataset)
        {
            for(itmidx in HeatmapHelper.fulldataset[channelkey])
            {
                calcdist = google.maps.geometry.spherical.computeDistanceBetween(compareto, 
                                                                                HeatmapHelper.fulldataset[channelkey][itmidx].location
                                                                                );
                if(calcdist < smallestdist)
                {
                    closestidx = itmidx;
                    smallestdist = calcdist;
                }
            }
        }
        $scope.nearestpointofreference = smallestdist;
        $scope.NPI = closestidx;
        $scope.buildSpectrumAtPoint(closestidx);
    }

    $scope.buildSpectrumAtPoint = function(indexpoint)
    {
        if(StateManager.getDROPCOUNT() == 0)
        {
            //first time dropping a marker
            //hide graphnodata
            HeatmapHelper.toggleGraphNodata();
        }
        //aggeregate all of the separate readings for the present channels at the
        //designated points
        $scope.xAxisCategories = new Array();
        for(var i = 0; i < GraphHelper.getCategories().length; i++)
        {
            $scope.xAxisCategories[i] = null;
        }

        for(var key in HeatmapHelper.rawReadings)
        {
            //key is actually channelid, need to convert channel id to channel number for displayon graph.
            $scope.xAxisCategories[ GraphHelper.getCategories().indexOf( $scope.ChannelLookup[parseInt(key)] ) ] = HeatmapHelper.rawReadings[key][indexpoint].CombinedPower;
        }

        GraphHelper.setSeriesData($scope.xAxisCategories);
        GraphHelper.moveChartBandToChannel($scope.ChannelLookup[parseInt($scope.displaychannel)]);
        $scope.$apply();
    }

    $scope.putHeatmap = function(hmdata)
    {
        StateManager.setHEATMAPPING();
        HeatmapHelper.graphinfotext = "move the marker to view point data";
        $scope.displaychannel = HeatmapHelper.heatmapdatachannels[0];
        $scope.datachannelcount = HeatmapHelper.heatmapdatachannels.length;
        HeatmapHelper.fulldataset = hmdata;
        $scope.HMCACHE = new Object();
        HeatmapHelper.heatmap = $scope.map.heatmapLayers.vizlayer;
        $scope.HMCACHE[$scope.displaychannel] = new google.maps.MVCArray(hmdata[$scope.displaychannel]);
        HeatmapHelper.heatmap = new google.maps.visualization.HeatmapLayer({
            data: $scope.HMCACHE[$scope.displaychannel],
            radius: 25
        });
        $scope.map.setCenter(new google.maps.LatLng($scope.DATASET.Lat, $scope.DATASET.Lon));
        $scope.map.markers[0].setPosition(new google.maps.LatLng($scope.DATASET.Lat, $scope.DATASET.Lon));
        HeatmapHelper.heatmap.setMap($scope.map);
        $scope.map.heatmapLayers.vizlayer.setMap($scope.map);
    }
    
    $scope.IncrementHeatmap = function()
    {
        if(StateManager.isHEATMAPPING())
        {
            var candidateindex = HeatmapHelper.heatmapdatachannels.indexOf((parseInt($scope.displaychannel) + 1).toString());
            if(candidateindex != -1)
            {
                $scope.switchHeatmap((parseInt($scope.displaychannel) + 1));
            } 
        }

    } 
    
    $scope.DecrementHeatmap = function()
    {
        if(StateManager.isHEATMAPPING())
        {
            var candidateindex = HeatmapHelper.heatmapdatachannels.indexOf((parseInt($scope.displaychannel) - 1).toString());
            if(candidateindex != -1)
            {
                $scope.switchHeatmap((parseInt($scope.displaychannel) - 1));
            }
        }

    }

    $scope.switchHeatmap = function(channelid)
    {
        $scope.displaychannel = channelid;
        if($scope.HMCACHE[channelid] == undefined)
        {
            $scope.HMCACHE[channelid] = new google.maps.MVCArray(HeatmapHelper.fulldataset[$scope.displaychannel]);
             HeatmapHelper.heatmap.setData($scope.HMCACHE[channelid]);
        }else
        {
            HeatmapHelper.heatmap.setData($scope.HMCACHE[channelid]);
        }
        
        GraphHelper.moveChartBandToChannel($scope.ChannelLookup[parseInt($scope.displaychannel)]);
        
    }

    $scope.gotReadings = function(readings)
    {
        HeatmapHelper.rawReadings = readings;
        HeatmapHelper.heatmapdatachannels = Object.keys(readings);
        $scope.convertAPItoHeatmap(readings, $scope.putHeatmap);
    }

    $scope.gotReadingsFail = function(readingserror)
    {
        console.log("ERROR :: Getting readings Failed");
    }

    $scope.gotDataset = function(rawdatas)
    {
    }

    $scope.gotDatasetFail = function(datas)
    {
        console.log("ERROR :: Getting dataset Failed");
    }

    $scope.markerPositionChanged = function(event)
    {
        //should find near point index if we actually have data
        if(StateManager.isHEATMAPPING())
        {
            $scope.findNearPointIndex(event.latLng.lng(), event.latLng.lat());
            StateManager.increaseDROPCOUNT();
            $scope.markeratlon = event.latLng.lng();
            $scope.markeratlat = event.latLng.lat();
        }
    }

    $scope.gotRegionFail = function()
    {
        console.log("ERROR :: Getting region Failed");
    }
    


    $scope.gotRegion = function(datas)
    {
        //got the regions successfully
        //set up the graph
        $scope.ChannelLookup = new Object();
        HeatmapHelper.channelassignments = datas;
        var xaxis = new Array();
        for(var k in HeatmapHelper.channelassignments)
        {
            xaxis.push(HeatmapHelper.channelassignments[k].ChannelNumber);
            $scope.ChannelLookup[HeatmapHelper.channelassignments[k].ChannelID] = HeatmapHelper.channelassignments[k].ChannelNumber;
        }
        //set to graph
        //console.log(xaxis);
        GraphHelper.setCategories(xaxis);

        
        //check the cache, otherwise make the API call
        //console.log(HeatmapHelper.HEATMAPCACHE);

        //either way augment the url of the request to the dataset id so the link can be easily shared

        $location.search("DatasetID", $scope.DATASET.DatsetID);

        if(HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID])
        {
            HeatmapHelper.rawReadings = HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].Rawdata;
            HeatmapHelper.heatmapdatachannels = HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].Channels;
            $scope.overallmin = HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].ovmin;
            $scope.overallmax = HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].ovmax;
            //$scope.fulldataset = HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].Normdata;
            $scope.putHeatmap(HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].Normdata);
        }else
        {
            MeasureSpaceAPIService.getDatasetReadings(  $scope.DATASET.DatasetID,
                                                        $scope.gotReadings,
                                                        $scope.gotReadingsFail
                                                     );
        }

        
    }

    
    $scope.backToSearch = function()
    {
        //option is invalid unless the system is in heatmapping mode
        if(StateManager.isHEATMAPPING())
        {
            
            //console.log("DC IS --> " + StateManager.getDROPCOUNT());
            if(StateManager.getDROPCOUNT() > 0)
            {
                HeatmapHelper.graphinfotext = "Find Dataset to View it's Data."
                HeatmapHelper.toggleGraphNodata();
                GraphHelper.clearGraph();
            }

            StateManager.setSEARCHING();
            SidebarHelper.clearFreeChannels();

            HeatmapHelper.graphinfotext = "Find Dataset to View it's Data."

            HeatmapHelper.cacheAndRemoveHeatmap();
            SidebarHelper.showOverlays();
        }

    }

    $scope.drawHoverInfo = function(location, dataset, el)
    {
        var divstr = '<div id="datasetinfo" style="z-index:1500;height:100px;width:100px;position: absolute;left:' + (location[0]+ 10) +'px;top:' + (location[1] + 10) +'px;">' + JSON.stringify(dataset) +'</div>'
        //console.log("passedel");
        //console.log(el);
        //var todiv = $(el);
        var jq = $(divstr);
        jq.appendTo('body');
        //console.log(todiv);
        //console.log(todiv.position());
        //jq.appendTo('body');
    }

    $scope.removeHoverInfo = function()
    {
        $('#datasetinfo').remove();
    }



    $scope.markerHover = function(event)
    {
        //console.log("hover");
        //console.log(event);
        $scope.drawHoverInfo([event.evt.pageX, event.evt.pageY], event.arg.dataset, event.evt.fromElement);
    }

    $scope.markerHoverExit = function(event)
    {
        //console.log("hoverexit");
        //console.log(event);
        $scope.removeHoverInfo();
    }

    $scope.mapClicked = function(evt)
    {
      if (event.alreadyCalled_) {
      }
      else {
        event.alreadyCalled_ = true;
          //console.log(evt);
        if(evt["arg"]["dataset"])
        {
            //console.log("here");
          SidebarHelper.clearOverlays();
          $scope.removeHoverInfo();
          HeatmapHelper.DATASET = $scope.DATASET = evt["arg"]["dataset"] 
          $scope.getRegionDataset(evt["arg"]["dataset"].Lon,evt["arg"]["dataset"].Lat);
        }
      }
    }

    $scope.loadURLDataset = function(dsid)
    {
        MeasureSpaceAPIService.getDatasetByID(dsid, $scope.loadedURLDataset, $scope.failedLoadURLDataset);

    }

    $scope.loadedURLDataset = function(data)
    {
        //set the scope's dataset to the dataset info
        //console.log(data);
        //save in the scope
        HeatmapHelper.DATASET = $scope.DATASET = data;
        //get the datset of channels for the region
        $scope.getRegionDataset(data.Lon, data.Lat);
    }

    $scope.failedLoadURLDataset = function(data)
    {

    }

    $scope.getRegionDataset = function(lon, lat)
    {
        MeasureSpaceAPIService.getRegionChannelSet(lon, lat, $scope.gotRegion, $scope.gotRegionFail)
    }

    $scope.$on('mapInitialized', function(event, map) {
        
        $scope.map = map;


        SidebarHelper.setMap(map);
        google.maps.event.addListener($scope.map.markers[0],'dragend',$scope.markerPositionChanged);
        google.maps.event.addListener($scope.map,'markerclick',$scope.mapClicked);
        google.maps.event.addListener($scope.map,'markerhover',$scope.markerHover);
        google.maps.event.addListener($scope.map,'markerhoverexit',$scope.markerHoverExit);
        setTimeout(function(){$scope.togglePageLoading();},2000);
        $("#channelsmapmover").fadeOut("fast");
        event.stopPropagation();

        //console.log($routeParams);
        //check for route params
        //load map if one is predent (DatasetID)
        if($routeParams.DatasetID)
        {
            //load this dataset
            $scope.loadURLDataset($routeParams.DatasetID);
        }

    });


  }]);
