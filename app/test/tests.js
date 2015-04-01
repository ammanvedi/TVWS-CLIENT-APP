describe('SidebarHelper', function () {

  var SidebarHelper;
  beforeEach(module('clientAngularApp'));
  beforeEach(inject(function (_SidebarHelper_) {
    SidebarHelper = _SidebarHelper_;
  }));

  describe('Constructor', function () {

    it('assigns a name', function () {
      expect(SidebarHelper.map).to.be.empty;
    });

  });

});

describe('MapCtrl', function() {
    var scope, $location, createController, MS, CS, SH, SM, HH, GH;
    beforeEach(module('clientAngularApp'));
    beforeEach(inject(function (_$location_, $rootScope, CookieService,$controller, MeasureSpaceAPIService, SidebarHelper,StateManager,HeatmapHelper,GraphHelper) {
        $location = _$location_;
        scope = $rootScope.$new();
        MS = MeasureSpaceAPIService;
        SH = SidebarHelper;
        SM = StateManager;
        HH = HeatmapHelper;
        GH = GraphHelper;
        CS = CookieService;
        RP = {DatasetID: 57};

        createController = $controller('MapCtrl', {
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
          scope.togglePageLoading();
          console.log($('.bottombar_button'));
          //expect($('.bottombar_button')).toHaveCss({opacity: "0.0"});
          });


});









