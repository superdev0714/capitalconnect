


angular.module('capitalconnect.controllers')

.controller('CardDetailsCtrl', function($scope, $rootScope, $ionicModal, $timeout, $ionicSideMenuDelegate, $utils, $cordovaCamera, $api, $localStorage) {

	$scope.$on( "modal.shown", function( scopes, states ) {

		$scope.CARD_DETAILS = {
			number: "",
			exp_month: "",
			exp_year: "",
			cvv: "",
			first_name: "",
			last_name: ""
		};
	});

	$scope.$on( "modal.hidden", function( scopes, states ) {

	});

	$scope.onClose = function(){
		$rootScope.dlgCardDetails.remove();
	};

      $scope.onDone = function(){

      	if ($scope.CARD_DETAILS.number.trim().length < 12){
			$utils.openAlert(CONFIG.cd_invalid_number);
			return;
		}else if ($scope.CARD_DETAILS.cvv.trim().length < 3){
			$utils.openAlert(CONFIG.cd_invalid_cvv);
			return;
		}else if ($scope.CARD_DETAILS.exp_month.trim().length != 2){
			$utils.openAlert(CONFIG.cd_invalid_expiry_month);
			return;
		}else if ($scope.CARD_DETAILS.exp_year.trim().length != 4){
			$utils.openAlert(CONFIG.cd_invalid_expiry_year);
			return;
		}else if ($scope.CARD_DETAILS.first_name.trim().length == 0){
			$utils.openAlert(CONFIG.reg_empty_firstname);
			return;
		}else if ($scope.CARD_DETAILS.last_name.trim().length == 0){
			$utils.openAlert(CONFIG.reg_empty_lastname);
			return;
		}

		$utils.showLoading(CONFIG.cd_adding_card);

		$api.post('/payment/methods', {
			card_number: $scope.CARD_DETAILS.number,
			card_expiry_month: $scope.CARD_DETAILS.exp_month,
			card_expiry_year: $scope.CARD_DETAILS.exp_year,
			card_cvv: $scope.CARD_DETAILS.cvv,
			card_first_name: $scope.CARD_DETAILS.first_name,
			card_last_name: $scope.CARD_DETAILS.last_name
		})

		.then(function(response, status, headers, config, statusText){

			$rootScope.PAYMENTS.push(response.data);

			$scope.onClose();

		}, function(response, status, headers, config, statusText){

			if ((response.data == null) && (response.status == 0)){
				$utils.openAlert(CONFIG.offline_alert);
				return;
			}

			if (response.data.errors){
				$utils.openAlert(response.data.errors[0]);
				return;
			}
		})

		['finally'](function(){
			$utils.hideLoading();
		});
      };
});
