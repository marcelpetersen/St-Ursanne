angular.module('starter.services', [])

    .factory('Lieux', ['$http',function($http){
        return {
            load:function(callback, lang){
                if(lang == "fr"){
                    $http.get('data/monumentsFR.json').success(callback);
                } else if( lang == "de"){
                    $http.get('data/monumentsDE.json').success(callback);
                }
            },
            get:function(lieuId, callback, lang) {
                if(lang == "fr"){
                    $http.get('data/monumentsFR.json').success(function(data) {
                        var lieu = data.lieux[lieuId];
                        callback(lieu);
                    });
                } else if( lang == "de"){
                    $http.get('data/monumentsDE.json').success(function(data) {
                        var lieu = data.lieux[lieuId];
                        callback(lieu);
                    });
                }
            }
        }
    }])
