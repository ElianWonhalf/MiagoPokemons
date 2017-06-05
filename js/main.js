addListener(document, 'DOMContentLoaded', function (event) {
    var pokemonsContainer = document.getElementById('pokemons');
    var loader = document.getElementById('infinitescroll-loader');
    var loading = false;
    var lightbox = new Lightbox();
    lightbox.load();

    var lightboxContainer = document.getElementById('jslghtbx'),
        startX,
        startY,
        threshold = 150;

    function lightboxContainerSwipeHandler(isRightSwipe) {
        if (isRightSwipe) {
            lightbox.prev();
        } else {
            lightbox.next();
        }
    }

    function documentScrolledHandler() {
        if (!loading && nextPage * 50 < howManyPokemons) {
            var pokemonsContainerBottom = pokemonsContainer.offsetTop + pokemonsContainer.offsetHeight;
            var viewportBottom = window.scrollY + window.innerHeight;

            if (viewportBottom >= pokemonsContainerBottom - 400) {
                loading = true;
                loader.style.display = 'block';

                send('webservice.php', 'GET', {action: 'getPokemons', page: nextPage}, function (xhr) {
                    var data = JSON.parse(xhr.responseText);

                    if (!data.error) {
                        pokemonsContainer.innerHTML += data.html;
                        lightbox = new Lightbox();
                        lightbox.load();

                        loading = false;
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

    document.addEventListener('scroll', documentScrolledHandler);
    documentScrolledHandler();
});