

angular.module('capitalconnect.controllers')

.controller('SignInCtrl', function($scope, $rootScope, $ionicModal, $ionicHistory, $timeout, $utils, $api, $localStorage) {

	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {

	});

	$scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
		
	});

	$scope.onSignIn = function(){

		if ((typeof $rootScope.CRED_DATA.email !== "undefined") && ($rootScope.CRED_DATA.email.trim().length == 0)){
			$utils.openAlert(CONFIG.reg_empty_email);
			return;
		}

		if ($utils.isValidEmail($rootScope.CRED_DATA.email) == false){
			$utils.openAlert(CONFIG.reg_invalid_email);
			return;
		}

		if ($rootScope.CRED_DATA.password.length < 6){
			$utils.openAlert(CONFIG.reg_invalid_password);
			return;
		}
		
		$utils.showLoading();

		$api.post('/login', $rootScope.CRED_DATA)

		.then(function(response, status, headers, config, statusText){

			if (!response.data.account){
				$utils.openAlert(CONFIG.unexpected_error);
				return;
			}

			$utils.processUserData(response.data);

			return $api.get('/cities');

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

		.then(function(response, status, headers, config, statusText){

			if (typeof response === "undefined") return;

			$rootScope.AREAS = response.data;

			$localStorage.set("THE-CAPITAL-AREAS", $rootScope.AREAS);

			return $api.get('/payment/methods');

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

            .then(function(response, status, headers, config, statusText){

            	if (typeof response === "undefined") return;
            	
                  $rootScope.PAYMENTS = response.data;

			return $api.get('/bookings');

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

            .then(function(response, status, headers, config, statusText){

			if (typeof response === "undefined") return;

			$rootScope.BOOKINGS = $utils.getBookings(response.data);

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

		.finally(function(){
			$utils.hideLoading();
		});
	}

	$scope.onBack = function(){
		$ionicHistory.goBack();
	}
})




