


var serviceModule = angular.module('capitalconnect.services', []);


serviceModule.factory('$api', ['$http', '$rootScope' , function ($http, $rootScope) {

	var host = "https://thecapitalapp.co.za/api/v1";
	// var host = "http://172.20.2.60:8881/api/v1";
	var protelHost = "https://connect.protel.net/WBE/1/0d63f0d6-17d4-4310-9bd3-ce79b097aeb3"; // capital group
	// var protelHost = "https://connect.protel.net/WBE/1/4008771f-5fb9-4c2d-90d7-6b9a7519c277";
	var API_KEY = "5wE(tT6kFzDQD^qve4Q5";

	return {

		post: function (service, data, isProtel) {

			isProtel = isProtel || false;
			data = data || {};

			if (isProtel){
				data.isocode = "en";
				data.format = "json";
			}
			
			var header = {
				headers: {
					'X-API-KEY': API_KEY
				},
				timeout: 40000
			};

			if (window.userToken.length != 0)
				header.headers['X-Authorization'] = "Token " + window.userToken;

			return $http.post(
				(isProtel?protelHost:host) + service,
				JSON.stringify(data),
				isProtel?{}:header
			);
		},

		get: function (service, data, isProtel) {

			isProtel = isProtel || false;
			data = data || {};

			if (isProtel){
				data.isocode = "en";
				data.format = "json";
			}

			var header = {
				headers: {
					'X-API-KEY': API_KEY
				},
				timeout: 40000
			};

			if (window.userToken.length != 0)
				header.headers['X-Authorization'] = "Token " + window.userToken;

			return $http.get(
				(isProtel?protelHost:host) + service + "?" + $.param(data),
				header
			);
		},

		delete: function (service, isProtel) {

			isProtel = isProtel || false;

			if (isProtel){
				data.isocode = "en";
				data.format = "json";
			}

			var header = {
				headers: {
					'X-API-KEY': API_KEY
				},
				timeout: 40000
			};

			if (window.userToken.length != 0)
				header.headers['X-Authorization'] = "Token " + window.userToken;

			return $http.delete(
				(isProtel?protelHost:host) + service,
				header
			);
		}
	}
}]);

serviceModule.factory('$localStorage', ['$window', function ($window) {

	return {

		contains: function (key) {
			return $window.localStorage.hasOwnProperty(key);
		},

		remove: function (key) {
			$window.localStorage.removeItem(key);
		},

		get: function (key) {
			return JSON.parse($window.localStorage[key] || '[]');
		},

		set: function (key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},

		setString: function (key, value) {
			$window.localStorage[key] = value;
		},

		getString: function (key) {
			return $window.localStorage[key];
		}
	}
}])

serviceModule.factory('$utils', ['$rootScope', '$state', '$ionicLoading', '$ionicHistory', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', '$ionicModal', '$timeout', '$cordovaDialogs', '$cordovaDatePicker', '$window', '$sce', '$cordovaNetwork', '$cordovaSocialSharing', '$http', '$localStorage', '$cordovaInAppBrowser', '$cordovaSocialSharing',
	function ($rootScope, $state, $ionicLoading, $ionicHistory, $ionicScrollDelegate, $ionicSlideBoxDelegate, $ionicModal, $timeout, $cordovaDialogs, $cordovaDatePicker, $window, $sce, $cordovaNetwork, $cordovaSocialSharing, $http, $localStorage, $cordovaInAppBrowser, $cordovaSocialSharing) {

	var utils = {

		showLoading: function (msg) {
			var message = msg;
			var sIcon = ionic.Platform.isIOS()?'ios':'android'

			if (typeof msg === "undefined")
				message = CONFIG.loading;

			$ionicLoading.show({
				template: "<ion-spinner icon='" + sIcon + "' class='spinner-stable'></ion-spinner><br/><span style='margin-top: .5em; float: right; line-height: 1em; width: 110%; margin-right: -5%;'>&nbsp" + message + "</span>"
			});
		},

		hideLoading: function () {
			$ionicLoading.hide();
		},

		openAlert: function(msg, title, button, callback){

			if (typeof title === "undefined") title = "Warning";
			if (typeof msg === "number") msg = msg + "";
			
			if ($cordovaDialogs){
				$cordovaDialogs.alert(msg, title, button).then(callback);
			}else
				alert(msg);
		},

		openConfirm: function(msg, title, buttons, callback){

			if (typeof title === "undefined")
				title = CONFIG.confirm;

			if ($cordovaDialogs){
				$cordovaDialogs.confirm(msg, title, buttons).then(callback);
			}else
				alert(msg);
		},

		openPrompt: function(msg, title, buttons, callback){

			if (typeof title === "undefined")
				title = CONFIG.prompt;

			if ($cordovaDialogs){
				$cordovaDialogs.prompt(msg, title, buttons).then(callback);
			}else
				alert(msg);
		},

		isRootState: function (stateName) {

			if (!stateName)
				stateName = $ionicHistory.currentStateName();

			var rootStates = [
				"app.home"
			]

			return rootStates.indexOf(stateName) >= 0;
		},

		clearNavHistory: function(){

			$ionicHistory.nextViewOptions({
				historyRoot: true,
				disableAnimate: true,
				disableBack: true
			});
		},

		getScrollByHandle: function(handle){
			var sclInstances = $ionicScrollDelegate.$getByHandle(handle)._instances;

			return sclInstances[sclInstances.length-1];
		},

		getSlideBoxByHandle: function(handle){
			var sclInstances = $ionicSlideBoxDelegate.$getByHandle(handle)._instances;

			return sclInstances[sclInstances.length-1];
		},

		removeSpaces: function(str){
			return str.replace(/\s/g, '');
		},

		padding: function(n, width, z) {
			z = z || '0';
			n = n + '';
			return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
		},

		isValidEmail: function(email){
			if (typeof email === "undefined") return false;

			var at = email.indexOf("@");
			var dot = email.lastIndexOf(".");

			if ((at < 0) || (dot < 0) || (at > dot)) return false;

			return true;
		},

		isOnline: function(){
			if (typeof navigator.connection === "undefined") return true;

			return $cordovaNetwork.isOnline();
		},

		isOffline: function(){
			if (typeof navigator.connection === "undefined") return false;

			return $cordovaNetwork.isOffline();
		},

		clone: function(obj){
			return JSON.parse(JSON.stringify(obj));
		},

		getDayOfWeek: function(y, m, d){ // starting from 0: SUN
			var t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
			y -= m < 3;
			return (y + parseInt(y/4) - parseInt(y/100) + parseInt(y/400) + t[m-1] + d) % 7;
		},

		getDaysInMonth: function(y, m){
			var isLeapYear = (y % 4) || ((y % 100 === 0) && (y % 400)) ? 0 : 1;
			var daysInMonth = (m === 2) ? (28 + isLeapYear) : (31 - (m - 1) % 7 % 2);

			return daysInMonth;
		}
	};

	utils.shareViaEmail = function(to, subject, message){
		if (typeof window.plugins == "undefined"){
			window.open("mailto:" + to + "?subject=" + subject + "&body=" + message);
		}else{
			$cordovaSocialSharing.canShareViaEmail()
			.then(function(result) {
				$cordovaSocialSharing
				.shareViaEmail(message, subject, [to], null, null, null)
				.then(function(result) {
				}, function(err) {
				});
			}, function(err) {
				utils.openAlert(CONFIG.no_email_registered);
			});
		}
	};

	utils.resizeScroll = function(handle, time_offset){
		var time = 200;

		if (time_offset) time = time_offset;
		$timeout(function(){
			if (!handle)
				$ionicScrollDelegate.resize();
			else
				utils.getScrollByHandle(handle).resize();
		}, time);
	};

	utils.getDateString = function(dt, hasSep){

		if (!dt) return "";

		if (typeof hasSep === "undefined") hasSep = true; else hasSep = false;

		var monthNames = [CONFIG.jan, CONFIG.feb, CONFIG.mar, CONFIG.apr, CONFIG.may, CONFIG.june, CONFIG.july, CONFIG.aug, CONFIG.sept, CONFIG.oct, CONFIG.nov, CONFIG.dec];
		var val = new Date(dt);
		var retVal = monthNames[val.getMonth()] + " " + val.getDate() + (hasSep?", ":" ") + val.getFullYear();

		return retVal;
	};

	utils.getTimeString = function(dt){

		if (!dt) return "";

		var val = new Date(dt);
		var ampm = (val.getHours() > 11)?CONFIG.pm:CONFIG.am;
		var hours = (val.getHours() > 12)?(val.getHours()-12):val.getHours();
		var retVal = utils.padding(hours, 2) + ":" + utils.padding(val.getMinutes(), 2) + " " + ampm;

		return retVal;
	};

	utils.getDateTimeString = function(dt){

		if (!dt) return "";

		var val = new Date(dt);
		var monthNames = [CONFIG.jan, CONFIG.feb, CONFIG.mar, CONFIG.apr, CONFIG.may, CONFIG.june, CONFIG.july, CONFIG.aug, CONFIG.sept, CONFIG.oct, CONFIG.nov, CONFIG.dec];
		var ampm = (val.getHours() > 11)?CONFIG.pm:CONFIG.am;
		var hours = (val.getHours() > 12)?(val.getHours()-12):val.getHours();
		var retVal = monthNames[val.getMonth()] + " " + val.getDate() + ", " + hours + ":" + utils.padding(val.getMinutes(), 2) + " " + ampm;

		return retVal;
	};

	utils.getMDateString = function(dt){

		if (!dt) return "";

		var val = new Date(dt);
		var monthNames = [CONFIG.jan, CONFIG.feb, CONFIG.mar, CONFIG.apr, CONFIG.may, CONFIG.june, CONFIG.july, CONFIG.aug, CONFIG.sept, CONFIG.oct, CONFIG.nov, CONFIG.dec];
		var retVal = monthNames[val.getMonth()] + " " + val.getDate();

		return retVal;
	}

	utils.getODateString = function(dt){

		if (!dt) return "";

		var val = new Date(dt);
		var monthNames = [CONFIG.jan, CONFIG.feb, CONFIG.mar, CONFIG.apr, CONFIG.may, CONFIG.june, CONFIG.july, CONFIG.aug, CONFIG.sept, CONFIG.oct, CONFIG.nov, CONFIG.dec];
		var date = val.getDate();
		var dateOrd;

		if(date > 3 && date < 21) dateOrd = "th";

		switch (date % 10) {
			case 1:  dateOrd = "st"; break;
			case 2:  dateOrd = "nd"; break;
			case 3:  dateOrd = "rd"; break;
			default: dateOrd = "th";
		}

		var retVal = date+dateOrd + " " + monthNames[val.getMonth()];

		return retVal;
	}

	utils.getBooking = function(data){

		var hotel_name = null;

		for (var j=0; j<$rootScope.AREAS.length; j++)
			for (var k=0; k<$rootScope.AREAS[j].hotels.length; k++){
				if ($rootScope.AREAS[j].hotels[k].id == data.hotel){
					hotel_name = $rootScope.AREAS[j].hotels[k].name;
					break;
				}
			}

		if (!hotel_name || !data.start_date) return null;

		var price = "R"+parseInt(data.amount)/100;
		var period = utils.getMDateString(data.start_date) + " - " + utils.getMDateString(data.end_date);

		var lowerDate = new Date(data.start_date);
		lowerDate = new Date(lowerDate.setHours(0)).getTime();
		var upperDate = new Date(data.end_date);
		upperDate.setHours(23); upperDate.setMinutes(59);
		upperDate = new Date(upperDate).getTime();
		var curDate = new Date().getTime();

		var status = 0;
		if (curDate < lowerDate) status = 2;
		else if ((curDate < upperDate) && (curDate > lowerDate)) status = 1;

		var booking = {
			hotel_name: hotel_name,
			price: price,
			period: period,
			status: status
		};

		return booking;
	}

	utils.getBookings = function(data){

		var bookings = [];

		for (var i=0; i<data.length; i++){
			var booking = utils.getBooking(data[i]);
			if (booking) bookings.push(booking);
		}

		return bookings;
	};

	utils.goState = function(state, params, options){

		if (!params) params = {};

		if (options)
			$ionicHistory.nextViewOptions(options);
		else if (utils.isRootState(state))
			$ionicHistory.nextViewOptions({
				historyRoot: true,
				disableAnimate: true,
				disableBack: true
			});
		else
			$ionicHistory.nextViewOptions({
				historyRoot: false,
				disableAnimate: false,
				disableBack: false
			});

		$state.go(state, params);
	};

	utils.processUserData = function(data){

		window.userToken = data.token;
		$rootScope.ACCOUNT_DATA = data.account;

		if (!$rootScope.ACCOUNT_DATA.photo)
			$rootScope.ACCOUNT_DATA.photo = "./img/avatar-placeholder.png";

		$localStorage.setString("USER-TOKEN", window.userToken);
		$localStorage.set("USER-ACCOUNT-DATA", $rootScope.ACCOUNT_DATA);
	}

	return utils;
}]);


