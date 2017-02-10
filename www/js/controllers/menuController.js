angular.module('starter.controllers')
    .controller('MenuCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        var a = $('ion-content').height();
        var b = $('.menu_list').height();
        $('.home-title').height(a-b);

        $(window).resize(function() {
            a = $('ion-content').height();
            b = $('.menu_list').height();
            $('.home-title').height(a-b);
        });
    }]);