

angular.module('capitalconnect.controllers')

.controller('BookingsCtrl', function($scope, $rootScope, $stateParams, $ionicModal, $ionicActionSheet, $timeout, $utils, $api) {

      $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {

      });

      $scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
            
      });

      $scope.getItemClass = function(status){
            if (status == 0) return "mb-color-gray";
            else if (status == 1) return "mb-color-white";
            else if (status == 2) return "mb-color-blue";
      }
})
