angular.module('starter.routes', [])

.constant('USER_ROLES', {
  user: 'user_role',
  guest: 'guest_role'
})

.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabCtrl',
    data: {
      authorizedRoles: [USER_ROLES.user]
    }
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.bookmark', {
    url: '/bookmark',
    views: {
      'tab-bookmark': {
        templateUrl: 'templates/tab-bookmark.html',
        controller: 'BookmarkCtrl'
      }
    }
  })

  .state('tab.lectures', {
    url: '/lectures',
    views: {
      'tab-lectures': {
        templateUrl: 'templates/tab-lectures.html',
        controller: 'LecturesCtrl'
      }
    }
  })

  .state('tab.home-lecture-detail', {
    url: '/home/lectures/:lectureId',
    views: {
      'tab-home': {
        templateUrl: 'templates/lecture-detail.html',
        controller: 'LectureDetailCtrl'
      }
    }
  })

  .state('tab.bookmark-lecture-detail', {
    url: '/bookmark/lectures/:lectureId',
    views: {
      'tab-bookmark': {
        templateUrl: 'templates/lecture-detail.html',
        controller: 'LectureDetailCtrl'
      }
    }
  })

  .state('tab.more', {
    url: '/more',
    views: {
      'tab-more': {
        templateUrl: 'templates/tab-more.html',
        controller: 'MoreCtrl'
      }
    }
  })

  .state('tab.noti', {
    url: '/more/noti',
    views: {
      'tab-more': {
        templateUrl: 'templates/more-noti.html',
        controller: 'NotiCtrl'
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/intro');
});
