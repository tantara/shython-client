angular.module('starter.filters', [])

.filter('amFromUnix', function() {
  return function(ts) {
    return new Date(ts * 1000); 
  };
})
;