module.exports = angular.module('starter.constants', [])

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.constant('SERVER', {
  host: 'http://192.168.0.36:5050',
  //host: 'https://api-sugang.snu.ac',
  web: 'https://sugang.snu.ac',
})

.constant('USER_ROLES', {
  user: 'user_role',
  guest: 'guest_role'
})
