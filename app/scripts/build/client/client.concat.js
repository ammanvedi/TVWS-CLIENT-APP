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
    'angularMoment'
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
      .otherwise({
        redirectTo: '/'

      });
  });
;var app = angular.module('clientAngularApp');

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
                console.log("Angular Http get failed");
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
                console.log("Angular Http get failed");
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

                if (data.QueryError) {
                    failure(data);
                    return;
                }
                data.DatasetID = parseInt(dsid);
                //console.log(JSON.stringify(data));
                complete(data);

            }).
            error(function(data, status, headers, config) {
                console.log("Angular Http get failed");
                failure(data);
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
                failure(data);
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
                failure(data);
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
                    text: "ITU Channel"
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

app.service('SidebarHelper', ['MeasureSpaceAPIService', 'StateManager', "HeatmapHelper", "GraphHelper", function(MeasureSpaceAPIService, StateManager, HeatmapHelper, GraphHelper) {

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

}]);;var app = angular.module('clientAngularApp');




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
;function CustomMarker(latlng, map, args) {
	this.latlng = latlng;
	this.args = args;
	this.setMap(map);
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.getArgs = function() {
  return this.args;
}

CustomMarker.prototype.draw = function() {

	var self = this;

	var div = this.div;

	if (!div) {

		div = this.div = document.createElement('div');

		div.className = 'marker';

		div.style.position = 'absolute';
		div.style.cursor = 'pointer';
    	div.innerHTML = this.args.dataset.StartTime;
		if (typeof(self.args.marker_id) !== 'undefined') {
			div.dataset.marker_id = self.args.marker_id;
		}

		google.maps.event.addDomListener(div, "click", function(event) {
			console.log("original event is ");
			console.log(event);
			google.maps.event.trigger(self.map, "markerclick", {
                                      latLng: new google.maps.LatLng(0, 0),
                                      arg:self.args
                                        });
		});

		google.maps.event.addDomListener(div, "mouseenter", function(event) {
			//console.log("original hover evt is ");
			//console.log(event);
			google.maps.event.trigger(self.map, "markerhover", {
                                      latLng: new google.maps.LatLng(0, 0),
                                      arg:self.args,
                                      evt:event
                                        });
			event.stopPropagation();
		});

		google.maps.event.addDomListener(div, "mouseleave", function(event) {
			//console.log("mouse out ");
			//console.log(event);
			google.maps.event.trigger(self.map, "markerhoverexit", {
                                      latLng: new google.maps.LatLng(0, 0),
                                      arg:self.args,
                                      evt:event
                                        });
			event.stopPropagation();
		});


		var panes = this.getPanes();
		console.log("panes");
		console.log(panes);
		panes.overlayMouseTarget.appendChild(div);
	}

	var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

	if (point) {
		div.style.left = point.x + 'px';
		div.style.top = point.y + 'px';
	}
};

CustomMarker.prototype.remove = function() {
	if (this.div) {
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}
};

CustomMarker.prototype.getPosition = function() {
	return this.latlng;
};
;'use strict';

/**
 * @ngdoc controller
 * @name clientAngularApp.controller.HomeCtrl
 * @description
 * Controller to mediate the display of the homepage
 */
angular.module('clientAngularApp')
  .controller('HomeCtrl', ['CookieService',function (CookieService) {

  }]);
;

/**
 * @ngdoc controller
 * @name clientAngularApp.controller.APICtrl
 * @description
 * Controller to mediate display of the API Documentation
 */


angular.module('clientAngularApp')
  .controller('APICtrl', ['$rootScope', '$scope','MeasureSpaceAPIService', function ($rootScope, $scope, MeasureSpaceAPIService) {
console.log($scope);


	$scope.apidata= {
  "Endpoints": {
    "Channels": {
      "/near": {
        "parameters": {
          "Longitude": {
            "name": "Lng",
            "datatype": "FLOAT",
            "example": "-1.434343"
          },
          "Latitude": {
            "name": "Lat",
            "datatype": "FLOAT",
            "example": "51.00005"
          }
        },
        "AcceptEncoding": "url-form-encoded",
        "Method": "GET",
        "Description": "Get the ITU channel assignments for a specific region. This information is compiled based on ITU channel regions and may not be fully accurate to small regions, but this is something we are working on.",
        "ResponseDescription": "Returns an array of the channels, including its frequency range, its internal ID and its ITU channel number",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "[\n  {\n    \"ChannelNumber\": 21,\n    \"LowEnd\": 471.25,\n    \"ChannelID\": 10,\n    \"UpEnd\": 476.75\n  },\n  {\n    \"ChannelNumber\": 22,\n    \"LowEnd\": 479.25,\n    \"ChannelID\": 11,\n    \"UpEnd\": 484.75\n  },\n  {\n    \"ChannelNumber\": 23,\n    \"LowEnd\": 487.25,\n    \"ChannelID\": 12,\n    \"UpEnd\": 492.75\n  },...",
        "ExampleQuery": "https://api.measurespace.io/channels/near/-0.189099270827/51.5344744155",
        "ExampleQueryBody": "NA",
        "Endpoint": "/channels/near/:Lng/:Lat"
      }
    },
    "User": {
      "/datasets": {
        "parameters": {
          "UserID": {
            "name": "UserID",
            "datatype": "INT",
            "example": "1"
          }
        },
        "AcceptEncoding": "url-form-encoded",
        "Method": "GET",
        "Description": "Get the datasets that realte to a user via their id",
        "ResponseDescription": "Returns a JSON array containing all the datasets that have been uploaded by the user specified by ID",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "[\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829782\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 60\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1427315026\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 89\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425315989\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 57\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829783\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 61\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425830307\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 62\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425830379\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 63\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425831273\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 64\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425831320\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 65\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426182434\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 70\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426445442\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 2,\n    \"PointCount\": 284,\n    \"DatasetID\": 72\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829721\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 59\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426512816\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 2,\n    \"PointCount\": 284,\n    \"DatasetID\": 74\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1427314770\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 84\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940123\",\n    \"Created\": \"1427313667\",\n    \"Lat\": 51.5104183412,\n    \"Lon\": -0.156444146492,\n    \"EndTime\": \"1423954433\",\n    \"UserID\": -1,\n    \"PointCount\": 289,\n    \"DatasetID\": 82\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940123\",\n    \"Created\": \"1427314919\",\n    \"Lat\": 51.5104183412,\n    \"Lon\": -0.156444146492,\n    \"EndTime\": \"1423954433\",\n    \"UserID\": 1,\n    \"PointCount\": 289,\n    \"DatasetID\": 87\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940672\",\n    \"Created\": \"1427313245\",\n    \"Lat\": 51.5096982,\n    \"Lon\": -0.1347394,\n    \"EndTime\": \"1423943487\",\n    \"UserID\": -1,\n    \"PointCount\": 44,\n    \"DatasetID\": 80\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940672\",\n    \"Created\": \"1426512901\",\n    \"Lat\": 51.5096982,\n    \"Lon\": -0.1347394,\n    \"EndTime\": \"1423943487\",\n    \"UserID\": 2,\n    \"PointCount\": 44,\n    \"DatasetID\": 76\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1427315157\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 1,\n    \"PointCount\": 34,\n    \"DatasetID\": 90\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1426512563\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 2,\n    \"PointCount\": 34,\n    \"DatasetID\": 73\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1427314784\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 1,\n    \"PointCount\": 34,\n    \"DatasetID\": 85\n  }\n]",
        "ExampleQuery": "https://api.measurespace.io/datasets/user/1/datasets",
        "ExampleQueryBody": "NA",
        "Endpoint": "/user/:UserID/datasets"
      }
    },
    "Datasets": {
      "/near": {
        "parameters": {
          "Longitude": {
            "name": "Lng",
            "datatype": "FLOAT",
            "example": "-1.434343"
          },
          "Latitude": {
            "name": "Lat",
            "datatype": "FLOAT",
            "example": "51.00005"
          }
        },
        "AcceptEncoding": "url-form-encoded",
        "Method": "GET",
        "Description": "Get the datasets that are near a geographical region, radius of 1000m , this will be customisable in future api versions",
        "ResponseDescription": "Returns a JSON array containing all the datasets that are within the search region, and a QueryError otherwise",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "[\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829782\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 60\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1427315026\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 89\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425315989\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 57\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829783\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 61\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425830307\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 62\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425830379\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 63\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425831273\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 64\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425831320\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 65\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426182434\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 70\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426445442\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 2,\n    \"PointCount\": 284,\n    \"DatasetID\": 72\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829721\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 59\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426512816\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 2,\n    \"PointCount\": 284,\n    \"DatasetID\": 74\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1427314770\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 84\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940123\",\n    \"Created\": \"1427313667\",\n    \"Lat\": 51.5104183412,\n    \"Lon\": -0.156444146492,\n    \"EndTime\": \"1423954433\",\n    \"UserID\": -1,\n    \"PointCount\": 289,\n    \"DatasetID\": 82\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940123\",\n    \"Created\": \"1427314919\",\n    \"Lat\": 51.5104183412,\n    \"Lon\": -0.156444146492,\n    \"EndTime\": \"1423954433\",\n    \"UserID\": 1,\n    \"PointCount\": 289,\n    \"DatasetID\": 87\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940672\",\n    \"Created\": \"1427313245\",\n    \"Lat\": 51.5096982,\n    \"Lon\": -0.1347394,\n    \"EndTime\": \"1423943487\",\n    \"UserID\": -1,\n    \"PointCount\": 44,\n    \"DatasetID\": 80\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940672\",\n    \"Created\": \"1426512901\",\n    \"Lat\": 51.5096982,\n    \"Lon\": -0.1347394,\n    \"EndTime\": \"1423943487\",\n    \"UserID\": 2,\n    \"PointCount\": 44,\n    \"DatasetID\": 76\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1427315157\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 1,\n    \"PointCount\": 34,\n    \"DatasetID\": 90\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1426512563\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 2,\n    \"PointCount\": 34,\n    \"DatasetID\": 73\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1427314784\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 1,\n    \"PointCount\": 34,\n    \"DatasetID\": 85\n  }\n]",
        "ExampleQuery": "https://api.measurespace.io/datasets/near/-0.189099270827/51.5344744155",
        "ExampleQueryBody": "NA",
        "Endpoint": "/datasets/near/:Lng/:Lat"
      },
      "/readings": {
        "parameters": {
          "DatasetID": {
            "name": "DatasetID",
            "datatype": "INT",
            "example": "65"
          }
        },
        "AcceptEncoding": "url-form-encoded",
        "Method": "GET",
        "Description": "Get all the readings that relate to a specific dataset by its ID",
        "ResponseDescription": "Returns a JSON object containing the Dataset readings",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "{\n  \"14\": [\n    {\n      \"Lat\": 51.5344744155,\n      \"Timestamp\": \"1425321920\",\n      \"Lon\": -0.189099270827,\n      \"CombinedPower\": -64\n    },\n    {\n      \"Lat\": 51.501254082,\n      \"Timestamp\": \"1425316288\",\n      \"Lon\": -0.129792259269,\n      \"CombinedPower\": -65\n    },\n    {\n      \"Lat\": 51.5048360566,\n      \"Timestamp\": \"1425316616\",\n      \"Lon\": -0.152592287107,\n      \"CombinedPower\": -62\n    },\n    {\n      \"Lat\": 51.520158256,\n      \"Timestamp\": \"1425326370\",\n      \"Lon\": -0.169350042549,\n      \"CombinedPower\": -68\n    },\n    {\n      \"Lat\": 51.5030787,\n      \"Timestamp\": \"1425317965\",\n      \"Lon\": -0.1520732,\n      \"CombinedPower\": -66\n    },...",
        "ExampleQuery": "https://api.measurespace.io:8080/datasets/65/readings",
        "ExampleQueryBody": "NA",
        "Endpoint": "/datasets/:DatasetID/readings"
      },
      "/meta": {
        "parameters": {
          "DatasetID": {
            "name": "DatasetID",
            "datatype": "INT",
            "example": "65"
          }
        },
        "AcceptEncoding": "url-form-encoded",
        "Method": "GET",
        "Description": "Get the metadat for a given dataset using its unique ID",
        "ResponseDescription": "Returns a JSON object containing the Dataset metadata",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "{\n  \"ChannelCount\": 12,\n  \"StartTime\": \"1425315398\",\n  \"Created\": \"1425831320\",\n  \"Lat\": 51.5203243904,\n  \"Lon\": -0.170329774411,\n  \"EndTime\": \"1425329858\",\n  \"UserID\": 0,\n  \"PointCount\": 284\n}",
        "ExampleQuery": "https://api.measurespace.io:8080/datasets/65/meta",
        "ExampleQueryBody": "NA",
        "Endpoint": "/datasets/:DatasetID/meta"
      }
    },
    "Uploading": {
      "/track": {
        "parameters": {
          "TrackingID": {
            "name": "TrackID",
            "datatype": "FLOAT",
            "example": "10101.10"
          }
        },
        "AcceptEncoding": "multipart/form-data",
        "Method": "GET",
        "Description": "Use this endpoint to track the progress of the upload you have submitted. The Token returned to you by the upload endpoint should be retained so you can update the user of progress. If the job completes successfully, then you can use the returned DatasetID to access the measurements either through the api or through the online visualisation.",
        "ResponseDescription": "Returns a JSON object representing the status of the job. While the job is returning a status of Completed: 0 and Error: null it is still processing.",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "{Completed: 0, \\n CompletedOn: null, \\n DatasetID: null, \\n Error: null, \\n Message: null, \\n StartedOn: \"1427323495\"}",
        "ExampleQuery": "https://api.measurespace.io:8080/upload/track/2323221.00",
        "ExampleQueryBody": "NA",
        "Endpoint": "/upload/track/:TrackID"
      },
      "/upload": {
        "parameters": {
          "UserID": {
            "name": "UID",
            "datatype": "INT",
            "example": "1"
          }
        },
        "AcceptEncoding": "multipart/form-data",
        "Method": "POST",
        "Description": "Upload readings as JSON files, This is a special case endpoint that uses a specific server port, this will be rectified in the future.",
        "ResponseDescription": "Returns a trackingid that can be used to poll the api as to the status of the upload. Use the /measurements/track endpoint. Jobs are processed in a queue and polling is reccommended no more than once per 2 seconds.",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "{trackingid: \"1427323495.5\"}",
        "ExampleQuery": "https://api.measurespace.io:8080/upload",
        "ExampleQueryBody": "NA",
        "Endpoint": "/upload"
      }
    }
  },
  "Begin": {
    "Accepted Upload Formats": {
      "a": {
        "Text": "Accepted Upload Formats",
        "Type": "Heading"
      },
      "b": {
        "Text": "Below is an illustration of the accepted format for readings upload",
        "Type": "Body"
      },
      "c": {
        "Type": "Code",
        "Text": "{\n  \"Getting Started\": {\n    \"Accepted Upload Formats\": {\n      \"TEXTITEM\": {\n        \"Text\": \"Accepted Upload Formats\",\n        \"Type\": \"Heading\"\n      },\n      \"TEXTITEM 2\": {\n        \"Text\": \"Below is an illustration of the accepted format for readings upload\",\n        \"Type\": \"Body\"\n      },\n      \"TEXTITEM 2 2\": {\n        \"Type\": \"Code\"\n      }\n    },\n    \"Architechture\": {\n      \n    },\n    \"Error Responses\": {\n      \n    }\n"
      }
    },
    "Architechture": {
      "a": {
        "Text": "Accepted Upload Formats",
        "Type": "Heading"
      },
      "b": {
        "Text": "Below is an illustration of the accepted format for readings upload",
        "Type": "Body"
      },
      "c": {
        "Type": "Code",
        "Text": "{\n  \"Getting Started\": {\n    \"Accepted Upload Formats\": {\n      \"TEXTITEM\": {\n        \"Text\": \"Accepted Upload Formats\",\n        \"Type\": \"Heading\"\n      },\n      \"TEXTITEM 2\": {\n        \"Text\": \"Below is an illustration of the accepted format for readings upload\",\n        \"Type\": \"Body\"\n      },\n      \"TEXTITEM 2 2\": {\n        \"Type\": \"Code\"\n      }\n    },\n    \"Architechture\": {\n      \n    },\n    \"Error Responses\": {\n      \n    }\n"
      }
    },
    "Error Responses": {
      "a": {
        "Text": "Accepted Upload Formats",
        "Type": "Heading"
      },
      "b": {
        "Text": "Below is an illustration of the accepted format for readings upload",
        "Type": "Body"
      },
      "c": {
        "Type": "Code",
        "Text": "{\n  \"Getting Started\": {\n    \"Accepted Upload Formats\": {\n      \"TEXTITEM\": {\n        \"Text\": \"Accepted Upload Formats\",\n        \"Type\": \"Heading\"\n      },\n      \"TEXTITEM 2\": {\n        \"Text\": \"Below is an illustration of the accepted format for readings upload\",\n        \"Type\": \"Body\"\n      },\n      \"TEXTITEM 2 2\": {\n        \"Type\": \"Code\"\n      }\n    },\n    \"Architechture\": {\n      \n    },\n    \"Error Responses\": {\n      \n    }\n"
      }
    }
  }
}

  }]);
;'use strict';

/**
 * @ngdoc controller
 * @name clientAngularApp.controller.LogoutCtrl
 * @description
 * Controller to mediate the logout operation and redirect user to the homepage
 */
angular.module('clientAngularApp')
  .controller('LogoutCtrl', [ '$scope','MeasureSpaceAPIService', 'CookieService', '$location',function ($scope, MeasureSpaceAPIService, CookieService, $location) {

  	CookieService.Logout();
  	$location.path("/");

  }]);
;/**
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


    }]);;
/**
 * @ngdoc controller
 * @name clientAngularApp.controller.RegisterCtrl
 * @description
 * Controller to mediate creation of user accounts and login to existing accounts
 */
angular.module('clientAngularApp')
  .controller('RegisterCtrl', ['$location', '$rootScope', '$scope','MeasureSpaceAPIService', 'CookieService' ,function ($location, $rootScope, $scope, MeasureSpaceAPIService, CookieService) {




  	$scope.loginUser = function()
  	{
  		MeasureSpaceAPIService.loginUser( $('input[name="uname"]').val(),
                                        $('input[name="loginpass"]').val(),
                                        $scope.successLogin,
                                        $scope.failedLogin
                                      );
  	}

    $scope.failedLogin = function(data)
    {
      console.log("failure");
      console.log(data);
    }

    $scope.successLogin = function(data)
    {
      console.log("success");
      console.log(data);
      CookieService.storeUserData(data);
      CookieService.setLoggedIn();
      console.log("from cookie");
      console.log("login status : " + CookieService.LoggedIn);
      console.log(CookieService.getToken());
      $location.path("/me");
    }

  	$scope.registerUser = function()
  	{
  		console.log("HAHHA");
  		if(!$scope.validateform(
			 				$('input[name="email"]').val(),
							$('input[name="password"]').val(),
							$('input[name="passwordverify"]').val(),
							$('input[name="fname"]').val(),
							$('input[name="sname"]').val()
  							))
  		{
  			  		MeasureSpaceAPIService.registerUser(
  											$('input[name="email"]').val(),
  											$('input[name="password"]').val(),
  											$('input[name="fname"]').val(),
  											$('input[name="sname"]').val(), 
  											$scope.successregistration,
  											$scope.failedregistration
  											);
  		}



  	}

  	$scope.validateform = function(email, pass1, pass2, fname, sname)
  	{

  		var error_detected = false;

  		$('.inputTooltip').css('opacity', '0.0');

  		if(pass1 != pass2)
  		{
  			//passwords do not match
  			$('#passwordverify').addClass("error");
  			$('#passwordverifyerr').css('opacity', '1.0');
  			error_detected = true;
  		}else
  		{
  			$('#passwordverify').removeClass("error");
  		}

  		if(!new RegExp("^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\.\\w{2,3})+$").test(email))
  		{
  			//email failed
  			$('#email').addClass("error");
  			$('#emailerr').css('opacity', '1.0');
  			error_detected = true;
  		}else
  		{
  			$('#email').removeClass("error");
  		}

  		if(new RegExp("^([\\w]*\\s[\\w]*)+$").test(fname) || (fname == ""))
  		{
  			$('#fname').addClass("error");
  			$('#fnameerr').css('opacity', '1.0');
  			error_detected = true;
  		}else
  		{
  			$('#fname').removeClass("error");
  		}

  		if(new RegExp("^([\\w]*\\s[\\w]*)+$").test(sname) || (sname == ""))
  		{
  			$('#sname').addClass("error");
  			$('#snameerr').css('opacity', '1.0');
  			error_detected = true;
  		}else
  		{
  			$('#sname').removeClass("error");
  		}

  		if(!(new RegExp("^[^\\s]+$").test(pass1)) || (pass1 == ""))
  		{
  			$('#password').addClass("error");
  			$('#passworderr').css('opacity', '1.0');
  			error_detected = true;
  		}else
  		{
  			$('#password').removeClass("error");
  		}

  		return error_detected;
  	}

  	$scope.failedregistration = function(data)
  	{
  		console.log(data);

  	}

  	$scope.successregistration = function(data)
  	{
  		console.log(data);
  		
  		//allow user to log in
  		//hide the sign up box
  		$(".signupbox").css("width", "0px");
  		$(".signupbox").css("opacity", "0");
  		$(".vertdivider").css("opacity", "0");
  		
  	}

  }]);;'use strict';

/**
 * @ngdoc controller
 * @name clientAngularApp.controller.UploadCtrl
 * @description
 * Controller to mediate display of the Upload page
 */
angular.module('clientAngularApp')
  .controller('UploadCtrl', ['$rootScope', '$upload', '$scope','MeasureSpaceAPIService', 'CookieService',function ($rootScope, $upload, $scope, MeasureSpaceAPIService, CookieService) {

  }]);
;/**
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
