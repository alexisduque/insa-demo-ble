'use strict';

angular.module('controllers').controller('CommonsCtrl', [
  '$scope',
  function($scope) {
    $scope.devices = {};
    $scope.scanning = false;
    $scope.status = 'Scan Paused';
    $scope.updateTimer = null;
    $scope.scanInterval = 3000;
    $scope.lastScanEvent = 0;
    $scope.scanTimer = 0;
    $scope.error = '';
  }
]);
