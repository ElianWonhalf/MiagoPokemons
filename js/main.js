addListener(document, 'DOMContentLoaded', function (event) {
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
});