


angular.module('capitalconnect.controllers')

.controller('PaymentCtrl', function($scope, $rootScope, $ionicModal, $timeout, $ionicSideMenuDelegate, $utils, $api) {

	$scope.$on( "modal.shown", function( scopes, states ) {
		
	});

	$scope.$on( "modal.hidden", function( scopes, states ) {

	});

	$scope.onClose = function(){
		$rootScope.dlgPayment.remove();
	}
	
	$scope.onAddCard = function(){
            $ionicModal.fromTemplateUrl('templates/card-details.html', {
                  scope: $rootScope,
                  backdropClickToClose: false
            }).then(function(modal) {
                  $rootScope.dlgCardDetails = modal;
                  $rootScope.dlgCardDetails.show();
            });
	}

	$scope.getCardIcon = function(type){
		if (type == 0)
			return "p-icon-visa";
		else
			return "p-icon-visa"
	}

	$scope.onRemoveCard = function(index){
		$utils.openConfirm(CONFIG.sure_remove_card, CONFIG.sure_remove_card_title, [CONFIG.yes, CONFIG.no],
                  function(idx){
                        if (idx == 1) $scope.removeCard(index);
                  }
            );
	}

	$scope.removeCard = function(index){

		$utils.showLoading(CONFIG.p_removing_card);

		$api.delete('/payment/methods/'+$rootScope.PAYMENTS[index].id)

		.then(function(response, status, headers, config, statusText){

			$rootScope.PAYMENTS.splice(index, 1);

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
	}
});