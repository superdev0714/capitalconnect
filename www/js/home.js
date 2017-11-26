

angular.module('capitalconnect.controllers')

.controller('HomeCtrl', function($scope, $rootScope, $ionicModal, $timeout, $utils) {

	$scope.onTapArea = function(index){
		$utils.goState("app.hotels",{
			areaIndex: index
		});
	}
})
