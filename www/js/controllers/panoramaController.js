angular.module('starter.controllers')
    .controller("panoramaController",['$scope', '$rootScope', '$stateParams','Lieux','$ionicHistory', '$translate', function($scope, $rootScope, $stateParams, Lieux, $ionicHistory, $translate ){

        //Crée l'élément photoswipe en HTML
        $rootScope.$on("$ionicView.loaded", function(scopes,states){
            replacePSWP();
        });

        $rootScope.$on("$ionicView.afterLeave", function(scopes,states){
            if(states.stateName == "lieuPanorama" ) {
                removepano("pano1");
        }
        });


        $rootScope.showTabs = 'hideDown';
        $rootScope.checkZoom = true;
        $rootScope.styleTransform = undefined;

        $scope.panoHide = true;
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        Lieux.load(function(data) {


            var monuments = data.lieux;
            window.loadDetailPano = function(id){

                var hotspot = monuments[$stateParams.lieuId].hotspots[id];
                var images = [];
                images = hotspot.image;

                var pswpElement = document.querySelectorAll('.pswp_pano')[0];

                // define options (if needed)
                var options = {
                    // history & focus options are disabled on CodePen
                    history: false,
                    focus: true,

                    showHideOpacity:true,
                    loop:false,

                    showAnimationDuration: 0,
                    hideAnimationDuration: 0
                };

                var items = [];

                if(images[0].image == ""){

                    items = [{
                        src: "",
                        w: 0,
                        h: 0,
                        title: hotspot.description
                    }];

                    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
                    gallery.listen('destroy', function() {
                        document.getElementsByClassName("pswp_pano")[0].style.display = 'none';

                    });

                    gallery.listen('beforeChange', function() {
                        document.getElementsByClassName("pswp_pano")[0].style.display = 'block';

                    });
                    gallery.init();
                } else {
                    // build items array
                    imagesLoading(0);
                    function imagesLoading(index){
                        var sourceImage = 'data/img/monument' + $stateParams.lieuId + "/hotspots/" + images[index].image;

                        var img = new Image();
                        img.onload = function () {

                            items.push({
                                src: this.getAttribute('src'),
                                w: this.width,
                                h: this.height,
                                title: this.description
                            });
                            if (i = (images.length)) {
                                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

                                gallery.listen('imageLoadComplete', function(i) {
                                    $('.pswp__zoom-wrap').first().find('img').first().css('height');
                                    //Trouver hauteur du viewport
                                    //Trouver marge a mettre en haut pour que l'image soit centré
                                    //Appliquer a la translate3d 2e element
                                });

                                gallery.listen('destroy', function() {
                                    document.getElementsByClassName("pswp_pano")[0].style.display = 'none';
                                    replacePSWP();
                                });

                                gallery.listen('beforeChange', function() {
                                    document.getElementsByClassName("pswp_pano")[0].style.display = 'block';
                                });
                                gallery.init();
                            }
                            if(index < images.length)
                                imagesLoading(index + 1);
                        };
                        img.description = images[index].description;
                        img.src = sourceImage;
                    }
                }
            };
        }, $translate.use());

        $scope.scripts = [];
        $scope.scripts = [
            'embedpano({swf:"panoramas/tour.swf", xml:"panoramas/xml/' + $stateParams.lieuId + '.xml", target:"pano",id:"pano1", html5:"prefer", passQueryParameters:true});'
        ];

        function replacePSWP(){
            document.getElementById("pswp_replace").innerHTML = "<div id='pswp_replace' class='pswp pswp_pano' tabindex='-1' role='dialog' aria-hidden='true'>"+
                "<div class='pswp__bg'></div>"+
                "<div class='pswp__scroll-wrap'>"+
                "<div class='pswp__container'>"+
                "<div class='pswp__item'></div>"+
                "<div class='pswp__item'></div>"+
                "<div class='pswp__item'></div>"+
                "</div>"+
                "<div class='pswp__ui pswp__ui--hidden'>"+
                "<div class='pswp__top-bar'>"+
                "<div class='pswp__counter'></div>"+
                "<button class='pswp__button pswp__button--close' title='Close (Esc)'></button>"+
                "<button class='pswp__button pswp__button--zoom' title='Zoom in/out'></button>"+
                "<div class='pswp__preloader'>"+
                "<div class='pswp__preloader__icn'>"+
                "<div class='pswp__preloader__cut'>"+
                "<div class='pswp__preloader__donut'></div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='pswp__share-modal pswp__share-modal--hidden pswp__single-tap'>"+
                "<div class='pswp__share-tooltip'></div>"+
                "</div>"+
                "<button class='pswp__button pswp__button--arrow--left' title='Previous (arrow left)'>"+
                "</button>"+
                "<button class='pswp__button pswp__button--arrow--right' title='Next (arrow right)'>"+
                "</button>"+
                "<div class='pswp__caption'>"+
                "<div class='pswp__caption__center'></div>"+
                "</div>"+
                "</div>"+
                "</div>"+
                "</div>";
        }
    }]);