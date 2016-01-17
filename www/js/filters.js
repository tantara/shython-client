angular.module('starter.filters', [])

.filter('toTime', function() {
  return function(ts) {
    if(ts != undefined && ts.length > 0) {
      return new Date(ts);
    } else {
      return "";
    }
  };
})

.filter('amFromUnix', function() {
  return function(ts) {
    return new Date(ts * 1000); 
  };
})
;