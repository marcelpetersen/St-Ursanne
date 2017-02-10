angular.module('starter.controllers')
    .controller('LieuDetailCtrl', ['$scope', '$rootScope', '$stateParams', 'Lieux', '$ionicSlideBoxDelegate', '$ionicModal', '$translate',
        function($scope, $rootScope, $stateParams, Lieux, $ionicSlideBoxDelegate, $ionicModal, $translate){
            $rootScope.showTabs = 'hideDown';

            $scope.lieu = [];

            Lieux.get($stateParams.lieuId, function(data){
                $scope.lieu = data;
                $ionicSlideBoxDelegate.update();
            }, $translate.use());

            $('.rond').css('max-height', $('.rond').width()+"px");
            //$('.no360 > .pano-icon').css('background-size', $('.rond').width()+"px " + $('.rond').width()+"px !important");
            if($('.rond').width() <= 70){
                $('.ligne').css('padding', "15px 0");
            } else{
                $('.ligne').css('padding', "20px 0");
            }
            $(window).resize(function() {
                $('.rond').css('max-height', $('.rond').width()+"px");
                //$('.no360 > .pano-icon').css('background-size', $('.rond').width()+"px " + $('.rond').width()+"px !important");
                if($('.rond').width() <= 70){
                    $('.ligne').css('padding', "15px 0");
                } else{
                    $('.ligne').css('padding', "20px 0");
                }
            });

            Lieux.load(function (data) {
                var images = [];
                images = data.lieux[$stateParams.lieuId].images;

                //Cache le bouton de panorama s'il n'y en a pas
                if(!data.lieux[$stateParams.lieuId].panorama){
                    $.each($('.panoramaButton'), function() {
                        $(this).addClass('grey no360');
                    });
                } else {
                    $.each($('.panoramaButton'), function() {
                        $(this).removeClass('grey no360');
                    });
                }

                $(".lieu-thumbnail-img").css("background-image","url('data/img/monument"+[$stateParams.lieuId]+"/1.jpg')");

                if(data.lieux[$stateParams.lieuId].panorama) {
                    $('.panoramaButton').attr('href', '#/lieu/' + $stateParams.lieuId + '/panorama')
                }

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

                    // build items array
                    imagesLoading(0);
                    function imagesLoading(index){
                        var sourceImage = 'data/img/monument' + $stateParams.lieuId + "/" + images[index].image;

                        var img = new Image();
                        img.onload = function() {
                            items.push({
                                src: this.getAttribute('src'),
                                w: this.width,
                                h: this.height,
                                title: this.description
                            });

                            if(index == (images.length-1)){
                                var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
                                gallery.listen('destroy', function() {
                                    document.getElementsByClassName("pswp")[0].style.display = 'none';
                                });

                                gallery.listen('beforeChange', function() {
                                    document.getElementsByClassName("pswp")[0].style.display = 'block';
                                });
                                gallery.init();
                            }
                            if(index < images.length)
                                imagesLoading(index + 1);
                        };
                        img.description = images[index].description;
                        img.src = sourceImage;
                    }
                };

                document.getElementById('btn').onclick = function() {
                    $rootScope.setOpenDiapo();
                };

                document.getElementById('pic-btn').onclick = function() {
                    $rootScope.setOpenDiapo();
                };

                Number.prototype.toRad = function() {
                    return this * Math.PI / 180;
                };

                var getData = function()  {
                    return data;
                };

                var getDistance = function(a,b,c,d)  {
                    return distance(a,b,c,d);
                };



                navigator.geolocation.getCurrentPosition(function(position) {
                    var data = getData();
                    var distance = getDistance(data.lieux[$stateParams.lieuId].latitude, position.coords.latitude, data.lieux[$stateParams.lieuId].longitude, position.coords.longitude);
                    var totalTime = getTotalTime(distance);

                    $('#distanceTime').append('<p>' + parseInt(totalTime) + ' min. ' + parseInt(distance) + ' m.</p>');
                })

                
            }, $translate.use())
        }]);