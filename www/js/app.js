// Ionic Starter App
// kick off the platform web client
//Ionic.io();

// this will give you a fresh user or the previously saved 'current user'
//var user = Ionic.User.current();

// if the user doesn't have an id, you'll need to give it one.
/*if (!user.id) {
    user.id = Ionic.User.anonymousId();
    // user.id = 'your-custom-user-id';
}*/

//persist the user
//user.save();
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic.service.core', 'ui.router', /*'ionic.service.analytics',*/ 'starter.controllers', 'starter.services','ngIOS9UIWebViewPatch', 'pascalprecht.translate'/*, 'ngRoute'*/])

.config(['$ionicConfigProvider'/*, '$compileProvider'*/, function($ionicConfigProvider/*, $compileProvider*/) {
    //Force le placements des Tabs en bas peu importe l'OS
    $ionicConfigProvider.tabs.position('bottom'); //other values: top
    //White listing
    /*$compileProvider.aHrefSanitizationWhitelist(/^\s*(geo|mailto|tel|maps):/);*/
}])

.config(['$translateProvider', function ($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'data/lang/',
            suffix: '.json'
        });

        $translateProvider.registerAvailableLanguageKeys(['de', 'fr'], {
            'de-DE': 'de',
            'fr-FR': 'fr'
        });

        $translateProvider.preferredLanguage('fr');

        /*
        if(window.localStorage.getItem('lang') != undefined){
            $translateProvider.preferredLanguage(window.localStorage.getItem('lang'));
        } else {
            $translateProvider.preferredLanguage('fr');
            window.localStorage.setItem('lang', "fr");
        }
        */
}])

.filter('newlines', ['$sce', function ($sce) {
    return function(text) {
        if(text)
            return $sce.trustAsHtml(text.replace(/\n/g, '</p><p>'));
        else
            return 0;
    }
}])
/*
.run(function($ionicPlatform, $ionicAnalytics) {
    $ionicPlatform.ready(function() {
        $ionicAnalytics.register();
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        if(window.MobileAccessibility){
            window.MobileAccessibility.usePreferredTextZoom(true);
        }
    });
})
*/
//.config(['$ionicAutoTrackProvider', function($ionicAutoTrackProvider) {
//    // Don't track which elements the user clicks on.
//    $ionicAutoTrackProvider.disableTracking('Tap');
//}])
//
//.config(['$ionicAutoTrackProvider', function($ionicAutoTrackProvider) {
//    // Don't track anything at all.
//    $ionicAutoTrackProvider.disableTracking();
//}])

.config(function($stateProvider, $urlRouterProvider, $provide, $ionicConfigProvider) {

    /*.config(function($provide) {
        $provide.decorator('$state', function($delegate, $stateParams) {
            $delegate.forceReload = function() {
                return $delegate.go($delegate.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };
            return $delegate;
        });
    });*/
/*
    $ionicConfigProvider.views.transition('none');
*/
    $provide.decorator('$state', function($delegate, $stateParams){
        $delegate.forceReload = function(){
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    })  ;

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
  /*  .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })*/

    .state('menu', {
        url: "/menu",
        templateUrl: "templates/menu.html",
        controller: 'MenuCtrl'
    })

    .state('history',{
        url: '/history',
        templateUrl: "templates/history.html",
        controller: 'HistoryCtrl'
    })

    .state('lieux', {
        url: '/lieux',
        templateUrl: "templates/list-lieux.html",
        controller: 'LieuxCtrl'
    })

    .state('lieu', {
        url: '/lieu/:lieuId',
        templateUrl: "templates/lieu-detail.html",
        controller: 'LieuDetailCtrl'
    })

    .state('lieuPanorama', {
        url: '/lieu/:lieuId/panorama',
        templateUrl: "templates/panorama.html",
        controller: 'panoramaController'
    })

    .state('map',{
        cache: false,
        url: '/map',
        templateUrl: "templates/map.html",
        controller: 'MapCtrl'
    })

    .state('mapMonument', {
        cache: false,
        url: '/map/:mapId',
        templateUrl: "templates/mapMonument.html",
        controller: 'MapMonumentCtrl'
    })

    .state('parametres',{
        url: '/parametres',
        templateUrl: "templates/parametres.html",
        controller: 'ParamCtrl'
    })

    .state('discover',{
        url: '/discover',
        templateUrl: "templates/discover.html",
        controller: 'DiscoverCtrl'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/menu');
});