addListener(document, 'DOMContentLoaded', function () {
    var langEN = document.getElementById('lang-en');
    var langFR = document.getElementById('lang-fr');
    var langSwitch = document.getElementById('lang-switch');
    var pokemonsContainer = document.getElementById('pokemons');
    var loader = document.getElementById('infinitescroll-loader');
    var scrollLoading = false;
    var variantsLoading = false;
    var variantsLoadTime = null;
    var variantsTimeout = null;
    var lastVariantsPositionLoaded = null;
    var lightbox = new Lightbox();
    lightbox.load({
        onload: imageLoaded,
        onopen: imageLoading,
        onclose: imageLoading
    });

    var lightboxTitle = document.createElement('div'),
        shadow = document.createElement('div'),
        lightboxSubGallery = document.createElement('div'),
        lightboxSubGalleryXHR = null,
        lightboxContainer = lightbox.box,
        startX,
        startY,
        threshold = 150;

    lightboxTitle.id = 'jslghtbx-title';
    shadow.id = 'shadow';
    lightboxSubGallery.id = 'jslghtbx-subgallery';

    document.body.appendChild(lightboxTitle);
    document.body.appendChild(shadow);
    document.body.appendChild(lightboxSubGallery);

    if (getCookie('lang') == 'fr' || (getCookie('lang') == null && (navigator.language || navigator.userLanguage) == 'fr')) {
        langEN.checked = false;
        langFR.checked = true;

        langChanged();
    }

    function changeLang() {
        if (langEN.checked) {
            langEN.checked = false;
            langFR.checked = true;
        } else {
            langEN.checked = true;
            langFR.checked = false;
        }

        langChanged();
    }

    function langChanged() {
        var containers = document.getElementsByClassName('pokemon');
        var lang = 'en';

        if (langFR.checked) {
            lang = 'fr';
        }

        setCookie('lang', lang, 365);

        for (var i = 0; i < containers.length; i++) {
            var image = containers[i].getElementsByTagName('img')[0];
            var name = containers[i].getAttribute('data-name-' + lang);

            containers[i].title = name;
            image.alt = name;
        }
    }

    function lightboxContainerSwipeHandler(isRightSwipe) {
        if (isRightSwipe) {
            lightbox.prev();
        } else {
            lightbox.next();
        }
    }

    function documentScrolledHandler() {
        if (!scrollLoading && nextPage * 50 < howManyPokemons) {
            var pokemonsContainerBottom = pokemonsContainer.offsetTop + pokemonsContainer.offsetHeight;
            var viewportBottom = window.scrollY + window.innerHeight;

            if (viewportBottom >= pokemonsContainerBottom - 400) {
                scrollLoading = true;
                loader.style.display = 'block';

                send('webservice.php', 'GET', {action: 'getPokemons', page: nextPage}, function (xhr) {
                    var data = JSON.parse(xhr.responseText);

                    if (!data.error) {
                        pokemonsContainer.innerHTML += data.html;
                        lightbox = new Lightbox();
                        lightbox.load({
                            onload: imageLoaded
                        });

                        document.body.appendChild(lightboxTitle);
                        document.body.appendChild(shadow);
                        document.body.appendChild(lightboxSubGallery);

                        scrollLoading = false;
                        loader.style.display = 'none';

                        nextPage++;
                    } else {
                        console.error(data);
                    }
                });
            } else {
                loader.style.display = 'none';
            }
        }
    }

    function imageLoading() {
        lightboxSubGallery.innerHTML = '<img src="img/design/loading-white.svg" alt="Loading..." class="loading-animation" />';
        lightboxTitle.innerHTML = '';
    }

    function imageLoaded() {
        var lightboxImg = lightbox.box.getElementsByTagName('img')[0];
        var currentSrc = lightboxImg.getAttribute('src');
        var currentThumbElement = document.querySelector('[data-jslghtbx="' + currentSrc + '"]');

        if (currentThumbElement != null) {
            var position = currentThumbElement.getAttribute('data-pokemon-position');

            lightboxTitle.innerHTML = '<h2>' + currentThumbElement.parentElement.getAttribute('title') + '</h2>';

            if (lastVariantsPositionLoaded != position) {
                lastVariantsPositionLoaded = position;

                if (lightboxSubGalleryXHR != null) {
                    lightboxSubGalleryXHR.abort();
                }

                if (!variantsLoading) {
                    lightboxSubGallery.innerHTML = '<img src="img/design/loading-white.svg" alt="Loading..." class="loading-animation" />';
                    variantsLoading = true;
                }

                if (variantsTimeout != null) {
                    clearTimeout(variantsTimeout);
                }

                variantsLoadTime = new Date().getTime();

                lightboxSubGalleryXHR = send('webservice.php', 'GET', {
                    action: 'getVariants',
                    position: position
                }, function (xhr) {
                    var data = JSON.parse(xhr.responseText);

                    if (!data.error) {
                        var now = new Date().getTime();
                        var animationTime = 1000;
                        var animationElapsed = now - variantsLoadTime;

                        if (animationElapsed >= animationTime) {
                            handleVariants(data, currentThumbElement, currentSrc, position, lightboxImg);
                        } else {
                            variantsTimeout = setTimeout(function () {
                                handleVariants(data, currentThumbElement, currentSrc, position, lightboxImg);
                            }, animationTime - animationElapsed);
                        }
                    } else {
                        console.error(data);
                    }
                });
            }
        }
    }

    function handleVariants(data, currentThumbElement, currentSrc, position, lightboxImg) {
        var variants = data.variants;
        var sources = [[currentThumbElement.src, currentSrc, 'none']];
        var images = [];
        var i;

        variantsLoading = false;

        for (i = 0; i < variants.length; i++) {
            var basePath = 'img/pokemons/drawn/' + position + '-' + variants[i] + '@';
            var temporaryImage = new Image();

            sources.push([basePath + 'thumb.png', basePath + '2x.png', variants[i]]);
            temporaryImage.src = basePath + '2x.png';
        }

        lightboxSubGallery.innerHTML = '';

        for (i = 0; i < sources.length; i++) {
            var image = new Image();

            image.src = sources[i][0];
            image.setAttribute('data-hd', sources[i][1]);
            image.setAttribute('data-variant', sources[i][2]);

            if (i == 0) {
                image.classList.add('active');
            }

            lightboxSubGallery.appendChild(image);
            images.push(image);
        }

        for (i = 0; i < images.length; i++) {
            images[i].addEventListener('click', function (e) {
                var j;
                var variant = e.currentTarget.getAttribute('data-variant').split('-');
                var backgroundImage = '';
                var hd = e.currentTarget.getAttribute('data-hd');

                for (j = 0; j < images.length; j++) {
                    if (images[j] == e.currentTarget) {
                        images[j].classList.add('active');
                    } else {
                        images[j].classList.remove('active');
                    }
                }

                lightboxImg.style.opacity = 0;

                setTimeout(function () {
                    lightboxImg.setAttribute('src', hd);

                    for (j = 0; j < variant.length; j++) {
                        var filename = variant[j].toLowerCase();

                        if (filename != 'none') {
                            if (backgroundImage.length > 0) {
                                backgroundImage += ', ';
                            }

                            if (getPokemonVariants().indexOf(filename) < 0) {
                                filename = 'extra';
                            }

                            backgroundImage += 'url("img/variants/' + filename + '.svg")';
                        }
                    }

                    lightboxImg.style.backgroundImage = backgroundImage;
                    lightboxImg.style.opacity = 1;
                }, 200);
            });
        }
    }

    lightboxContainer.addEventListener('touchstart', function (e) {
        var touchObj = e.changedTouches[0];

        startX = touchObj.pageX;
        startY = touchObj.pageY;
    }, false);

    lightboxContainer.addEventListener('touchend', function (e) {
        var touchObj = e.changedTouches[0];
        var rightDist = Math.abs(touchObj.pageX - startX) + Math.abs(touchObj.pageY - startY) >= threshold;

        if (rightDist) {
            var isRightSwipe = touchObj.pageX > startX;
            lightboxContainerSwipeHandler(isRightSwipe);
        }
    }, false);

    lightboxSubGallery.addEventListener('click', function (e) {
        if (e.target == e.currentTarget) {
            lightbox.close();
        }
    });

    lightboxTitle.addEventListener('click', function (e) {
        if (e.target == e.currentTarget) {
            lightbox.close();
        }
    });

    shadow.addEventListener('click', function (e) {
        if (e.target == e.currentTarget) {
            lightbox.close();
        }
    });

    document.addEventListener('scroll', documentScrolledHandler);
    langEN.addEventListener('change', langChanged);
    langFR.addEventListener('change', langChanged);
    langSwitch.addEventListener('click', changeLang);
    documentScrolledHandler();
});