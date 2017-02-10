angular.module('starter.controllers')
    .controller('ParamCtrl', ['$scope', '$rootScope', '$stateParams', '$translate', function($scope, $rootScope, $stateParams, $translate){

        $rootScope.$on("$ionicView.beforeLeave", function(scopes, states) {
            if (states.stateName == "parametres") {
                $rootScope.lieuxReload = true
            }
        });

        //$scope.satellite = window.localStorage.getItem('mobileData');
        //console.log(window.localStorage.getItem('mobileData'));
        $scope.satelite = $rootScope.satellite;
        $scope.switchDataState = function(){
            $scope.satellite = !$scope.satellite;
            $rootScope.satellite = !$rootScope.satellite;
            //window.localStorage.setItem('mobileData', $scope.satellite);
        };

        
        
        var langue = [
            { text: "Français", value: "fr" },
            { text: "Deutsch", value: "de" }
        ];

        $scope.radioListLang = {
            langue: $translate.use()
        };

        $scope.currentLang = $translate.use();

        $scope.getLangues = function(){return langue;};
        $scope.changeOrdreLang = function(lang){
            $scope.currentLang = lang;
            $translate.use(lang);
            window.localStorage.setItem('lang', lang);
        };
    }]);