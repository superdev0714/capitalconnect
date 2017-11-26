

angular.module('capitalconnect.controllers')

.controller('FinalCtrl', function($scope, $rootScope, $stateParams, $ionicModal, $ionicHistory, $timeout, $utils, $cordovaKeyboard) {

      $scope.$on( "$ionicView.afterEnter", function( scopes, states ) {

            if ($rootScope.CUR_BOOKING_DATA.success) $ionicHistory.clearHistory();
      });

      $scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
            
      });

      $scope.getNextCaption = function(){
            if ($rootScope.CUR_BOOKING_DATA.success) return "Done";
            return "Try Again";
      }

      $scope.getCaption = function(){
            if ($rootScope.CUR_BOOKING_DATA.success) return CONFIG.rd_thank_you;
            return CONFIG.rd_sorry;
      }

      $scope.getStatusClass = function(){
            if ($rootScope.CUR_BOOKING_DATA.success) return "f-icon-success";
            return "f-icon-failure";
      }

      $scope.getMessage = function(){
            if ($rootScope.CUR_BOOKING_DATA.success) return CONFIG.rd_booking_succeed;
            return CONFIG.rd_booking_failed;
      }

      $scope.onNext = function(){
            if ($rootScope.CUR_BOOKING_DATA.success)
                  $utils.goState("app.home", {});
            else
                  $ionicHistory.goBack(-1);
      }

      $scope.getDurationText = function(){

            if (!$rootScope.CUR_BOOKING_DATA.bookingDate) return;

            return $utils.getODateString($rootScope.CUR_BOOKING_DATA.bookingDate.fromDT) + " - " +
                   $utils.getODateString($rootScope.CUR_BOOKING_DATA.bookingDate.toDT);
      }
})

