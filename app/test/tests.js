describe('SidebarHelper', function () {

  var SidebarHelper;
  beforeEach(module('clientAngularApp'));
  beforeEach(inject(function (_SidebarHelper_) {
    SidebarHelper = _SidebarHelper_;
  }));

  describe('Constructor', function () {

    it('initialises map to empty', function () {
      expect(SidebarHelper.map).to.be.empty;
    });

    it('Set a map instance', function () {

        var mapProp = {
            center:new google.maps.LatLng(51.508742,-0.120850),
            zoom:5,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };
        var map=new google.maps.Map(document.createElement("div"),mapProp);


        SidebarHelper.setMap(map);
        expect(SidebarHelper.MAP).to.not.be.empty;
    });

    it('Draws Dataset Markers', function () {
        var mapProp = {
            center:new google.maps.LatLng(51.508742,-0.120850),
            zoom:5,
            mapTypeId:google.maps.MapTypeId.ROADMAP
          };
        var map=new google.maps.Map(document.createElement("div"),mapProp);
      SidebarHelper.setMap(map);
      SidebarHelper.drawDatasetMarkers(JSON.parse('[{"Created":"1427894060","UserID":-1,"Lon":-0.152327002244,"EndTime":"1427816154","HF":500,"DatasetID":93,"LF":550,"ChannelCount":6,"PointCount":284,"StartTime":"1427801694","Lat":51.5045164665},{"Created":"1427894989","UserID":-1,"Lon":-0.152327002244,"EndTime":"1427816154","HF":500,"DatasetID":94,"LF":550,"ChannelCount":6,"PointCount":284,"StartTime":"1427801694","Lat":51.5045164665}]'));
      expect(SidebarHelper.OVERLAYS.length).to.equal(2);
    });

    it('deletes overlays', function () {
      SidebarHelper.deleteOverlays();
      expect(SidebarHelper.OVERLAYS).to.be.empty;
    });

  });

});

describe('CookieService', function () {

  var CookieService;
  beforeEach(module('clientAngularApp'));
  beforeEach(inject(function (_CookieService_) {
    CookieService = _CookieService_;
  }));

  describe('Constructor', function () {

    it('initialises to logged out', function () {
      expect(CookieService.isLoggedIn()).to.equal(false);
    });

    it('stores userdata in a cookie', function () {
      CookieService.storeUserData(JSON.parse('{"Surname":"Vedi","Token":"c5f0b8f0-c8cd-11e4-88be-04013fa73901","UserID":1,"Email":"amman.vedi@gmail.com","ForeName":"Amman"}'))
      expect(CookieService.isLoggedIn()).to.equal(true);
      expect(CookieService.getToken()).to.not.be.null;
    });


    it('clear user data on logout', function () {
      CookieService.Logout()
      expect(CookieService.isLoggedIn()).to.equal(false);
      expect(CookieService.getToken()).to.be.null;
    });


  });

});


describe('StateManager', function () {

  var StateManager;

  beforeEach(module('clientAngularApp'));
  beforeEach(inject(function (_StateManager_) {
    StateManager = _StateManager_;
  }));

  describe('Constructor', function () {

    it('initialises to correct state', function () {
      expect(StateManager.isNODATA()).to.equal(1);
      expect(StateManager.isSEARCHING()).to.equal(0);
      expect(StateManager.isHEATMAPPING()).to.equal(0);
    });

    it('augments the state when requested', function () {
      StateManager.setNODATA();
      expect(StateManager.isNODATA()).to.equal(1);
      StateManager.setSEARCHING();
      expect(StateManager.isSEARCHING()).to.equal(1);
      StateManager.setHEATMAPPING();
      expect(StateManager.isHEATMAPPING()).to.equal(1);
    });


  });

});

describe('HeatmapHelper', function () {

  var HeatmapHelper;

  var rawread = { "14": [ { "Lat": 51.5333647178, "Timestamp": "1427808189", "Lon": -0.187626731782, "CombinedPower": -66 }, { "Lat": 51.5275868654, "Timestamp": "1427812202", "Lon": -0.17940670351, "CombinedPower": -66 } ], "15": [ { "Lat": 51.5333647178, "Timestamp": "1427808189", "Lon": -0.187626731782, "CombinedPower": -66 }, { "Lat": 51.5275868654, "Timestamp": "1427812202", "Lon": -0.17940670351, "CombinedPower": -64 } ], "16": [ { "Lat": 51.5333647178, "Timestamp": "1427808189", "Lon": -0.187626731782, "CombinedPower": -65 }, { "Lat": 51.5275868654, "Timestamp": "1427812202", "Lon": -0.17940670351, "CombinedPower": -65 } ]}
  var dc = ["14","15","16"];
  var full = { "14": [ { "location": { "k": 51.5333647178, "D": -0.1876267317819611 }, "weight": 0.32786885245901637 }, { "location": { "k": 51.5275868654, "D": -0.17940670351003973 }, "weight": 0.32786885245901637 } ], "15": [ { "location": { "k": 51.5333647178, "D": -0.1876267317819611 }, "weight": 0.5 }, { "location": { "k": 51.5275868654, "D": -0.17940670351003973 }, "weight": 0.8333333333333334 } ], "16": [ { "location": { "k": 51.5333647178, "D": -0.1876267317819611 }, "weight": 0.6666666666666666 }, { "location": { "k": 51.5275868654, "D": -0.17940670351003973 }, "weight": 0.6666666666666666 } ]};


  beforeEach(module('clientAngularApp'));
  beforeEach(inject(function (_HeatmapHelper_) {
    HeatmapHelper = _HeatmapHelper_;
  }));

  describe('Constructor', function () {

    it('calculates a percentage', function () {
      HeatmapHelper.rawReadings = rawread;
      HeatmapHelper.fulldataset = full;
      HeatmapHelper.heatmapdatachannels = dc;
      var res = HeatmapHelper.calculatePercentageOccupancy(-66)
      expect(res[0].PO).to.equal(0);
      expect(res[1].PO).to.equal(50);
      expect(res[2].PO).to.equal(100);
    });

    it('defaults graph to visible', function () {
      expect(HeatmapHelper.graphvisible).to.equal(true);
    });

    it('hides graph', function () {
      expect(HeatmapHelper.graphvisible).to.equal(true);
      HeatmapHelper.toggleGraphNodata();
      expect(HeatmapHelper.graphvisible).to.equal(false);
    });
  });

});

describe('MapCtrl : preloaded map', function() {
    var scope, $location, createController, MS, CS, SH, SM, HH, GH, $controller;
    var full = { "14": [ { "location": { "k": 51.5333647178, "D": -0.1876267317819611 }, "weight": 0.32786885245901637 }, { "location": { "k": 51.5275868654, "D": -0.17940670351003973 }, "weight": 0.32786885245901637 } ], "15": [ { "location": { "k": 51.5333647178, "D": -0.1876267317819611 }, "weight": 0.5 }, { "location": { "k": 51.5275868654, "D": -0.17940670351003973 }, "weight": 0.8333333333333334 } ], "16": [ { "location": { "k": 51.5333647178, "D": -0.1876267317819611 }, "weight": 0.6666666666666666 }, { "location": { "k": 51.5275868654, "D": -0.17940670351003973 }, "weight": 0.6666666666666666 } ]};

    beforeEach(module('clientAngularApp'));
    beforeEach(inject(function (_$location_, $rootScope, CookieService, _$controller_, MeasureSpaceAPIService, SidebarHelper,StateManager,HeatmapHelper,GraphHelper) {
        $location = _$location_;
        scope = $rootScope.$new();
        MS = MeasureSpaceAPIService;
        SH = SidebarHelper;
        SM = StateManager;
        HH = HeatmapHelper;
        GH = GraphHelper;
        CS = CookieService;
        RP = {DatasetID: 57};

        $controller = _$controller_('MapCtrl', {
                '$scope': scope,
                '$location': $location,
                'MeasureSpaceAPIService' : MS,
                'SidebarHelper' : SH,
                'StateManager' : SM,
                'HeatmapHelper'  : HH,
                'GraphHelper' : GH,
                '$routeParams' : RP,
                'CookieService' : CS
            });


        
    }));



        it('should have a working API service', function() {
          expect(MS).to.exist;

          });
        it('should have a working Sidebar service', function() {
          expect(SH).to.exist;
          });
        it('should have a working Heatmap service', function() {
          expect(HH).to.exist;
          });
        it('should have a working Graph service', function() {
          expect(GH).to.exist;
          });
        it('should have a working State service', function() {
          expect(SH).to.exist;
          });

        it('should be able to toggle page loading screen', function() {
          scope.toggleGraphNodata();
          scope.loadURLDataset(92);

          //expect($('.bottombar_button')).toHaveCss({opacity: "0.0"});
          });

        var mapProp = {
            center:new google.maps.LatLng(51.508742,-0.120850),
            zoom:5,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };
        var map=new google.maps.Map(document.createElement("div"),mapProp);

        it('sets state to heatmapping appropriatley', function() {
          scope.map = map;
          scope.putHeatmap(full);
          console.log(HeatmapHelper.isHEATMAPPING());

          //expect($('.bottombar_button')).toHaveCss({opacity: "0.0"});
          });


});









