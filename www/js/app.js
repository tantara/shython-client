var appVersion = "0.0.0";

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.routes', 'starter.directives', 'ngCordova', 'starter.filters'])

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.constant('SERVER', {
  //host: 'http://192.186.0.6:3000',
  //host: 'http://127.0.0.1:3000',
  host: 'http://dev.tantara.me:3000',
  web: 'http://sugang.snu.ac.kr',
})

.run(function($ionicPlatform, $rootScope, $state, AuthService, AUTH_EVENTS, $ionicLoading, SERVER, $ionicPopup, $cordovaDevice, $window) {
  var apiCount = 0;
  $rootScope.showLoading = function(config) {
    var isApi = config.url.match(SERVER.host);
    if(isApi != null) {
      if(apiCount == 0) {
        console.log('showLoading');
        $ionicLoading.show({noBackdrop: true});
      }
      apiCount += 1;
    }
  }

  $rootScope.hideLoading = function(config) {
    var isApi = config.url.match(SERVER.host);
    if(isApi != null) {
      apiCount -= 1;
      if(apiCount == 0) {
        console.log('hideLoading');
        $ionicLoading.hide();
      }
    }
  }

  $rootScope.openWebview = function(url) {
    if(ionic.Platform.isWebView()) {
      var options = {
        location: 'no',
        clearcache: 'yes',
        toolbar: 'yes'
      };
      $cordovaInAppBrowser.open(url, '_blank', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
    } else {
      $window.open(url);
    }
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();

      //Custom
      StatusBar.overlaysWebView(true);
      if(ionic.Platform.isIOS()) {
        StatusBar.style(1)
      } else if(ionic.Platform.isAndroid()) {
        ionic.Platform.isFullScreen = true;
      }
    }

    if(ionic.Platform.isWebView()) {
      cordova.getAppVersion(function(version) {
        appVersion = version;
      });

      var info = {};
      info.device = $cordovaDevice.getDevice();

      info.cordova = $cordovaDevice.getCordova();

      info.model = $cordovaDevice.getModel();

      info.platform = $cordovaDevice.getPlatform();

      info.uuid = $cordovaDevice.getUUID();

      info.version = $cordovaDevice.getVersion();

      AuthService.storeDeviceInfo(info);

      var push = PushNotification.init({
        android: {
          senderID: "607566472910",
          "icon": "icon",
          "iconColor": "#FFFFFF"
        },
        ios: {
          alert: "true",
          badge: "true",
          sound: "true"
        },
        windows: {}
      });

      push.on('registration', function(data) {
        // data.registrationId
        console.log(data.registrationId);
        AuthService.storePushToken(data.registrationId);
      });

      push.on('notification', function(data) {
        var alertPopup = $ionicPopup.alert({
          title: data.title,
          template: data.message,
          okText: "확인"
        });
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
      });

      push.on('error', function(e) {
        // e.message
      });
    };
  });

  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {

    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        //$state.go($state.current, {}, {reload: true});
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
    }

    if (!AuthService.isAuthenticated()) {
      if (next.name != 'intro') {
        event.preventDefault();
        $state.go('intro', {}, {replace: true, reload: true});
      }
    }
    else {
      if (next.name == 'intro') {
        event.preventDefault();
        $state.go('tab.home', {}, {replace: true, reload: true});
      }
    }
  });
})

.config(function($ionicConfigProvider) {
  //$ionicConfigProvider.tabs.position('bottom');
})
