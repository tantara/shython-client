angular.module('starter.controllers', [])

.controller('TabCtrl', function($scope, $state) {
})

.controller('IntroCtrl', function($scope, $state, AuthService, $ionicPopup, $stateParams, $window, AuthService) {
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

.controller('HomeCtrl', function($scope, $ionicPopup, $cordovaInAppBrowser, LecturesService) {
  $scope.searchForm = {};
  $scope.lectures = [];

  $scope.openLecture = function(lecture) {

    if(ionic.Platform.isWebView()) {
      var options = {
        location: 'no',
        clearcache: 'yes',
        toolbar: 'yes'
      };
      $cordovaInAppBrowser.open('https://sugang.snu.ac.kr/' + username, '_blank', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
    } else {
      $window.open('https://sugang.snu.ac.kr/' + username, '_blank');
    }
  }

  $scope.search = function(form) {
    LecturesService.search(form.query).then(function(res) {
      $scope.lectures = res.data.lectures;
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: '에러',
        template: '정보를 가져오는데 문제가 생겼습니다.',
        okText: "확인"
      });
    })
  };
})

.controller('BookmarkCtrl', function($scope, $ionicPopup, $cordovaInAppBrowser, UsersService) {
  $scope.lectures = [];

  $scope.openLecture = function(lecture) {

    if(ionic.Platform.isWebView()) {
      var options = {
        location: 'no',
        clearcache: 'yes',
        toolbar: 'yes'
      };
      $cordovaInAppBrowser.open('https://sugang.snu.ac.kr/' + username, '_blank', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
    } else {
      $window.open('https://sugang.snu.ac.kr/' + username, '_blank');
    }
  }

  UsersService.getBookmark().then(function(res) {
    $scope.lectures = res.data.lectures;
  }, function(err) {
    var alertPopup = $ionicPopup.alert({
      title: '에러',
      template: '정보를 가져오는데 문제가 생겼습니다.',
      okText: "확인"
    });
  })
})

.controller('LectureDetailCtrl', function($scope, $ionicPopup, $cordovaInAppBrowser, LecturesService, $stateParams) {
  $scope.lecture = {};

  $scope.openLecture = function(lecture) {

    if(ionic.Platform.isWebView()) {
      var options = {
        location: 'no',
        clearcache: 'yes',
        toolbar: 'yes'
      };
      $cordovaInAppBrowser.open('https://sugang.snu.ac.kr/' + lecture, '_blank', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
    } else {
      $window.open('https://sugang.snu.ac.kr/' + username, '_blank');
    }
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

.controller('MoreCtrl', function($scope, UsersService, $ionicPopup) {

  $scope.options = {};

  UsersService.getOptions().then(function(res) {
    $scope.options = res;
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
;
