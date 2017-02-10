angular.module('starter.controllers')
    .controller('TabsCtrl', ['$scope', '$rootScope','$ionicTabsDelegate', function($scope, $rootScope, $ionicTabsDelegate){
        $rootScope.selectTabWithIndex = function(index) {
            $ionicTabsDelegate.select(index);
        };
    }]);