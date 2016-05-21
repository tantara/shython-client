'use strict';

var _ = require('underscore');

require('ng-cordova');

require('./controllers.js');
require('./services.js');
require('./routes.js');
require('./directives.js');
require('./filters.js');
require('./uis.js');
require('./constants.js');

window.appVersion = "1.0.6";

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.routes', 'starter.directives', 'ngCordova', 'starter.filters', 'angularMoment', 'ionic-toast', 'starter.uis', 'starter.constants'])

.run(function($ionicPlatform, $rootScope, $state, AuthService, AUTH_EVENTS, $ionicLoading, SERVER, $ionicPopup, $cordovaDevice, $window, $cordovaInAppBrowser, $ionicHistory, $cordovaKeychain, ionicToast, ModalService, $timeout) {
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

  $rootScope.showToast = function(msg){
    ionicToast.show(msg, 'middle', false, 1000);
  };

  $rootScope.showLecture = function(lecture) {
    ModalService.showLecture(lecture);
  }

  $rootScope.showCourse = function(course) {
    ModalService.showCourse(course);
  }

  $rootScope.showInstructor = function(instructor) {
    ModalService.showInstructor(instructor);
  }

  $rootScope.openSugang = function() {
    var form = AuthService.tmpLoad();
    var oldTs = AuthService.tmpTimeLoad();
    var curTs = parseInt((new Date()).getTime() / 1000);

    if(form.id == undefined || form.id.length == 0) {
      if(oldTs + 60 * 10 < curTs){ // 팝업을 본 적이 없으면
        AuthService.tmpTimeSave(curTs);
        var alertPopup = $ionicPopup.alert({
          title: '안내',
          template: "자동 로그인은 '더보기' 탭에서 설정해주세요.",
          okText: "확인"
        });
        alertPopup.then(function(res) {
          var url = 'https://sugang.snu.ac.kr/sugang/cc/cc100.action';
          $rootScope.openWebview(url);
        })
      } else {
        var url = 'https://sugang.snu.ac.kr/sugang/cc/cc100.action';
        $rootScope.openWebview(url);
      }
    } else {
      if(oldTs + 60 * 10 < curTs){ // 팝업을 본 적이 없으면
        var confirmPopup = $ionicPopup.confirm({
          title: '안내',
          template: "자동 로그인은 앱 실행 후 한번만 시도합니다. 10분 후에 재시도합니다. 중복 로그인 메세지가 보이면 '더보기' 탭에서 '로그인 시간'을 재설정해주세요.",
          okText: "확인",
          cancelText: "취소"
        });

        confirmPopup.then(function(res) {
          if(res) {
            var url = 'https://sugang.snu.ac.kr/sugang/cc/cc100.action';
            var ref = $rootScope.openWebview(url);

            $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
              if(oldTs + 60 * 10 < curTs){ // 10분간 로그인 시도 안함
                AuthService.tmpTimeSave(curTs);
                oldTs = curTs;
                var code = '$.ajax({\n' +
                          'type: "POST",\n' +
                          'url: "https://sugang.snu.ac.kr/sugang/j_login",\n' +
                          'data: "j_username=' + form.id + "&j_password=" + form.password + '",\n' +
                          'success: function() { alert("학번 및 비밀번호를 확인해주세요") },\n' +
                          'error: function(e) { window.location = "https://sugang.snu.ac.kr/sugang/cc/cc210.action" },\n' +
                          'contentType : "application/x-www-form-urlencoded"\n' +
                        '});';
                $cordovaInAppBrowser.executeScript({
                  code: code
                });
              }
            });
          } else {
            //
          }
        });
      } else {
        var url = 'https://sugang.snu.ac.kr/sugang/cc/cc210.action';
        $rootScope.openWebview(url);
      }
    }
  }

  $rootScope.openExternal = function(url) {
    if(ionic.Platform.isWebView()) {
      window.open(url, '_system');
    } else {
      window.open(url, '_blank');
    }
  }

  $rootScope.openWebview = function(url) {
    if(ionic.Platform.isWebView()) {
      var options = {
        location: 'yes',
        clearcache: 'no',
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

  $rootScope.makeKey = function() {
    var key = AuthService.loadUID();
    if(key != null && typeof key !== "undefined" && key.length > 0) {
      return key;
    }

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < 10; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  $rootScope.openReview = function() {
    var customLocale = {};
    customLocale.title = "샤이썬의 리뷰를 작성해주세요";
    customLocale.message = "안녕하세요. 샤이썬 개발자입니다. 샤이썬을 이용해보신 소감이 어떠신가요? 도움이 되셨거나 개선 사항이 있으면 리뷰 작성을 부탁 드립니다! 길어도 1분이면 작성하실 수 있을 것입니다. 샤이썬을 이용해주셔서 감사합니다 :)";
    customLocale.cancelButtonLabel = "괜찮아요";
    customLocale.laterButtonLabel = "나중에 할래요";
    customLocale.rateButtonLabel = "지금 쓰러가기";

    AppRate.preferences.openStoreInApp = true;
    AppRate.preferences.storeAppURL.ios = '1071743994';
    AppRate.preferences.storeAppURL.android = 'market://details?id=com.shython.sandbox';
    AppRate.preferences.customLocale = customLocale;
    AppRate.preferences.displayAppName = '샤이썬: 수강신청 도우미';
    AppRate.preferences.usesUntilPrompt = 5;
    AppRate.preferences.promptAgainForEachNewVersion = true;
    AppRate.promptForRating();
  }

  $rootScope.initPush = function() {
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
        "icon": "ic_stat_icon_material",
        "iconColor": "grey"
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
      //console.log(JSON.stringify(data));

      var info = data;
      var additionalData = info.additionalData;
      if(ionic.Platform.isIOS()) {
        info = data.additionalData;
      }
      if(additionalData.action == "review") {
        $rootScope.openReview();
        AppRate.promptForRating(true);
      } else if(additionalData.action == "url") {
        $rootScope.openWebview(additionalData.url);
      } else {
        var alertPopup = $ionicPopup.alert({
          title: info.title,
          template: info.message,
          okText: "확인"
        });
      }
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
  }

  $rootScope.openAd = function() {
    var admobid = {};
    var isTesting = false;

    if(window.AdMob) {
      if(ionic.Platform.isAndroid()) {
        admobid = {
          banner: 'ca-app-pub-6165819145047862/6639781434',
          interstitial: 'ca-app-pub-6165819145047862/8116514630'
        };
        AdMob.createBanner({
          isTesting: isTesting,
          adId: admobid.banner,
          position: AdMob.AD_POSITION.BOTTOM_CENTER,
          autoShow: true });
      } else if(ionic.Platform.isIOS()) {
        admobid = {
          banner: 'ca-app-pub-6165819145047862/2069981032',
          interstitial: 'ca-app-pub-6165819145047862/3546714236'
        };
        AdMob.createBanner({
          isTesting: isTesting,
          adId: admobid.banner,
          position: AdMob.AD_POSITION.BOTTOM_CENTER,
          autoShow: true });
      }
    }
  }

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

    if (window.Keychain) {
      var key = "oldKey";
      var servicename = "shython";

      $cordovaKeychain.getForKey(key, servicename).then(function(value) {
        console.log("old key: " + value);
        AuthService.storeUID(value);
      }, function(err) {
        var value = $rootScope.makeKey();
        console.log("generated: " + value);
        $cordovaKeychain.setForKey(key, servicename, value).then(function(res) {
          console.log("new key: " + value);
          AuthService.storeUID(value);
        }, function(err) {
          console.log('later');
        });
      });
    }
    if (ionic.Platform.isAndroid()) {
      var device = $cordovaDevice.getDevice();
      var uuid = $cordovaDevice.getUUID();
      AuthService.storeUID(uuid);
    }

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

    if(ionic.Platform.isWebView()) {
      $rootScope.openReview();
      $timeout(function() {
        //$rootScope.openAd(); //FIXME
      }, 1500);
    }

    console.log("fb");
    console.log(window.facebookConnectPlugin);
    if(window.facebookConnectPlugin) {
      console.log("fb activate app");
      window.facebookConnectPlugin.activateApp(function(obj) {
        console.log("fb success", obj);
      },
      function(obj) {
        console.log("fb failure", obj);
      });
    }

    if(ionic.Platform.isWebView()) {
      console.log('init push');
      $rootScope.initPush();
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
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $ionicConfigProvider.backButton.text('');
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.scrolling.jsScrolling(false);
})
