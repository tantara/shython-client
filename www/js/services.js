angular.module('starter.services', [])

.service('LecturesService', function($q, $http, SERVER) {
  var hot = function(q) {
    return $q(function(resolve, reject) {
      $http({
        method: 'GET',
        url: SERVER.host + '/api/v1/lectures/hot'
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('failed.');
      });
    });
  };

  var hotLiked = function(q) {
    return $q(function(resolve, reject) {
      $http({
        method: 'GET',
        url: SERVER.host + '/api/v1/lectures/hot/liked'
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('failed.');
      });
    });
  };

  var search = function(q) {
    return $q(function(resolve, reject) {
      $http({
        method: 'GET',
        url: SERVER.host + '/api/v1/lectures/search?q=' + q
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('failed.');
      });
    });
  };

  var get = function(lectureId) {
    return $q(function(resolve, reject) {
      $http({
        method: 'GET',
        url: SERVER.host + '/api/v1/lectures/' + lectureId
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('failed.');
      });
    });
  };

  var toggle = function(lectureId) {
    return $q(function(resolve, reject) {
      $http({
        method: 'POST',
        url: SERVER.host + '/api/v1/lectures/' + lectureId +  '/toggle'
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('failed.');
      });
    });
  };

  var register = function(data) {
    return $q(function(resolve, reject) {
      $http({
        method: 'POST',
        url: SERVER.host + '/api/v1/lectures/register',
        data: data
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('failed.');
      });
    });
  };

  return {
    get: get,
    search: search,
    hot: hot,
    hotLiked: hotLiked,
    toggle: toggle,
    register: register
  };
})

.service('UsersService', function($q, $http, SERVER) {
  var me = function() {
    return $q(function(resolve, reject) {
      $http({
        method: 'GET',
        url: SERVER.host + '/api/v1/users/me'
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('Signup Failed.');
      });
    });
  };

  var getBookmark = function() {
    return $q(function(resolve, reject) {
      $http({
        method: 'GET',
        url: SERVER.host + '/api/v1/users/me/bookmark'
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('Signup Failed.');
      });
    });
  };

  var getNoti = function() {
    return $q(function(resolve, reject) {
      $http({
        method: 'GET',
        url: SERVER.host + '/api/v1/users/me/noti'
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('Signup Failed.');
      });
    });
  };

  var getOptions = function() {
    return $q(function(resolve, reject) {
      $http({
        method: 'GET',
        url: SERVER.host + '/api/v1/users/me/options'
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('Signup Failed.');
      });
    });
  };

  var editOptions = function(options, uuid, device) {
    return $q(function(resolve, reject) {
      $http({
        method: 'PUT',
        url: SERVER.host + '/api/v1/users/me/options',
        data: {device: options, uuid: uuid, device_info: device}
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('Signup Failed.');
      });
    });
  };

  var saveDevice = function(uuid, device) {
    return $q(function(resolve, reject) {
      $http({
        method: 'POST',
        url: SERVER.host + '/api/v1/users/me/device',
        data: {uuid: uuid, device: device}
      }).then(function successCallback(response) {
        console.log(response);
        resolve(response);
      }, function errorCallback(response) {
        reject('failed.');
      });
    });
  };

  return {
    getBookmark: getBookmark,
    getNoti: getNoti,
    getOptions: getOptions,
    editOptions: editOptions,
    saveDevice: saveDevice
  };
})

.service('AuthService', function($q, $http, USER_ROLES, SERVER) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var LOCAL_DEVICE_INFO_KEY = 'yourDeviceInfoKey';
  var LOCAL_PUSH_TOKEN_KEY = 'yourPushTokenKey';
  var LOCAL_USER_INFO_KEY = 'yourUserInfoKey';
  var isAuthenticated = false;
  var role = '';
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function storeDeviceInfo(info) {
    window.localStorage.setItem(LOCAL_DEVICE_INFO_KEY, JSON.stringify(info));
    useDevice(info);
  }

  function loadDeviceInfo() {
    return window.localStorage.getItem(LOCAL_DEVICE_INFO_KEY);
  }

  function storePushToken(token) {
    window.localStorage.setItem(LOCAL_PUSH_TOKEN_KEY, token);
  }

  function loadPushToken() {
    return window.localStorage.getItem(LOCAL_PUSH_TOKEN_KEY);
  }

  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    role = USER_ROLES.user

    // Set the token as header for your requests!
    $http.defaults.headers.common['X-AUTH-TOKEN'] = token;
  }

  function useDevice(info) {
    $http.defaults.headers.common['X-DEVICE-UUID'] = info.uuid;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common['X-AUTH-TOKEN'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var start = function(user) {
    return $q(function(resolve, reject) {
      $http({
        method: 'POST',
        url: SERVER.host + '/api/v1/users',
        data: {user: user}
      }).then(function successCallback(response) {
        console.log(response);
        storeUserCredentials(response.data.token);
        resolve('success.');
      }, function errorCallback(response) {
        reject('failed.');
      });
    });
  };

  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };

  loadUserCredentials();

  return {
    start: start,
    storeDeviceInfo: storeDeviceInfo,
    loadDeviceInfo: loadDeviceInfo,
    storePushToken: storePushToken,
    loadPushToken: loadPushToken,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    role: function() {return role;}
  };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    request: function(config) {
      $rootScope.showLoading(config);
      return config;
    },
    response: function(response) {
      $rootScope.hideLoading(response.config);
      return response;
    },
    responseError: function (response) {
      $rootScope.hideLoading(response.config);
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})
