angular.module('starter.controllers')
    .controller('DiscoverCtrl', ['$scope', '$http','$rootScope',
        function($scope, $http, $rootScope) {
            $rootScope.showTabs = 'showUp';

            if(ios){
                $('.tel_link a').each(function(){
                    $(this).attr('href','tel:'+$(this).attr('data-tel'));
                });
            }else{
                $('.tel_link a').each(function(){
                    $(this).attr('onclick',  "window.open('tel:"+$(this).attr('data-tel')+"', '_system', 'location=yes')");
                });
            }
        }
    ]);