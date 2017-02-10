angular.module('starter.controllers')
    .controller('MapMonumentCtrl', ['$scope', '$ionicPopup', '$http', '$stateParams', '$rootScope', 'Lieux', 'leafletEvents', '$translate',
        function($scope, $ionicPopup, $http, $stateParams, $rootScope, Lieux, leafletEvents, $translate) {
            $rootScope.showTabs = 'showUp';


            $rootScope.$on("$ionicView.beforeLeave", function(scopes, states) {
                if (states.stateName == "mapMonument") {
                    $rootScope.mapReload = true;
                }
            });


            $('.satelliteButton').hide();

            /**************************
                        POPUPS
             **************************/
            $scope.showAlert = function() {
                if ($rootScope.erreurAffichee == false) {
                    var alertPopup = $ionicPopup.alert({
                        title: $translate.instant('CARTE_ERREUR_1_TITRE'),
                        template: $translate('CARTE_ERREUR_1_CONTENU')
                    });
                    $rootScope.erreurAffichee = true;
                } else {
                    console.log('pas de popup');
                }
            };

            $scope.showErrorOutPorrentruy = function() {
                var alertPopup = $ionicPopup.alert({
                    title: $translate.instant('CARTE_ERREUR_2_TITRE'),
                    template: $translate('CARTE_ERREUR_2_CONTENU')
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


            /**************************
             Initialisation de la map Googlemap
             **************************/

            $scope.initMap = function() {
                Lieux.load(function(data) {
                    $('.satelliteButton').show();

                    var monuments = data.lieux;
                    $scope.lieu = data.lieux[$stateParams.mapId];
                    $scope.markers = [];

                    // Boucle permettant de remplir le tableau de marqueurs pour les afficher sur la carte
                    for (var i = 0; i < monuments.length; i++) {
                        var monument = monuments[i];
                        if ($stateParams.mapId == monument.id) {
                            $scope.markers[monument.id] = {
                                lat: monument.latitude,
                                lng: monument.longitude,
                                focus: true,
                                draggable: false,
                                enable: ['click'],
                                clickable: true
                            };

                            $scope.porrentruy = {
                                lat: monument.latitude,
                                lng: monument.longitude,
                                zoom: 16
                            }

                        }
                    }

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

                    var iconMarqueurPosition = {
                        url: 'data/img/BlueDotGoogleMap.png',
                        size: new google.maps.Size(16, 16)
                    };


                    var iconMarqueurDestination = {
                        url: 'data/img/markerMonumentGoogleMaps.png'
                    };

                    var rendererOptions = {
                        map: $scope.mapGoogle,
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: "red"
                        }
                    };

                    if ($rootScope.plan == true) {
                        $scope.mapGoogle.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                        $('.satelliteButton').attr('src', 'data/img/satelliteview.png');
                    } else {
                        $scope.mapGoogle.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                        $('.satelliteButton').attr('src', 'data/img/leafletview.png');
                    }


                    directionsService = new google.maps.DirectionsService;
                    directionsDisplay = new google.maps.DirectionsRenderer(
                        rendererOptions
                    );

                    var destinationLatLng = new google.maps.LatLng($scope.markers[$stateParams.mapId].lat, $scope.markers[$stateParams.mapId].lng);
                    destinationOffline = new google.maps.Marker({
                        position: destinationLatLng,
                        map: $scope.mapGoogle,
                        title: 'Destination',
                        icon: iconMarqueurDestination
                    });

                    var geocoder = new google.maps.Geocoder();
                    var address = "Place Blarer-de-Wartensee 2";

                    geocoder.geocode({
                        'address': address
                    }, function(results, status) {

                        if (status == google.maps.GeocoderStatus.OK) {
                            var latitude = results[0].geometry.location.lat();
                            var longitude = results[0].geometry.location.lng();
                        }
                        var geocodedLocationLatLng = new google.maps.LatLng(latitude, longitude);



                    });

                    $scope.mapGoogle.setCenter(destinationLatLng);

                    var pointB = new google.maps.LatLng($scope.markers[$stateParams.mapId].lat, $scope.markers[$stateParams.mapId].lng);

                    var markerB = new google.maps.Marker({
                        position: pointB,
                        map: $scope.mapGoogle,
                        title: 'Destination',
                        icon: iconMarqueurDestination
                    });


                    markerB.addListener('click', function() {
                        slideInUpMap(
                            monuments[$stateParams.mapId].name,
                            100,
                            "SimpleDisplay",
                            monuments[$stateParams.mapId].id,
                            true
                        );
                        $("#mapMonumenSatelliteButton").hide();
                        $("#mapMonumentLocationButtons").hide();
                    });

                    $scope.mapGoogle.addListener('click', function() {
                        $('.slide-in-up').css('marginBottom', '-' + $('.slide-in-up').css('height'));
                        $("#menu_map")
                            .removeClass("map-slider")
                            .removeClass("slide-in-up");
                        $("#mapMonumenSatelliteButton").show();
                        $("#mapMonumentLocationButtons").show();
                    });


                    navigator.geolocation.getCurrentPosition(function(position) {

                        var pointA = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                        var markerA = new google.maps.Marker({
                            position: pointA,
                            map: $scope.mapGoogle,
                            title: 'Vous êtes ici',
                            icon: iconMarqueurPosition
                        });

                        directionsService.route({
                            origin: pointA,
                            destination: pointB,
                            travelMode: google.maps.TravelMode.WALKING
                        }, function(response, status) {
                            if (status == google.maps.DirectionsStatus.OK) {
                                directionsDisplay.setDirections(response);

                            } else {
                                if ($rootScope.erreurAffichee == false) {
                                    $scope.showAlert();
                                }
                            }
                        });

                        var service = new google.maps.DistanceMatrixService();
                        service.getDistanceMatrix({
                            origins: [pointA],
                            destinations: [pointB],
                            travelMode: google.maps.TravelMode.WALKING
                        }, callback);

                        function callback(response, status) {
                            if (status == google.maps.DistanceMatrixStatus.OK) {
                                var results = response.rows[0].elements;
                                var element = results[0];
                                var distance = element.distance.text;
                                var duration = element.duration.text;

                                slideInUpMap(
                                    monuments[$stateParams.mapId].name,
                                    distance,
                                    parseInt(duration),
                                    monuments[$stateParams.mapId].id,
                                    true,
                                    'km'
                                );
                                $("#mapMonumenSatelliteButton").hide();
                                $("#mapMonumentLocationButtons").hide();

                                markerB.addListener('click', function() {
                                    slideInUpMap(
                                        monuments[$stateParams.mapId].name,
                                        distance,
                                        parseInt(duration),
                                        monuments[$stateParams.mapId].id,
                                        true,
                                        'km'
                                    );
                                    $("#mapMonumenSatelliteButton").hide();
                                    $("#mapMonumentLocationButtons").hide();
                                });

                                $scope.mapGoogle.addListener('click', function() {
                                    $('.slide-in-up').css('marginBottom', '-' + $('.slide-in-up').css('height'));
                                    $("#menu_map")
                                        .removeClass("map-slider")
                                        .removeClass("slide-in-up");
                                    $("#mapMonumenSatelliteButton").show();
                                    $("#mapMonumentLocationButtons").show();
                                });

                                // Fonction permettant de centrer la carte sur la position de l'utilisateur
                                $scope.centerPosition = function() {

                                    var userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                    var actualZoom = $scope.mapGoogle.getZoom();

                                    $scope.mapGoogle.setCenter(userPosition);
                                    if ($scope.mapGoogle.getZoom() < 15) {
                                        $scope.mapGoogle.setZoom(15);
                                    } else {
                                        $scope.mapGoogle.setZoom(actualZoom);
                                    }
                                };
                                $.each($('.locationButtons'), function() {
                                    $(this).removeClass('locationButtons');
                                });
                            }
                        }
                    });
                }, $translate.use())
            };


            /**************************
             Map Leaflet
             **************************/
            // Déclaration des limites visibles de la carte (évite que l'utilisateur déplace la carte à des endroits où
            // la carte n'a pas été téléchargée

            var southWest = L.latLng(47.386677, 7.016623),
                northEast = L.latLng(47.431581, 7.102020),
                bounds = L.latLngBounds(southWest, northEast);

            //leaflet sans directive
            var mapLeaflet = L.map('leafletMapMonument', {
                center: [47.416444, 7.075223],
                zoom: 16,
                minZoom: 16,
                maxBounds: bounds
            });

            var greenIcon = L.icon({
                iconUrl: 'data/img/BlueDot.png',
                iconSize: [16, 16]
            });


            L.tileLayer('data/img/MapQuest/{z}/{x}/{y}.jpg', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18
            }).addTo(mapLeaflet);



            /**************************
             POPUPS
             **************************/
            $scope.showAlert = function() {
                console.log($rootScope.erreurAffichee);
                if ($rootScope.erreurAffichee == false) {
                    var alertPopup = $ionicPopup.alert({
                        title: $translate.instant('CARTE_ERREUR_1_TITRE'),
                        template: $translate('CARTE_ERREUR_1_CONTENU')
                    });

                    $rootScope.erreurAffichee = true;
                } else {
                    console.log('pas de popup');
                }
            };

            $scope.showErrorOutPorrentruy = function() {
                var alertPopup = $ionicPopup.alert({
                    title: $translate.instant('CARTE_ERREUR_2_TITRE'),
                    template: $translate('CARTE_ERREUR_2_CONTENU')
                });
            };


            /**************************
             Markers leaflet
             **************************/
            var firstSuccess = true;
            Lieux.load(function(data) {
                var monuments = data.lieux;
                $scope.lieu = data.lieux[$stateParams.mapId];
                $scope.markers = [];
                for (var i = 0; i < monuments.length; i++) {
                    var monument = monuments[i];
                    if ($stateParams.mapId == monument.id) {
                        $scope.markers[monument.id] = {
                            lat: monument.latitude,
                            lng: monument.longitude,
                            //message: '<h2>' + monument[i].name + '</h2>' + '<img style="width:100%" src=data/img/monument' + i + '/1.jpg />' + monument[i].description,
                            focus: true,
                            draggable: false,
                            enable: ['click'],
                            clickable: true
                        };

                        $scope.porrentruy = {
                            lat: monument.latitude,
                            lng: monument.longitude,
                            zoom: 16
                        }

                    }
                }

                // Affiche le marker du monument avant même de savoir si la localisation a fonctionnée ou non
                var markerMonument = L.marker([$scope.markers[$stateParams.mapId].lat, $scope.markers[$stateParams.mapId].lng]).addTo(mapLeaflet);
                mapLeaflet.panTo([$scope.markers[$stateParams.mapId].lat, $scope.markers[$stateParams.mapId].lng]);
                $('.leaflet-marker-icon:nth-child(1)').click(function() {
                    slideInUpMap(
                        monuments[$stateParams.mapId].name,
                        100,
                        "SimpleDisplay",
                        monuments[$stateParams.mapId].id,
                        true
                    );
                });

                // Callback si la localisation a fonctionné
                function onSuccess(position) {

                    //On masque le panneau qui affiche les différents points de passage pour le trajet (dans 500m tournez à gauche etc...)
                    $('.leaflet-top').hide();
                    $('.leaflet-right').hide();

                    // Test si l'utilisateur se trouve à Porrentruy (Dans les limites de la carte)
                    // Test la latitude
                    if (position.coords.latitude > 47.386677 && position.coords.latitude < 47.43158) {
                        // Test la longitude
                        if (position.coords.longitude > 7.016623 && position.coords.longitude < 7.102020) {

                            $scope.centerPosition = function() {
                                mapLeaflet.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
                            };


                            $.each($('.locationButtons'), function() {
                                $(this).removeClass('locationButtons');
                            });

                            // Test si c'est la première fois que l'utilisateur est localisé, si oui on affiche le marqueur de position
                            // si non on supprime l'ancien marqueur et on en affiche un nouveau pour éviter d'avoir plusieurs marqueurs de position
                            if (firstSuccess == false) {
                                mapLeaflet.removeLayer(markerPosition);
                            }
                            var markerPosition = L.marker([position.coords.latitude, position.coords.longitude], {
                                icon: greenIcon
                            }).addTo(mapLeaflet);

                            // On supprime l'ombre du marker
                            $('.leaflet-marker-shadow:nth-child(2)').remove();


                            // Une fois arrivé ici, on indique que ce n'est plus la première fois que l'utilisateur est localisé
                            firstSuccess = false;




                            $('.leaflet-marker-icon:nth-child(1)').click(function() {
                                slideInUpMap(
                                    monuments[$stateParams.mapId].name,
                                    100,
                                    "SimpleDisplay",
                                    monuments[$stateParams.mapId].id,
                                    true
                                );
                            });


                        } else {
                            // Message d'erreur si l'utilisateur ne se situe pas dans Porrentruy
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
                }

                // Affichage de l'erreur si la géolocalisation n'a pas fonctionné (Callback erreur)
                function onError(error) {
                    if ($rootScope.erreurAffichee == false) {
                        $scope.showAlert();
                    }

                    $('.leaflet-marker-icon:nth-child(1)').click(function() {
                        slideInUpMap(
                            monuments[$stateParams.mapId].name,
                            100,
                            "SimpleDisplay",
                            monuments[$stateParams.mapId].id,
                            true
                        );
                    });
                }

                var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {
                    timeout: 5000
                });

                setTimeout(function() {
                    if ($rootScope.satellite == true) {
                        //$('.satelliteButton').attr('src','data/img/leafletview.png');
                        $('.map').remove('#map');
                        $('#map').remove();
                        $('#copyright').hide();
                        $('.map').append(' <div id="map" tap-on style="position: fixed; top: 35px; bottom: 50px; left: 0; right: 0; " data-tap-disabled="true"></div>')
                        $scope.initMap();
                    }
                }, 500);
            }, $translate.use());
            
        }
    ]);