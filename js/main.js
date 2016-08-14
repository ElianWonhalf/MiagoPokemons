addListener(document, 'DOMContentLoaded', function (event) {
    var lightbox = new Lightbox();
    lightbox.load();

    var lightboxContainer = document.getElementById('jslghtbx'),
        startX,
        startY,
        dist,
        threshold = 150, //required min distance traveled to be considered swipe
        allowedTime = 200, // maximum time allowed to travel that distance
        elapsedTime,
        startTime;

    function lightboxContainerSwipeHandler(isRightSwipe) {
        if (isRightSwipe) {
            lightbox.next();
        } else {
            lightbox.prev();
        }
    }

    lightboxContainer.addEventListener('touchstart', function (e) {
        var touchObj = e.changedTouches[0];

        dist = 0;
        startX = touchObj.pageX;
        startY = touchObj.pageY;
        startTime = new Date().getTime();

        e.preventDefault();
    }, false);

    lightboxContainer.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false);

    lightboxContainer.addEventListener('touchend', function (e) {
        var touchObj = e.changedTouches[0];

        dist = touchObj.pageX - startX;
        elapsedTime = new Date().getTime() - startTime;

        var rightTime = elapsedTime <= allowedTime;
        var rightDist = dist >= threshold;
        var isRightSwipe = rightTime && rightDist && Math.abs(touchObj.pageY - startY) <= 100;
        lightboxContainerSwipeHandler(isRightSwipe);

        e.preventDefault();
    }, false);
});