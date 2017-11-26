

angular.module('capitalconnect.controllers')

.controller('RoomsCtrl', function($scope, $rootScope, $stateParams, $ionicModal, $ionicSlideBoxDelegate, $ionicActionSheet, $timeout, $utils, $api) {

      $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {

      });

      $scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
            
      });

      $scope.getPriceTag = function(room){
            if (room.minPrice == room.maxPrice) return "R" + room.minPrice;
            return "R" + room.minPrice + " - R" + room.maxPrice;
      }
      
      $scope.onTapRoom = function(index){
            var buttons = [];

            for (var i=0; i<$rootScope.ROOMS[index].rates.length; i++)
                  buttons.push({
                        text: $rootScope.ROOMS[index].rates[i].name + " (R" + parseInt($rootScope.ROOMS[index].rates[i].price.formatted) + ")"
                  });

            $ionicActionSheet.show({
                  buttons: buttons,
                  titleText: 'Select your desired rate',
                  cancelText: 'Cancel',
                  cancel: function() {
                        // add cancel code..
                  },
                  buttonClicked: function(buttonIndex) {

                        $rootScope.CUR_BOOKING_DATA.roomDetails = {
                              id: $rootScope.ROOMS[index].id,
                              name: $rootScope.ROOMS[index].name,
                              desc: $rootScope.ROOMS[index].shortDesc,
                              thumbnail: $rootScope.ROOMS[index].image,
                              pricePerPerson: $rootScope.ROOMS[index].pricePerPerson,
                              price: parseFloat($rootScope.ROOMS[index].rates[buttonIndex].price.formatted),
                              rateId: $rootScope.ROOMS[index].rates[buttonIndex].id,
                              detailId: $rootScope.ROOMS[index].rates[buttonIndex].rateCodeDetailId
                        }

                        // if ($rootScope.CUR_BOOKING_DATA.roomDetails.pricePerPerson)
                        //       $rootScope.CUR_BOOKING_DATA.roomDetails.price = $rootScope.CUR_BOOKING_DATA.roomDetails.price * $rootScope.CUR_BOOKING_DATA.guests;

                        $scope.goRoomDetail();
                        return true;
                  }
            });
      }

      $scope.getDurationText = function(){

            if (!$rootScope.CUR_BOOKING_DATA.bookingDate) return;

            return $utils.getODateString($rootScope.CUR_BOOKING_DATA.bookingDate.fromDT) + " - " +
                   $utils.getODateString($rootScope.CUR_BOOKING_DATA.bookingDate.toDT);
      }

      $scope.goRoomDetail = function(){
            
            $utils.showLoading(CONFIG.r_get_room_details);

            $api.get('/RoomTypes/' + $rootScope.CUR_BOOKING_DATA.roomDetails.id + '/WbeFull', {}, true)

            .then(function(response, status, headers, config, statusText){

                  $rootScope.CUR_BOOKING_DATA.roomDetails.facilities = response.data.data.roomTypeFeatures;

                  $utils.goState("app.room-details", {});

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

      $scope.onTapRoomDesc = function(index){
            $rootScope.curRoomDesc = $rootScope.ROOMS[index].desc;

            $ionicModal.fromTemplateUrl('templates/description.html', {
                  scope: $rootScope,
                  backdropClickToClose: true
            }).then(function(modal) {
                  modal.show();
            });
      }

      $scope.openPhotos = function(index){
            $rootScope.curRoomPhotos = $rootScope.ROOMS[index].curRoomPhotos;
            $ionicModal.fromTemplateUrl('templates/photo.html', {
                  scope: $rootScope,
                  backdropClickToClose: true
            }).then(function(modal) {
                  modal.show();
            });
      }

      $scope.onTapRoomPhoto = function(index){

            if ($rootScope.ROOMS[index].hasOwnProperty("curRoomPhotos")){
                  $scope.openPhotos(index);
                  return;
            }

            $utils.showLoading(CONFIG.r_get_room_photos);

            $api.get('/RoomTypes/' + $rootScope.ROOMS[index].id + '/WbeFull', {}, true)

            .then(function(response, status, headers, config, statusText){

                  $rootScope.ROOMS[index].curRoomPhotos = response.data.data.fileEntries;
                  $scope.openPhotos(index);

            }, function(response, status, headers, config, statusText){

                  if ((response.data == null) && (response.status == 0)){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }

                  $utils.openAlert(CONFIG.unexpected_error);
            })

            ['finally'](function(){
                  $utils.hideLoading();
            });
      }

      $scope.onPager = function(index){
            var sclInstances = $ionicSlideBoxDelegate.$getByHandle('p-sld-photos')._instances;
            sclInstances[sclInstances.length-1].slide(index);
            // $ionicSlideBoxDelegate.$getByHandle('p-sld-photos').slide(index);
      }
})
