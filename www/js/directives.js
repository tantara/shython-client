angular.module('starter.directives', [])

.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
})

.directive('ngQuota', function() {
  return function(scope, element, attrs) {
    attrs.$observe('quota', function(val){
      element.removeClass('assertive');
      element.removeClass('balanced');
      if(attrs.cur >= attrs.quota) {
        element.addClass('assertive');
      } else {
        element.addClass('balanced');
      }
    });
  };
});
