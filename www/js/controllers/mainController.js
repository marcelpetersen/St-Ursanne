angular.module('starter.controllers')
    .controller('MainCtrl', ['$scope', '$rootScope', '$cordovaGeolocation', '$http', '$ionicPopup', '$translate',
        function($scope, $rootScope, $cordovaGeolocation, $http, $ionicPopup, $translate){
            //Configuration de l'affichage des tabs sur les différentes vues
            $rootScope.$on("$ionicView.beforeEnter", function (scopes, states) {
                if(states.stateName == "discover") {
                    $rootScope.showTabs = 'showUp';
                }
                if(states.stateName == "lieux" ) {
                    $rootScope.showTabs = 'showUp';
                }
                if(states.stateName == "history") {
                    $rootScope.showTabs = 'showUp';
                }
                if(states.stateName == "map") {
                    $rootScope.showTabs = 'showUp';
                }
                if(states.stateName == "menu" ) {
                    $rootScope.showTabs = 'hideDown';
                }
                if(states.stateName == "lieu") {
                    $rootScope.showTabs = 'hideDown';
                    document.getElementsByClassName("nav-bar-container")[0].style.display = "block";
                }
            });
/*
            $rootScope.$on("$ionicView.beforeLeave", function (scopes, states) {
                $('#animOverride')
                    .css('display', 'block')
                    .animate({opacity: "1"}, 200, "swing", function() {
                        setTimeout(function(){
                            $('#animOverride').animate({opacity: "0"}, 200, "swing", function() {
                                //Suppression de la zone d'animation
                                // $('#animOverride').remove();
                                // delete $('#animOverride');
                                $('#animOverride').css('display', 'none');
                            });
                        },500);
                    });*/

                /* animation css
                $('#animOverride').css('display', 'block');
                setTimeout(function(){
                    $('#animOverride').css('opacity', '1');
                }, 1);*/
            //});
/* animation css
            $rootScope.$on("$ionicView.leave", function (scopes, states) {
                setTimeout(function(){
                    $('#animOverride').css('opacity', '0');
                    setTimeout(function(){
                        $('#animOverride').css('display', 'none');
                    }, 300)
                },1000);
            });*/

            //Désactive les Tabs sur la page d'accueil
            $rootScope.showTabs = 'hideDown';
            $rootScope.firstMapShow = false;
            $rootScope.erreurAffichee = false;
            $rootScope.firstOutPorrentruy = true;
            $rootScope.satellite = false;
            $rootScope.plan = false;
            

            showMapPopup = function() {
                //if(window.localStorage.getItem('mobileData') == undefined) {
                    setTimeout(function () {
                        var mapPopup = $ionicPopup.alert({
                            title: $translate.instant('POPUP_LOCALISATION_TITRE'),
                            template: $translate('POPUP_LOCALISATION_CONTENU'),
                            buttons: [{
                                text: $translate.instant('POPUP_LOCALISATION_NON'),
                                type: 'button-default',
                                onTap: function () {
                                    $rootScope.satellite = false;
                                    //window.localStorage.setItem('mobileData', false);
                                }
                            }, {
                                text: $translate.instant('POPUP_LOCALISATION_OUI'),
                                type: 'button-positive',
                                onTap: function () {
                                    $rootScope.satellite = true;
                                    //window.localStorage.setItem('mobileData', true);
                                }
                            }]
                        });
                    }, 500);
                //} else {
                //    $rootScope.satellite = window.localStorage.getItem('mobileData');
                //}
            };


            if(window.localStorage.getItem('lang') == undefined) {
                langPopup = $ionicPopup.show({
                    title: 'Choix de la langue',
                    template: '<div style="text-align:center;">' +
                    '           <img style="width:64px; height:64px; margin:-5px 5px 0 5px;" id="de" alt="Deutsch" onclick="selectLang(\'de\')" src="data/img/de.png" />' +
                    '           <img style="width:64px; height:64px; margin:-5px 5px 0 5px;" id="fr" alt="Français" onclick="selectLang(\'fr\')" src="data/img/fr.png" />' +
                    '           <p style="font-size:0.9em;">Vous pourrez toujours modifier la langue ultérieurement.</p>' +
                    '           </div>'
                });
            } else {
                $translate.use(window.localStorage.getItem('lang'));
                showMapPopup();
            }

            selectLang = function(lang){
                langPopup.close();
                $translate.use(lang);

                setTimeout(function () {
                    var confirmationPopup = $ionicPopup.show({
                        template: '<div style="text-align:center;"><img alt="'+ lang +'" style="width:64px; height:64px; margin:auto" src="data/img/' + lang + '.png" /></div>',
                        title: $translate.instant('POPUP_LANGUE_CONFIRMATION_TITRE'),
                        buttons: [
                            {
                                text: $translate.instant('POPUP_LANGUE_CONFIRMATION_BOUTTON'),
                                type: 'button',
                                onTap: function(e) {
                                    confirmationPopup.close();
                                    setTimeout(function () {
                                        langPopup = $ionicPopup.show({
                                            title: 'Choix de la langue',
                                            template: '<div style="text-align:center;">' +
                                            '           <img style="width:64px; height:64px; margin:-5px 5px 0 5px;" id="de" alt="Deutsch" onclick="selectLang(\'de\')" src="data/img/de.png" />' +
                                            '           <img style="width:64px; height:64px; margin:-5px 5px 0 5px;" id="fr" alt="Français" onclick="selectLang(\'fr\')" src="data/img/fr.png" />' +
                                            '           <p style="font-size:0.9em;">Vous pourrez toujours modifier la langue ultérieurement.</p>' +
                                            '           </div>'
                                        });
                                    },200);
                                }
                            },
                            {
                                text: '<b>Ok</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    confirmationPopup.close();
                                    window.localStorage.setItem('lang', $translate.use());
                                    showMapPopup();
                                }
                            }

                        ]
                    });
                }, 200);
            };




            //Défini que par défaut aucun parcours entre deux lieux n'existe
            $scope.lieuDestination = null;

            //Crée une fonction permettant de définir le deuxième point du parcours
            $scope.setLieuDestination = function($id){
                $scope.lieuDestination = $id;
                itineraire($id, $scope);
            };

            //Defini les favoris de l'utilisateur
            if( window.localStorage.getItem('favoris') == null){
                $scope.favoris = [];
            } else {
                if(window.localStorage.getItem('favoris') == [""]){
                    $scope.favoris = [];
                }else{
                    $scope.favoris = window.localStorage.getItem('favoris').split(",");
                }
            }

            //Cree une fonction permettant d'ajouter des monuments favoris
            $scope.manageFavoris = function($id){
                var isAFavoris = false;
                var i = 0;

                while(i < $scope.favoris.length && !isAFavoris){
                    if($id == $scope.favoris[i]){
                        $scope.favoris.splice(i, 1);
                        isAFavoris = true;
                    }else{
                        i++;
                    }
                }
                if(!isAFavoris) {
                    $scope.favoris.push($id);
                }
                window.localStorage.setItem('favoris',$scope.favoris);
            };

            //Fonction renseignant si un monument est un favori
            $scope.isFavoris = function($id){
                var i = 0;
                while(i < $scope.favoris.length){
                    if($id == $scope.favoris[i]){
                        return true;
                    }else{
                        i++;
                    }
                }
                return false;
            };

            //Fonction renseignant si la liste des favoris est vide
            $scope.noFavoris = function(){
                return ($scope.favoris.length == 0);
            };

            $('.hideDown .tab-nav').bind('transitionend webkitTransitionEnd MSTransitionEnd oTransitionEnd', function() {
                $('.hideDown .tab-nav').css("display", "none");
            });
        }
    ]);