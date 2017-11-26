

angular.module('capitalconnect.controllers')

.controller('DatesCtrl', function($scope, $rootScope, $stateParams, $ionicModal, $timeout, $utils, $api) {

	$scope.monthNames = [CONFIG.jan, CONFIG.feb, CONFIG.mar, CONFIG.apr, CONFIG.may, CONFIG.june, CONFIG.july, CONFIG.aug, CONFIG.sept, CONFIG.oct, CONFIG.nov, CONFIG.dec];
	$scope.weekdayNames = [CONFIG.sun, CONFIG.mon, CONFIG.tue, CONFIG.wed, CONFIG.thu, CONFIG.fri, CONFIG.sat];

      $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
		var date = new Date();

      	if (!$rootScope.CUR_BOOKING_DATA.bookingDate){
	      	$scope.curMonth = $scope.thisMonth = date.getMonth();
	      	$scope.curYear = $scope.thisYear = date.getFullYear();
	      	$scope.thisDate = date.getDate();
                  $scope.fromYear = $scope.fromMonth = $scope.fromDate = null;
                  $scope.toYear = $scope.toMonth = $scope.toDate = null;
	      }else{
	      	$scope.thisMonth = date.getMonth();
	      	$scope.thisYear = date.getFullYear();
	      	$scope.thisDate = date.getDate();
	      	$scope.curYear = $scope.fromYear = $rootScope.CUR_BOOKING_DATA.bookingDate.fromYear;
	      	$scope.curMonth = $scope.fromMonth = $rootScope.CUR_BOOKING_DATA.bookingDate.fromMonth;
	      	$scope.fromDate = $rootScope.CUR_BOOKING_DATA.bookingDate.fromDate;
                  $scope.toYear = $rootScope.CUR_BOOKING_DATA.bookingDate.toYear;
                  $scope.toMonth = $rootScope.CUR_BOOKING_DATA.bookingDate.toMonth;
                  $scope.toDate = $rootScope.CUR_BOOKING_DATA.bookingDate.toDate;
	      }

      	$scope.minMonth = $scope.thisMonth;
      	$scope.minYear = $scope.thisYear;
      	$scope.maxYear = $scope.thisYear + 1;

            $scope.doingFrom = true;

      	$scope.prepareCalendar();
      });

      $scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
            
      });

      $scope.getFormattedDT = function(y, m, d){
            return y + "-" + $utils.padding(m, 2) + "-" + $utils.padding(d, 2);
      }

      $scope.prepareCalendar = function(){
      	DOW = $utils.getDayOfWeek($scope.curYear, $scope.curMonth+1, 1);
      	DIM = $utils.getDaysInMonth($scope.curYear, $scope.curMonth+1);

            var fromDT = null, toDT = null;

            if ($scope.fromYear && $scope.toYear){
                  fromDT = new Date($scope.getFormattedDT($scope.fromYear, $scope.fromMonth+1, $scope.fromDate));
                  toDT = new Date($scope.getFormattedDT($scope.toYear, $scope.toMonth+1, $scope.toDate));
            }

            var lastYear, lastMonth, nextYear, nextMonth;

      	var pDIM;
      	if ($scope.curMonth == 0){
                  lastYear = $scope.curYear-1;
                  lastMonth = 12;
                  nextYear = $scope.curYear;
                  nextMonth = 2;
      	}else if ($scope.curMonth == 11){
                  lastYear = $scope.curYear;
                  lastMonth = $scope.curMonth;
                  nextYear = $scope.curYear+1;
                  nextMonth = 0;
            }else{
                  lastYear = $scope.curYear;
                  lastMonth = $scope.curMonth;
                  nextYear = $scope.curYear;
                  nextMonth = $scope.curMonth+2;
            }

      	pDIM = $utils.getDaysInMonth(lastYear, lastMonth);

      	var totalCells = DOW + DIM;
      	totalCells += ((totalCells%7) == 0) ? 0 : (7-(totalCells%7));

      	var temp = [];
      	for (var i=0; i<totalCells; i++){

      		var value = 0;
      		var disabled = true;
      		var from = false;
                  var to = false;
      		var today = false;
                  var booked = false;

      		if (i < DOW){
      			value = pDIM - DOW + i + 1;
                        // var dt = new Date($scope.getFormattedDT(lastYear, lastMonth, value));

                        // if (fromDT && (dt.getTime() >= fromDT.getTime()) && (dt.getTime() <= toDT.getTime()))
                        //       booked = true;
                  }else if (i < DOW + DIM){
      			value = i - DOW + 1;
      			disabled = false;
      			if (($scope.fromYear == $scope.curYear) && ($scope.fromMonth == $scope.curMonth) && (value == $scope.fromDate))
      				from = true;
                        if (($scope.toYear == $scope.curYear) && ($scope.toMonth == $scope.curMonth) && (value == $scope.toDate))
                              to = true;
      			if (($scope.thisYear == $scope.curYear) && ($scope.thisMonth == $scope.curMonth) && (value == $scope.thisDate))
      				today = true;

                        var dt = new Date($scope.getFormattedDT($scope.curYear, $scope.curMonth+1, value));

                        if (fromDT && (dt.getTime() > fromDT.getTime()) && (dt.getTime() < toDT.getTime()))
                              booked = true;
      		}else{
      			value = i - DOW - DIM + 1;

                        // var dt = new Date($scope.getFormattedDT(nextYear, nextMonth, value));

                        // if (fromDT && (dt.getTime() >= fromDT.getTime()) && (dt.getTime() <= toDT.getTime()))
                        //       booked = true;
                  }

      		temp[i] = {
      			date: value,
      			isDisabled: disabled,
      			isFrom: from,
                        isTo: to,
      			isToday: today,
                        isBooked: booked
      		};
      	}

      	$scope.CALENDAR = [];
      	var subArr = [];
      	for (var i=0; i<temp.length; i++){
      		subArr.push(temp[i]);
      		if (subArr.length == 7){
      			$scope.CALENDAR.push(subArr);
      			subArr = [];
      		}
      	}

      	$utils.resizeScroll();
      }

      $scope.getCellClass = function(day){
      	var cls = "";

      	if (day.isDisabled)
      		cls += "d-cell-disabled ";

      	if (day.isFrom)
      		cls += "d-cell-from ";

            if (day.isTo)
                  cls += "d-cell-to ";

      	if (day.isToday)
      		cls += "d-cell-today ";

            if (day.isBooked)
                  cls += "d-cell-booked ";

      	return cls;
      }

      $scope.onTapCell = function(pIndex, index){
      	var day = $scope.CALENDAR[pIndex][index];

            var fromDT = new Date($scope.getFormattedDT($scope.fromYear, $scope.fromMonth+1, $scope.fromDate));
            var curDT = new Date($scope.getFormattedDT($scope.curYear, $scope.curMonth+1, day.date));

      	if (day.isDisabled) return;

            if ((!$scope.doingFrom) && (fromDT.getTime() >= curDT.getTime()))
                  $scope.doingFrom = true;
            
            if ($scope.doingFrom){
                  $scope.fromYear = $scope.curYear;
                  $scope.fromMonth = $scope.curMonth;
                  $scope.fromDate = day.date;
                  $scope.toYear = $scope.toMonth = $scope.toDate = null;

                  for (var i=0; i<$scope.CALENDAR.length; i++)
                        for (var j=0; j<$scope.CALENDAR[i].length; j++){
                              $scope.CALENDAR[i][j].isFrom = false;
                              $scope.CALENDAR[i][j].isTo = false;
                              $scope.CALENDAR[i][j].isBooked = false;
                        }

                  day.isFrom = true;
                  $scope.doingFrom = false;
            }else{
                  $scope.toYear = $scope.curYear;
                  $scope.toMonth = $scope.curMonth;
                  $scope.toDate = day.date;

                  for (var i=0; i<$scope.CALENDAR.length; i++)
                        for (var j=0; j<$scope.CALENDAR[i].length; j++)
                              $scope.CALENDAR[i][j].isTo = false;

                  day.isTo = true;

                  $scope.doingFrom = true;

                  $scope.prepareCalendar();
            }
      }

      $scope.onDecMonth = function(){
      	if (($scope.minMonth == $scope.curMonth) && ($scope.minYear == $scope.curYear)) return;

      	if ($scope.curMonth == 0){
      		$scope.curMonth = 11;
      		$scope.curYear--;
      		$scope.prepareCalendar();
      		return;
      	}

      	$scope.curMonth--;
      	$scope.prepareCalendar();
      };

      $scope.onIncMonth = function(){
      	if ((11 == $scope.curMonth) && ($scope.maxYear == $scope.curYear)) return;

      	if ($scope.curMonth == 11){
      		$scope.curMonth = 0;
      		$scope.curYear++;
      		$scope.prepareCalendar();
      		return;
      	}

      	$scope.curMonth++;
      	$scope.prepareCalendar();
      };

      $scope.onDecYear = function(){
      	if (($scope.minMonth > $scope.curMonth) && ($scope.minYear+1 == $scope.curYear)){
      		$scope.curMonth = $scope.minMonth;
      		$scope.curYear = $scope.minYear;
      		$scope.prepareCalendar();
      		return;
      	};
      	if ($scope.minYear == $scope.curYear) return;

      	$scope.curYear--;
      	$scope.prepareCalendar();
      };

      $scope.onIncYear = function(){
      	if ($scope.maxYear == $scope.curYear) return;

      	$scope.curYear++;
      	$scope.prepareCalendar();
      };

      $scope.onNext = function(){

            if (!$scope.fromYear){
                  $utils.openAlert(CONFIG.d_no_checkin_dt);
                  return;
            }

            if (!$scope.toYear){
                  $utils.openAlert(CONFIG.d_no_checkout_dt);
                  return;
            }

      	$rootScope.CUR_BOOKING_DATA.bookingDate = {
      		fromYear: $scope.fromYear,
      		fromMonth: $scope.fromMonth,
      		fromDate: $scope.fromDate,
                  toYear: $scope.toYear,
                  toMonth: $scope.toMonth,
                  toDate: $scope.toDate
      	};

            var fromDT = $scope.getFormattedDT($scope.fromYear, $scope.fromMonth+1, $scope.fromDate);
            var toDT = $scope.getFormattedDT($scope.toYear, $scope.toMonth+1, $scope.toDate);
            var thisDT = $scope.getFormattedDT($scope.thisYear, $scope.thisMonth+1, $scope.thisDate);
            var stayLength = (new Date(toDT).getTime() - new Date(fromDT).getTime())/(1000 * 60 * 60 * 24);

            if (new Date(thisDT).getTime() > new Date(fromDT).getTime()){
                  $utils.openAlert(CONFIG.d_no_prev_booking);
                  return;
            }

            $rootScope.CUR_BOOKING_DATA.bookingDate.fromDT = fromDT;
            $rootScope.CUR_BOOKING_DATA.bookingDate.toDT = toDT;

            // $rootScope.CUR_BOOKING_DATA.hotelId = 5786; // 3767, 3768, 3769, 3770, 5786

            $utils.showLoading(CONFIG.d_finding_rooms);

            $api.get('/RoomTypes/Hotel/' + $rootScope.CUR_BOOKING_DATA.hotelId + '/WBEList', {}, true)

            .then(function(response, status, headers, config, statusText){

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }

                  if (!response.data.success){
                        $utils.openAlert(response.data.message);
                        return;
                  }

                  if (!response.data.data){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }
                  
                  var ids = [];
                  for (var i=0; i<response.data.data.length; i++)
                        ids.push(response.data.data[i].ids);

                  var options = {
                        type: "standardroom",
                        // lengthofstay: stayLength,
                        from: fromDT,
                        to: toDT,
                        countrooms: 1,
                        roomtypes: ids.join(","),
                        occupancy: $rootScope.CUR_BOOKING_DATA.guests + ",0,0,0,0,0,0"
                  };

                  return $api.get('/Rates', options, true);

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

                  if (!response.data.success){
                        $utils.openAlert(response.data.message);
                        return;
                  }

                  var roomsData = [];
                  $rootScope.ROOMS = [];

                  for (var i=0; i<response.data.data.instances.length; i++){
                        if ($rootScope.CUR_BOOKING_DATA.hotelId == response.data.data.instances[i].id){
                              roomsData = response.data.data.instances[i].roomTypes;
                              break;
                        }
                  }

                  if (!roomsData){
                        $utils.openAlert(CONFIG.d_room_not_available);
                        return;
                  }

                  for (var i=0; i<roomsData.length; i++){

                        var rates = roomsData[i].rates;
                        var maxPrice = 0, minPrice = roomsData[i].rates[0].price.formatted;

                        for (var j=0; j<rates.length; j++){
                              maxPrice = Math.max(maxPrice, parseFloat(roomsData[i].rates[j].price.formatted));
                              minPrice = Math.min(minPrice, parseFloat(roomsData[i].rates[j].price.formatted));
                        }

                        var room = {
                              id: roomsData[i].id,
                              name: roomsData[i].name,
                              desc: roomsData[i].shortDesc,
                              thumbnail: roomsData[i].image,
                              pricePerPerson: roomsData[i].pricePerPerson,
                              rates: rates,
                              maxPrice: maxPrice,
                              minPrice: minPrice,
                              stdPrice: parseInt(minPrice/stayLength)
                        }

                        $rootScope.ROOMS.push(room);
                  }

                  if ($rootScope.ROOMS.length == 0){
                        $utils.openAlert(CONFIG.d_room_not_available);
                        return;
                  }

                  $utils.goState("app.rooms", {});

            }, function(response, status, headers, config, statusText){

                  if ((response.data == null) && (response.status == 0)){
                        $utils.openAlert(CONFIG.offline_alert);
                        return;
                  }

                  if (response.data.errors){
                        $utils.openAlert(response.data.errors[0]);
                        return;
                  }

                  $utils.openAlert("/rates" + JSON.stringify(response.data));
            })

            ['finally'](function(){
                  $utils.hideLoading();
            });
      };
})
