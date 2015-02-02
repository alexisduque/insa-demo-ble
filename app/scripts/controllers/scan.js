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
    $scope.data = {};
    $scope.ready = true;

    $scope.displayStatus = function(status) {
      $scope.status = status;
    };

    $scope.startScan = function() {
      $scope.stopScan();
      $scope.scanning = true;
      $scope.lastScanEvent = new Date();
      $scope.runScanTimer();
      console.log('Scan started...');
      InsaBle.startScan($scope.deviceFound, $scope.handleError, $scope.onAccelerometerData, 
        $scope.onGyroscopeData, $scope.onButtonData, $scope.onTemperatureData);
    };

    // Stop scanning for devices.
    $scope.stopScan = function() {
      $scope.scanning = false;
      $scope.data = {};
      $scope.connected = false;
      InsaBle.stopScan();
      $rootScope.devices = {};
      if (angular.isDefined($scope.device.address)) {
        //$scope.device.disconnect();
        $scope.device = {};
        //$scope.ready = false;
      }
    };

    // Called when Start Scan button is selected.
    $scope.onStartScanButton = function() {
      $rootScope.devices = {};
      $scope.startScan();
      $scope.displayStatus('Scanning...');
    };

    // Called when Stop Scan button is selected.
    $scope.onStopScanButton = function() {
      if ($scope.scanning) {
        $scope.stopScan();
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
        console.log('Device found:' + device.address);
        console.log(' RSSI: ' + device.rssi);
        console.log(' Raw: ' + device.scanRecord);
        console.log(' Name: ' + device.name);
      }
    };

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

    $scope.onAccelerometerData = function(dataArray) {
      $scope.$apply(function() {
        $scope.data.accelerometer = dataArray;
      });
    };

    $scope.onTemperatureData = function(dataArray) {
      $scope.$apply(function() {
        $scope.data.temperature = dataArray;
      });
    };

    $scope.onButtonData = function(dataArray) {
      $scope.$apply(function() {
        $scope.data.button = dataArray;
      });
    };

    $scope.onGyroscopeData = function(dataArray) {
      $scope.$apply(function() {
        $scope.data.gyroscope = dataArray;
      });
    };

    $scope.onGpsLatData = function(data) {
      $scope.$apply(function() {
        $scope.data.gps.lat = dataArray;
      });
    };

    $scope.onGpsLngData = function(data) {
      $scope.$apply(function() {
        $scope.data.gps.lng = dataArray;
      });
    };

    $scope.onGpsLatDirData = function(data) {
      $scope.$apply(function() {
        $scope.data.gps.latDir = dataArray;
      });
    };

    $scope.onGpsLngData = function(data) {
      $scope.$apply(function() {
        $scope.data.gps.lngDir = dataArray;
      });
    };
    $scope.onGpsSpeedData = function(data) {
      $scope.$apply(function() {
        $scope.data.gps.speed = dataArray;
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
    };

    $scope.airbag = function() {
      if (angular.isDefined($scope.device.__services)) {
        InsaBle.writeAirbag($scope.device);
      }
    };
    $scope.isReady = function() {
      if ($scope.device.__services) {
        if ($scope.device.__services && $scope.device.__services.length > 1 &&
         $scope.ready == false) {
          $scope.ready = true;
        } else if ($scope.ready == true) {
          $scope.ready = false;
        }
        if ($scope.readyTimer) { clearTimeout($scope.readyTimer); }
      }
      $scope.readyTimer = setTimeout($scope.isReady, 1000);
    };

    //$scope.isReady();

    $scope.$on('$destroy', function() {
      $scope.stopScan();
    });


  }
]);
