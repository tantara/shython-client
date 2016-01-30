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
          $scope.search($scope.lastQuery);
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

.controller('CreatePostCtrl', function($scope, $ionicPopup, PostsService, $ionicHistory) {
  if(typeof analytics !== "undefined") { analytics.trackView("Create Post Controller"); }

  $scope.form = {};

  $scope.write = function() {
    PostsService.register($scope.form).then(function(res) {
      var alertPopup = $ionicPopup.alert({
        title: '안내',
        template: '등록되었습니다',
        okText: "확인"
      });
      $ionicHistory.goBack();
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  };
})

.controller('PostDetailCtrl', function($scope, $ionicPopup, PostsService, $stateParams, $window) {
  if(typeof analytics !== "undefined") { analytics.trackView("Post Detail Controller"); }
  
  $scope.post = {};

  $scope.contact = function() {
    if($scope.post.link) {
      $window.open($scope.open.link, '_system', 'location=yes');
    } else {
      var alertPopup = $ionicPopup.alert({
        title: '안내',
        template: '등록된 연락처가 없습니다.',
        okText: "확인"
      });
    }
  }

  PostsService.get($stateParams.postId).then(function(res) {
    $scope.post = res.data.post;
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })
})

.controller('MarketCtrl', function($scope, $ionicPopup, PostsService) {
  if(typeof analytics !== "undefined") { analytics.trackView("Market Controller"); }

  $scope.canBeLoaded = true;
  $scope.lastId = 0;
  $scope.posts = [];
  $scope.header = "";

  $scope.loadMore = function() {
    PostsService.getLatest($scope.lastId).then(function(res) {
      $scope.canBeLoaded = res.data.load_more;
      $scope.posts = res.data.posts;
      if($scope.posts.length > 0) {
        $scope.lastId = $scope.posts[$scope.posts.length - 1].id;
      }
      if($scope.posts.length == 0) {
        $scope.header = "교환이 가능한 강의가 없습니다.";
      } else {
        $scope.header = "";
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
      $scope.$broadcast('scroll.infiniteScrollComplete');
    })
  }
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
    if(ionic.Platform.isWebView()) {
      $cordovaEmailComposer.isAvailable().then(function() {
        // is available
        var info = JSON.parse(AuthService.loadDeviceInfo());
        var token = AuthService.getUserCredentials();

        var infoStr = '<br>platform: ' + info.platform;
        infoStr += '<br>model: ' + info.model;
        infoStr += '<br>version: ' + info.version;
        infoStr += '<br>appVersion: ' + appVersion; 
        infoStr += '<br>ID: ' + token; 

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
    } else {
      var alertPopup = $ionicPopup.alert({
        title: '안내',
        template: 'help.shython@gmail.com로 메일을 보내주세요.',
        okText: "확인"
      });
    }
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

.controller('AutoCtrl', function($scope, $ionicPopup, AuthService) {
  if(typeof analytics !== "undefined") { analytics.trackView("Auto Controller"); }

  $scope.form = AuthService.tmpLoad();

  $scope.init = function() {
    $scope.form = {id: '', password: ''};
    AuthService.tmpInit();
    var alertPopup = $ionicPopup.alert({
      title: '안내',
      template: '자동 로그인 정보가 초기화되었습니다.',
      okText: "확인"
    });
  }

  $scope.save = function() {
    AuthService.tmpSave($scope.form.id, $scope.form.password);
    var alertPopup = $ionicPopup.alert({
      title: '안내',
      template: '자동 로그인 정보가 저장되었습니다.',
      okText: "확인"
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
