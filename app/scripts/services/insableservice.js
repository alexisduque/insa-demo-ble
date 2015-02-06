'use strict';

angular.module('services').factory('InsaBle', [
  'easyBle',
  'bleUtil',
  function(easyBle, bleUtil) {

    var data = {};
    var insable = {};
    evothings.easyble = easyBle;
    evothings.util = bleUtil;

    insable.DEVICEINFO_SERVICE = '0000180a-6f74-696e-8000-00805f9b34fb';
    insable.FIRMWARE_DATA = '00002a26-0000-6f74-696e-00805f9b34fb';

    insable.LIGHT_SERVICE = '496e264d-6f74-696e-0130-000000000000';
    insable.LIGHT_STATUS = '496e264d-6f74-696e-0131-000000000000';
    insable.LIGHT_NOTIFICATION = '496e264d-6f74-696e-8000-00805f9b34fb';

    var stopScan = function() {
      evothings.easyble.stopScan();
      evothings.easyble.closeConnectedDevices();
    };

    var startScan = function(success, error, onTemp) {
      evothings.easyble.startScan(
        function(device) {
          if (deviceIsInsaBle(device)) {
            console.log('Status: Device found: ' + device.name + '.');
            evothings.easyble.stopScan();
            connectToDevice(device, error, onTemp);
            success(device);
          }
        },
        function(errorCode) {
          console('Error: startScan: ' + errorCode + '.');
          evothings.ble.reset();
          error(errorCode);
        });
    };

    var deviceIsInsaBle = function(device) {
      if (device === null || device.name === null) {
        return false;
      }
      return (device.name.indexOf('GreenH') > -1);
    };

    var connectToDevice = function(device, error, onTemp) {
      device.connect(
        function(device) {
          console.log('Status: Connected - reading insable services...');
          readServices(device, error, onTemp);
        },
        function(errorCode) {
          console.log('Error: Connection failed: ' + errorCode + '.');
          evothings.ble.reset();
        });
    };

    var readServices = function(device, error, onTemp) {
      device.readServices(
        [
        insable.LIGHT_SERVICE
        ],
        function(device) {
        },
        function(errorCode) {
          console.log('Error: Failed to read services: ' + errorCode + '.');
        });
    };

    var readTempData = function(device, success, error) {
      console.log('Reading services done - Now reading characteristic...');
      frozen = true;
      device.readCharacteristic(
        insable.LIGHT_STATUS,
        function(arrayBuffer) {
          frozen = false;
          var uint8ArrayData = new Uint8Array(arrayBuffer);
          success(device, uint8ArrayData);
          console.log('Status: readCharacteristic ok.' + bleUtil.Uint8ToString(uint8ArrayData));
        },
        function(errorCode) {
          frozen = false;
          console.log('Status: readCharacteristic error - ' + errorCode);
          error(errorCode, device);
        });
      setTimeout(function() { if (frozen) { error(133, device); reset(); }}, 15000);
    };


    var writeLight = function(device) {
      device.writeCharacteristic(
        insable.LIGHT_STATUS,
        new Uint8Array([1]),
        function() {
          console.log('Status: writeLightCharacteristic ok.');
        },
        function(errorCode) {
          console.log('Error: writeLightCharacteristic: ' + errorCode + '.');
        });
    };

    return {
      startScan: startScan,
      stopScan: stopScan,
      readServices: readServices,
      connectToDevice: connectToDevice,
      deviceIsInsaBle: deviceIsInsaBle,
      writeLight: writeLight,
      readTempData: readTempData
    };
  }
]);
