/*
* ----------------------------------------------------------------------------------------
Author        : Rama Hardian Sidik
Template Name : Freeman - Free Multipurpose Personal One Page Html Template
Version       : 1.0
Filename      : main.js
* ----------------------------------------------------------------------------------------
* ----------------------------------------------------------------------------------------
*/
const freemaninit = (function() {
    "use strict";
    // variable 
    var header = document.querySelector('#headermain');
    var body = document.querySelector('body');
    var continuousElements = document.getElementsByClassName("sectionblock");
    var counter = document.querySelectorAll(".counterwrap__counter");
    var counters = document.querySelectorAll(".counterwrap__counter");
    var mobilelink = document.querySelectorAll('.overlay__listnav li a');
    var mobilenav = document.querySelector('.navicon');
    var mainSection = document.querySelectorAll('main div.sectionblock');
    var menuSection = document.querySelectorAll('.navpage__wrap li a');
    var goup = document.querySelector('.scroll-top');
    var sliderService = document.getElementById("sliderservice");
    var yearele = document.querySelector('.years');
    var btnContainer = document.getElementById("filterwrap");
    var btns = btnContainer.getElementsByTagName("li");
    var porto = document.getElementById('porfoliowarp');
    var Shuffle = window.Shuffle;
    var wrapper;
    var dots;
    var typedText = document.querySelector("#typed-text");
    var cursor = document.querySelector(".cursor");
    var textArrayIndex = 0;
    var charIndex = 0;
    var textArray = ["UI/UX Design.", " Web Developer.", "Product Design.", "Digital Marketing."];
    var year = new Date().getFullYear();
    var revealPoint = 150;
    var interval = 0;
    var loop = 0;
    //var burger = document.querySelector('.mobilenav');
    //detect mobile device
    const isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    // loadder page
    const loadder = function(e) {
        setTimeout(() => {
            document.querySelector(".preloader").style.display = "none";
        }, 1000);
    };
    // GLightbox
    const glight = function(e) {
        GLightbox({
            selector: 'glightboxvideo',
        });
        GLightbox();
    };
    // shuffle portfolio
    const portofolio = function(e) {
        var myShuffle = new Shuffle(porto, {
            itemSelector: '.porfoliowarp__item',
            buffer: 0,
            columnThreshold: 0.01,
            columnWidth: 0,
            delimiter: null,
            sizer: null,
            speed: 250,
            filterMode: Shuffle.FilterMode.ANY,
            group: Shuffle.ALL_ITEMS,
        });
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", function(e) {
                document.querySelector('.active').classList.remove('active');
                (document.querySelector('.active')) ? document.querySelector('.active').classList.remove('active'): '';
                this.classList.add('active');
                myShuffle.filter(e.target.dataset.group);
            });
        };
    };
    // scroll spy 
    const scrolspy = function(e) {
        // for clickable event
        menuSection.forEach(v => {
            v.onclick = (() => {
                setTimeout(() => {
                    menuSection.forEach(j => j.classList.remove('activelink'));
                    v.classList.add('activelink');
                }, 300)
            });
        });
        // for window scroll spy event
        window.onscroll = (() => {
            mainSection.forEach((v, i) => {
                let rect = v.getBoundingClientRect().y
                if (rect < window.innerHeight - 100) {
                    menuSection.forEach(v => v.classList.remove('activelink'));
                    menuSection[i].classList.add('activelink');
                }
            });
        });
    };
    //animated typed init ------------------------
    const erase = function(e) {
        if (charIndex > 0) {
            cursor.classList.remove('blink');
            typedText.textContent = textArray[textArrayIndex].slice(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 80);
        } else {
            cursor.classList.add('blink');
            textArrayIndex++;
            if (textArrayIndex > textArray.length - 1) {
                textArrayIndex = 0;
            }
            setTimeout(typeanimation, 1000);
        };
    };
    const typeanimation = function(e) {
        if (charIndex <= textArray[textArrayIndex].length - 1) {
            cursor.classList.remove('blink');
            typedText.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeanimation, 120);
        } else {
            cursor.classList.add('blink');
            setTimeout(erase, 1000);
        }
    };
    /* scroll counter */
    counters.forEach(function(item) {
        item.counterAlreadyFired = false
        item.counterSpeed = item.getAttribute("data-Speed") / 45
        item.counterTarget = +item.innerText
        item.counterCount = 0
        item.counterStep = item.counterTarget / item.counterSpeed
        item.updateCounter = function() {
            item.counterCount = item.counterCount + item.counterStep
            item.innerText = Math.ceil(item.counterCount)
            if (item.counterCount < item.counterTarget) {
                setTimeout(item.updateCounter, item.counterSpeed)
            } else {
                item.innerText = item.counterTarget
            }
        }
    });
    const counternumber = function() {
        const isScrolledIntoView = function(el) {
            var rect = el.getBoundingClientRect();
            var elemTop = rect.top;
            var elemBottom = rect.bottom;
            // Only completely visible elements return true:
            var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
            // Partially visible elements return true:
            //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
            return isVisible;
        };
        counter.forEach(function(item, id) {
            if (!isScrolledIntoView(item)) return
            item.updateCounter()
            item.counterAlreadyFired = true
        });
    };
    // click button menu burger
    const buttonclick = function(e) {
        // menu mobile toggle
        mobilenav.addEventListener("click", function(e) {
            //your handler here
            this.classList.toggle('active');
            body.classList.toggle('openmenu');
        }, false);
        // mobile link navigation 
        for (var i = 0; i < mobilelink.length; i++) {
            mobilelink[i].addEventListener('click', function(e) {
                mobilenav.classList.toggle('active');
                body.classList.toggle('openmenu');
            }, false);
        };
    };
    // services slider 
    const servicesslider = function(e) {
        function autoplay(run) {
            clearInterval(interval);
            interval = setInterval(() => {
                if (run && slider) {
                    slider.next();
                }
            }, 5000);
        };

        function navigation(slider) {
            function markup(remove) {
                wrapperMarkup(remove);
                dotMarkup(remove);
            };

            function removeElement(elment) {
                elment.parentNode.removeChild(elment);
            };

            function createDiv(className) {
                var div = document.createElement("div");
                var classNames = className.split(" ");
                classNames.forEach((name) => div.classList.add(name))
                return div
            };

            function wrapperMarkup(remove) {
                if (remove) {
                    var parent = wrapper.parentNode
                    while (wrapper.firstChild)
                        parent.insertBefore(wrapper.firstChild, wrapper);
                    removeElement(wrapper);
                    return
                };
                wrapper = createDiv("navigation-wrapper");
                slider.container.parentNode.appendChild(wrapper);
                wrapper.appendChild(slider.container);
            };

            function dotMarkup(remove) {
                if (remove) {
                    removeElement(dots);
                    return
                };
                dots = createDiv("dots")
                slider.track.details.slides.forEach((_e, idx) => {
                    var dot = createDiv("dot");
                    dot.addEventListener("click", () => slider.moveToIdx(idx))
                    dots.appendChild(dot);
                });
                wrapper.appendChild(dots);
            };

            function updateClasses() {
                var slide = slider.track.details.rel
                Array.from(dots.children).forEach(function(dot, idx) {
                    idx === slide ?
                        dot.classList.add("dot--active") :
                        dot.classList.remove("dot--active")
                });
            };

            slider.on("created", () => {
                markup();
                updateClasses();
            });
            slider.on("optionsChanged", () => {
                markup(true);
                markup();
                updateClasses();
            });
            slider.on("slideChanged", () => {
                updateClasses();
            });
            slider.on("destroyed", () => {
                markup(true);
            });
        };
        var slider = new KeenSlider(sliderService, {
            loop: true,
            mode: "free-snap",
            breakpoints: {
                "(min-width: 320px)": {
                    slides: { perView: 1, spacing: 5 },
                },
                "(min-width: 400px)": {
                    slides: { perView: 1, spacing: 5 },
                },
                "(min-width: 1000px)": {
                    slides: { perView: 3, spacing: 20 },
                },
            },
            slides: {
                perView: 1,
                spacing: 20
            },
            duration: 3000,
            dragStart: () => {
                autoplay(false);
            },
            dragEnd: () => {
                autoplay(true);
            }
        }, [navigation]);
        sliderService.addEventListener("mouseover", (e) => {
            autoplay(false);
        });
        sliderService.addEventListener("mouseout", (e) => {
            autoplay(true);
        });
        autoplay(true);
    };
    // page scroll
    const scrollpage = function(e) {
        // add fixid class
        if (window.pageYOffset > 0) {
            header.classList.add('fixid');
        } else {
            header.classList.remove('fixid');
        }
    };
    //binds event ----------------------------
    const bindEvents = function(e) {
        // window onbuffer
        window.onbeforeunload = function(e) {
            // allways force page to scroll top on refresh
            window.scrollTo(0, 0);
        };
        // window load
        window.addEventListener('load', (e) => {
            // page load
            loadder();
        });
        // document load
        window.addEventListener('DOMContentLoaded', (e) => {
            // button event 
            buttonclick();
            //type animation 
            typeanimation();
            // slider service 
            servicesslider();
            // portfolio 
            portofolio();
            // glightbox 
            glight();
            // year 
            yearele.innerHTML = year;
        });
        window.addEventListener("scroll", (e) => {
            // scrollspy
            scrolspy();
            // scroll window 
            scrollpage();
            // counter 
            counternumber();
        });
    };
    // init - initilizes elements and events
    const AppInit = function(e) {
        bindEvents();
    };
    return {
        AppInit: AppInit
    };
}());
//initilizing app
freemaninit.AppInit();