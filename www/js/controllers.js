var _ = require('underscore');

module.exports = angular.module('starter.controllers', [])

.controller('TabCtrl', function($scope, $state) {
})

.controller('IntroCtrl', function($scope, $state, AuthService, $ionicPopup, $stateParams, $window, AuthService, UsersService, $rootScope) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Intro Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

  $scope.start  = function() {
    var key = $rootScope.makeKey();
    var user = {key: key};
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

.controller('HomeCtrl', function($scope, $ionicPopup, LecturesService, UsersService, AuthService, $ionicPopup, ProfileService, StatService, $rootScope, $cordovaKeychain, $state, $timeout) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Home Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

  $scope.searchForm = {};
  $scope.season = "";
  $scope.lectures = [];
  $scope.header = "";
  $scope.abb = [];
  $scope.abbText = "";
  $scope.notice = "";
  $scope.mode = "hot";
  $scope.lastQuery = "";
  $scope.banner = {};
  $scope.unread = 0;
  $scope.period = {};
  $scope.current = "";
  //$scope.banner.image = "https://ssl.pstatic.net/sstatic/keypage/outside/scui/chuseok_2015/img/bg_banner.png";
  //$scope.banner.url = "http://naver.com"

  $scope.webPushEnabled = false;
  $scope.activateWebPush = function() {
    if(!ionic.Platform.isWebView()) {
      if($scope.webPushEnabled == true) {
        var alertPopup = $ionicPopup.alert({
          title: '안내',
          template: '데스크탑 혹은 모바일 브라우저에서도 알림을 받으실 수 있습니다. 단, 크롬만 지원합니다.',
          okText: "확인"
        });
        alertPopup.then(function(res) {
          $scope.webPushEnabled = true;
          activate();
        });
      }
    }
  }

  $scope.goToNoti = function() {
    $state.go('tab.home-noti');
    $scope.unread = 0;
  }

  $scope.showPeriodForm = function() {
    $scope.periodForm = {};
    $scope.periodForm.period = $scope.current;
    $scope.keys = Object.keys($scope.period);

    var myPopup = $ionicPopup.show({
      template: '<div class="list"><div class="item item-input item-select"><div class="input-label">학기</div><select ng-model="periodForm.period"><option ng-repeat="key in keys" value="{{key}}" ng-selected="key == periodForm.period">{{period[key]}}</option></select></div></div>',
      title: "학기를 선택해주세요.",
      subTitle: "해당 학기의 과목들을 검색합니다.",
      scope: $scope,
      buttons: [
        { text: '취소' },
        {
          text: '<b>선택</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.periodForm.period) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.periodForm.period;
            }
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log(res);
      if(res != undefined) {
        $scope.current = res;
        $scope.season = $scope.period[$scope.current];
      }
    });
  }

  $scope.showProfileForm = function() {
    $scope.profileForm = {};
    $scope.years = _.range(2016, 1990, -1);

    var myPopup = $ionicPopup.show({
      template: '<div class="list"><div class="item item-input item-select"><div class="input-label">입학년도</div><select ng-model="profileForm.year"><option ng-value="">선택해주세요</option><option ng-repeat="year in years" ng-value="{{year}}">{{year}}년</option></select></div><div class="item item-input item-select"><div class="input-label">학적</div><select ng-model="profileForm.state"><option ng-value="">선택해주세요</option><option value="graduate">학부생</option><option value="master">석사</option><option value="doctor">박사</option></select></div></div>',
      title: "입학년도와 학적을 입력해주세요.",
      subTitle: "알림을 효율적으로 보내는 데 사용됩니다. 자세한 내용은 '더보기 > 프로필 수정'을 확인하세요.",
      scope: $scope,
      buttons: [
        { text: '나중에 하기' },
        {
          text: '<b>등록</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.profileForm.year) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.profileForm.year;
            }
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log('Tapped!', res);
      if(res != undefined) {
        ProfileService.edit($scope.profileForm).then(function(res) {
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
  }

  $scope.configure = function() {
    UsersService.configure().then(function(res) {
      console.log(res);
      $scope.activateWebPush();
      if(ionic.Platform.isIOS()) {
        var key = "oldKey";
        var servicename = "shython";

        if(window.Keychain) {
          var value = res.key;
          $cordovaKeychain.setForKey(key, servicename, value).then(function(res) {
            console.log("new key: " + value);
            AuthService.storeUID(value);
          }, function(err) {
            console.log('later');
          });
        }
      }

      if(res.show_profile_form) {
        $scope.showProfileForm();
      } else if(res.show_notice_with_url) {
        var url = res.url_notice.data;
        StatService.checkNotice(res.url_notice).then(function(res) {
          console.log(res);
          $timeout(function() { $rootScope.openWebview(url) }, 4000);
        }, function(err) {
          console.log(err);
        });
      }
      if(res.show_ad) {
        $rootScope.openAd();
      }
    }, function(err) {
    });
  }
  $scope.configure();

  $scope.doRefresh = function() {
    if($scope.lastQuery.length == 0) {
      $scope.init();
    } else {
      $scope.search($scope.lastQuery);
    }
  }

  $scope.init = function() {
    $scope.lastQuery = "";
    $scope.searchForm.query = "";
    LecturesService.hot().then(function(res) {
      $scope.mode = "hot";
      $scope.lectures = res.lectures;
      $scope.header = res.header;
      $scope.abb = res.abb;
      $scope.abbText = res.abb_text;
      $scope.notice = res.notice;
      $scope.banner = res.banner;
      $scope.unread = res.unread;
      $scope.period = res.period;
      if($scope.season.length == 0) {
        $scope.season = res.season;
        $scope.current = res.current;
      }
      $scope.$broadcast('scroll.refreshComplete');
    }, function(err) {
      $scope.$broadcast('scroll.refreshComplete');
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
    LecturesService.search(query, $scope.current).then(function(res) {
      $scope.mode = "search";
      $scope.lectures = res.lectures;
      $scope.header = res.header;
      $scope.abb = res.abb;
      $scope.abbText = res.abb_text;
      //$scope.season = res.season;
      $scope.notice = res.notice;
      $scope.banner = res.banner;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(err) {
      $scope.$broadcast('scroll.refreshComplete');
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  };

  $scope.openAd = function(banner) {
    StatService.clickAd(banner).then(function(res) {
      console.log(res);
    }, function(err) {
      console.log(err);
    });
    $rootScope.openExternal(banner.url);
  }

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

.controller('BookmarkCtrl', function($scope, $ionicPopup, UsersService, $rootScope) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Bookmark Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

  $scope.lectures = [];
  $scope.header = "";
  $scope.notice = "";
  $scope.recommend_lectures = [];
  $scope.recommend_header = "";

  $scope.doRefresh = function() {
    $scope.init();
  }

  $scope.showLecture = function(lecture) {
    $rootScope.showLecture(lecture, function() {
      $scope.init();
    })
  }

  $scope.init = function() {
    UsersService.getBookmark().then(function(res) {
      $scope.lectures = res.lectures;
      if($scope.lectures.length == 0) {
        $scope.header = "즐겨찾기한 강좌가 없습니다.";
      } else {
        $scope.header = res.header;
      }
      $scope.notice = res.notice;
      $scope.recommend_lectures = res.recommend_lectures;
      $scope.recommend_header = res.recommend_header;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(err) {
      $scope.$broadcast('scroll.refreshComplete');
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  }
  $scope.init();
})

.controller('HotLecturesCtrl', function($scope, $ionicPopup, LecturesService) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Hot Lectures Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

  $scope.lectures = [];
  $scope.header = "";
  $scope.notice = "";

  $scope.doRefresh = function() {
    $scope.init();
  }

  $scope.init = function() {
    LecturesService.hotLiked().then(function(res) {
      $scope.lectures = res.lectures;
      $scope.header = res.header;
      $scope.notice = res.notice;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(err) {
      $scope.$broadcast('scroll.refreshComplete');
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  }
  $scope.init();
})

.controller('LectureDetailCtrl', function($scope, $ionicPopup, LecturesService, $stateParams, $rootScope, AuthService, $cordovaInAppBrowser, $cordovaEmailComposer, $ionicActionSheet, $rootScope) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Lecture Detail Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

  $scope.tab = 1;
  $scope.similar_lectures = [];
  $scope.remark = false;
  $scope.notice = ""

  $scope.showDetail = function() {
    var buttons = []
    , text = "";

    // open course
    text = "[교과목] " + $scope.lecture.course.name;
    if(!ionic.Platform.isIOS()) {
      text = '<i class="icon ion-easel"></i> ' + text;
    }
    buttons.push({ text: text });

    // open instructor
    text = "[강의자] " + $scope.lecture.instructor.name;
    if(!ionic.Platform.isIOS()) {
      text = '<i class="icon ion-person"></i> ' + text;
    }
    buttons.push({ text: text });

    var hideSheet = $ionicActionSheet.show({
      buttons: buttons,
      titleText: "세부정보",
      cancelText: "닫기",
      cancel: function() {
      },
      buttonClicked: function(index) { // zero base
        if(index == 0) {
          $rootScope.showCourse($scope.lecture.course.id);
        } else if(index == 1) {
          $rootScope.showInstructor($scope.lecture.instructor.id);
        }
        return true;
      }
    });
  }

  $scope.tabChanged = function(tab) {
    if($scope.tab != tab) {
      $scope.tab = tab;
    }
  }

  $scope.sendMail = function(lecture) {
    var to = lecture.instructor.email;
    if(to == undefined || to.length == 0) {
      var alertPopup = $ionicPopup.alert({
        title: '안내',
        template: '교수님의 이메일 정보가 없습니다. 수강편람 혹은 교수님 연구실 페이지를 이용해주세요.',
        okText: "확인"
      });
    } else {
      if(ionic.Platform.isWebView()) {
        $cordovaEmailComposer.isAvailable().then(function() {
          var alertPopup = $ionicPopup.alert({
            title: '안내',
            template: '초안지 메일 내용은 예시입니다. 상황에 맞게 수정해서 사용하시길 바랍니다 :)',
            okText: "확인"
          });

          alertPopup.then(function(res) {
            var subject = lecture.course.name + ' 수업 수강을 희망하는 컴퓨터공학부 학생입니다.'
            var body = "[예시]\n" +
              "<br>\n" +
              "<br>\n" +
              "안녕하세요. " + lecture.instructor.name + "교수님.\n" +
              "<br>\n" +
              "<br>\n" +
              "저는 이번 학기에 " + lecture.course.name + "의 수업을 듣고 싶은 컴퓨터공학부 학생입니다.\n" +
              "<br>\n" +
              "해당 과목에 수강생이 몰려서 수강신청을 하지 못했습니다.\n" +
              "<br>\n" +
              "<br>\n" +
              "혹시 자리가 남는다면 초안지를 신청해도 될까요??\n" +
              "<br>\n" +
              "<br>\n" +
              "끝까지 읽어주셔서 감사합니다!!\n";
            var email = {
              to: to,
              subject: subject,
              body: body + "<br><br>",
              isHtml: true
            };

            $cordovaEmailComposer.open(email).then(null, function () {
              // user cancelled email
            });
          });
        }, function () {
          // not available
          var alertPopup = $ionicPopup.alert({
            title: '안내',
            template: '교수님의 이메일은 ' + to + '입니다.',
            okText: "확인"
          });
        });
      } else {
        var alertPopup = $ionicPopup.alert({
          title: '안내',
          template: '교수님의 이메일은 ' + to + '입니다.',
          okText: "확인"
        });
      }
    }
  }

  $scope.registerLecture = function(lecture) {
    $rootScope.openSugang();
  }

  $scope.openLecture = function(lecture) {
    var url = 'https://sugang.snu.ac.kr/sugang/cc/cc101.action?' + lecture.syllabus + '&sbjtCd=' + lecture.course.code + '&ltNo=' + lecture.code + '&sugangFlag=P';
    $rootScope.openWebview(url);
  }

  $scope.toggle = function(lectureId) {
    LecturesService.toggle(lectureId).then(function(res) {
      $scope.lecture.isBookmarked = res.isBookmarked;
      if($scope.lecture.isBookmarked) {
        $rootScope.showToast('알림이 등록되었습니다.');
      } else {
        $rootScope.showToast('알림이 해제되었습니다.');
      }
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  };

  $scope.init = function() {
    console.log($scope.lecture);
    LecturesService.get($scope.lecture.id).then(function(res) {
      $scope.lecture = res.lecture;
      $scope.similar_lectures = res.similar_lectures;
      $scope.similar_header = res.similar_header;
      $scope.lecture.isBookmarked = res.isBookmarked;
      $scope.lecture.bookmarkCount = res.bookmark_count;
      $scope.lecture.time_arr = $scope.lecture.time_str.split("/");
      $scope.lecture.location_arr = $scope.lecture.location_str.split("/");
      $scope.notice = res.notice;
      console.log($scope.lecture);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  }
})

.controller('CreatePostCtrl', function($scope, $ionicPopup, PostsService, $ionicHistory) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Create Post Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

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

.controller('CourseDetailCtrl', function($scope, $ionicPopup, CoursesService) {
  /*$scope.$on('$ionicView.enter', function() {
    var ctrlName = "Course Detail Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })*/

  var ctrlName = "Course Detail Controller";
  console.log(ctrlName);
  if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }

  CoursesService.get($scope.course.id).then(function(res) {
    $scope.course = res.course;
    $scope.notice = res.notice;
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })
})

.controller('InstructorDetailCtrl', function($scope, $ionicPopup, InstructorsService) {
  /*$scope.$on('$ionicView.enter', function() {
    var ctrlName = "Instructor Detail Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })*/

  var ctrlName = "Instructor Detail Controller";
  console.log(ctrlName);
  if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }

  InstructorsService.get($scope.instructor.id).then(function(res) {
    $scope.instructor = res.instructor;
    $scope.notice = res.notice;
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })
})

.controller('PostDetailCtrl', function($scope, $ionicPopup, PostsService, $stateParams, $window, CommentsService) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Post Detail Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

  console.log($scope.post);
  //$scope.post = {};
  $scope.notice = "";
  $scope.form = {}
  $scope.loaded = true;

  $scope.refreshComments = function() {
    if(!$scope.loaded) return;

    $scope.loaded = false;

    PostsService.getComments($stateParams.postId).then(function(res) {
      $scope.loaded = true;
      $scope.post.comments = res.comments;
    }, function(err) {
      $scope.loaded = true;
      $scope.post.comments = res.comments;
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  }

  $scope.blocked = false;
  $scope.write = function() {
    $scope.form.post_id = $stateParams.postId;
    $scope.blocked = true;

    CommentsService.register($scope.form).then(function(res) {
      if(res.success) {
        $scope.form.content = "";
        $scope.post.comments = $scope.post.comments.concat(res.comment);
      }
      $scope.blocked = false;
    }, function(err) {
      $scope.blocked = false;
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  }

  $scope.contact = function() {
    if($scope.post.link) {
      $window.open($scope.post.link, '_system', 'location=yes');
    } else {
      var alertPopup = $ionicPopup.alert({
        title: '안내',
        template: '등록된 연락처가 없습니다.',
        okText: "확인"
      });
    }
  }

  PostsService.get($scope.post.id).then(function(res) {
    $scope.post = res.post;
    $scope.notice = res.notice;
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })
})

.controller('MarketCtrl', function($scope, $ionicPopup, PostsService) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Market Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

  $scope.canBeLoaded = true;
  $scope.lastId = 0;
  $scope.posts = [];
  $scope.header = "";
  $scope.notice = "";
  $scope.boardKey = "";
  $scope.board = "";
  $scope.boards = {};

  $scope.showBoards = function() {
    $scope.boardForm = {};
    $scope.boardForm.key = $scope.boardKey;
    $scope.keys = Object.keys($scope.boards);

    var myPopup = $ionicPopup.show({
      template: '<div class="list"><div class="item item-input item-select"><div class="input-label">게시판</div><select ng-model="boardForm.key"><option ng-repeat="key in keys" value="{{key}}" ng-selected="key == boardForm.key">{{boards[key].name}}</option></select></div></div>',
      title: "게시판을 선택해주세요.",
      subTitle: "강의, 책 등을 교환하는 글을 올리는 게시판입니다.",
      scope: $scope,
      buttons: [
        { text: '취소' },
        {
          text: '<b>선택</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.boardForm.key) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.boardForm.key;
            }
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log(res);
      if(res != undefined) {
        console.log(res);
        var boardKey = res;
        if($scope.boardKey != boardKey) {
          $scope.boardKey = boardKey;
          $scope.board = $scope.boards[$scope.boardKey].name;
          $scope.lastId = 0;
          $scope.posts = [];
          $scope.loadMore();
        }
      }
    });
  }

  $scope.doRefresh = function() {
    $scope.lastId = 0;
    $scope.canBeLoaded = false;
    $scope.loadMore();
  }

  $scope.loadMore = function() {
    PostsService.getLatest($scope.lastId, $scope.boardKey).then(function(res) {
      if($scope.lastId == 0) $scope.posts = [];
      $scope.canBeLoaded = res.load_more;
      $scope.posts = $scope.posts.concat(res.posts);
      if($scope.posts.length > 0) {
        $scope.lastId = $scope.posts[$scope.posts.length - 1].id;
      }
      if($scope.posts.length == 0) {
        $scope.header = "교환이 가능한 항목이 없습니다.";
      } else {
        $scope.header = res.header;
      }
      $scope.notice = res.notice;
      $scope.boards = res.boards;
      if($scope.boardKey.length <= 0) {
        $scope.boardKey = res.current;
        $scope.board = $scope.boards[$scope.boardKey].name;
      }
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, function(err) {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.canBeLoaded = false;
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  }
})

.controller('MoreCtrl', function($scope, UsersService, $ionicPopup, SERVER, $rootScope, $cordovaEmailComposer, AuthService) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "More Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

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
        infoStr += '<br>ID: ' + token.substring(0, 8); 

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
    $scope.options = res;
    $scope.latestVersion = appVersion;
    var uuid = AuthService.loadPushToken();
    if(uuid == undefined || uuid.length == 0) {
      $scope.options.on = false;
    }
    if(ionic.Platform.isIOS()) {
      $scope.latestVersion = $scope.options.version.ios;
    } else if(ionic.Platform.isAndroid()) {
      $scope.latestVersion = $scope.options.version.android;
    }
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  });

  $scope.change = function() {
    if(!ionic.Platform.isWebView()) {
      var alertPopup = $ionicPopup.alert({
        title: '안내',
        template: "웹 버전 알림은 크롬 브라우저에서만 동작합니다. 크롬 브라우저들 사용하시는 경우에는 '검색 탭' 이동 후 새로고침을 해주세요.",
        okText: "확인"
      });
    } else {
      var uuid = AuthService.loadPushToken();
      if((uuid == undefined || uuid.length == 0) || $scope.options.no_device) {
        $scope.options.on = false;
        $rootScope.initPush();
      } else {
        var device = AuthService.loadDeviceInfo();
        UsersService.editOptions($scope.options, uuid, device).then(function(res) {
          var alertPopup = $ionicPopup.alert({
            title: '안내',
            template: res.msg,
            okText: "확인"
          });
          $scope.options = res.options;
        }, function(err) {
          var alertPopup = $ionicPopup.alert({
            title: '에러',
            template: '정보를 가져오는데 문제가 생겼습니다.',
            okText: "확인"
          });
        });
      }
    }
  }
})

.controller('ProfileCtrl', function($scope, $ionicPopup, ProfileService) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Profile Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

  $scope.profileForm = {};
  $scope.years = _.range(2016, 1990, -1);
  $scope.notice = "";

  ProfileService.get().then(function(res) {
    $scope.profileForm = res.profile;
    $scope.notice = res.notice;
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  });


  $scope.save = function() {
    ProfileService.edit($scope.profileForm).then(function(res) {
      $scope.profileForm = res.profile;
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
})

.controller('AutoCtrl', function($scope, $ionicPopup, AuthService) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Auto Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

  $scope.form = AuthService.tmpLoad();
  $scope.oldTs = AuthService.tmpTimeLoad();
  $scope.isSet = $scope.form.id.length > 0 && $scope.form.password.length > 0;
  console.log($scope.isSet);
  console.log($scope.oldTs);

  $scope.init = function() {
    $scope.form = {id: '', password: ''};
    $scope.isSet = $scope.form.id.length > 0 && $scope.form.password.length > 0;
    AuthService.tmpInit();
    AuthService.tmpTimeInit();
    var alertPopup = $ionicPopup.alert({
      title: '안내',
      template: '자동 로그인 정보가 초기화되었습니다.',
      okText: "확인"
    });
  }

  $scope.initTime = function() {
    $scope.oldTs = 0;
    AuthService.tmpTimeInit();
    var alertPopup = $ionicPopup.alert({
      title: '안내',
      template: '자동 로그인이 활성화되었습니다.',
      okText: "확인"
    });
  }

  $scope.save = function() {
    $scope.isSet = $scope.form.id.length > 0 && $scope.form.password.length > 0;
    AuthService.tmpTimeInit();
    AuthService.tmpSave($scope.form.id, $scope.form.password);
    var alertPopup = $ionicPopup.alert({
      title: '안내',
      template: '자동 로그인 정보가 저장되었습니다.',
      okText: "확인"
    });
  }
})

.controller('TipsCtrl', function($scope, $ionicPopup, TipsService) {
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Tips Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

  $scope.tips = [];
  $scope.header = "";
  $scope.notice = "";

  $scope.init = function() {
    TipsService.getAll().then(function(res) {
      $scope.tips = res.tips;
      $scope.header = res.header;
      $scope.notice = res.notice;
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    });
  }
  $scope.init();

  $scope.save = function(form) {
    TipsService.save(form).then(function(res) {
      var alertPopup = $ionicPopup.alert({
        title: '안내',
        template: '등록되었습니다.',
        okText: "확인"
      });
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
  $scope.$on('$ionicView.enter', function() {
    var ctrlName = "Noti Controller";
    console.log(ctrlName);
    if(typeof analytics !== "undefined") { analytics.trackView(ctrlName); }
  })

  $scope.notis = [];
  $scope.header = "";
  $scope.notice = "";

  $scope.doRefresh = function() {
    $scope.init();
  }

  $scope.init = function() {
    UsersService.getNoti().then(function(res) {
      $scope.notis = res.notis;
      $scope.notice = res.notice;
      if($scope.notis.length == 0) {
        $scope.header = '즐겨찾기한 강좌의 변동사항이 없습니다.';
      } else {
        $scope.header = res.header;
      }
      $scope.$broadcast('scroll.refreshComplete');
    }, function(err) {
      $scope.$broadcast('scroll.refreshComplete');
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  }
  $scope.init();
})
;
