

angular.module('capitalconnect.controllers')

.controller('WelcomeCtrl', function($scope, $rootScope, $ionicModal, $timeout, $utils) {

	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {

	});

	$scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
		
	});

	$scope.onSignIn = function(){
            $utils.goState("sign-in", {});
	}

	$scope.onRegister = function(){
            $utils.goState("register", {});
	}
})
