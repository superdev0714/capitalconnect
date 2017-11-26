

angular.module('capitalconnect.controllers')

.controller('HelpCtrl', function($scope, $rootScope, $stateParams, $ionicModal, $ionicActionSheet, $timeout, $utils, $api) {

      $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {

      });

      $scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
            
      });

      $scope.onPhone = function(ev){
      	var tel = $(ev.target).html();
      	tel = $utils.removeSpaces(tel).replace("(0)", "");
      	window.open('tel:'+tel, '_system');
      }

      $scope.onEmail = function(ev){
      	var email = $(ev.target).html();
		$utils.shareViaEmail(email, "CapitalConnect Enquiries & Feedbacks", "");
      }
})
