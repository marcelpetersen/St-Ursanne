angular.module('starter.controllers')
    .controller('LieuxCtrl', ['$scope', '$rootScope', 'Lieux', '$cordovaGeolocation', '$ionicLoading', '$translate', '$state', '$stateParams',
        function($scope, $rootScope, Lieux, $cordovaGeolocation, $ionicLoading, $translate, $state, $stateParams){
            $scope.selectTabWithIndex(0);
            $rootScope.showTabs = 'showUp';

            $(".list-filtres").hide();
            $("#switchToFiltres")
                .addClass('active')
                .click(function(){
                    if(!$(this).hasClass('active')){
                        $("#switchToFiltres").addClass('active');
                        $("#switchToTris").removeClass('active');
                        $(".list-tris").toggle(500);
                        $(".list-filtres").toggle(500);
                    }
                });

            $("#switchToTris").click(function(){
                if(!$(this).hasClass('active')){
                    $("#switchToFiltres").removeClass('active');
                    $("#switchToTris").addClass('active');
                    $(".list-tris").toggle(500);
                    $(".list-filtres").toggle(500);
                }
            });

            $rootScope.$on("$ionicView.beforeEnter", function(scopes, states) {
                if (states.stateName == "lieux") {
                    $scope.loadLieux();
                    $scope.loadFiltres();
                }
            });



            $scope.loadLieux = function() {
                $scope.lieux = [];
                Lieux.load(function (data) {
                    $scope.lieux = data;
                    for (var i = 0; i < $scope.lieux.lieux.length; i++) {
                        $scope.lieux.lieux[i].sortingName = removeSpecialCharacters($scope.lieux.lieux[i].name);
                    }
                    function onSuccess(position) {
                        clearTimeout(errorTimeout);
                        getProximity($scope.lieux, $scope, position, function (data) {
                            $scope.lieux = data;
                            $ionicLoading.hide();
                        });
                    }

                    function onError(error) {
                        $ionicLoading.hide();
                    }

                    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {timeout: 5000});
                    var errorTimeout = setTimeout(onError, 5000);
                }, $translate.use());
            }

            $scope.loadLieux();

            $scope.loadFiltres = function() {
                var ordreMonument = '+id',
                    listeMonuments = 'aucun',
                    monumentsTris = [
                        {text: $translate.instant('LIEUX_DETAIL_TRI_1'), value: "+id"},
                        {text: $translate.instant('LIEUX_DETAIL_TRI_2'), value: "+sortingName"},
                        {text: $translate.instant('LIEUX_DETAIL_TRI_3'), value: "-sortingName"},
                        {text: $translate.instant('LIEUX_DETAIL_TRI_4'), value: "+distance"},
                        {text: $translate.instant('LIEUX_DETAIL_TRI_5'), value: "-distance"}
                    ],
                    monumentsFiltres = [
                        {text: $translate.instant('LIEUX_DETAIL_FILTRE_1'), value: "aucun"},
                        {text: $translate.instant('LIEUX_DETAIL_FILTRE_2'), value: "panorama"}/*,
                         { text: "Places de parc proches", value: "d" },
                         { text: "Accès personnes handicapées", value: "c" }*/
                    ];


                $scope.radioList = {
                    tri: '+id',
                    filtre: 'aucun'
                };

                $scope.openSortingMenu = function () {
                    $('#sorting_menu').css('display', 'initial');
                    $('#sorting_background').css('display', 'block');
                    setTimeout(function () {
                        $('#sorting_background').css('opacity', '0.7');
                    }, 1);
                };

                $scope.getOrdreMonuments = function () {
                    return ordreMonument;
                };
                $scope.getFiltredMonuments = function () {
                    var monuments = [];
                    switch (listeMonuments) {
                        case 'aucun':
                            monuments = $scope.lieux.lieux;
                            break;
                        case 'panorama':
                            for (var i = 0; i < $scope.lieux.lieux.length; i++) {
                                if ($scope.lieux.lieux[i].panorama) {
                                    monuments.push($scope.lieux.lieux[i]);
                                }
                            }
                            break;
                    }
                    return monuments;
                };
                $scope.getMonumentsFiltres = function () {
                    return monumentsFiltres;
                };
                $scope.getMonumentsTris = function () {
                    return monumentsTris;
                };
                $scope.changeOrdre = function (ordre) {
                    ordreMonument = ordre;
                };
                $scope.changeElementsListe = function (typeElements) {
                    listeMonuments = typeElements;
                };
            }

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        }]);
