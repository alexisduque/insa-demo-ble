'use strict';

angular.module('controllers').controller('ScanCtrl', [
  '$scope',
  '$rootScope',
  '$timeout',
  'InsaBle',
  function($scope, $rootScope, $timeout, InsaBle) {

    $scope.status = 'Scan Paused';
    $scope.device = {};
    $scope.connected = false;
    $scope.error = '';
    $scope.data = { temp: 0 };
    $scope.ready = true;
    $scope.tempInterval = null;

    $scope.displayStatus = function(status) {
      $scope.status = status;
    };

    $scope.startScan = function() {
      $scope.stopScan();
      $scope.scanning = true;
      $scope.lastScanEvent = new Date();
      $scope.runScanTimer();
      console.log('Scan started...');
      InsaBle.startScan($scope.deviceFound, $scope.handleError, $scope.onTemperatureData);
    };

    // Stop scanning for devices.
    $scope.stopScan = function() {
      $scope.scanning = false;
      $scope.data = {};
      $scope.connected = false;
      InsaBle.stopScan();
      $rootScope.devices = {};
      if (angular.isDefined($scope.device.address)) {
        $scope.device = {};
      }
    };

    // Called when Start Scan button is selected.
    $scope.onStartScanButton = function() {
      $scope.tempInterval = setInterval($scope.onTemperatureData, 500);
      $rootScope.devices = {};
      $scope.startScan();
      $scope.displayStatus('Scanning...');
    };

    // Called when Stop Scan button is selected.
    $scope.onStopScanButton = function() {
      if ($scope.scanning) {
        $scope.stopScan();
        clearInterval($scope.tempInterval);
      }
      $scope.displayStatus('Scan Paused');
    };

    $scope.deviceFound = function(device) {
      if (device) {
        $scope.$apply(function() {
          $scope.device = device;
          $scope.scanning = false;
          $scope.connected = true;
          device.timeStamp = Date.now();
          $scope.displayStatus('Devices found !');
          $rootScope.devices[device.address] = device;
          $scope.data.temp = 21.4;
        });
        $scope.tempInterval = setInterval($scope.onTemperatureData, 500);
        console.log('Device found:' + device.address);
        console.log(' RSSI: ' + device.rssi);
        console.log(' Raw: ' + device.scanRecord);
        console.log(' Name: ' + device.name);
      }
    };

    function getRandomArbitary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $scope.runScanTimer = function() {
      if ($scope.scanning)
      {
        var timeSinceLastScan = new Date() - $scope.lastScanEvent;
        if (timeSinceLastScan > $scope.scanInterval)
        {
          if ($scope.scanTimer) { clearTimeout($scope.scanTimer); }
          $scope.startScan();
        }
        $scope.scanTimer = setTimeout($scope.runScanTimer, $scope.scanInterval);
      }
    };

    $scope.handleError = function(errorCode) {
      console.log('Error (' + errorCode + ') - ');
      $scope.$apply(function() {
        $scope.error = 'Scan error';
      });
    };

    $scope.onTemperatureData = function() {
        console.log('new temp');
        $scope.$apply(function() {
          $scope.data.temp = getRandomArbitary(24, 33);
        });
    };

    $scope.reset = function() {
      console.log('reset BLE interface ...');
      $rootScope.devices = {};
      $scope.stopScan();
      $scope.error = '';
      $scope.status = 'Scan Paused';
      $rootScope.deviceHandle = '';
      $rootScope.services = {};
      $rootScope.connected = 0;
      evothings.ble.reset();
      clearInterval($scope.tempInterval);
    };

    $scope.light = function() {
      if (angular.isDefined($scope.device.__services)) {
        InsaBle.writeAirbag($scope.device);
      }
    };

    $scope.$on('$destroy', function() {
      $scope.stopScan();
    });

  }
]);
