angular.module('JustAProject')

.controller('InitCtrl', function($scope, $ionicLoading, $ionicPopup, $dataService, $httpService, $timeout, $ionicBackdrop) {

  $scope.psiReading = {};

  $scope.initLoad = function() {
    console.log("Start initLoading");
    $scope.initLoading = $ionicLoading.show({
      template: 'Initializing <br><ion-spinner></ion-spinner>'
    });
  };

  $scope.initStop = function() {
    console.log("Stopping initLoading");
    $scope.initLoading = $ionicLoading.hide();
  };

  $scope.initAlert = function() {
    console.log("Stopping initLoading due to timeout");
    var alertPopup = $ionicPopup.alert({
      title: 'Connection Timeout',
      template: 'Please check your connection'
    });
  };

  $scope.refreshAlert = function() {
    console.log("Stopping refresh due to timeout");
    var alertPopup = $ionicPopup.alert({
      title: 'Connection Timeout',
      template: 'Please check your connection'
    });
  };

  $scope.showBackdrop = function() {
    $ionicBackdrop.retain();
  }

  $scope.hideBackdrop = function() {
    $ionicBackdrop.release();
  }

  $scope.refreshData = function() {
    $scope.showBackdrop();
    $httpService.getPSI('http://www.nea.gov.sg/api/WebAPI?dataset=psi_update&keyref=781CF461BB6606ADC4A6A6217F5F2AD6623E25A537B5DE8B').then(function (data) {

      $scope.psiReading.reading = $dataService.get3HReading(data);
      $scope.psiReading.quality = $dataService.get3HRating(data)[0];
      $scope.psiReading.color = $dataService.get3HRating(data)[1];
      $scope.psiReading.dateTime = $dataService.getDateTime();

      console.log(JSON.stringify($scope.psiReading));
      $scope.$broadcast('scroll.refreshComplete');
      $scope.hideBackdrop();
    }, function(error) {

      $timeout(function() {
        $scope.refreshAlert();
        $scope.hideBackdrop();
        $scope.$broadcast('scroll.refreshComplete');
      },10000);

    });
  };

  $scope.initLoad();

})

.controller('DashCtrl', function($scope, $httpService, $ionicLoading, $timeout, $dataService) {

  $httpService.getPSI('http://www.nea.gov.sg/api/WebAPI?dataset=psi_update&keyref=781CF461BB6606ADC4A6A6217F5F2AD6623E25A537B5DE8B').then(function (data) {

    $scope.psiReading.reading = $dataService.get3HReading(data);
    $scope.psiReading.quality = $dataService.get3HRating(data)[0];
    $scope.psiReading.color = $dataService.get3HRating(data)[1];
    $scope.psiReading.dateTime = $dataService.getDateTime();
    $scope.psiReading.hour = $dataService.getHour(data);
   
    $scope.initStop();
  }, function(error) {

    $timeout(function() {
      $scope.initStop();
      $scope.initAlert();
    },10000);

  });

})

.controller('SettingCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});