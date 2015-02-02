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

    insable.ACCELEROMETER_SERVICE = '496e264d-6f74-696e-0100-000000000000';
    insable.ACCELEROMETER_DATA = '496e264d-6f74-696e-0101-000000000000';
    insable.ACCELEROMETER_CONFIG = '496e264d-6f74-0102-b000-000000000000';
    insable.ACCELEROMETER_PERIOD = '496e264d-6f74-0103-b000-000000000000';
    insable.ACCELEROMETER_NOTIFICATION = '496e264d-6f74-696e-0104-00805f9b34fb';

    insable.GYROSCOPE_SERVICE = '496e264d-6f74-696e-0110-000000000000';
    insable.GYROSCOPE_DATA = '496e264d-6f74-696e-0111-000000000000';
    insable.GYROSCOPE_CONFIG = '496e264d-6f74-696e-0112-000000000000';
    insable.GYROSCOPE_PERIOD = '496e264d-6f74-696e-0113-000000000000';
    insable.GYROSCOPE_NOTIFICATION = '496e264d-6f74-696e-0114-00805f9b34fb';

    insable.GPS_SERVICE = '496e264d-6f74-696e-0120-000000000000';
    insable.GPS_LOCKED = '496e264d-6f74-696e-0121-000000000000';
    insable.GPS_TIME = '496e264d-6f74-696e-0122-000000000000';
    insable.GPS_LAT = '496e264d-6f74-696e-0123-000000000000';
    insable.GPS_LATDIR = '496e264d-6f74-0123-b000-000000000000';
    insable.GPS_LNG = '496e264d-6f74-696e-0125-000000000000';
    insable.GPS_LNGDIR = '496e264d-6f74-696e-0126-000000000000';
    insable.GPS_SPEED = '496e264d-6f74-696e-0127-000000000000';
    insable.GPS_CONFIG = '496e264d-6f74-696e-0128-000000000000';
    insable.GPS_PERIOD = '496e264d-6f74-696e-0129-000000000000';
    insable.GPS_NOTIFICATION = '496e264d-6f74-696e-0128-00805f9b34fb';

    insable.AIRBAG_SERVICE = '496e264d-6f74-696e-0130-000000000000';
    insable.AIRBAG_STATUS = '496e264d-6f74-696e-0131-000000000000';
    insable.AIRBAG_NOTIFICATION = '496e264d-6f74-696e-8000-00805f9b34fb';

    var stopScan = function() {
      evothings.easyble.stopScan();
      evothings.easyble.closeConnectedDevices();
    };

    var startScan = function(success, error, onAccel, onGyro, onKey, onTemp) {
      evothings.easyble.startScan(
        function(device) {
          //if (deviceIsInsaBle(device)) {
            console.log('Status: Device found: ' + device.name + '.');
            evothings.easyble.stopScan();
            connectToDevice(device, error, onAccel, onGyro, onKey, onTemp);
            success(device);
          //}
        },
        function(errorCode) {
          console('Error: startScan: ' + errorCode + '.');
          evothings.ble.reset();
          error(errorCode);
        });
    };

    var deviceIsInsaBle = function(device) {
      return true;
    };

    var connectToDevice = function(device, error, onAccel, onGyro, onKey, onTemp) {
      device.connect(
        function(device) {
          console.log('Status: Connected - reading insable services...');
          readServices(device, error, onAccel, onGyro, onKey, onTemp);
        },
        function(errorCode) {
          console.log('Error: Connection failed: ' + errorCode + '.');
          evothings.ble.reset();
        });
    };

    var readServices = function(device, error, onAccel, onGyro, onKey, onTemp) {
      device.readServices(
        [
        //insable.ACCELEROMETER_SERVICE,
        //insable.GYROSCOPE_SERVICE,
        insable.AIRBAG_SERVICE
        //insable.GPS_SERVICE
        ],
        function(device) {
          
          //startAccelerometerNotification(device, onAccel, error);
          //startGyroscopeNotification(device, onGyro, error);
          //startGpsLatNotification(device, onGpsLat, error);
          //startGpsLatDirNotification(device, onGpsLatDir, error);
          //startGpsLngNotification(device, onGpsLng, error);
          //startGpsLngDirNotification(device, onGpsLngDir, error);
          //startGpsSpeedNotification(device, onGps, error);
        },
        function(errorCode) {
          console.log('Error: Failed to read services: ' + errorCode + '.');
        });
    };

    var startGyroscopeNotification = function(device, success, error) {
      console.log('Status: Starting gyroscope notification...');

      device.writeCharacteristic(
        insable.GYROSCOPE_CONFIG,
        new Uint8Array([1]),
        function() {
          console.log('Status: writeCharacteristic 1 ok.');
        },
        function(errorCode) {
          console.log('Error: writeCharacteristic 1 error: ' + errorCode + '.');
        });

      // Set update period to 100 ms (10 == 100 ms).
      device.writeCharacteristic(
        insable.GYROSCOPE_PERIOD,
        new Uint8Array([10]),
        function() {
          console.log('Status: writeCharacteristic 2 ok.');
        },
        function(errorCode) {
          console.log('Error: writeCharacteristic 2 error: ' + errorCode + '.');
        });

      // Set gyroscope notification to ON.
      device.writeDescriptor(
        insable.GYROSCOPE_DATA, // Characteristic for gyroscope data
        insable.GYROSCOPE_NOTIFICATION, // Configuration descriptor
        new Uint8Array([1 , 0]),
        function() {
          console.log('Status: writeDescriptor ok.');
        },
        function(errorCode) {
          console.log('Error: writeDescriptor: ' + errorCode + '.');
        });

      // Start notification of gyroscope data.
      device.enableNotification(
        insable.GYROSCOPE_DATA,
        function(data) {
          console.log('Status: Data stream active - gyroscope');
          console.log('byteLength: ' + data.byteLength);
          var dataArray = new Int16Array(data);
          console.log('length: ' + dataArray.length);
          console.log('data: ' + dataArray[0] + ' ' + dataArray[1] + ' ' + dataArray[2]);
          var gyro = getGyroscopeValues(dataArray);
          success(gyro);
        },
        function(errorCode) {
          console.log('Error: enableNotification: ' + errorCode + '.');
          error(errorCode);
        });
    };

    var startAccelerometerNotification = function(device, success, error) {
      console.log('Status: Starting accelerometer notification...');

      device.writeCharacteristic(
        insable.ACCELEROMETER_CONFIG,
        new Uint8Array([1]),
        function() {
          console.log('Status: writeCharacteristic ok.');
        },
        function(errorCode) {
          console.log('Error: writeCharacteristic: ' + errorCode + '.');
        });

      // Set accelerometer period to 100 ms.
      device.writeCharacteristic(
        insable.ACCELEROMETER_PERIOD,
        new Uint8Array([10]),
        function() {
          console.log('Status: writeCharacteristic ok.');
        },
        function(errorCode) {
          console.log('Error: writeCharacteristic: ' + errorCode + '.');
        });

      /*
      device.writeDescriptor(
        insable.ACCELEROMETER_DATA, // Characteristic for accelerometer data
        insable.ACCELEROMETER_NOTIFICATION, // Configuration descriptor
        new Uint8Array([1 , 0]),
        function() {
          console.log('Status: writeDescriptor ok.');
        },
        function(errorCode) {
          console.log('Error: writeDescriptor: ' + errorCode + '.');
        });
      */

      // Start accelerometer notification.
      device.enableNotification(
        insable.ACCELEROMETER_DATA,
        function(data) {
          console.log('Status: Data stream active - accelerometer');
          console.log('byteLength: ' + data.byteLength);
          var dataArray = new Int8Array(data);
          console.log('length: ' + dataArray.length);
          console.log('data: ' + dataArray[0] + ' ' + dataArray[1] + ' ' + dataArray[2]);
          var accel = getAccelerometerValues(dataArray);
          success(accel);
        },
        function(errorCode) {
          console.log('Error: enableNotification: ' + errorCode + '.');
          error(errorCode);
        });
    };

    var startGpsNotification = function(device, success, error) {
      console.log('Status: Starting gps notification...');

      device.writeCharacteristic(
        insable.GPS_CONFIG,
        new Uint8Array([1]),
        function() {
          console.log('Status: writeCharacteristic ok.');
        },
        function(errorCode) {
          console.log('Error: writeCharacteristic: ' + errorCode + '.');
        });

      // Set accelerometer period to 100 ms.
      device.writeCharacteristic(
        insable.GPS_PERIOD,
        new Uint8Array([10]),
        function() {
          console.log('Status: writeCharacteristic ok.');
        },
        function(errorCode) {
          console.log('Error: writeCharacteristic: ' + errorCode + '.');
        });

      // Start gpsLat notification.
      device.enableNotification(
        insable.GPS_LAT,
        function(data) {
          console.log('Status: Data stream active - GpsLat');
          console.log('byteLength: ' + data.byteLength);
          var dataArray = new Int8Array(data);
          console.log('length: ' + dataArray.length);
          console.log('data: ' + dataArray[0] + ' ' + dataArray[1] + ' ' + dataArray[2]);
          var gps = getGpsLatValue(dataArray);
          success(gps);
        },
        function(errorCode) {
          console.log('Error: enableNotification: ' + errorCode + '.');
          error(errorCode);
        });

      // Start gpsLatDir notification.
      device.enableNotification(
        insable.GPS_LATDIR,
        function(data) {
          console.log('Status: Data stream active - GpsLatDir');
          console.log('byteLength: ' + data.byteLength);
          var dataArray = new Int8Array(data);
          console.log('length: ' + dataArray.length);
          console.log('data: ' + dataArray[0] + ' ' + dataArray[1] + ' ' + dataArray[2]);
          var gps = getGpsLatDirValue(dataArray);
          success(gps);
        },
        function(errorCode) {
          console.log('Error: enableNotification: ' + errorCode + '.');
          error(errorCode);
        });

      // Start gpsLng notification.
      device.enableNotification(
        insable.GPS_LNG,
        function(data) {
          console.log('Status: Data stream active - GpsLng');
          console.log('byteLength: ' + data.byteLength);
          var dataArray = new Int8Array(data);
          console.log('length: ' + dataArray.length);
          console.log('data: ' + dataArray[0] + ' ' + dataArray[1] + ' ' + dataArray[2]);
          var gps = getGpsLngValue(dataArray);
          success(gps);
        },
        function(errorCode) {
          console.log('Error: enableNotificationGpsLng: ' + errorCode + '.');
          error(errorCode);
        });
      // Start gpsLngDir notification.
      device.enableNotification(
        insable.GPS_LNGDIR,
        function(data) {
          console.log('Status: Data stream active - GpsLngDir');
          console.log('byteLength: ' + data.byteLength);
          var dataArray = new Int8Array(data);
          console.log('length: ' + dataArray.length);
          console.log('data: ' + dataArray[0] + ' ' + dataArray[1] + ' ' + dataArray[2]);
          var gps = getGpsLngDirValue(dataArray);
          success(gps);
        },
        function(errorCode) {
          console.log('Error: enableNotificationGpsLngDir: ' + errorCode + '.');
          error(errorCode);
        });
      // Start gpsSpeed notification.
      device.enableNotification(
        insable.GPS_SPEED,
        function(data) {
          console.log('Status: Data stream active - GpsSpeed');
          console.log('byteLength: ' + data.byteLength);
          var dataArray = new Int8Array(data);
          console.log('length: ' + dataArray.length);
          console.log('data: ' + dataArray[0] + ' ' + dataArray[1] + ' ' + dataArray[2]);
          var gps = getGpsSpeedValue(dataArray);
          success(gps);
        },
        function(errorCode) {
          console.log('Error: enableNotification: ' + errorCode + '.');
          error(errorCode);
        });
    };

    var getAccelerometerValues = function(u8data) {
      var ax = evothings.util.littleEndianToInt8(u8data, 0) / 16.0;
      var ay = evothings.util.littleEndianToInt8(u8data, 1) / 16.0;
      var az = evothings.util.littleEndianToInt8(u8data, 2) / 16.0 * -1.0;
      return { x: ax, y: ay, z: az };
    };

    var getGyroscopeValues = function(u8data) {
      // Calculate gyroscope values.
      var gy = -util.littleEndianToInt16(u8data, 0) * 500.0 / 65536.0;
      var gx = evothings.util.littleEndianToInt16(u8data, 2) * 500.0 / 65536.0;
      var gz = evothings.util.littleEndianToInt16(u8data, 4) * 500.0 / 65536.0;
      return { x: gx, y: gy, z: gz };
    };

    var getGpsLatValue = function(u8data) {
      var lat = -util.littleEndianToInt16(u8data, 0);
      return lat;
    };
    var getGpsLatDirValue = function(u8data) {
      var latdir = -util.littleEndianToInt16(u8data, 0);
      return (latdir == 0) ? 'N' : 'S';
    };
    var getGpsLngValue = function(u8data) {
      var lng = -util.littleEndianToInt16(u8data, 0);
      return lng;
    };
    var getGpsLngDirValue = function(u8data) {
      var lngdir = -util.littleEndianToInt16(u8data, 0);
      return (lngdir == 0) ? 'E' : 'W';
    };
    var getGpsSpeedValue = function(u8data) {
      var speed = -util.littleEndianToInt16(u8data, 0);
      return speed;
    };

    var startButtonNotification = function(device, success, error) {
      console.log('Status: Starting accelerometer notification...');

      device.writeDescriptor(
        insable.KEYPRESS_DATA,
        insable.KEYPRESS_NOTIFICATION,
        new Uint8Array([1 , 0]),
        function() {
          console.log('Status: writeDescriptor ok.');
        },
        function(errorCode) {
          console.log('Error: writeDescriptor: ' + errorCode + '.');
        });

      // Start accelerometer notification.
      device.enableNotification(
        insable.KEYPRESS_DATA,
        function(data) {
          console.log('Status: Data stream active - accelerometer');
          console.log('byteLength: ' + data.byteLength);
          var dataArray = new Int8Array(data);
          console.log('length: ' + dataArray.length);
          console.log('data: ' + dataArray[0] + ' ' + dataArray[1] + ' ' + dataArray[2]);
          success(dataArray);
        },
        function(errorCode) {
          console.log('Error: enableNotification: ' + errorCode + '.');
          error(errorCode);
        });
    };

    var writeAirbag = function(device) {
      device.writeCharacteristic(
        insable.AIRBAG_STATUS,
        new Uint8Array([1]),
        function() {
          console.log('Status: writeAirbagCharacteristic ok.');
        },
        function(errorCode) {
          console.log('Error: writeAirbagCharacteristic: ' + errorCode + '.');
        });
    };

    return {
      startScan: startScan,
      stopScan: stopScan,
      readServices: readServices,
      connectToDevice: connectToDevice,
      startAccelerometerNotification: startAccelerometerNotification,
      startGyroscopeNotification: startGyroscopeNotification,
      startButtonNotification: startButtonNotification,
      deviceIsInsaBle: deviceIsInsaBle,
      writeAirbag: writeAirbag
    };
  }
]);
