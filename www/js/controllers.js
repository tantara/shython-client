angular.module('starter.controllers', [])

.controller('TabCtrl', function($scope, $state) {
})

.controller('IntroCtrl', function($scope, $state, AuthService, $ionicPopup, $stateParams, $window, AuthService, UsersService) {
  if(typeof analytics !== "undefined") { analytics.trackView("Intro Controller"); }

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
  if(typeof analytics !== "undefined") { analytics.trackView("Home Controller"); }

  $scope.searchForm = {};
  $scope.season = "";
  $scope.lectures = [];
  $scope.header = "";
  $scope.abb = [];
  $scope.abbText = "";
  $scope.notice = "";
  $scope.mode = "hot";
  $scope.lastQuery = "";

  $scope.init = function() {
    $scope.searchForm.query = "";
    LecturesService.hot().then(function(res) {
      $scope.mode = "hot";
      $scope.lectures = res.data.lectures;
      $scope.header = res.data.header;
      $scope.abb = res.data.abb;
      $scope.abbText = res.data.abb_text;
      $scope.season = res.data.season;
      $scope.notice = res.data.notice;
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  }
  $scope.init();

  $scope.search = function(query) {
    if(query.length == 0) return;
    $scope.searchForm.query = query;
    $scope.lastQuery = query;
    LecturesService.search(query).then(function(res) {
      $scope.mode = "search";
      $scope.lectures = res.data.lectures;
      $scope.header = res.data.header;
      $scope.abb = res.data.abb;
      $scope.abbText = res.data.abb_text;
      $scope.season = res.data.season;
      $scope.notice = res.data.notice;
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  };

  $scope.showAbbModal = function() {
    $scope.data = {query: $scope.lastQuery};
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.abb">',
      title: "'" + $scope.data.query + "'의 축약어를 입력해주세요",
      subTitle: '축약어를 등록하면 해당 축약어로 검색이 가능합니다',
      scope: $scope,
      buttons: [
        { text: '취소' },
        {
          text: '<b>등록</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.abb) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.abb;
            }
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log('Tapped!', res);
      if(res != undefined) {
        LecturesService.register($scope.data).then(function(res) {
          var alertPopup = $ionicPopup.alert({
            title: '안내',
            template: '등록되었습니다',
            okText: "확인"
          });
        }, function(err) {
          var alertPopup = $ionicPopup.alert({
            title: '에러',
            template: '정보를 가져오는데 문제가 생겼습니다.',
            okText: "확인"
          });
        })
      }
    });
  };
})

.controller('BookmarkCtrl', function($scope, $ionicPopup, UsersService) {
  if(typeof analytics !== "undefined") { analytics.trackView("Bookmark Controller"); }

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

.controller('HotLecturesCtrl', function($scope, $ionicPopup, LecturesService) {
  if(typeof analytics !== "undefined") { analytics.trackView("Hot Lectures Controller"); }

  $scope.lectures = [];
  $scope.header = "";

  LecturesService.hotLiked().then(function(res) {
    $scope.lectures = res.data.lectures;
    $scope.header = res.data.header;
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })
})

.controller('LectureDetailCtrl', function($scope, $ionicPopup, LecturesService, $stateParams, $rootScope) {
  if(typeof analytics !== "undefined") { analytics.trackView("Lecture Detail Controller"); }

  $scope.tab = 1;
  $scope.lecture = {};
  $scope.remark = false;

  $scope.tabChanged = function(tab) {
    if($scope.tab != tab) {
      $scope.tab = tab;
    }
  }

  $scope.openLecture = function(lecture) {
    var url = 'http://sugang.snu.ac.kr/sugang/cc/cc101.action?openSchyy=2015&openShtmFg=U000200002&openDetaShtmFg=U000300001&sbjtCd=' + lecture.course.code + '&ltNo=' + lecture.code + '&sugangFlag=P';
    $rootScope.openWebview(url);
  }

  $scope.toggle = function(lectureId) {
    LecturesService.toggle(lectureId).then(function(res) {
      $scope.lecture.isBookmarked = res.data.isBookmarked;
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  };

  LecturesService.get($stateParams.lectureId).then(function(res) {
    $scope.lecture = res.data.lecture;
    $scope.lecture.isBookmarked = res.data.isBookmarked;
    $scope.lecture.bookmarkCount = res.data.bookmark_count;
    $scope.lecture.time_arr = $scope.lecture.time_str.split("/");
    $scope.lecture.location_arr = $scope.lecture.location_str.split("/");
    console.log($scope.lecture);
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })
})

.controller('MoreCtrl', function($scope, UsersService, $ionicPopup, SERVER, $rootScope, $cordovaEmailComposer, AuthService) {
  if(typeof analytics !== "undefined") { analytics.trackView("More Controller"); }

  $scope.options = {};
  console.log(appVersion);
  $scope.appVersion = appVersion;

  $scope.openHelp = function() {
    $rootScope.openWebview(SERVER.web + '/help');
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
    var uuid = AuthService.loadPushToken();
    var device = AuthService.loadDeviceInfo();
    UsersService.editOptions($scope.options, uuid, device).then(function(res) {
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
  if(typeof analytics !== "undefined") { analytics.trackView("Noti Controller"); }

  $scope.notis = [];
  $scope.header = "";

  UsersService.getNoti().then(function(res) {
    $scope.notis = res.data.notis;
    if($scope.notis.length == 0) {
      $scope.header = '즐겨찾기한 강좌의 변동사항이 없습니다.';
    } else {
      $scope.header = "";
    }
    console.log($scope.notis);
    console.log($scope.header);
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })
})
;
