angular.module('starter.controllers', [])

.controller('TabCtrl', function($scope, $state) {
})

.controller('IntroCtrl', function($scope, $state, AuthService, $ionicPopup, $stateParams, $window, AuthService, UsersService) {
  function makeKey()
  {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < 10; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  $scope.start  = function() {
    var user = {key: makeKey()};
    AuthService.start(user).then(function(res) {
      var uuid = AuthService.loadPushToken();
      var device = AuthService.loadDeviceInfo();
      if(uuid && device) {
        UsersService.saveDevice(uuid, device);
      }
      $state.go('tab.home', {}, {location: "replace", reload: true});
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: '확인'
      });
    });
  };
})

.controller('HomeCtrl', function($scope, $ionicPopup, LecturesService) {
  $scope.searchForm = {};
  $scope.lectures = [];
  $scope.header = "";

  LecturesService.hot().then(function(res) {
    $scope.lectures = res.data.lectures;
    $scope.header = res.data.header;
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })

  $scope.search = function(form) {
    LecturesService.search(form.query).then(function(res) {
      $scope.lectures = res.data.lectures;
      $scope.header = res.data.header;
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  };
})

.controller('BookmarkCtrl', function($scope, $ionicPopup, UsersService) {
  $scope.lectures = [];
  $scope.header = "";

  UsersService.getBookmark().then(function(res) {
    $scope.lectures = res.data.lectures;
    if($scope.lectures.length == 0) {
      $scope.header = "즐겨찾기한 강좌가 없습니다.";
    } else {
      $scope.header = "";
    }
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })
})

.controller('LectureDetailCtrl', function($scope, $ionicPopup, LecturesService, $stateParams, $rootScope) {
  $scope.lecture = {};

  $scope.openLecture = function(lecture) {
    var url = 'http://sugang.snu.ac.kr/sugang/cc/cc101.action?openSchyy=2015&openShtmFg=U000200002&openDetaShtmFg=U000300001&sbjtCd=' + lecture.course.code + '&ltNo=' + lecture.code + '&sugangFlag=P';
    $rootScope.openWebview(url);
  }

  LecturesService.get($stateParams.lectureId).then(function(res) {
    $scope.lecture = res.data.lecture;
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })
})

.controller('MoreCtrl', function($scope, UsersService, $ionicPopup, SERVER, $rootScope, $cordovaEmailComposer) {

  $scope.options = {};

  $scope.openHelp = function() {
    $rootScope.openWebview(SERVER.host + '/help');
  }

  $scope.sendMail = function() {
    $cordovaEmailComposer.isAvailable().then(function() {
      // is available
      var info = JSON.parse(AuthService.loadDeviceInfo());
      var infoStr = '<br>platform: ' + info.platform;
      infoStr += '<br>model: ' + info.model;
      infoStr += '<br>version: ' + info.version;
      infoStr += '<br>appVersion: ' + appVersion; 

      var email = {
        to: 'help.shython@gmail.com',
        subject: '[문의] 샤이썬에 문의합니다.',
        body: '버그 제보 혹은 기능 제안을 해주세요.<br><br><br>' + infoStr,
        isHtml: true
      };

      $cordovaEmailComposer.open(email).then(null, function () {
        // user cancelled email
      });
    }, function () {
      // not available
      var alertPopup = $ionicPopup.alert({
        title: '안내',
        template: 'help.shython@gmail.com로 메일을 보내주세요.',
        okText: "확인"
      });
    });
  }

  UsersService.getOptions().then(function(res) {
    $scope.options = res.data;
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  });

  $scope.change = function() {
    UsersService.editOptions($scope.options).then(function(res) {
      var alertPopup = $ionicPopup.alert({
        title: '안내',
        template: res.data.msg,
        okText: "확인"
      });
      $scope.options = res.data.options;
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    });
  }
})

.controller('NotiCtrl', function($scope, $ionicPopup, UsersService) {
  $scope.notis = [];
  $scope.header = "";

  UsersService.getNoti().then(function(res) {
    $scope.notis = res.data.notis;
    if($scope.notis.length == 0) {
      $scope.header = '즐겨찾기한 강좌의 변동사항이 없습니다.';
    } else {
      $scope.header = "";
    }
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })
})
;
