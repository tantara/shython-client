require('./constants.js')
require('./templates.js')

module.exports = angular.module('starter.routes', ['starter.constants', 'starter.templates'])

.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('intro', {
    url: '/intro',
    templateUrl: 'intro.html',
    controller: 'IntroCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'tabs.html',
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
        templateUrl: 'tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.bookmark', {
    url: '/bookmark',
    views: {
      'tab-bookmark': {
        templateUrl: 'tab-bookmark.html',
        controller: 'BookmarkCtrl'
      }
    }
  })

  .state('tab.home-noti', {
    url: '/home/noti',
    views: {
      'tab-home': {
        templateUrl: 'home-noti.html',
        controller: 'NotiCtrl'
      }
    }
  })

  .state('tab.bookmark-hot-lectures', {
    url: '/bookmark/hot',
    views: {
      'tab-bookmark': {
        templateUrl: 'hot-lectures.html',
        controller: 'HotLecturesCtrl'
      }
    }
  })

  .state('tab.market', {
    url: '/market',
    views: {
      'tab-market': {
        templateUrl: 'tab-market.html',
        controller: 'MarketCtrl'
      }
    }
  })

  .state('tab.market-create-post', {
    url: '/market/create',
    views: {
      'tab-market': {
        templateUrl: 'post-create.html',
        controller: 'CreatePostCtrl'
      }
    }
  })

  .state('tab.market-post-detail', {
    url: '/market/:postId',
    views: {
      'tab-market': {
        templateUrl: 'post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })

  .state('tab.more', {
    url: '/more',
    views: {
      'tab-more': {
        templateUrl: 'tab-more.html',
        controller: 'MoreCtrl'
      }
    }
  })

  .state('tab.more-profile', {
    url: '/more/profile',
    views: {
      'tab-more': {
        templateUrl: 'more-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.more-auto', {
    url: '/more/auto',
    views: {
      'tab-more': {
        templateUrl: 'more-auto.html',
        controller: 'AutoCtrl'
      }
    }
  })

  .state('tab.more-tips', {
    url: '/more/tips',
    views: {
      'tab-more': {
        templateUrl: 'more-tips.html',
        controller: 'TipsCtrl'
      }
    }
  })

  .state('tab.more-noti', {
    url: '/more/noti',
    views: {
      'tab-more': {
        templateUrl: 'more-noti.html',
        controller: 'NotiCtrl'
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  if(window.localStorage['yourTokenKey']){
    $urlRouterProvider.otherwise('/tab/home');
  }else{
    $urlRouterProvider.otherwise('/intro');
  }
});
