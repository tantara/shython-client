var appVersion = "0.0.0";

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.routes', 'starter.directives', 'ngCordova', 'starter.filters', 'angularMoment'])

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.constant('SERVER', {
  host: 'http://192.168.0.7:3000',
  //host: 'http://api-sugang.snu.ac',
  web: 'http://sugang.snu.ac',
})

.run(function($ionicPlatform, $rootScope, $state, AuthService, AUTH_EVENTS, $ionicLoading, SERVER, $ionicPopup, $cordovaDevice, $window, $cordovaInAppBrowser, $ionicHistory) {
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
    if(typeof analytics !== "undefined") {
      if(ionic.Platform.isIOS()) {
        analytics.startTrackerWithId("UA-71864537-2");
      } else if(ionic.Platform.isAndroid()) {
        analytics.startTrackerWithId("UA-71864537-3");
        analytics.trackView('whatever');
      }
    } else {
      console.log("Google Analytics Unavailable");
    }
  });

  $ionicPlatform.registerBackButtonAction(function(e){
    if ($rootScope.backButtonPressedOnceToExit) {
      ionic.Platform.exitApp();
    }
    else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    }
    else {
      $rootScope.backButtonPressedOnceToExit = true;
      ionic.Platform.exitApp(); // FIXME
      //window.plugins.toast.showShortCenter(
      //  "Press back button again to exit",function(a){},function(b){}
      //);
      //setTimeout(function(){
      //  $rootScope.backButtonPressedOnceToExit = false;
      //},2000);
    }
    e.preventDefault();
    return false;
  },101);

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
        StatusBar.styleLightContent();
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
              var info = data;
              if(ionic.Platform.isIOS()) {
              info = data.additionalData;
              }
        var alertPopup = $ionicPopup.alert({
          title: info.title,
          template: info.message,
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
