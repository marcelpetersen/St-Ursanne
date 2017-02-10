angular.module('starter.controllers')
    .controller('HistoryCtrl', ['$scope', '$http','$rootScope',
        function($scope, $http, $rootScope) {
            $rootScope.showTabs = 'hideDown';

            $(".history-date").hide();
            $("#switchToHistoire").addClass('active');
            $("#switchToHistoire").click(function(){
                if(!$("#switchToHistoire").hasClass('active')){
                    $("#switchToHistoire").addClass('active');
                    $("#switchToDates").removeClass('active');
                    $(".history-text").toggle(500);
                    $(".history-date").toggle(500);
                }
            });

            $("#switchToDates").click(function(){
                if(!$("#switchToDates").hasClass('active')){
                    $("#switchToHistoire").removeClass('active');
                    $("#switchToDates").addClass('active');
                    $(".history-text").toggle(500);
                    $(".history-date").toggle(500);
                }
            });

            $rootScope.setOpenDiapo = function(){
                $("#photoswipe_perso").html('<div id="pswpPerso" class="pswp pswp_pano" tabindex="-1" role="dialog" aria-hidden="true"> <div class="pswp__bg"></div><div class="pswp__scroll-wrap"> <div class="pswp__container"> <div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"> <div class="pswp__top-bar"> <div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button> <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button> <div class="pswp__preloader"> <div class="pswp__preloader__icn"> <div class="pswp__preloader__cut"> <div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"> <div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"> </button> <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"> </button> <div class="pswp__caption"> <div class="pswp__caption__center"></div></div></div></div></div>');

                var pswpElement = $('#pswpPerso')[0];

                var options = {
                    history: false,
                    focus: true,

                    showHideOpacity:true,
                    loop:false,

                    preload:[4,4],

                    showAnimationDuration: 0,
                    hideAnimationDuration: 0
                };

                var items = [];

                var photoHistoire = ['1.jpg','2.jpg','3.jpg'];

                // build items array
                imagesLoading(0);

                function imagesLoading(index){
                    var sourceImage = 'data/img/histoire/' + photoHistoire[index];

                    var img = new Image();
                    img.onload = function() {

                        items.push({
                            src: this.getAttribute('src'),
                            w: this.width,
                            h: this.height,
                            title: this.description
                        });

                        if(i = (photoHistoire.length-1)){
                            var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
                            gallery.listen('destroy', function() {
                                document.getElementsByClassName("pswp")[0].style.display = 'none';
                            });

                            gallery.listen('beforeChange', function() {
                                document.getElementsByClassName("pswp")[0].style.display = 'block';
                            });
                            gallery.init();
                        }
                        if(index < photoHistoire.length)
                            imagesLoading(index + 1);
                    };
                    img.description = "Vue aérienne copyright Roger Meier";
                    if(index == 2){
                        img.description = "";
                    }

                    img.src = sourceImage;
                }
            };
            document.getElementById('pic-btn-history').onclick = function() {
                $rootScope.setOpenDiapo();
            };

        }
    ]);