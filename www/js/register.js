

angular.module('capitalconnect.controllers')

.controller('RegisterCtrl', function($scope, $rootScope, $ionicModal, $timeout, $utils, $api, $localStorage, $ionicHistory) {

	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
	
		$scope.REG_DATA = {
			// email: "test@email.com",
			// mobile: "12345678",
			// password: "testpassword",
			// confirm_pwd: "testpassword",
			// first_name: "firstName",
			// last_name: "lastName"
		};
		
		$scope.phase = 0;
	});

	$scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
		
	});

	$scope.getNextCaption = function(){
		if ($scope.phase == 0)
			return "Next";
		else
			return "Done";
	}

	$scope.getLowerClass = function(){
		if ($scope.phase == 0)
			return "r-lower-field";
		else
			return "si-lower-field";
	}

	$scope.onBack = function(){
		$ionicHistory.goBack();
	}

	$scope.onNext = function(){

		if ($scope.phase == 0){

			if (!$scope.REG_DATA.first_name || $scope.REG_DATA.first_name.trim().length == 0){
				$utils.openAlert(CONFIG.reg_empty_firstname);
				return;
			}

			if (!$scope.REG_DATA.last_name || $scope.REG_DATA.last_name.trim().length == 0){
				$utils.openAlert(CONFIG.reg_empty_lastname);
				return;
			}
			
			$scope.phase = 1;
			return;
		}

		if ((typeof $scope.REG_DATA.email !== "undefined") && ($scope.REG_DATA.email.trim().length == 0)){
			$utils.openAlert(CONFIG.reg_empty_email);
			return;
		}

		if ($utils.isValidEmail($scope.REG_DATA.email) == false){
			$utils.openAlert(CONFIG.reg_invalid_email);
			return;
		}

		if ($scope.REG_DATA.mobile.length < 7){
			$utils.openAlert(CONFIG.reg_invalid_phone);
			return;
		}

		if ($scope.REG_DATA.password !== $scope.REG_DATA.confirm_pwd){
			$utils.openAlert(CONFIG.reg_password_mismatch);
			return;
		}

		if ($scope.REG_DATA.password.length < 6){
			$utils.openAlert(CONFIG.reg_invalid_password);
			return;
		}

		var REG_DATA = $utils.clone($scope.REG_DATA);
		delete REG_DATA.confirm_pwd;

		$utils.showLoading(CONFIG.registering);

		$api.post('/register', REG_DATA)

		.then(function(response, status, headers, config, statusText){

			$utils.processUserData(response.data);

			return $api.get('/cities');

		}, function(response, status, headers, config, statusText){

			if ((response.data == null) && (response.status == 0)){
				$utils.openAlert(CONFIG.offline_alert);
				return;
			}

			if (response.data.errors){
				$utils.openAlert(response.data.errors[0]);
				return;
			}
		
			debugger;
		})

		.then(function(response, status, headers, config, statusText){

			if (typeof response === "undefined") return;

			$rootScope.AREAS = response.data;
			$localStorage.set("THE-CAPITAL-AREAS", $rootScope.AREAS);

			$utils.goState("app.home");

		}, function(response, status, headers, config, statusText){

			if (((response.data == null) && (response.status == 0)) || (typeof response.data === "undefined")){
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
	}
})
