'use strict';

angular.module('filters', [])
  .filter('propertiesflags', function() {
    return function(flags) {
      var str = '';
      for (var key in evothings.ble.property) {
        if (flags && (flags.toString() === key) ) {
          str += ' ' + evothings.ble.property[key];
        }
      }
      return str;
    };
  })
  .filter('permissionsflags', function() {
    return function(flags) {
      if (flags === 0) {
        return 'No permissions';
      } 
      var str = '';
      for (var key in evothings.ble.permission) {
        if (flags && (flags.toString() === key) ) {
          str += ' ' + evothings.ble.permission[key];
        }
      }
      return str;
    };
  })
  .filter('writeflags', function() {
    return function(flags) {
      var str = '';
      for (var key in evothings.ble.writeType) {
        if (flags && (flags.toString() === key) ) {
          str += ' ' + evothings.ble.writeType[key];
        }
      }
      return str;
    };
  });