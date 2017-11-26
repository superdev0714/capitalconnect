

angular.module('capitalconnect.controllers', ['ngMaterial'])

.filter('reverse', function() {
      return function(items) {
            return items.slice().reverse();
      };
})

.directive('input', function($timeout){
     return {
         restrict: 'E',
         scope: {
             'returnClose': '=',
             'onReturn': '&'
        },
        link: function(scope, element, attr){
            element.bind('keydown', function(e){
                if(e.which == 13){
                    if(scope.returnClose){
                        console.log('return-close true: closing keyboard');
                        element[0].blur();
                    }
                    if(scope.onReturn){
                        console.log('on-return set: executing');
                        $timeout(function(){
                            scope.onReturn();
                        });                        
                    }
                } 
            });   
        }
    }
})

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, $ionicSideMenuDelegate, $utils, $localStorage, $api) {

      $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
            if ($rootScope.AREAS.length != 0) return;

            $rootScope.AREAS = $localStorage.get("THE-CAPITAL-AREAS");

            $utils.showLoading(CONFIG.cd_retrieving_card);

            $api.get('/payment/methods')

            .then(function(response, status, headers, config, statusText){

                  $rootScope.PAYMENTS = response.data;

                  return $api.get('/bookings');

            }, function(response, status, headers, config, statusText){

                  $localStorage.setString("USER-TOKEN", "");
                  $localStorage.set("USER-ACCOUNT-DATA", []);
                  $localStorage.set("THE-CAPITAL-AREAS", []);

                  $utils.goState("welcome", {}, {
                        historyRoot: true,
                        disableAnimate: true,
                        disableBack: true
                  });
                  
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
      });

      $scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
            
      });

      $scope.onAccount = function(){
            $ionicModal.fromTemplateUrl('templates/account.html', {
                  scope: $rootScope,
                  backdropClickToClose: false
            }).then(function(modal) {
                  $rootScope.dlgAccount = modal;
                  $rootScope.dlgAccount.show();
            });
      };

      $scope.onBookings = function(){
            $utils.goState("app.bookings", {});
      };

      $scope.onPayment = function(){
            $ionicModal.fromTemplateUrl('templates/payment.html', {
                  scope: $rootScope,
                  backdropClickToClose: false
            }).then(function(modal) {
                  $rootScope.dlgPayment = modal;
                  $rootScope.dlgPayment.show();
            });
      };

      $scope.onTaC = function(){
            $utils.goState("app.tac", {});
      };

      $scope.onHelp = function(){
            $utils.goState("app.help", {});
      };

      $scope.onSignOut = function(){

            $ionicSideMenuDelegate.toggleLeft(false);
      
            window.userToken = "";
            $rootScope.ACCOUNT_DATA = [];
            $rootScope.PAYMENTS = [];
            $rootScope.CUR_BOOKING_DATA = {
                  hotelId: null,
                  name: null,
                  address: null,
                  coverImage: "",
                  guests: 1,
                  guests_min: 0,
                  guests_max: 6,
                  guest_names: [],
                  bookingDate: null,
                  roomDetails: null
            };

            $localStorage.setString("USER-TOKEN", "");
            $localStorage.set("USER-ACCOUNT-DATA", []);
            $localStorage.set("THE-CAPITAL-AREAS", []);

            $utils.goState("welcome", {}, {
                  historyRoot: true,
                  disableAnimate: true,
                  disableBack: true
            });
      };
})

