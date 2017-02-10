angular.module('starter.controllers')
    .controller('MapCtrl', ['$scope', '$ionicPopup', '$http', '$stateParams', '$rootScope', 'Lieux', 'leafletEvents', '$translate', '$state', '$ionicHistory',
        function($scope, $ionicPopup, $http, $stateParams, $rootScope, Lieux, leafletEvents, $translate, $state, $ionicHistory) {
            //Developpement code - cached page refresh
            $rootScope.$on("$ionicView.beforeEnter", function(scopes, states) {
                if (states.fromCache && states.stateName == "map") {
                    $rootScope.showTabs = 'showUp';
                }
            });
            $rootScope.showTabs = 'showUp';

            $('.satelliteButton').hide();

            $rootScope.$on("$ionicView.beforeLeave", function(scopes, states) {
                if (states.fromCache && states.stateName == "map") {
                    $('ion-nav-bar').show(); //Réaffiche le header
                }
                $("#menu_map").removeClass("map-slider");
                $('ion-nav-bar').show(); //Réaffiche le header
            });


            $rootScope.$on("$ionicView.enter", function(scopes, states) {
                if (states.stateName == "map") {
                    if ($rootScope.mapReload == true) {
                        $state.go($state.current, $stateParams, {reload: true, inherit: false});
                        $rootScope.mapReload = false;
                    }

                }
            });


            // Fonction permettant d'afficher une popup d'erreur indiquant à l'utilisateur que la localisation ne fonctionne pas
            $scope.showAlert = function() {
                // Test permettant de gérer le nombre de fois que la popup sera affiché à l'utilisateur (une seule fois suffit)
                if ($rootScope.erreurAffichee == false) {
                    var alertPopup = $ionicPopup.alert({
                        title: $translate.instant('CARTE_ERREUR_1_TITRE'),
                        template: $translate('CARTE_ERREUR_1_CONTENU')
                    });

                    $rootScope.erreurAffichee = true;
                }
            };

            // Fonction permettant d'afficher une popup d'erreur indiquant à l'utilisateur que la localisation ne fonctionne pas
            // en dehors de la ville de Porrentruy
            $scope.showErrorOutPorrentruy = function() {
                //todo Faire le test permettant de savoir si l'utilisateur a déjà vu cette popup ou non
                var alertPopup = $ionicPopup.alert({
                    title: $translate.instant('POPUP_LOCALISATION_TITRE'),
                    template: $translate('POPUP_LOCALISATION_CONTENU')
                });
            };


            $scope.changeMapType = function() {
                if ($scope.mapGoogle.mapTypeId == google.maps.MapTypeId.SATELLITE) {
                    $scope.mapGoogle.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                    $('.satelliteButton').attr('src', 'data/img/satelliteview.png');
                    $rootScope.plan = true;
                } else {
                    $scope.mapGoogle.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                    $('.satelliteButton').attr('src', 'data/img/leafletview.png');
                    $rootScope.plan = false;
                }

            };

            // Fonction d'initialisation de la carte Google Maps, appellée par le clic sur Satellite dans la popup permettant de
            // choisir quel type de la carte l'utilisateur souhaite voir apparaître
            $scope.initMap = function() {



                $('.satelliteButton').show();
                Lieux.load(function(data) {
                    var monuments = data.lieux;
                    $scope.markers = [];

                    $scope.mapGoogle = new google.maps.Map(document.getElementById('map'), {
                        center: {
                            lat: 47.416444,
                            lng: 7.075223
                        },
                        scrollwheel: true,
                        zoom: 15,
                        streetViewControl: false,
                        mapTypeControl: false
                    });

                    if ($rootScope.plan == true) {
                        $scope.mapGoogle.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                        $('.satelliteButton').attr('src', 'data/img/satelliteview.png');
                    } else {
                        $scope.mapGoogle.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                        $('.satelliteButton').attr('src', 'data/img/leafletview.png');
                    }

                    var iconMarqueurMonument = {
                        url: 'data/img/markerMonumentGoogleMaps.png'
                    };

                    for (var i = 0; i < monuments.length; i++) {

                        var monument = monuments[i];
                        var myLatLng = {
                            lat: monument.latitude,
                            lng: monument.longitude
                        };
                        $scope.markers[monument.id] = new google.maps.Marker({
                            position: myLatLng,
                            map: $scope.mapGoogle,
                            title: monument.name,
                            id: i,
                            address: monument.address,
                            description: monument.description,
                            latitude: monument.latitude,
                            longitude: monument.longitude,
                            images: monument.images,
                            icon: iconMarqueurMonument
                        });

                        $scope.mapGoogle.addListener('click', function() {
                            $('.slide-in-up').css('marginBottom', '-' + $('.slide-in-up').css('height'));
                            $("#menu_map")
                                .removeClass("map-slider")
                                .removeClass("slide-in-up");
                            $("#mapSatelliteButton").show();
                            $("#mapLocationButtons").show();
                        });

                        $scope.markers[i].addListener('click', affichePopUpError(i));

                        function affichePopUpError(id) {
                            return function() {
                                slideInUpMap(
                                    $scope.markers[id].title,
                                    100,
                                    "SimpleDisplay",
                                    $scope.markers[id].id,
                                    false
                                );
                                $("#mapSatelliteButton").hide();
                                $("#mapLocationButtons").hide();
                            };
                        }
                    }

                    navigator.geolocation.getCurrentPosition(function(position) {

                        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        var iconeLocalisation = {
                            url: 'data/img/BlueDotGoogleMap.png',
                            size: new google.maps.Size(16, 16)
                        };

                        $scope.markerPosition = new google.maps.Marker({
                            position: geolocate,
                            map: $scope.mapGoogle,
                            title: 'Vous êtes ici',
                            icon: iconeLocalisation
                        });

                        for (var i = 0; i < monuments.length; i++) {
                            $scope.markers[i].addListener('click', affichePopUpSucess(i));

                            function affichePopUpSucess(id) {
                                return function() {
                                    slideInUpMap(
                                        $scope.markers[id].title,
                                        parseInt(distance($scope.markers[id].latitude, position.coords.latitude, $scope.markers[id].longitude, position.coords.longitude)),
                                        "automatique",
                                        $scope.markers[id].id,
                                        false
                                    );
                                };
                            }
                        }
                    }, function(error) {
                        for (var i = 0; i < monuments.length; i++) {
                            $scope.markers[i].addListener('click', affichePopUpError(i));

                            function affichePopUpError(id) {
                                return function() {
                                    slideInUpMap(
                                        $scope.markers[id].title,
                                        100,
                                        "SimpleDisplay",
                                        $scope.markers[id].id,
                                        false
                                    );
                                };
                            }
                        }
                    });
                }, $translate.use());
            };

            //*******************************************************************************************************************************************************************
            //*******************************************************************************************************************************************************************
            //******************************    L E A F L E T    DIRECTIVE   ***************************    L E A F L E T    DIRECTIVE   *******************************************
            //*******************************************************************************************************************************************************************
            //*******************************************************************************************************************************************************************


            //********** Définitions des différents conrtôles de la carte ******************************************************************************



            var local_icons = {
                default_icon: {},
                greendot: {
                    iconUrl: 'data/img/BlueDot.png',
                    iconSize: [16, 16] // size of the icon
                },
                marker_icon: {
                    iconUrl: 'data/img/markermonument.png',
                    iconSize: [35, 41]
                }
            };

            // Chargement des tiles de la carte de Porrenruy (3 niveau de zoom, téléchargé avec Mobile Atlas Creator)
            var tilesDict = {
                porrentruyMap: {
                    url: 'data/img/MapQuest/{z}/{x}/{y}.jpg',
                    options: {
                        minZoom: 16,
                        maxZoom: 18
                    }
                }
            };

            angular.extend($scope, {

                // On indique à la carte quel tiles utilisé, ici ceux de la ville de Porrentruy créé plus haut
                tiles: tilesDict.porrentruyMap,

                // On définit le centre de la carte, en créant un objet de map centré sur Porrentruy avec un zoom par défaut et un zoom minimum
                porrentruy: {
                    lat: 47.416444,
                    lng: 7.075223,
                    zoom: 16,
                    minZoom: 16
                },

                // On créé les limites de la carte pour éviter que l'utilisateur se déplace à des endroits où la carte n'a pas
                // été téléchargée
                maxBounds: {
                    southWest: {
                        lat: 47.386677,
                        lng: 7.016623
                    },
                    northEast: {
                        lat: 47.431581,
                        lng: 7.102020
                    }
                },


                // On passe également un tableau de markers que l'on remplira par la suite
                markers: {}
            });

            // Variable permettant de savoir si l'utilisateur a déjà été localisé ou pas
            var firstSuccess = true;

            // On charge les lieux
            Lieux.load(function(data) {
                var monumentsLeaflet = data.lieux;

                // Tableau de markers leaflet
                $scope.markersLeaflet = [];

                // Boucle qui parcourt tous les monuments et qui en fait des marqueurs qui seront ajoutés à la carte
                for (var i = 0; i < monumentsLeaflet.length; i++) {
                    var monumentLeaflet = monumentsLeaflet[i];
                    $scope.markersLeaflet[monumentLeaflet.id] = {
                        lat: monumentLeaflet.latitude,
                        lng: monumentLeaflet.longitude,
                        //message: '<h2>' + monumentLeaflet[i].name + '</h2>' + '<img style="width:100%" src=data/img/monument' + i + '/1.jpg />' + monumentLeaflet[i].description,
                        focus: false,
                        draggable: false,
                        enable: ['click'],
                        clickable: true,
                        icon: local_icons.marker_icon
                    };
                }

                // ------------ CALLBACK DE SUCCESS DE LA LOCALISATION -----------------------------------------------------------------------------------------------------------
                function onSuccess(position) {

                    // Avant d'indiquer à l'utilisateur qu'il a été localisé, on vérifie que celui-ci se trouve dans Porrentruy avant
                    // de placer un marqueur sur la carte, sinon on lui indique qu'il doit se trouver dans Porrentruy pour être localisé
                    if (position.coords.latitude > 47.386677 && position.coords.latitude < 47.43158) {
                        if (position.coords.longitude > 7.016623 && position.coords.longitude < 7.102020) {
                            if (firstSuccess == true) {
                                // Si c'est la première fois qu'il est localisé on ajoute un marqueur de position au tablaeu de marqueur
                                // et on place celui-ci sur la carte
                                $scope.markersLeaflet[$scope.markersLeaflet.length] = {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                    message: "Vous êtes ici",
                                    focus: false,
                                    draggable: false,
                                    icon: local_icons.greendot
                                };
                            } else {
                                // Sinon si ce n'est pas la première fois qu'il est localisé, on remplace l'ancien marqueur de position
                                // avec le nouveau pour actualiser sa position
                                $scope.markersLeaflet[$scope.markersLeaflet.length - 1] = {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                    message: "Vous êtes ici",
                                    focus: false,
                                    draggable: false,
                                    icon: local_icons.greendot
                                };
                            }

                            /**
                             * Todo : Rendre cette fonction utile
                             $scope.calculRoute = function (latDepart, lngDepart, latArrivee, lngArrivee){
                                var routeControl = L.Routing.control({
                                    waypoints: [
                                        L.latLng(latDepart, lngDepart),
                                        L.latLng(latArrivee, lngArrivee)
                                    ],
                                    draggableWaypoints: false,
                                    addWaypoints: false,
                                    routeWhileDragging: false,
                                    router: L.Routing.graphHopper('6db181fd-dbad-4dd0-8163-6e506ef55780', {urlParameters: {vehicle: 'foot'}})
                                }).addTo(map);
                            };*/

                            // L'utilisateur a été localisé, par conséquent ce sera plus la première fois qu'il est localisé
                            firstSuccess = false;

                            // Fonction appellée au clic sur le bouton bleu en bas à gauche de la carte, permet de centrer celle-ci
                            // sur la position de l'utilisateur
                            $scope.centerPosition = function() {
                                if ($rootScope.satellite == false) {
                                    $scope.markers[$scope.markers.length - 1] = {
                                        lat: position.coords.latitude,
                                        lng: position.coords.longitude,
                                        message: "Vous êtes ici",
                                        focus: false,
                                        draggable: false,
                                        icon: local_icons.greendot
                                    };

                                    // On redéfinit le centrage par défaut sur la position de l'utilisateur
                                    $scope.porrentruy = {
                                        lat: position.coords.latitude,
                                        lng: position.coords.longitude,
                                        zoom: 16
                                    };
                                } else {
                                    // Centrage de la carte avec Google Maps
                                    var userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                    $scope.mapGoogle.setCenter(userPosition);
                                    $scope.mapGoogle.setZoom(this.getZoom());
                                }
                            };
                            $.each($('.greyLocationButtons'), function() {
                                $(this).removeClass('greyLocationButtons');
                                $(this).addClass('blueLocationButtons');
                                $(this).attr("src", "data/img/BlueDot.png");
                            });
                        } else {
                            // Si c'est la première fois que l'on constate que l'utilisateur est localisé à l'extérieur de Porrentruy
                            // alors on affiche la popup d'erreur lui indiquant. Le test firstOutPorrentruy permet d'éviter d'innonder
                            // l'utilisateur de popup lui indiquant qu'il est à l'extérieur de Porrentruy et que la localisation ne
                            // fonctionne pas, une seule fois suffit
                            if ($rootScope.firstOutPorrentruy == true) {
                                $rootScope.firstOutPorrentruy = false;
                                $scope.showErrorOutPorrentruy();
                            }
                        }
                    } else {
                        if ($rootScope.firstOutPorrentruy == true) {
                            $rootScope.firstOutPorrentruy = false;
                            $scope.showErrorOutPorrentruy();
                        }
                    }
                    $scope.$on('leafletDirectiveMarker.click', function(e, args) {
                        slideInUpMap(
                            monumentsLeaflet[args.modelName].name,
                            parseInt(distance(monumentsLeaflet[args.modelName].latitude, position.coords.latitude, monumentsLeaflet[args.modelName].longitude, position.coords.longitude)),
                            "automatique",
                            monumentsLeaflet[args.modelName].id,
                            false
                        );
                    });
                }
                // ---------------------------CALLBACK D'ERREUR DE LA LOCALISATION ---------------------------------------------------------------------------------------------

                function onError(error) {
                    // Fonction affichant la popup indiquant une erreur de localisation
                    $scope.showAlert();
                }

                var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {
                    timeout: 5000
                });

                // Listener sur le click du marqueur, au clic on affiche la popup pour afficher les informations du monument
                $scope.$on('leafletDirectiveMarker.click', function(e, args) {
                    slideInUpMap(
                        monumentsLeaflet[args.modelName].name,
                        100,
                        "SimpleDisplay",
                        monumentsLeaflet[args.modelName].id,
                        false
                    );
                });

                setTimeout(function() {
                    if ($rootScope.satellite == true) {
                        $('.leaflet-container').hide();
                        $('#contentMap').hide();
                        $('.satelliteButton').attr('src', 'data/img/leafletview.png');
                        $('.map').remove('#map');
                        $('#map').remove();
                        $('.map').append(' <div id="map" tap-on style="position: fixed; top: 35px; bottom: 50px; left: 0; right: 0; " data-tap-disabled="true"></div>')
                        $scope.initMap();
                    }
                }, 0);

            }, $translate.use());

        }
    ]);