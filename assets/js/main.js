/*-----------------------------------------------------------------

------------------------------------------------------------------*/

(function ($) {
    "use strict";

    $(document).ready(function () {
        /*-----------------------------------
          01. Mobile Menu  
        -----------------------------------*/
        $("#mobile-menu").meanmenu({
            meanMenuContainer: ".mobile-menu",
            meanScreenWidth: "1199",
            meanExpand: ['<i class="far fa-plus"></i>'],
        });

        /*-----------------------------------
          02. Sidebar Toggle  
        -----------------------------------*/
        $(".offcanvas__close,.offcanvas__overlay").on("click", function () {
            $(".offcanvas__info").removeClass("info-open");
            $(".offcanvas__overlay").removeClass("overlay-open");
        });
        $(".sidebar__toggle").on("click", function () {
            $(".offcanvas__info").addClass("info-open");
            $(".offcanvas__overlay").addClass("overlay-open");
        });

        /*-----------------------------------
          03. Body Overlay 
        -----------------------------------*/
        $(".body-overlay").on("click", function () {
            $(".offcanvas__area").removeClass("offcanvas-opened");
            $(".df-search-area").removeClass("opened");
            $(".body-overlay").removeClass("opened");
        });

        /*-----------------------------------
          04. Sticky Header 
        -----------------------------------*/
        $(window).scroll(function () {
            if ($(this).scrollTop() > 250) {
                $("#header-sticky").addClass("sticky");
            } else {
                $("#header-sticky").removeClass("sticky");
            }
        });

        /*-----------------------------------
          06. Wow Animation 
        -----------------------------------*/
        new WOW().init();

        /*-----------------------------------
          07. Set Background Image & Mask   
        -----------------------------------*/
        if ($("[data-bg-src]").length > 0) {
            $("[data-bg-src]").each(function () {
                var src = $(this).attr("data-bg-src");
                $(this).css("background-image", "url(" + src + ")");
                $(this).removeAttr("data-bg-src").addClass("background-image");
            });
        }

        if ($("[data-mask-src]").length > 0) {
            $("[data-mask-src]").each(function () {
                var mask = $(this).attr("data-mask-src");
                $(this).css({
                    "mask-image": "url(" + mask + ")",
                    "-webkit-mask-image": "url(" + mask + ")",
                });
                $(this).addClass("bg-mask");
                $(this).removeAttr("data-mask-src");
            });
        }

        /*-----------------------------------
          08.Global Slider
        -----------------------------------*/
        function applyAnimationProperties() {
            $("[data-ani]").each(function () {
                var animationClass = $(this).data("ani");
                $(this).addClass(animationClass);
            });

            $("[data-ani-delay]").each(function () {
                var delay = $(this).data("ani-delay");
                $(this).css("animation-delay", delay);
            });
        }

        // Call the animation properties function
        applyAnimationProperties();

        // Function to initialize Swiper
        function initializeSwiper(sliderContainer) {
            var sliderOptions = sliderContainer.data("slider-options");

            console.log("Slider options: ", sliderOptions);

            var previousArrow = sliderContainer.find(".slider-prev");
            var nextArrow = sliderContainer.find(".slider-next");
            var paginationElement = sliderContainer.find(".slider-pagination");
            var numberedPagination = sliderContainer.find(".slider-pagination.pagi-number");

            var paginationStyle = sliderOptions["paginationType"] || "bullets";
            var autoplaySettings = sliderOptions["autoplay"] || {
                delay: 6000,
                disableOnInteraction: false,
            };

            var defaultSwiperConfig = {
                slidesPerView: 1,
                spaceBetween: sliderOptions["spaceBetween"] || 24,
                loop: sliderOptions["loop"] !== false,
                speed: sliderOptions["speed"] || 1000,
                initialSlide: sliderOptions["initialSlide"] || 0,
                centeredSlides: !!sliderOptions["centeredSlides"],
                effect: sliderOptions["effect"] || "slide",
                fadeEffect: {
                    crossFade: true,
                },
                autoplay: autoplaySettings,
                navigation: {
                    nextEl: nextArrow.length ? nextArrow.get(0) : null,
                    prevEl: previousArrow.length ? previousArrow.get(0) : null,
                },
                pagination: {
                    el: paginationElement.length ? paginationElement.get(0) : null,
                    type: paginationStyle,
                    clickable: true,
                    renderBullet: function (index, className) {
                        var bulletNumber = index + 1;
                        var formattedNumber = bulletNumber < 10 ? "0" + bulletNumber : bulletNumber;
                        if (numberedPagination.length) {
                            return '<span class="' + className + ' number">' + formattedNumber + "</span>";
                        } else {
                            return '<span class="' + className + '" aria-label="Go to Slide ' + formattedNumber + '"></span>';
                        }
                    },
                },
                on: {
                    slideChange: function () {
                        setTimeout(
                            function () {
                                this.params.mousewheel.releaseOnEdges = false;
                            }.bind(this),
                            500
                        );
                    },
                    reachEnd: function () {
                        setTimeout(
                            function () {
                                this.params.mousewheel.releaseOnEdges = true;
                            }.bind(this),
                            750
                        );
                    },
                },
            };

            var finalConfig = $.extend({}, defaultSwiperConfig, sliderOptions);
            console.log("Complete Swiper options: ", finalConfig);

            // Initialize the Swiper instance
            return new Swiper(sliderContainer.get(0), finalConfig);
        }

        // Initialize Swipers on page load
        var swiperInstances = [];
        $(".gt-slider").each(function () {
            var sliderContainer = $(this);
            var swiperInstance = initializeSwiper(sliderContainer);
            swiperInstances.push(swiperInstance);
        });

        // Bootstrap tab show event
        $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
            var targetTab = $(e.target).attr("href");
            $(targetTab)
                .find(".et-slider")
                .each(function () {
                    var sliderContainer = $(this);
                    if (!sliderContainer[0].swiper) {
                        initializeSwiper(sliderContainer);
                    } else {
                        sliderContainer[0].swiper.update();
                    }
                });
        });

        // Add click event handlers for external slider arrows based on data attributes
        $("[data-slider-prev], [data-slider-next]").on("click", function () {
            var targetSliderSelector = $(this).data("slider-prev") || $(this).data("slider-next");
            var targetSlider = $(targetSliderSelector);

            if (targetSlider.length) {
                var swiper = targetSlider[0].swiper;

                if (swiper) {
                    if ($(this).data("slider-prev")) {
                        swiper.slidePrev();
                    } else {
                        swiper.slideNext();
                    }
                }
            }
        });

        /*-----------------------------------
           09. Back to top    
        -----------------------------------*/
        $(window).scroll(function () {
            if ($(this).scrollTop() > 20) {
                $("#back-top").addClass("show");
            } else {
                $("#back-top").removeClass("show");
            }
        });
        $("#back-top").click(function () {
            $("html, body").animate({ scrollTop: 0 }, 800);
            return false;
        });

        if ($(".testimonial-slider-3").length > 0) {
            const testimonialSlider3 = new Swiper(".testimonial-slider-3", {
                spaceBetween: 30,
                speed: 1500,
                loop: true,
                autoplay: {
                    delay: 1500,
                    disableOnInteraction: false,
                },
                navigation: {
                    nextEl: ".array-prev",
                    prevEl: ".array-next",
                },
            });
        }

        /*-----------------------------------
            12. Mouse Cursor    
        -----------------------------------*/
        function mousecursor() {
            if ($("body")) {
                const e = document.querySelector(".cursor-inner"),
                    t = document.querySelector(".cursor-outer");
                let n,
                    i = 0,
                    o = !1;
                (window.onmousemove = function (s) {
                    o || (t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)"), (e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)"), (n = s.clientY), (i = s.clientX);
                }),
                    $("body").on("mouseenter", "a, .cursor-pointer", function () {
                        e.classList.add("cursor-hover");
                        t.classList.add("cursor-hover");
                    }),
                    $("body").on("mouseleave", "a, .cursor-pointer", function () {
                        ($(this).is("a") && $(this).closest(".cursor-pointer").length) || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"));
                    }),
                    (e.style.visibility = "visible"),
                    (t.style.visibility = "visible");
            }
        }
        $(function () {
            mousecursor();
        });
    }); // End Document Ready Function
})(jQuery); // End jQuery
