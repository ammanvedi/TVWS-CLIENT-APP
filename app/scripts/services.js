var app = angular.module('clientAngularApp');

/**
 * @ngdoc service
 * @name clientAngularApp.service.MeasureSpaceAPIService
 * @description
 * Mediate basic queries to the api service at https://api.measurespace.io
 */

app.service('MeasureSpaceAPIService', ['$http', function($http) {

    return {
        APIKEY: "n-a",
        APIURL: "https://api.measurespace.io",
        /**
          * @ngdoc method
          * @name getUploadStatus
          * @methodOf clientAngularApp.service.MeasureSpaceAPIService
          * @description
          * using a tracking id, check the status of a submitted upload
          *
          * @param {string} trackid - the trackingid to access
          * @param {function} comp(data) - callback to call if the upload is complete 
          * @param {function} fail(data) - callback to call if the upload failed
          * @param {function} inprogress(data) -  callback to call if the upload is still in progress
          */
        getUploadStatus: function(trackid, comp, fail, inprogress) {
            $http.get(this.APIURL + '/upload/track/' + trackid).
            success(function(data, status, headers, config) {
                //console.log(data);
                if (data.Completed) {
                    //according to server the task was completed successfully
                    comp(data);
                    return;
                }

                if (data.Error) {
                    fail(data);
                    return;
                }

                if ((data.Completed == 0) && (data.Error == null)) {
                    //error flag not set, completed flag not set, in midst of processing
                    inprogress(data);
                    return;
                }

            }).
            error(function(data, status, headers, config) {
                fail({httperr: "HTTP : error accessing the api"});
            });
        },
        /**
          * @ngdoc method
          * @name getDatasetsNear
          * @methodOf clientAngularApp.service.MeasureSpaceAPIService
          * @description
          * using a latitude and longitide find any datsets that are near the point
          *
          * @param {float} nearlon - Longitude to search
          * @param {float} nearlat - Latitude to search
          * @param {function} complete(data) - callback to call if datasets were found
          * @param {function} failure(data) -  callback to call if there was an error
          */
        getDatasetsNear: function(nearlon, nearlat, complete, failure) {
            $http.get(this.APIURL + '/datasets/near/' + nearlon + '/' + nearlat + '/5000').
            success(function(data, status, headers, config) {

                if (data.QueryError) {
                    failure(data);
                    return;
                }
                //console.log(JSON.stringify(data));
                complete(data);

            }).
            error(function(data, status, headers, config) {
                console.log("Angular Http get failed");
                failure({httperr: "HTTP : error accessing the api"});
            });
        },
          /**
          * @ngdoc method
          * @name getDatasetReadings
          * @methodOf clientAngularApp.service.MeasureSpaceAPIService
          * @description
          * get the individual readings that relate to a dataset id
          *
          * @param {Number} dsid - DatasetID to retrieve readings for
          * @param {function} complete(data) - callback to call if datasets were found
          * @param {function} failure(data) -  callback to call if there was an error (no corresponding dataset)
          */
        getDatasetReadings: function(dsid, complete, failure) {

            $http.get(this.APIURL + '/datasets/' + dsid + '/readings').
            success(function(data, status, headers, config) {

                if (data.QueryError) {
                    failure(data);
                    return;
                }
                //console.log(JSON.stringify(data));
                complete(data);

            }).
            error(function(data, status, headers, config) {
                //console.log("Angular Http get failed");
                failure({httperr: "HTTP : error accessing the api"});
            });

        },
          /**
          * @ngdoc method
          * @name getRegionChannelSet
          * @methodOf clientAngularApp.service.MeasureSpaceAPIService
          * @description
          * Get the active channels that relate to a geographic region
          *
          * @param {float} lon - longitude to search
          * @param {float} lat - latitude to search
          * @param {function} complete(data) - callback to call if channels were found
          * @param {function} failure(data) -  callback to call if there was an error (no corresponding channels)
          */
        getRegionChannelSet: function(lon, lat, complete, failure) {
            $http.get(this.APIURL + '/channels/near/' + lon + '/' + lat).
            success(function(data, status, headers, config) {

                if (data.QueryError) {
                    failure(data);
                    return;
                }
                //console.log(JSON.stringify(data));
                complete(data);

            }).
            error(function(data, status, headers, config) {
                console.log("Angular Http get failed");
                failure({httperr: "HTTP : error accessing the api"});
            });
        },
          /**
          * @ngdoc method
          * @name getDatasetByID
          * @methodOf clientAngularApp.service.MeasureSpaceAPIService
          * @description
          * Get the metadata for a dataset
          *
          * @param {Number} dsid - DatasetID to retrieve
          * @param {function} complete(data) - callback to call if dataset was found
          * @param {function} failure(data) -  callback to call if there was an error (no corresponding dataset)
          */
        getDatasetByID: function(dsid, complete, failure) {
            $http.get(this.APIURL + '/datasets/' + dsid + '/meta').
            success(function(data, status, headers, config) {


              //handle the data error
                if (data.QueryError) {
                    failure(data);
                    return;
                }
                data.DatasetID = parseInt(dsid);
                //console.log(JSON.stringify(data));
                complete(data);

            }).
            error(function(data, status, headers, config) {
              //handle the http error
                console.log("Angular Http get failed");
                failure({httperr: "HTTP : error accessing the api"});
            });
        },
          /**
          * @ngdoc method
          * @name getDatasetByID
          * @methodOf clientAngularApp.service.MeasureSpaceAPIService
          * @description
          * Register a User account. Parameters are combined in a post body and passed over SSL to the
          * API server to maintain security
          *
          * @param {string} pemail - User email
          * @param {string} ppassword - User's password
          * @param {string} pfname - User forenam
          * @param {string} psname - User Lastname
          * @param {function} success(data) - callback to call if channels were found
          * @param {function} failure(data) -  callback to call if there was an error (user already exists)
          */
        registerUser: function(pemail, ppassword, pfname, psname, success, failure) {
            $http({
                method: 'POST',
                url: this.APIURL + '/register',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param({
                    sname: psname,
                    fname: pfname,
                    email: pemail,
                    password: ppassword
                })
            }).
            success(function(data, status, headers, config) {

                if (data.QueryError) {
                    failure(data);
                    return;
                }
                success(data);

            }).
            error(function(data, status, headers, config) {
                console.log("Angular Http get failed");
                failure({httperr: "HTTP : error accessing the api"});
            });
        },
          /**
          * @ngdoc method
          * @name loginUser
          * @methodOf clientAngularApp.service.MeasureSpaceAPIService
          * @description
          * Pass username and password to API server and determine if user has provided correct credentials
          *
          * @param {string} username - User email
          * @param {string} password - User's password
          * @param {function} success(data) - callback to call if channels were found
          * @param {function} failure(data) -  callback to call if there was an error (user entered incorrect details)
          */
        loginUser: function(username, password, success, failure) {
            $http({
                method: 'POST',
                url: this.APIURL + '/login',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param({
                    uname: username,
                    pword: password
                })
            }).
            success(function(data, status, headers, config) {

                if (data.QueryError) {
                    failure(data);
                    return;
                }
                success(data);

            }).
            error(function(data, status, headers, config) {
                console.log("Angular Http get failed");
                failure({httperr: "HTTP : error accessing the api"});
            });
        },
          /**
          * @ngdoc method
          * @name getDatasetsForUser
          * @methodOf clientAngularApp.service.MeasureSpaceAPIService
          * @description
          * Get a user's datasets 
          *
          * @param {string} userid - User id for whom to retireve datasets
          * @param {function} complete(data) - callback to call if channels were found
          * @param {function} failure(data) -  callback to call if there was an error (user entered incorrect details)
          */
        getDatasetsForUser: function(userid, complete, failure) {
            $http.get(this.APIURL + '/user/' + userid + '/datasets').
            success(function(data, status, headers, config) {

                if (data.QueryError) {
                    failure(data);
                    return;
                }

                complete(data);

            }).
            error(function(data, status, headers, config) {
                console.log("Angular Http get failed");
                failure({httperr: "HTTP : error accessing the api"});
            });
        },
        getAllDatasets: function(userid, complete, failure) {
            $http.get(this.APIURL + '/datasets/all').
            success(function(data, status, headers, config) {

                if (data.QueryError) {
                    failure(data);
                    return;
                }

                complete(data);

            }).
            error(function(data, status, headers, config) {
                console.log("Angular Http get failed");
                failure({httperr: "HTTP : error accessing the api"});
            });
        }
    }

}]);


/**
 * @ngdoc service
 * @name clientAngularApp.service.StateManager
 * @description
 * Service used to maintain an overall state of the mapping application so it can be accessed between directives
 * and the map controller, states are ;
 *    0 -> System has no data stored internally (including no cached data)
 *    1 -> System is in search mode and ispladisplaying potential datasets
 *    2 -> System is displaying a heatmap
 */

app.service('StateManager', [function() {

    var SM = {
        SM_NODATA: 0,
        SM_SEARCING: 1,
        SM_HEATMAPPING: 2,
        SM_STATE: 0,
        SM_PIN_DROPCOUNT: 0,
          /**
          * @ngdoc method
          * @name setState
          * @methodOf clientAngularApp.service.StateManager
          * @description
          * set the system state via an integer 
          *
          * @param {Number} state - the state to set
          */
        setState: function(state) {
            SM.SM_STATE = state;
        },
          /**
          * @ngdoc method
          * @name getState
          * @methodOf clientAngularApp.service.StateManager
          * @description
          * get the system state as an integer 
          *
          * @return {Number} state
          */
        getState: function() {
            return SM.SM_STATE;
        },
        /**
          * @ngdoc method
          * @name setNODATA
          * @methodOf clientAngularApp.service.StateManager
          * @description
          * set the system state to NODATA
          *
          */
        setNODATA: function() {
            //console.log("setting State  : NODATA");
            SM.SM_STATE = SM.SM_NODATA;
        },
        /**
          * @ngdoc method
          * @name setHEATMAPPING
          * @methodOf clientAngularApp.service.StateManager
          * @description
          * set the system state to HEATMAPPING
          *
          */
        setHEATMAPPING: function() {
            //console.log("setting State  : HEATMAPPING");
            SM.SM_STATE = SM.SM_HEATMAPPING;
        },
          /**
          * @ngdoc method
          * @name setSEARCHING
          * @methodOf clientAngularApp.service.StateManager
          * @description
          * set the system state to SEARCHING
          *
          */
        setSEARCHING: function() {
            //console.log("setting State  : SEARCHING");
            SM.resetDROPCOUNT();
            SM.SM_STATE = SM.SM_SEARCHING;
        },
        /**
          * @ngdoc method
          * @name isSEARCHING
          * @methodOf clientAngularApp.service.StateManager
          * @description
          * determine if the system state is SEARCHING
          *
          * @return {Number} returns a boolean 0,1 representing the outcome 
          */
        isSEARCHING: function() {
            if (SM.SM_STATE == SM.SM_SEARCHING) {
                return 1;
            }

            return 0;
        },
        /**
          * @ngdoc method
          * @name isNODATA
          * @methodOf clientAngularApp.service.StateManager
          * @description
          * determine if the system state is NODATA
          *
          * @return {Number} returns a boolean 0,1 representing the outcome 
          */
        isNODATA: function() {
            if (SM.SM_STATE == SM.SM_NODATA) {
                return 1;
            }

            return 0;
        },
        /**
          * @ngdoc method
          * @name isHEATMAPPING
          * @methodOf clientAngularApp.service.StateManager
          * @description
          * determine if the system state is HEATMAPPING
          *
          * @return {Number} returns a boolean 0,1 representing the outcome 
          */
        isHEATMAPPING: function() {
            if (SM.SM_STATE == SM.SM_HEATMAPPING) {
                return 1;
            }

            return 0;
        },
        /**
          * @ngdoc method
          * @name getDROPCOUNT
          * @methodOf clientAngularApp.service.StateManager
          * @description
          * find out the number of times the marker has been dropped on this particular 
          * dataset, used for triggering UI elements
          *
          * @return {Number} the number of times the marker has been dropped 
          */
        getDROPCOUNT: function() {
            return SM.SM_PIN_DROPCOUNT;
        },
        /**
          * @ngdoc method
          * @name increaseDROPCOUNT
          * @methodOf clientAngularApp.service.StateManager
          * @description
          * Increase the dropcount, called when the user moves the marker to a new position
          *
          */
        increaseDROPCOUNT: function() {
            SM.SM_PIN_DROPCOUNT += 1;
        },
          /**
          * @ngdoc method
          * @name resetDROPCOUNT
          * @methodOf clientAngularApp.service.StateManager
          * @description
          * reset the dropcount to 0, called when a new dataset is loaded or the current is unloaded
          *
          */
        resetDROPCOUNT: function() {
            SM.SM_PIN_DROPCOUNT = 0;
        }

    }

    return SM;


}]);

/**
 * @ngdoc service
 * @name clientAngularApp.service.HeatmapHelper
 * @description
 * Service that stores data for the display of the heatmap on-screen. Includes the storage of;
 *    HEATMAPCACHE : stores normalised and raw data related to downloaded heatmaps so they do not have to be re downloaded
 *    rawReadings  : stores raw readings so they do hot have to be reloaded
 *    fulldataset  : stores normalised representation of rawReadings
 *    graphvisible : keeps track of visibility / interactability of the power vs channel graph
 * and the map controller
 */


app.service('HeatmapHelper', [function() {

    var HH = {
        HEATMAPCACHE: {},
        heatmap: {},
        DATASET: {},
        rawReadings: [],
        fulldataset: [],
        heatmapdatachannels: [],
        channelassignments: [],
        overallmax: 0,
        overallmin: 0,
        graphvisible: true,
        graphinfotext: "Find Dataset to View it's Data.",
          /**
          * @ngdoc method
          * @name cacheAndRemoveHeatmap
          * @methodOf clientAngularApp.service.HeatmapHelper
          * @description
          * take the heatmap that is currently being displayed and save it in a dictionary with its uniqe
          * id as a a key
          *
          */
        cacheAndRemoveHeatmap: function() {
            //$scope.DATASET.DatasetID
            HH.HEATMAPCACHE[HH.DATASET.DatasetID] = {
                Rawdata: HH.rawReadings,
                Normdata: HH.fulldataset,
                Channels: HH.heatmapdatachannels,
                ovmax: HH.overallmax,
                ovmin: HH.overallmin
            }
            HH.heatmap.setMap(null);
            //console.log("CLEARING FROM SERVICE");
        },
          /**
          * @ngdoc method
          * @name toggleGraphNodata
          * @methodOf clientAngularApp.service.HeatmapHelper
          * @description
          * depending on its current state show/hide the graph overlay as well as the 
          * sidebar overlays that block user interaction when no data is present
          *
          */
        toggleGraphNodata: function() {
            if (HH.graphvisible) {
                $(".graphnodata").fadeOut("fast");
                $(".sidebarnodata").fadeOut("fast");
                $("#channelsmapmover").fadeIn("fast");
            } else {
                $(".graphnodata").fadeIn("fast");
                $(".sidebarnodata").fadeIn("fast");
                $("#channelsmapmover").fadeOut("fast");
            }

            HH.graphvisible = !HH.graphvisible;
        },
          /**
          * @ngdoc method
          * @name toggleGraphNodata
          * @methodOf clientAngularApp.service.HeatmapHelper
          * @description
          * depending on the provided threshold consider all data points within each channel. calculate the percentage
          * of the channels within each band whose power is above this threshold (indicating occupied relative to threshold)
          *
          * @param {float} thresh - threshold to consider
          */
        calculatePercentageOccupancy: function(thresh) {
            var FPC = 0;
            var occupiedcount = 0;
            var PERCENTAGES = new Array();
            for (var channelid in HH.rawReadings) {
                FPC = HH.rawReadings[channelid].length
                for (var key in HH.rawReadings[channelid]) {
                    if (HH.rawReadings[channelid][key].CombinedPower > thresh) {
                        occupiedcount++;
                    }
                }
                PERCENTAGES.push({
                    cid: channelid,
                    PO: ((occupiedcount * 100) / FPC)
                });
                occupiedcount = 0;
            }

            return PERCENTAGES;
        }
    }

    return HH;


}]);

/**
 * @ngdoc service
 * @name clientAngularApp.service.CookieService
 * @description
 * Maintains the login and logout functions across the application. Manages the retrieval of cookie data
 * performs an initial check on creation to load cookie data if it is present
 */

app.service("CookieService", ['ipCookie', '$rootScope', function(ipCookie, $rootScope) {

    /**
    * @ngdoc method
    * @name storeUserData
    * @methodOf clientAngularApp.service.CookieService
    * @description
    * Upon successful login store the user data in a local cookie
    *
    * @param {JSON} usrdata - data returned from api call to /login
    */
    this.storeUserData = function(usrdata) {
        this.LoggedIn = true;
        // /console.log(JSON.stringify(usrdata));
        ipCookie("TVWS", usrdata)
    }
    /**
    * @ngdoc method
    * @name isLoggedIn
    * @methodOf clientAngularApp.service.CookieService
    * @description
    * Determine if a user is logged in by returning internal state variable that denotes this
    *
    * @return {boolean} returns a bool indicating the state
    */
    this.isLoggedIn = function() {
        return this.LoggedIn;
    }
    /**
    * @ngdoc method
    * @name setLoggedIn 
    * @methodOf clientAngularApp.service.CookieService
    * @description
    * method utilised on any re-access of the site, when the service is instantiated this method is used
    * to reinstate the local data from the cookie
    *
    */
    this.setLoggedIn = function() {
        this.LoggedIn = true;
        $rootScope.LoggedIn = true;
        $rootScope.ForeName = ipCookie("TVWS").ForeName;
        $rootScope.SurName = ipCookie("TVWS").Surname;
        $rootScope.UserID = ipCookie("TVWS").UserID;
    }
    /**
    * @ngdoc method
    * @name setLoggedOut
    * @methodOf clientAngularApp.service.CookieService
    * @description
    * clear the local data representing the user, called by the logout function
    *
    */
    this.setLoggedOut = function() {
        this.LoggedIn = false;
        $rootScope.LoggedIn = false;
        $rootScope.ForeName = null;
        $rootScope.SurName = null;
        $rootScope.UserID = -1;

    }
    /**
    * @ngdoc method
    * @name Logout
    * @methodOf clientAngularApp.service.CookieService
    * @description
    * clear the local cookie data representing the user and also remove in-app references to this data
    *
    */
    this.Logout = function() {
        ipCookie.remove("TVWS");
        this.setLoggedOut();
    }
    /**
    * @ngdoc method
    * @name getToken
    * @methodOf clientAngularApp.service.CookieService
    * @description
    * Get the unique token that was issued to the user at login from the internal application state
    *
    * @return {string} Issued token
    */
    this.getToken = function() {
        if (ipCookie("TVWS") === undefined)
            return null;
        return ipCookie("TVWS").Token;
    }


    this.setLoggedOut();

    if (ipCookie("TVWS") != undefined) {
        //no cookie exists for the user, which is ok
        //but the system is logged in
        this.setLoggedIn();

    }
}]);

/**
 * @ngdoc service
 * @name clientAngularApp.service.GraphHelper
 * @description
 * Maintains functions that relate to the operation of the main power vs channel graph.
 * contains all Highcharts configuration information for the graph as setting data
 */

app.service("GraphHelper", [function() {

    var GH = {
        chartConfig: {
            options: {
                chart: {
                    type: 'area',
                    zoomType: 'x',
                    backgroundColor: '#2F6EB2',
                    spacingTop: 40,
                    spacingRight: 30,
                    selectionMarkerFill: "RGBA(78, 191, 155, 0.5)"
                },
                exporting: {
                  enabled: true
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },
                legend: {
                    enabled: false,
                    itemStyle: {
                        "display": "none"
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
            xAxis: {
                gridLineColor: "#fff",
                labels: {
                    style: {
                        "color": "#fff"
                    }
                },
                title: {
                    style: {
                        "color": "#fff"
                    },
                    text: "TV Channel Number"
                }
            },
            yAxis: {
                gridLineColor: "#fff",
                labels: {
                    style: {
                        "color": "#fff"
                    }
                },
                title: {
                    style: {
                        "color": "#fff"
                    },
                    text: "Power (dBm)"
                },
                plotLines: [{
                    color: 'red', // Color value
                    dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                    value: 3, // Value of where the line will appear
                    width: 2 // Width of the line    
                }]

            },
            loading: false

        },
    /**
    * @ngdoc method
    * @name moveChartBandToChannel
    * @methodOf clientAngularApp.service.GraphHelper
    * @description
    * Move the band select indicator to the channel specified by the given ID
    *
    * @param {Number} channelID - s
    */
        moveChartBandToChannel: function(cid) {
            var bandat = GH.chartConfig.xAxis.categories.indexOf(parseInt(cid));

            if (GH.chartConfig.xAxis.plotBands == undefined) {
                GH.chartConfig.xAxis.plotBands = new Array();
                GH.chartConfig.xAxis.plotBands.push({
                    from: bandat - 0.5,
                    to: bandat + 0.5,
                    color: 'rgba(68, 170, 213, .2)'
                });
            } else {
                GH.chartConfig.xAxis.plotBands[0].from = bandat - 0.5;
                GH.chartConfig.xAxis.plotBands[0].to = bandat + 0.5;
            }
        },
      /**
      * @ngdoc method
      * @name getCategories
      * @methodOf clientAngularApp.service.GraphHelper
      * @description
      * Move the band select indicator to the channel specified by the given ID
      *
      * @return {Number[]} channelID's
      */
        getCategories: function() {
            return GH.chartConfig.xAxis.categories;
        },
        clearGraph: function() {
            //console.log("should clear graph");
            delete GH.chartConfig.xAxis.categories;
            GH.chartConfig.series = [];
        },
        setSeriesData: function(CategoryData) {
            //console.log(GH.chartConfig);
            GH.chartConfig.series = new Array();
            GH.chartConfig.series[0] = new Object();
            GH.chartConfig.series[0].data = CategoryData;
            GH.chartConfig.series[0].color = "#fff";
            GH.chartConfig.series[0].name = "Power"
            GH.chartConfig.loading = false;

        },
        setCategories: function(catdata) {
            GH.chartConfig.xAxis.categories = catdata;
        },
        setThresholdLine: function(val) {
            GH.chartConfig.yAxis.plotLines[0].value = val;
        }

    }

    return GH;

}]);


/**
 * @ngdoc service
 * @name clientAngularApp.service.SidebarHelper
 * @description
 * Service that ties together sidebar directive functionality and main controller functionality
 * includes all aspects of sidebar including its internal displayed data and control of the HighCharts
 * instance that represtents the occupancy pie chart. 
 */

app.service('SidebarHelper', ['MeasureSpaceAPIService', 'StateManager', "HeatmapHelper", "GraphHelper", 'notify', function(MeasureSpaceAPIService, StateManager, HeatmapHelper, GraphHelper, notify) {

    var svc = {
        MAP: {},
        MAPVIEW: {},
        utility: {},
        OVERLAYS: [],
        PIECHART: {},
        PERCENTOCCUPIED: 0,

        sidebarChartConfig: {
            chart: {
                renderTo: 'piechart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                backgroundColor: '',
                colors: ['#000', '#fff']
            },
            exporting: {
              enabled: false
                
              },
            colors: ['#e74c3c', '#2ecc71'],
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                    ['FreeChannels', 1],
                    ['OccupiedChannels', 8]
                ]
            }]
        },
        FreeChannels: [],
      /**
      * @ngdoc method
      * @name setMap
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * Set the internal map object so it is accessible across the view
      *
      * @param {Object} mapobj - the map object to pass
      */
        setMap: function(mapobj) {
            this.MAP = mapobj;
        },
      /**
      * @ngdoc method
      * @name getMap
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * Get the internal map object so it is accessible across the view
      *
      * @return {Object} mapobj - the map object inside the Helper
      */
        getMap: function() {
            return this.MAP;
        },
      /**
      * @ngdoc method
      * @name setMapView
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * Set the internal mapView object so it is accessible across the view
      *
      * @param {Object} mapv - the map view to set
      */
        setMapView: function(mapv) {
            this.MAPVIEW = mapv;
        },
      /**
      * @ngdoc method
      * @name getMapView
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * Get the internal mapView object
      *
      * @return {Object} mapv - the map view internally
      */
        getMapView: function() {
            return this.MAPVIEW;
        },
      /**
      * @ngdoc method
      * @name showDatasetsNear
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * Show datasets near the current location, if already displaying aheatmap then this
      * function uses the heatmap helper to cache it
      *
      */
        showDatasetsNear: function() {
            if (StateManager.isHEATMAPPING()) {
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
      /**
      * @ngdoc method
      * @name drawDatasetMarkers
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * From API response draw the overlays that represent the datasets that resulted from a geo
      * based search
      *
      * @param {Object} data - the return value from the API service
      */
        drawDatasetMarkers: function(data) {
            //console.log(svc.MAP);
            for (var dskey in data) {
                var overlay = new CustomMarker(
                    new google.maps.LatLng(data[dskey].Lat, data[dskey].Lon),
                    svc.MAP, {
                        dataset: data[dskey]
                    }
                );

                svc.OVERLAYS.push(overlay);
            }

        },
      /**
      * @ngdoc method
      * @name failedDrawing
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * Function to deal with the failure of drawing datasets to the map, following an API screen
      *
      * @param {Object} errdata - the return value from the API service
      */
        failedDrawing: function(errdata) {
            console.log("ERROR : Failed To Draw Heatmaps");
            console.log(errdata);
            if(errdata.httperr != undefined)
            {
              notify("Could not contact the API : " + errdata.httperr)
              return
            }
            notify("Could not contact the API : " + errdata.QueryError)
        },
      /**
      * @ngdoc method
      * @name showOverlays
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * iterate through the local markers and display them on the map instance
      *
      */
        showOverlays: function() {
            for (var ok in svc.OVERLAYS) {
                svc.OVERLAYS[ok].setMap(svc.MAP);
            }
        },
      /**
      * @ngdoc method
      * @name clearOverlays
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * iterate through the local markers and clear them from the map instance
      *
      */
        clearOverlays: function() {
            for (var ok in svc.OVERLAYS) {
                svc.OVERLAYS[ok].setMap(null);
            }
        },
      /**
      * @ngdoc method
      * @name deleteOverlays
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * iterate through the local markers and clear them completley from the array 
      */
        deleteOverlays: function() {
            svc.clearOverlays();
            svc.OVERLAYS = [];
        },
      /**
      * @ngdoc method
      * @name setFreeChannels
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * Set the internal state of free channels, so they can be drawn to the sidebar
      *
      * @param {Number[]} FreeChannels - the array of free channel values
      */
        setFreeChannels: function(FC) {
            svc.FreeChannels = FC;
        },
      /**
      * @ngdoc method
      * @name determineFreeChannels
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * Using the supplied threshold determine which channels can be considred as "free" i.e. below the threshold
      *
      * @param {Number} threshold - the current threshold as specified by the user (slider)
      * @param {Number} nearpointindex - index within the readings of the current observed point
      */
        determineFreeChannels: function(threshold, nearpointindex) {
            var free = new Array();
            for (var channelID in HeatmapHelper.rawReadings) {
                if (HeatmapHelper.rawReadings[channelID][nearpointindex].CombinedPower < threshold) {
                    free.push(channelID);
                }
            }
            var fullfree = new Array();
            for (var freechannelID in free) {
                for (var idx in HeatmapHelper.channelassignments) {
                    if (HeatmapHelper.channelassignments[idx].ChannelID == free[freechannelID]) {
                        fullfree.push(HeatmapHelper.channelassignments[idx]);
                    }
                }
            }

            svc.setFreeChannels(fullfree);
            return svc.FreeChannels;
            //update pie chart
            //svc.updateFreeChannelChart(fullfree, DC);
        },
      /**
      * @ngdoc method
      * @name clearFreeChannels
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * clear the local represenation of the free channels as determined by the threshold slider
      *
      */
        clearFreeChannels: function() {
            svc.FreeChannels = [];
        },
      /**
      * @ngdoc method
      * @name UpdateOccupancy
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * Set the pie chart in the sidebar to display the information regarding occupancy in the observed channel
      *
      * @param {Number} threshold - the current threshold as specified by the user (slider)
      * @param {Number} CurrentDisplayChannel - Channel being observed
      */
        UpdateOccupancy: function(threshold, CurrentDisplayChannel) {
            var percentages = HeatmapHelper.calculatePercentageOccupancy(threshold);
            for (var arrkey in percentages) {
                if (percentages[arrkey].cid == CurrentDisplayChannel) {
                    svc.updatePieChart(percentages[arrkey].PO, 100 - percentages[arrkey].PO);
                    break;
                }
            }


        },

    /**
      * @ngdoc method
      * @name updatePieChart
      * @methodOf clientAngularApp.service.SidebarHelper
      * @description
      * Set the pie chart data struture to the information regarding occupancy in the observed channel
      *
      * @param {Number} positive - percentage positive
      * @param {Number} negative - percentage negative
      */
        updatePieChart: function(positive, negative) {
            svc.PERCENTOCCUPIED = positive;
            svc.PIECHART.series[0].setData([]);
            svc.PIECHART.series[0].setData([
                ['FreeChannels', positive],
                ['OccupiedChannels', negative]
            ]);

        }


    }

    return svc;

}]);