


angular.module('capitalconnect', ['ionic', 'capitalconnect.controllers', 'capitalconnect.services', 'ngCordova'])

.run(function($rootScope, $ionicPlatform, $cordovaStatusbar, $ionicSideMenuDelegate, $ionicHistory, $utils, $localStorage) {


	// Initialization

	$rootScope.CRED_DATA = {
		// email: "chriseen313@gmail.com",
		// password: "anypassword"
	};
	
	$rootScope.AREAS = [];
	$rootScope.ROOMS = [];

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

	$rootScope.CUR_MAP_DATA = {
		name: null,
		address: null,
		location: null
	};

	$rootScope.PAYMENTS = [];
	$rootScope.BOOKINGS = [];

	$rootScope.ACCOUNT_DATA = $localStorage.get("USER-ACCOUNT-DATA");

	$rootScope.curAreaIndex = null;
	$rootScope.dlgAccount = null;
	$rootScope.dlgPayment = null;
	$rootScope.dlgCardDetails = null;
	console.log("token: ", window.userToken);

	// Ionic Ready Event Handler

	$ionicPlatform.ready(function() {

		if (navigator.splashscreen){
			navigator.splashscreen.hide();
		}

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}

            if (window.StatusBar) {
            	console.log("status bar", window.StatusBar);
                  $cordovaStatusbar.style(1);
            }

            if (ionic.Platform.isAndroid())
                  ionic.Platform.isFullScreen = true;
	});

      // Back button event

      $ionicPlatform.registerBackButtonAction(function(event){

            if ($(".backdrop-loading").length > 0)
                  return;
                
            if ($ionicHistory.currentStateName() == "welcome"){
                  $utils.openConfirm(CONFIG.sure_quit, CONFIG.sure_quit_title, [CONFIG.no, CONFIG.yes],
                        function(index){
                              if (index == 2)
                                    ionic.Platform.exitApp();
                        }
                  );
            }else if ($utils.isRootState()){
            	$ionicSideMenuDelegate.toggleLeft();
            }else
                  $ionicHistory.goBack();
      }, 151);
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $mdGestureProvider) {

	$stateProvider

	.state('welcome', {
		url: '/welcome',
		templateUrl: 'templates/welcome.html',
		controller: 'WelcomeCtrl'
	})
	.state('sign-in', {
		url: '/sign-in',
		templateUrl: 'templates/sign-in.html',
		controller: 'SignInCtrl'
	})
	.state('register', {
		url: '/register',
		templateUrl: 'templates/register.html',
		controller: 'RegisterCtrl'
	})
	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})
	.state('app.home', {
		url: '/home',
		views: {
			'menuContent': {
				templateUrl: 'templates/home.html',
				controller: 'HomeCtrl'
			}
		}
	})
	.state('app.hotels', {
		url: '/hotels/:areaIndex',
		views: {
			'menuContent': {
				templateUrl: 'templates/hotels.html',
				controller: 'HotelsCtrl'
			}
		}
	})
	.state('app.map', {
		url: '/map',
		views: {
			'menuContent': {
				templateUrl: 'templates/map.html',
				controller: 'MapCtrl'
			}
		}
	})
	.state('app.guests', {
		url: '/guests',
		views: {
			'menuContent': {
				templateUrl: 'templates/guests.html',
				controller: 'GuestsCtrl'
			}
		}
	})
	.state('app.dates', {
		url: '/dates',
		views: {
			'menuContent': {
				templateUrl: 'templates/dates.html',
				controller: 'DatesCtrl'
			}
		}
	})
	.state('app.rooms', {
		url: '/rooms',
		views: {
			'menuContent': {
				templateUrl: 'templates/rooms.html',
				controller: 'RoomsCtrl'
			}
		}
	})
	.state('app.room-details', {
		url: '/room-details',
		views: {
			'menuContent': {
				templateUrl: 'templates/room-details.html',
				controller: 'RoomDetailsCtrl'
			}
		}
	})
	.state('app.final', {
		url: '/final',
		views: {
			'menuContent': {
				templateUrl: 'templates/final.html',
				controller: 'FinalCtrl'
			}
		}
	})
	.state('app.help', {
		url: '/help',
		views: {
			'menuContent': {
				templateUrl: 'templates/help.html',
				controller: 'HelpCtrl'
			}
		}
	})
	.state('app.bookings', {
		url: '/bookings',
		views: {
			'menuContent': {
				templateUrl: 'templates/bookings.html',
				controller: 'BookingsCtrl'
			}
		}
	})
	.state('app.tac', {
		url: '/tac',
		views: {
			'menuContent': {
				templateUrl: 'templates/tac.html',
				controller: 'TaCCtrl'
			}
		}
	});
	
	$ionicConfigProvider.backButton.text("").icon("ion-ios-arrow-left").previousTitleText(false);
	$ionicConfigProvider.navBar.alignTitle("center");
	// $ionicConfigProvider.views.swipeBackEnabled(false);

	$mdGestureProvider.skipClickHijack();

	var firstPage = '/welcome';

	window.userToken = "";

	if (typeof localStorage["USER-TOKEN"] !== "undefined"){
		window.userToken = localStorage["USER-TOKEN"];
	}

	if (window.userToken.length != 0)
		firstPage = '/app/home';
	
	$urlRouterProvider.otherwise(firstPage);
});


