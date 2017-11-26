

angular.module('capitalconnect.controllers')

.controller('GuestsCtrl', function($scope, $rootScope, $stateParams, $ionicModal, $timeout, $utils, $cordovaKeyboard) {

      $scope.guest_names = [];

      $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {

            if ($rootScope.CUR_BOOKING_DATA.guest_names.length > 0){
                  $scope.guest_names = $utils.clone($rootScope.CUR_BOOKING_DATA.guest_names);
                  return;
            }

            $scope.guest_names = [];
            $scope.guest_names.push({
                  first_name: $rootScope.ACCOUNT_DATA.first_name,
                  last_name: $rootScope.ACCOUNT_DATA.last_name
            });
            
            for (var i=0; i<$rootScope.CUR_BOOKING_DATA.guests_max-1; i++){
                  var guestName = {
                        first_name: "",
                        last_name: ""
                  };
                  $scope.guest_names.push(guestName);
            }

      });

      $scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
            
      });

      $scope.$watch(
            function () {
                  return $rootScope.CUR_BOOKING_DATA.guests;
            },
            function (guests) {
                  $utils.resizeScroll();
            }
      );

      $scope.onNext = function(){
      	if ($rootScope.CUR_BOOKING_DATA.guests == 0){
      		$utils.openAlert(CONFIG.g_invalid_guests_count);
      		return;
      	}

            var hasBlank = false;
            for (var i=0; i<$rootScope.CUR_BOOKING_DATA.guests; i++)
                  if (($scope.guest_names[i].first_name.trim().length == 0) || 
                      ($scope.guest_names[i].last_name.trim().length == 0)){
                        hasBlank = true;
                        break;
                  }

            if (hasBlank){
                  $utils.openAlert(CONFIG.g_fill_all_names);
                  return;
            }

            $rootScope.CUR_BOOKING_DATA.guest_names = $utils.clone($scope.guest_names);
      	$utils.goState("app.dates");
      };

      // $scope.focusHandler = function(e){
      //       $(e.target).focus();
      //       console.log("t");
      // }

      // $scope.onFocusName = function(e){
      //       $timeout($scope.focusHandler(e), 2000);
      // };
})

