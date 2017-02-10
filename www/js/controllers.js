/*
 *   CONTROLLERS
 *   ===================================================
 *   @author         Mathis Schaller & Sébastien Marquis
 *   @description    Contrôleurs de l'application.
 */

//Création du module
angular.module('starter.controllers', ['ngCordova', 'leaflet-directive']);

//DIRECTIVES
//Directive permettant d'appeler un script n'impote où dans le code
angular.module('starter.controllers')
    .directive("otcScripts", function() {

        var updateScripts = function (element) {
            return function (scripts) {
                element.empty();
                angular.forEach(scripts, function (source, key) {
                    var scriptTag = angular.element(
                        document.createElement("script"));
                    source = "//@ sourceURL=" + key + "\n" + source;
                    scriptTag.text(source);
                    element.append(scriptTag);
                });
            };
        };

        return {
            restrict: "EA",
            scope: {
                scripts: "="
            },
            link: function(scope,element) {
                scope.$watch("scripts", updateScripts(element));
            }
        };
    })

    // Tap or drag on the content to hide the menu
    .directive('tapOn', function($ionicGesture) {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                $ionicGesture.on('tap', function(e) {
                    e.gesture.stopDetect();
                    e.gesture.preventDefault();
                    $('.slide-in-up').css('marginBottom','-'+$('.slide-in-up').css('height'));
                    $element.parent('#wrapper').find("nav").removeClass('slide-in-up');
                    $("#menu_map")
                        .removeClass("map-slider")
                        .removeClass("slide-in-up");
                    $("#menu_pano")
                        .removeClass("pano-slider")
                        .removeClass("slide-in-up");
                }, $element);
                $ionicGesture.on('drag', function(e) {
                    e.gesture.stopDetect();
                    e.gesture.preventDefault();
                    $('.slide-in-up').css('marginBottom','-'+$('.slide-in-up').css('height'));
                    $element.parent('#wrapper').find("nav").removeClass('slide-in-up');
                    $("#menu_map")
                        .removeClass("map-slider")
                        .removeClass("slide-in-up");
                    $("#menu_pano")
                        .removeClass("pano-slider")
                        .removeClass("slide-in-up");
                }, $element);
            }
        }
    })
    .directive('hideSortingMenu', function($ionicGesture) {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                $ionicGesture.on('tap', function(e) {
                    e.gesture.stopDetect();
                    e.gesture.preventDefault();
                    $('#sorting_background').css('opacity', '0');
                    setTimeout(function(){
                        $('#sorting_background').css('display', 'none');
                    },300);
                    $('#sorting_menu').css('display', 'none');
                }, $element);
            }
        }
    });

function loadScript(url, callback){

    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}