function slideInUp(title, text) {
    document.getElementById("menu_pano").className += " pano-slider slide-in-up";
    document.getElementById("nav_title_pano").innerHTML = "<div class='title title-center header-item pano-slider'>" + title + "</div>";
    document.getElementById("nav_content_pano").innerHTML = text;
}

function slideInDown() {
    $("#menu_pano")
        .removeClass("pano-slider")
        .removeClass("slide-in-up");
    document.getElementById("nav_title_pano").innerHTML = "";
    document.getElementById("nav_content_pano").innerHTML = "";
}

function getTotalTime(distance){

    const VITESSE_MARCHE = 5;
    var travelTime = distance / (VITESSE_MARCHE * 1000) * 60;
    return travelTime;
}

function slideInUpMap(title, distance, travelTime, id, mapMonument, echelle) {
    var currentDate = new Date();
    var arriveTime = new Date();
    var travel = new Date();
    const VITESSE_MARCHE = 5; // Km/h

    // Calcul du temps automatique en passant '-1' en paramètre
    if (travelTime == "automatique") {
        travelTime = distance / (VITESSE_MARCHE * 1000) * 60;
    }

    if (currentDate.getMinutes() + travelTime <= 59 && currentDate.getMinutes() + travelTime >= 0) {
        arriveTime.setMinutes(currentDate.getMinutes() + travelTime);
        arriveTime.setHours(currentDate.getHours());
    } else if (currentDate.getMinutes() + travelTime > 59) {
        var minutes = currentDate.getMinutes() + travelTime;
        var hours = Math.floor(minutes / 60);
        minutes = minutes - (hours * 60);
        arriveTime.setMinutes(minutes);
        arriveTime.setHours(currentDate.getHours() + hours);
    } else {
        var hideInfos = true;
    }

    if (travelTime >= 0 && travelTime <= 59) {
        travel.setMinutes(travelTime);
        travel.setHours(0);
    } else if (travelTime >= 60) {
        var travelHours = Math.floor(travelTime / 60);
        travel.setMinutes(travelTime - (travelHours * 60));
        travel.setHours(travelHours);
    } else {
        var hideInfos = true;
    }

    var contenu = "<div class='navbar_map_title'>" +
        "<h3>" + title + "</h3>" +
        "</div>";

    if (typeof hideInfos === 'undefined') {
        contenu += "<div class='navbar_map_text'>" +
            "<p><i class='icon icon-left ion-android-walk'></i> " + distance;
        if(echelle != 'km') {
            contenu += " m";
        }
        contenu += "</p>" +
            "<p><i class='icon icon-left ion-android-stopwatch'></i> " + ('0' + travel.getHours()).slice(-2) +
            ":" + ('0' + travel.getMinutes()).slice(-2) + "</p>" +
            "<p><i class='icon icon-left ion-android-time'></i> " + ('0' + arriveTime.getHours()).slice(-2) +
            ":" + ('0' + arriveTime.getMinutes()).slice(-2) + "</p>" +
            "</div>";
    }

    contenu += "<div class='navbar_map_buttons'>";
    if (mapMonument !== true){
        contenu += "<a href='#/map/" + id + "'><div class='compass-icon'></div></a>";
    }
    contenu += "<a href='#/lieu/" + id + "'><div class='monument-icon'></div></a>" +
        "</div>";

    document.getElementById("menu_map").className += " map-slider slide-in-up";
    document.getElementById("nav_title_map").innerHTML = contenu;
}