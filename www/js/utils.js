// DISTANCE ENTRE 2 MARUQUEURS
Number.prototype.toRad = function() {
    return this * Math.PI / 180;
};

function distance(lat1, lat2, lon1, lon2) {
    var R = 6371000; // meter
    var Phi1 = lat1.toRad();
    var Phi2 = lat2.toRad();
    var DeltaPhi = (lat2 - lat1).toRad();
    var DeltaLambda = (lon2 - lon1).toRad();

    var a = Math.sin(DeltaPhi / 2) * Math.sin(DeltaPhi / 2)
        + Math.cos(Phi1) * Math.cos(Phi2) * Math.sin(DeltaLambda / 2)
        * Math.sin(DeltaLambda / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c);
}

function getProximity(monuments, pScope, position, callback){
    for (var i = 0; i < monuments.lieux.length; i++){
        monuments.lieux[i].distance = parseInt((distance(position.coords.latitude, monuments.lieux[i].latitude, position.coords.longitude, monuments.lieux[i].longitude)).toFixed(0));
    }
    callback(monuments);
}

function removeSpecialCharacters(str) {
    return str.toLowerCase().
    replace(/\\s/g, "").
    replace(/[àáâãäå]/g, "a").
    replace(/æ/g, "ae").
    replace(/ç/g, "c").
    replace(/[èéêë]/g, "e").
    replace(/[ìíîï]/g, "i").
    replace(/ñ/g, "n").
    replace(/[òóôõö]/g, "o").
    replace(/œ/g, "oe").
    replace(/[ùúûü]/g, "u").
    replace(/[ýÿ]/g, "y").
    replace(/\\W/g, "");
}


function checkNetConnection(){

}

