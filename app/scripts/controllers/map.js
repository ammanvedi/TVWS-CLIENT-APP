/**
 * @ngdoc controller
 * @name clientAngularApp.controller.MapCtrl
 * @description
 * Controller to mediate display of the visualisation
 */
angular.module('clientAngularApp')
    .controller('MapCtrl', ["MeasureSpaceAPIService", "SidebarHelper", "StateManager", "HeatmapHelper", "GraphHelper", '$scope', "$routeParams", '$location', 'CookieService', function(MeasureSpaceAPIService, SidebarHelper, StateManager, HeatmapHelper, GraphHelper, $scope, $routeParams, $location, CookieService) {



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
        $scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        $scope.$watch(function() {
            return HeatmapHelper.graphinfotext
        }, function() {
            $scope.git = HeatmapHelper.graphinfotext
        });
        $scope.$watch(function() {
            return GraphHelper.chartConfig
        }, function() {
            $scope.chartConfig = GraphHelper.chartConfig
        });
        $scope.$watch(function() {
            return SidebarHelper.sidebarChartConfig
        }, function() {
            $scope.sidebarChartConfig = SidebarHelper.sidebarChartConfig
        });
        $scope.$watch(function() {
            return SidebarHelper.FreeChannels
        }, function() {
            $scope.FreeChannels = SidebarHelper.FreeChannels
        });
        $scope.$watch(function() {
            return SidebarHelper.PERCENTOCCUPIED
        }, function() {
            $scope.PERCENTOCCUPIED = SidebarHelper.PERCENTOCCUPIED
        });

        /**
         * @ngdoc method
         * @name togglesidebar
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * hide the sidebar
         *
         */

        $scope.togglesidebar = function() {
                //console.log( $('#mapsidebar').css("left"));
                if ($('#mapsidebar').css("left") == "0px") {
                    $('#mapsidebar').animate({
                        "left": "-500px"
                    }, "fast");
                    $('#xicon').removeClass("tilted");
                    $('#chart1').css("width", "100%");
                    $('#chart1').css("padding-left", "50px");
                    $('.graphnodata').css("padding-left", "50px");
                    $('.graphnodata').css("width", "100%");
                    GraphHelper.chartConfig.options.chart.width = parseInt($(window).width()) - 50;
                    GraphHelper.chartConfig.options.marginLeft = 50;
                    $('#chart1').highcharts().redraw();
                    $('#chart1').highcharts().reflow();


                } else {
                    $('#mapsidebar').animate({
                        "left": "0px"
                    }, "fast");
                    $('#xicon').addClass("tilted");
                    $('#chart1').css("width", "calc(100% - 280px)");
                    $('.graphnodata').css("width", "calc(100% - 280px)");
                    $('#chart1').css("padding-left", "0px");
                    $('.graphnodata').css("padding-left", "0px");
                    GraphHelper.chartConfig.options.chart.width = parseInt($(window).width()) - 280;
                    //console.log(parseInt($('#chart1').width()));
                    $('#chart1').highcharts().redraw();
                    $('#chart1').highcharts().reflow();
                    //$('.highcharts-container').css("width", "calc(100% - 280px)");
                }

            }
        /**
         * @ngdoc method
         * @name togglesidebarsection
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * toggle a sidebar section
         *
         * @param {String} classname - the classname of the section to collapse
         */
        $scope.togglesidebarsection = function(collapse) {
                //passes the class of the element that should be collapsed
                $('.' + collapse).toggleClass("sidebarcollapse");
            }
        /**
         * @ngdoc method
         * @name sidebarclicked
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * click handler for the sidebar 
         *
         * @param {Object } event - the event from the click
         */
        $scope.sidebarclicked = function(event) {
                if (event.target.attributes.getNamedItem("close-attr")) {
                    $scope.togglesidebarsection(event.target.attributes.getNamedItem("close-attr").value);
                }


            }
        /**
         * @ngdoc method
         * @name sidebarclicked
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * click handler for the sidebar 
         *
         * @param {Object } event - the event from the click
         */
        $scope.ThresholdUpdate = function() {
                if (StateManager.isHEATMAPPING()) {
                    GraphHelper.setThresholdLine($scope.ThresholdVal);
                    SidebarHelper.determineFreeChannels($scope.ThresholdVal, $scope.NPI);
                    SidebarHelper.UpdateOccupancy($scope.ThresholdVal, $scope.displaychannel);
                }

            }
        /**
         * @ngdoc method
         * @name togglegraph
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * controller for the showing and hiding of the graph
         *
         */
        $scope.togglegraph = function() {
            //console.log( $('#chart1').css("left"));

            if ($('#chart1').css("bottom") == "120px") {
                $('#chart1').animate({
                    "bottom": "-500px"
                }, "fast");
                $('.graphnodata').animate({
                    "bottom": "-500px"
                }, "fast");
            } else {
                $('#chart1').animate({
                    "bottom": "120px"
                }, "fast");
                $('.graphnodata').animate({
                    "bottom": "120px"
                }, "fast");
            }
        }

        /**
         * @ngdoc method
         * @name togglePageLoading
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * show or hide the page loading overlay
         *
         */
        $scope.togglePageLoading = function() {
            $("#pageloading").fadeOut("fast");


        }

        /**
         * @ngdoc method
         * @name toggleGraphNodata
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * show or hide the overlays that show that there is no data present
         *
         */

        $scope.toggleGraphNodata = function() {

            if ($scope.graphvisible) {
                $(".graphnodata").fadeOut("fast");
                //sidebarnodata
                $(".sidebarnodata").fadeOut("fast");
            } else {
                $(".graphnodata").fadeIn("fast");
                $(".sidebarnodata").fadeIn("fast");
            }

            $scope.graphvisible = !$scope.graphvisible;
        }

        /**
         * @ngdoc method
         * @name convertAPItoHeatmap
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * convert the data from the API call into a normalised google maps heatmap.
         *
         * @param {Object} APIDATA - data recieved from the api (channel readings)
         * @param {Function} conversiondone - callback to fire when the conversion is done
         */
        $scope.convertAPItoHeatmap = function(APIDATA, conversiondone) {
            $scope.pointcount = APIDATA[Object.keys(APIDATA)[0]].length;
            var heatmapchannels = {}
            $scope.overallmin = 100000.0;
            $scope.overallmax = -100000000.0;
            var channelkey;
            var readingkey;
            var min = 100000.0;
            var max = -100000000.0;

            for (channelkey in APIDATA) {

                for (readingkey in APIDATA[channelkey]) {
                    if (APIDATA[channelkey][readingkey].CombinedPower < min) {
                        min = APIDATA[channelkey][readingkey].CombinedPower;
                    }

                    if (APIDATA[channelkey][readingkey].CombinedPower > max) {
                        max = APIDATA[channelkey][readingkey].CombinedPower;
                    }
                }

                if (min < $scope.overallmin) {
                    $scope.overallmin = min;
                }

                if (max > $scope.overallmax) {
                    $scope.overallmax = max;
                }

                //console.log(min);
                //console.log(max);

                HeatmapHelper.overallmin = $scope.overallmin;
                HeatmapHelper.overallmax = $scope.overallmax;


                heatmapchannels[channelkey] = new Array();

                for (readingkey in APIDATA[channelkey]) {
                    var heatmapobj = {
                        location: new google.maps.LatLng(APIDATA[channelkey][readingkey].Lat,
                            APIDATA[channelkey][readingkey].Lon),
                        weight: -1 * (100.0 * (APIDATA[channelkey][readingkey].CombinedPower - min)) / (max * 10)
                    }
                    heatmapchannels[channelkey].push(heatmapobj)
                }
            }

            conversiondone(heatmapchannels);
            //console.log(heatmapchannels);
        }

        /**
         * @ngdoc method
         * @name findNearPointIndex
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * cbased on a longitude and a latitude of a marker position calculate the closest datapoint to the position
         * uses google maps geometry function
         *
         * @param {Number} lon  - longitude
         * @param {Number} lat - latitude
         */
        $scope.findNearPointIndex = function(lon, lat) {
                var smallestdist = Infinity;
                var closestidx;
                var calcdist;
                var compareto = new google.maps.LatLng(lat, lon);
                var channelkey, itmidx;
                for (channelkey in HeatmapHelper.fulldataset) {
                    for (itmidx in HeatmapHelper.fulldataset[channelkey]) {
                        calcdist = google.maps.geometry.spherical.computeDistanceBetween(compareto,
                            HeatmapHelper.fulldataset[channelkey][itmidx].location
                        );
                        if (calcdist < smallestdist) {
                            closestidx = itmidx;
                            smallestdist = calcdist;
                        }
                    }
                }
                $scope.nearestpointofreference = smallestdist;
                $scope.NPI = closestidx;
                $scope.buildSpectrumAtPoint(closestidx);

                //console.log(closestidx);
            }
        /**
         * @ngdoc method
         * @name buildSpectrumAtPoint
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * using the nearest index create the graph data at the marker point
         *
         * @param {Number} indexpoint - index of the nearest datapoint within the dataset 
         */
        $scope.buildSpectrumAtPoint = function(indexpoint) {
                if (StateManager.getDROPCOUNT() == 0) {
                    //first time dropping a marker
                    //hide graphnodata
                    HeatmapHelper.toggleGraphNodata();
                }
                //aggeregate all of the separate readings for the present channels at the
                //designated points
                $scope.xAxisCategories = new Array();
                for (var i = 0; i < GraphHelper.getCategories().length; i++) {
                    $scope.xAxisCategories[i] = null;
                }

                for (var key in HeatmapHelper.rawReadings) {
                    //key is actually channelid, need to convert channel id to channel number for displayon graph.
                    $scope.xAxisCategories[GraphHelper.getCategories().indexOf($scope.ChannelLookup[parseInt(key)])] = HeatmapHelper.rawReadings[key][indexpoint].CombinedPower;
                }

                GraphHelper.setSeriesData($scope.xAxisCategories);
                GraphHelper.moveChartBandToChannel($scope.ChannelLookup[parseInt($scope.displaychannel)]);
                $scope.$apply();
            }
        /**
         * @ngdoc method
         * @name putHeatmap
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * given normalised heatmap data place the data on the google map
         *
         * @param {Object} hmdata - heatmap data (Weighted google maps heatmap data)
         */
        $scope.putHeatmap = function(hmdata) {
                StateManager.setHEATMAPPING();
                HeatmapHelper.graphinfotext = "move the marker to view point data";
                $scope.displaychannel = HeatmapHelper.heatmapdatachannels[0];
                $scope.datachannelcount = HeatmapHelper.heatmapdatachannels.length;
                HeatmapHelper.fulldataset = hmdata;
                $scope.HMCACHE = new Object();

                $scope.HMCACHE[$scope.displaychannel] = new google.maps.MVCArray(hmdata[$scope.displaychannel]);
                HeatmapHelper.heatmap = new google.maps.visualization.HeatmapLayer({
                    data: $scope.HMCACHE[$scope.displaychannel],
                    radius: 25
                });
                $scope.map.setCenter(new google.maps.LatLng($scope.DATASET.Lat, $scope.DATASET.Lon));
                $scope.map.markers[0].setPosition(new google.maps.LatLng($scope.DATASET.Lat, $scope.DATASET.Lon));
                HeatmapHelper.heatmap.setMap($scope.map);



            }
        /**
         * @ngdoc method
         * @name IncrementHeatmap
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * Show the heatmap of the next available channel
         *
         */
        $scope.IncrementHeatmap = function() {
                if (StateManager.isHEATMAPPING()) {
                    var candidateindex = HeatmapHelper.heatmapdatachannels.indexOf((parseInt($scope.displaychannel) + 1).toString());
                    if (candidateindex != -1) {
                        $scope.switchHeatmap((parseInt($scope.displaychannel) + 1));
                    }
                }

            }
        /**
         * @ngdoc method
         * @name DecrementHeatmap
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * Show the heatmap of preceeding channel
         *
         */
        $scope.DecrementHeatmap = function() {
            if (StateManager.isHEATMAPPING()) {
                var candidateindex = HeatmapHelper.heatmapdatachannels.indexOf((parseInt($scope.displaychannel) - 1).toString());
                if (candidateindex != -1) {
                    $scope.switchHeatmap((parseInt($scope.displaychannel) - 1));
                }
            }

        }

        /**
         * @ngdoc method
         * @name switchHeatmap
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * Switch the heatmap data that is currently being displayed to the the data for a given ITU channel. Also switch the graph indicator
         *
         * @param {Number} CahnnelID - The ITU channel ID to show 
         */
        $scope.switchHeatmap = function(channelid) {
            $scope.displaychannel = channelid;
            if ($scope.HMCACHE[channelid] == undefined) {
                $scope.HMCACHE[channelid] = new google.maps.MVCArray(HeatmapHelper.fulldataset[$scope.displaychannel]);
                HeatmapHelper.heatmap.setData($scope.HMCACHE[channelid]);
            } else {
                HeatmapHelper.heatmap.setData($scope.HMCACHE[channelid]);
            }

            GraphHelper.moveChartBandToChannel($scope.ChannelLookup[parseInt($scope.displaychannel)]);

        }

        /**
         * @ngdoc method
         * @name gotReadings
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * Callnack to fire on successfully getting dataset readings
         * saves the data into the systems internal state
         *
         * @param {Object} readings - readings returned by the api
         */
        $scope.gotReadings = function(readings) {
                HeatmapHelper.rawReadings = readings;
                HeatmapHelper.heatmapdatachannels = Object.keys(readings);
                $scope.convertAPItoHeatmap(readings, $scope.putHeatmap);
            }
        /**
         * @ngdoc method
         * @name gotReadingsFail
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * Failure callback function if the api failed to get dataset readings
         *
         * @param {Object} readingserror - error data returned by the api
         */
        $scope.gotReadingsFail = function(readingserror) {
                console.log("ERROR :: Getting readings Failed");
            }
        /**
         * @ngdoc method
         * @name gotDatasetFail
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * Failure callback function if the api failed to get dataset
         *
         * @param {Object} datas - error data returned by the api
         */
        $scope.gotDatasetFail = function(datas) {
                console.log("ERROR :: Getting dataset Failed");
            }
        /**
         * @ngdoc method
         * @name markerPositionChanged
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * callback to fire when the user moves the marker position, updates the graph with nearest point data
         *
         * @param {Object} GoogleMapsEventObject - marker event
         */
        $scope.markerPositionChanged = function(event) {
                //console.log(event);
                console.log(StateManager.isHEATMAPPING());
                //should find near point index if we actually have data
                if (StateManager.isHEATMAPPING()) {
                    $scope.findNearPointIndex(event.latLng.lng(), event.latLng.lat());
                    StateManager.increaseDROPCOUNT();
                    $scope.markeratlon = event.latLng.lng();
                    $scope.markeratlat = event.latLng.lat();
                }
            }
        /**
         * @ngdoc method
         * @name gotRegionFail
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * Failure callback function if the api failed to get channel for the local region
         *
         */
        $scope.gotRegionFail = function() {
            console.log("ERROR :: Getting region Failed");
        }

        /**
         * @ngdoc method
         * @name gotRegion
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * region data for the dataset was recieved from the api, this is the initial stage of the dataset display,
         * this function initiates the call to get the heatmap data, either from the APi or from the local cache
         *
         * @param {Object} data - data for the channel
         */
        $scope.gotRegion = function(datas) {
            //got the regions successfully
            //set up the graph
            $scope.ChannelLookup = new Object();
            HeatmapHelper.channelassignments = datas;
            var xaxis = new Array();
            for (var k in HeatmapHelper.channelassignments) {
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

            if (HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID]) {
                HeatmapHelper.rawReadings = HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].Rawdata;
                HeatmapHelper.heatmapdatachannels = HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].Channels;
                $scope.overallmin = HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].ovmin;
                $scope.overallmax = HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].ovmax;
                //$scope.fulldataset = HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].Normdata;
                $scope.putHeatmap(HeatmapHelper.HEATMAPCACHE[$scope.DATASET.DatasetID].Normdata);
            } else {
                MeasureSpaceAPIService.getDatasetReadings($scope.DATASET.DatasetID,
                    $scope.gotReadings,
                    $scope.gotReadingsFail
                );
            }


        }

        $scope.getMSAS  =function()
        {
            return MeasureSpaceAPIService;
        }

        /**
         * @ngdoc method
         * @name backToSearch
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * System is currently showing a heatmap use this function in order to switch it back to the search mode
         *
         */

        $scope.backToSearch = function() {
            if (StateManager.isHEATMAPPING()) {
                if (StateManager.getDROPCOUNT() > 0) {
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

        /**
         * @ngdoc method
         * @name drawHoverInfo
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * When displaying search results their hoover callback is this function. 
         * gets the dataset information and displays it in an overlay div at the hover position
         *
         * @param {Object} location - location at which the hover occurred
         * @param {Object} dataset - dataset data for related hover
         * @param {Object} el - element that fired the hover
         */

        $scope.drawHoverInfo = function(location, dataset, el) {
            //console.log(moment);
            var d = new Date(dataset.StartTime * 1000)

            var divstr = '<div id="datasetinfo" style="z-index:1500;position: absolute;left:' +
                (location[0] + 10) + 'px;top:' +
                (location[1] + 10) + 'px;"> <span id="datespan">' +
                d.getDate() + ' ' + $scope.months[d.getMonth()] + ' ' + d.getFullYear() + ' </br>@ ' +
                d.getHours() + ' : ' + d.getMinutes() + ' ' + '</span> <br/>' +
                '<span id="rangespan"><span id="titlespan">Range (MHz) : </span>' + dataset.LF + ' → ' + dataset.HF + ' </span><br/>' +
                '<span id="channelspan"><span id="titlespan">Channels : </span>' + dataset.ChannelCount + ' </span><br/>' +
                '<span id="poitcountspan"><span id="titlespan">Points : </span>' + dataset.PointCount +
                '</span></div>'
            var jq = $(divstr);
            jq.appendTo('body');
        }

        /**
         * @ngdoc method
         * @name removeHoverInfo
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * remove the hover div 
         *
         */

        $scope.removeHoverInfo = function() {
            $('#datasetinfo').remove();
        }

        /**
         * @ngdoc method
         * @name markerHover
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * When displaying search results this is the callback function that is fired on hover
         *
         * @param {Object} event - full dom event of hover
         */

        $scope.markerHover = function(event) {
            $scope.drawHoverInfo([event.evt.pageX, event.evt.pageY], event.arg.dataset, event.evt.fromElement);
        }

        /**
         * @ngdoc method
         * @name markerHoverExit
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * When displaying search results this is the callback function that is fired on hover exit so that the overlay can be cleaned up 
         *
         * @param {Object} event - full dom event of hover exit 
         */

        $scope.markerHoverExit = function(event) {
            $scope.removeHoverInfo();
        }

        /**
         * @ngdoc method
         * @name mapClicked
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * Event callback to fire on the map clicked event 
         *
         * @param {Object} event - full dom event click
         */

        $scope.mapClicked = function(evt) {
                if (event.alreadyCalled_) {} else {
                    event.alreadyCalled_ = true;
                    //console.log(evt);
                    if (evt["arg"]["dataset"]) {
                        //console.log("here");
                        SidebarHelper.clearOverlays();
                        $scope.removeHoverInfo();
                        HeatmapHelper.DATASET = $scope.DATASET = evt["arg"]["dataset"]
                        $scope.getRegionDataset(evt["arg"]["dataset"].Lon, evt["arg"]["dataset"].Lat);
                    }
                }
            }
        /**
         * @ngdoc method
         * @name loadURLDataset
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * function that is called if the map page is loaded with a dataset id parameter, which means it should pre-load a datasets data
         *
         * @param {Number} dsid - the dataset id to get 
         */

        $scope.loadURLDataset = function(dsid) {
            MeasureSpaceAPIService.getDatasetByID(dsid, $scope.loadedURLDataset, $scope.failedLoadURLDataset);

        }

        /**
         * @ngdoc method
         * @name loadedURLDataset 
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * function called if the get request to the api for the preload of a dataset was successful 
         *
         * @param {Number} data - dataset data returned by the api
         */

        $scope.loadedURLDataset = function(data) {
            //set the scope's dataset to the dataset info
            //console.log(data);
            //save in the scope
            HeatmapHelper.DATASET = $scope.DATASET = data;
            //get the datset of channels for the region
            $scope.getRegionDataset(data.Lon, data.Lat);


        }

        /**
         * @ngdoc method
         * @name failedLoadURLDataset
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * function called if the get request to the api for the preload of a dataset was unsuccessful 
         *
         * @param {Number} data - dataset error data returned by the api
         */

        $scope.failedLoadURLDataset = function(data) {

        }

        /**
         * @ngdoc method
         * @name getRegionDataset
         * @methodOf clientAngularApp.controller.MapCtrl
         * @description
         * function to get the set of channels related to a particular region via the API 
         *
         * @param {Number} lon - longitude
         * @param {Number} lat - latitude
         */

        $scope.getRegionDataset = function(lon, lat) {
            MeasureSpaceAPIService.getRegionChannelSet(lon, lat, $scope.gotRegion, $scope.gotRegionFail)
        }

        $scope.mousedwn = function(evt)
        {
            console.log(evt.pageX);
            console.log(evt.pageY);
        }

        $scope.getstate = function()
        {
            return StateManager.SM_STATE;
        }

        $scope.$on('mapInitialized', function(event, map) {

            $scope.map = map;

            console.log("init")
            SidebarHelper.setMap(map);
            document.addEventListener("mousedown", $scope.mousedwn);
            document.addEventListener("mouseup", $scope.mousedwn);
            google.maps.event.addListener($scope.map.markers[0], 'dragend', $scope.markerPositionChanged);
            google.maps.event.addListener($scope.map, 'markerclick', $scope.mapClicked);
            google.maps.event.addListener($scope.map, 'markerhover', $scope.markerHover);
            google.maps.event.addListener($scope.map, 'markerhoverexit', $scope.markerHoverExit);
            setTimeout(function() {
                $scope.togglePageLoading();
            }, 2000);
            $("#channelsmapmover").fadeOut("fast");
            event.stopPropagation();

            //console.log($routeParams);
            //check for route params
            //load map if one is predent (DatasetID)
            if ($routeParams.DatasetID) {

                //load this dataset
                $scope.loadURLDataset($routeParams.DatasetID);

            }

        });


    }]);