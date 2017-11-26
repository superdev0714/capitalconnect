

angular.module('capitalconnect.controllers')

.controller('MapCtrl', function($scope, $rootScope, $stateParams, $ionicModal, $timeout, $utils) {

	$scope.map = null;
	$scope.marker = null;
	$scope.infoWindow = null;

      $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
      	if (!$rootScope.CUR_MAP_DATA.location) return;

		var loc = new google.maps.LatLng($rootScope.CUR_MAP_DATA.location.latitude,
		                                 $rootScope.CUR_MAP_DATA.location.longitude);

		$scope.map = new google.maps.Map(document.getElementById('id-hotel-loc-map'), {
			zoom: 15,
			center: loc,
			streetViewControl: false,
			// disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		$scope.createMarker(loc, "The Capital " + $rootScope.CUR_MAP_DATA.name);
      });

      $scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
            
      });

	$scope.createMarker = function(loc, infoText){
		if ($scope.marker)
			$scope.marker.setMap(null);

		$scope.marker = new google.maps.Marker({
			map: $scope.map,
			position: loc,
			icon: "./img/the-capital-marker.png"
		});

		// $scope.infoWindow = new google.maps.InfoWindow({
		// 	content: "<div class='m-info-text'>" + infoText + "</div>"
		// });

		// $scope.marker.addListener('click', function() {
		// 	$scope.infoWindow.open($scope.map, $scope.marker);
		// });
	}
})
