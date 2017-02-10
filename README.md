#Mise en place de l'environnment de développement

1. Installer git https://git-scm.com/downloads
2. Installer Node JS : https://nodejs.org/
2. Mettre à jour NPM : `$ sudo npm install npm -g`
3. Installer Bower, Gulp, Cordova et ionic : `$ sudo npm install -g bower gulp cordova ionic`

##Récupération de l'application et initialisation des outils de développement (bower, gulp, sass)

1. Dans WebStorm, aller dans le menu VCS --> Checkout from version control --> Github --> Connectez-vous avec votre identifiant et votre mdp --> cloner le dépot github dans un dossier de votre choix

2. Executer les commandes suivantes dans le terminal. Controlez que vous travaillez dans le dossier de l'application.

<pre>$ npm install bower gulp gulp-concat gulp-minify-css gulp-rename gulp-sass gulp-util shelljs
$ bower install angular-translate
$ bower install angular-translate-loader-static-files
$ ionic setup sass
$ bower update
$ ionic add ionic-platform-web-client
$ ionic plugin add cordova-plugin-whitelist
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git
$ cordova plugin add https://github.com/phonegap/phonegap-mobile-accessibility.git
$ ionic serve --lab</pre>

Un onglet dans votre navigateur devrait s'ouvrir avec votre application.

##Pour exécuter un commit :

* ctrl + k
* Contrôler les modifications
* Ajouter une description
* Choisir
 * commit : effectue un commit local
 * commit and push : effectue un commit local puis l'envoie sur le dépot github
