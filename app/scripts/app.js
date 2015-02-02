'use strict';

angular.module('config', []);
angular.module('services', ['config']);
angular.module('controllers', ['services', 'config']);

angular.module('BleMobile', [
  'ionic',
  'config',
  'filters',
  'controllers',
  'services',
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    if (window.evothings) {
      console.log('evothings');
      evothings.ble.reset();
      //window.evothings.loadScript('lib/evothings/util/util.js');
      //window.evothings.loadScript('lib/evothings/easyble/easyble.js');
    }
    if (window.cordova) {
      console.log('cordova');
      window.base64 = cordova.require('cordova/base64');
    }
  });
})

.run(function($rootScope) {
  $rootScope.connected = 0;
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      controller: 'ScanCtrl'
    })

    .state('tab.scan', {
      url: '/scan',
      views: {
        'tab-scan': {
          templateUrl: 'templates/tab-scan.html'
        }
      }
    });

  $urlRouterProvider.otherwise('/tab/scan');

});

