

angular.module('capitalconnect.controllers')

.controller('HotelsCtrl', function($scope, $rootScope, $stateParams, $ionicModal, $timeout, $utils) {

	$scope.HOTELS = [];

      $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {

		var areaIndex = parseInt($stateParams.areaIndex);
		$scope.HOTELS = $rootScope.AREAS[areaIndex].hotels;
      });

      $scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
            
      });

	$scope.onTapMap = function(index, e){
		e.stopPropagation();

		if (typeof window.google === "undefined"){
			$utils.openAlert(CONFIG.offline_alert);
			return;
		}

		$rootScope.CUR_MAP_DATA = {
			name: $scope.HOTELS[index].name,
			address: $scope.HOTELS[index].address,
			location: {
				latitude: $scope.HOTELS[index].latitude,
				longitude: $scope.HOTELS[index].longitude
			}
		};

		$utils.goState("app.map", {});
	}

	$scope.onTapHotel = function(index, e){

		$rootScope.CUR_BOOKING_DATA.hotelId = $scope.HOTELS[index].id;
		$rootScope.CUR_BOOKING_DATA.name = $scope.HOTELS[index].name;
		$rootScope.CUR_BOOKING_DATA.address = $scope.HOTELS[index].address;
		$rootScope.CUR_BOOKING_DATA.coverImage = $scope.HOTELS[index].image;
		$rootScope.CUR_BOOKING_DATA.guests = 1;
		$rootScope.CUR_BOOKING_DATA.bookingDate = null;
		$rootScope.CUR_BOOKING_DATA.roomDetails = null;

		$utils.goState("app.guests", {});
	}

	$scope.getHotelPrice = function(hotel){
		return parseInt(hotel.price);
	}
})

