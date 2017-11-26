

angular.module('capitalconnect.controllers')

.controller('RoomDetailsCtrl', function($scope, $rootScope, $stateParams, $ionicHistory, $ionicModal, $timeout, $utils, $api, $http, $cordovaInAppBrowser) {

	$scope.facilities = [];
	$scope.basketId = null;

	$scope.successUrl = "https://www.test.net/wbeTestHotel/#checkout?success=true";
	$scope.failureUrl = "https://www.test.net/wbeTestHotel/#checkout?success=false";
	$scope.notifyUrl = "https://www.test.net/wbeTestHotel/#checkout?message=test";

      $scope.voucher = {
            voucherCode: ""
      };

      $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {

      	if (!$rootScope.CUR_BOOKING_DATA.roomDetails) return;

		var temp = $rootScope.CUR_BOOKING_DATA.roomDetails.facilities;
		var subArr = [];
		$scope.facilities = [];

		for (var i=0; i<temp.length; i++){
			subArr.push(temp[i]);
			if (subArr.length == 2){
				$scope.facilities.push(subArr);
				subArr = [];
			}
		}

		if (subArr.length == 1){
			subArr.push({
				id: null
			});
			$scope.facilities.push(subArr);
		}
      });

      $scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
            
      });

      $scope.onBook = function(){

            console.log($rootScope.CUR_BOOKING_DATA);

            $utils.showLoading(CONFIG.rd_validating_room_data);

            $api.get('/basket/new', {}, true)

            ////////////////////////// Adding room to cart //////////////////////////
            .then(function(response, status, headers, config, statusText){

                  console.log("got basket: "+response.data.data);
            	$scope.basketId = response.data.data;

            	var options = {
                  	categoryId: $rootScope.CUR_BOOKING_DATA.roomDetails.id,
                  	rateId: $rootScope.CUR_BOOKING_DATA.roomDetails.rateId,
                  	detailId: $rootScope.CUR_BOOKING_DATA.roomDetails.detailId,
                  	// amount: {
                  	// 	currency: "EUR",
                  	// 	value: $rootScope.CUR_BOOKING_DATA.roomDetails.price.toFixed(2),
                  	// 	localizedValue: $rootScope.CUR_BOOKING_DATA.roomDetails.price.toFixed(2).replace(".", ","),
                  	// 	valueNumber: $rootScope.CUR_BOOKING_DATA.roomDetails.price,
                  	// 	numeric: $rootScope.CUR_BOOKING_DATA.roomDetails.price * 100
                  	// },
                  	count: 1,
                  	numAdults: $rootScope.CUR_BOOKING_DATA.guests,
                  	// numChild1: 0,
                  	// numChild2: 0,
                  	// numChild3: 0,
                  	// numChild4: 0,
                  	// addBeds: 0,
                  	// cots: 0,
                  	mpehotel: $rootScope.CUR_BOOKING_DATA.hotelId,
                  	from: $rootScope.CUR_BOOKING_DATA.bookingDate.fromDT,
                  	to: $rootScope.CUR_BOOKING_DATA.bookingDate.toDT
                  };
            	console.log("new item options: ", options);

                  return $api.post('/basket?basketid=' + $scope.basketId, options, true);

            }, function(response, status, headers, config, statusText){

            	$utils.hideLoading();

                  if ((response.data == null) && (response.status == 0)){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }
            })

		////////////////////////// Adding a guest to basket //////////////////////////
            .then(function(response, status, headers, config, statusText){
            	
            	if (typeof response === "undefined") return;
            	console.log("post basket item: ", response.data);

            	$scope.addGuests(response.data.data.id);

            }, function(response, status, headers, config, statusText){

            	$utils.hideLoading();

                  if ((response.data == null) && (response.status == 0)){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }
            })
      };

      $scope.addGuests = function(cartItemId){
      	var addedGuests = 0;

            $utils.showLoading(CONFIG.rd_adding_guests);

      	for (var i=0; i<$rootScope.CUR_BOOKING_DATA.guests; i++){

	            $api.post('/basket/guest/' + cartItemId + '?basketid=' + $scope.basketId, {
	            	firstname: $rootScope.CUR_BOOKING_DATA.guest_names[i].first_name,
	            	lastname: $rootScope.CUR_BOOKING_DATA.guest_names[i].last_name
	            }, true)

			////////////////////////// Adding booker information //////////////////////////
	            .then(function(response, status, headers, config, statusText){
	            	
                        var temp = JSON.parse(response.config.data);
	            	console.log("post guest (" + temp.firstname + " " + temp.lastname + "): ", response.data);

	            	if (response.data.success) addedGuests++;

	            	if (addedGuests == $rootScope.CUR_BOOKING_DATA.guests)
					$scope.addBooker();

	            }, function(response, status, headers, config, statusText){

	            	$utils.hideLoading();

	                  if ((response.data == null) && (response.status == 0)){
	                        $utils.openAlert(CONFIG.offline_alert);
	                        return;
	                  }

	                  if (response.data.errors){
	                        $utils.openAlert(response.data.errors[0]);
	                        return;
	                  }
	            });
            }
      }

      $scope.addBooker = function(){

            $utils.showLoading(CONFIG.rd_processing_payment);

            $api.post('/basket/booker?basketid=' + $scope.basketId, {
            	firstname: $rootScope.ACCOUNT_DATA.first_name,
            	lastname: $rootScope.ACCOUNT_DATA.last_name,
                  email: $rootScope.ACCOUNT_DATA.email,
                  phone: $rootScope.ACCOUNT_DATA.mobile
            }, true)

            .then(function(response, status, headers, config, statusText){
            	
            	console.log("post booker: ", response.data);

                  if ($scope.voucher.voucherCode.trim().length != 0)
                        $scope.addVoucher();
                  else
                        $scope.addPaymentURLs();

            }, function(response, status, headers, config, statusText){

            	$utils.hideLoading();

                  if ((response.data == null) && (response.status == 0)){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }
            })
      }

      $scope.addVoucher = function(){

            $api.post('/basket/cashvoucher?basketid=' + $scope.basketId, {
                  number: $scope.voucher.voucherCode.trim()
            }, true)

            .then(function(response, status, headers, config, statusText){
                  
                  console.log("add voucher: ", response.data);

                  if (!response.data.success){
                        $utils.hideLoading();
                        $utils.openAlert(CONFIG.rd_invalid_voucher);
                        return;
                  }

                  $scope.addPaymentURLs();

            }, function(response, status, headers, config, statusText){

                  $utils.hideLoading();

                  if ((response.data == null) && (response.status == 0)){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }
            })
      }

      $scope.addPaymentURLs = function(){

      	$api.post('/basket/success?basketid=' + $scope.basketId, {
            	url: $scope.successUrl
            }, true)

            .then(function(response, status, headers, config, statusText){
            	
            	console.log("set success url: ", response.data);

            	return $api.post('/basket/failed?basketid=' + $scope.basketId, {
	            	url: $scope.failureUrl
	            }, true)

            }, function(response, status, headers, config, statusText){

            	$utils.hideLoading();

                  if ((response.data == null) && (response.status == 0)){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }
            })

            // .then(function(response, status, headers, config, statusText){
            	
            // 	if (typeof response === "undefined") return;
            // 	console.log("set failure url: ", response.data);

            // 	return $api.post('/basket/notify?basketid=' + $scope.basketId, {
	           //  	url: $scope.notifyUrl
	           //  }, true)

            // }, function(response, status, headers, config, statusText){

            // 	$utils.hideLoading();

            //       if ((response.data == null) && (response.status == 0)){
            //             $utils.openAlert(CONFIG.offline_alert);
            //             return;
            //       }

            //       if (response.data.errors){
            //             $utils.openAlert(response.data.errors[0]);
            //             return;
            //       }
            // })

            .then(function(response, status, headers, config, statusText){
            	
            	if (typeof response === "undefined") return;
            	console.log("set failure url: ", response.data);

            	$scope.performCheckout();

            }, function(response, status, headers, config, statusText){

            	$utils.hideLoading();

                  if ((response.data == null) && (response.status == 0)){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }
            });
      }

      $scope.performCheckout = function(){

      	$api.get('/basket/payment', {
            	basketid: $scope.basketId
            }, true)

            ////////////////////////// Basket checkout //////////////////////////
            .then(function(response, status, headers, config, statusText){
            	
            	console.log("basket payment: ", response.data);
            	
                  return $api.get('/basket/checkout', {
                  	basketid: $scope.basketId
                  }, true);

            }, function(response, status, headers, config, statusText){

                  $utils.hideLoading();

                  if ((response.data == null) && (response.status == 0)){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }
            })

            ////////////////////////// Basket checkout done //////////////////////////
            .then(function(response, status, headers, config, statusText){
            	
            	if (typeof response === "undefined") return;
            	console.log("basket checkout: ", JSON.stringify(response.data));

                  if ($rootScope.PAYMENTS.length == 0){
                        $utils.hideLoading();
                        $utils.openAlert(CONFIG.rd_no_active_payments, "Warning", "OK", function(){
                              $ionicModal.fromTemplateUrl('templates/payment.html', {
                                    scope: $rootScope,
                                    backdropClickToClose: false
                              }).then(function(modal) {
                                    $rootScope.dlgPayment = modal;
                                    $rootScope.dlgPayment.show();
                              });
                        });
                        return;
                  }

                  var data = {};

                  for (var i=0; i<response.data.data.elements.length; i++)
                        data[response.data.data.elements[i].name] = response.data.data.elements[i].value;

                  data["payment_method"] = $rootScope.PAYMENTS[0].id;

                  return $api.post(response.data.data.action.replace("http://thecapitalapp.co.za/api/v1", ""), data);

            }, function(response, status, headers, config, statusText){

                  $utils.hideLoading();

                  if ((response.data == null) && (response.status == 0)){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }
            })

            ////////////////////////// Custom checkout URL retrieval done //////////////////////////
            .then(function(response, status, headers, config, statusText){

                  console.log("checkout response: ", JSON.stringify(response.data));
                  $scope.goCheckout(response.data);

            }, function(response, status, headers, config, statusText){

                  debugger;
                  console.log(JSON.stringify(response.data));

                  $utils.hideLoading();
                  if ((response.data == null) && (response.status == 0)){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }
            });
      }

      $scope.goCheckout = function(refData){

            var options = {
                  closebuttoncaption: "Close",
                  location: "no",
                  enableViewportScale: "yes",
                  hidden: "yes"
            };
            var loadStopped = false;

            if (!window.cordova)
                  $utils.hideLoading();
            else
                  $utils.showLoading(CONFIG.rd_opening_paygate_url);

            $cordovaInAppBrowser.open(refData.url, '_blank', options);

            $scope.$on('$cordovaInAppBrowser:loadstop', function(e, event){

                  var url = event.url;

                  loadStopped = true;
                  $utils.hideLoading();
                  $cordovaInAppBrowser.show();

                  if (url.indexOf("/payment/final") > 0) {

                        $scope.validateCheckout(refData.reference);
                        $cordovaInAppBrowser.close();
                  }
            });

            // $scope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
                  
            //       var url = event.url;
            // });

            $scope.$on('$cordovaInAppBrowser:exit', function(e, event){
                  if (!loadStopped) $utils.hideLoading();
            });
      }

      $scope.validateCheckout = function(reference){

            var booking = {
                  amount: null,
                  hotel: null,
                  start_date: $rootScope.CUR_BOOKING_DATA.bookingDate.fromDT,
                  end_date: $rootScope.CUR_BOOKING_DATA.bookingDate.toDT,
                  reference: reference
            };

            $utils.showLoading();

            $api.post('/payment/validate', {
                  reference: reference
            })

            .then(function(response, status, headers, config, statusText){
                  var extraMsg = "";

                  console.log("success: " + JSON.stringify(response.data));

                  $rootScope.CUR_BOOKING_DATA.success = response.data.success;
                  booking.hotel = response.data.hotel;
                  booking.amount = response.data.amount;

                  return $api.post('/bookings/info', {
                        reference: reference,
                        start_date: booking.start_date,
                        end_date: booking.end_date
                  });

            }, function(response, status, headers, config, statusText){

                  console.log("error: " + JSON.stringify(response.data));
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

                  $rootScope.BOOKINGS.push($utils.getBooking(booking));

                  $utils.goState("app.final", {});

            }, function(response, status, headers, config, statusText){

                  console.log("error booking info: " + JSON.stringify(response.data));
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

      $scope.getDurationText = function(){

            if (!$rootScope.CUR_BOOKING_DATA.bookingDate) return;

            return $utils.getODateString($rootScope.CUR_BOOKING_DATA.bookingDate.fromDT) + " - " +
                   $utils.getODateString($rootScope.CUR_BOOKING_DATA.bookingDate.toDT);
      }
})

