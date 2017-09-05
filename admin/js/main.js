addListener(document, 'DOMContentLoaded', function (event) {
    var dropZone = document.getElementById('dropZone');
    var pokemonForm = document.getElementById('pokemonForm');
    var fileInput = document.getElementById('fileInput');
    var dragSpan = document.getElementById('dragSpan');
    var dragDropSpan = document.getElementById('dragDropSpan');
    var clickSpan = document.getElementById('clickSpan');
    var uploadedFiles = document.getElementById('uploadedFiles');
    var nothingUploaded = document.getElementById('nothingUploaded');
    var missingPicture = document.getElementById('missingPicture');
    var submitButton = document.getElementById('submitButton');

    var dragSpanWidth = dragSpan.offsetWidth;
    var dragDropSpanWidth = dragDropSpan.offsetWidth;
    var clickSpanWidth = clickSpan.offsetWidth;

    var uploadedPictures = [];

    dragSpan.style.width = dragSpanWidth + 'px';
    dragDropSpan.style.width = dragDropSpanWidth + 'px';
    clickSpan.style.width = '0';

    dropZone.addEventListener('mouseover', function (e) {
        dragDropSpan.style.width = '0';
        clickSpan.style.width = clickSpanWidth + 'px';
    });

    dropZone.addEventListener('mouseout', function (e) {
        dragDropSpan.style.width = dragDropSpanWidth + 'px';
        clickSpan.style.width = '0';
    });

    document.body.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        dropZone.classList.add('dragover');
        dragSpan.style.width = '0';
        dragDropSpan.style.width = (dragDropSpanWidth - dragSpanWidth) + 'px';
    });

    document.body.addEventListener('dragleave', function (e) {
        dropZone.classList.remove('dragover');
        dragSpan.style.width = dragSpanWidth + 'px';
        dragDropSpan.style.width = dragDropSpanWidth + 'px';
    });

    document.body.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();

        dropZone.classList.remove('dragover');
        dragSpan.style.width = dragSpanWidth + 'px';
        dragDropSpan.style.width = dragDropSpanWidth + 'px';
        clickSpan.style.width = '0';

        handleFiles(e.dataTransfer.files); // Array of all files
    });

    dropZone.addEventListener('click', function (e) {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (e) {
        if (fileInput.files.length > 0) {
            handleFiles(fileInput.files);
        }
    });

    pokemonForm.addEventListener('submit', function (e) {
        var data = new FormData(pokemonForm);

        data.append('action', 'saveData');

        for (var key in uploadedPictures) {
            if (uploadedPictures.hasOwnProperty(key)) {
                var current = uploadedPictures[key];

                data.append('pokemon-' + key + '-thumb', current['thumb']['file'], current['thumb']['file'].name);
                data.append('pokemon-' + key + '-hd', current['hd']['file'], current['hd']['file'].name);
            }
        }

        var xhr = new XMLHttpRequest();

        xhr.open("POST", "webservice.php", true);
        xhr.onload = savedDataHandler;
        xhr.send(data);
    });

    function savedDataHandler(event) {
        var xhr = event.target;
        var data = JSON.parse(xhr.responseText);

        if (!data.error) {
            alert('Upload success!');
            history.go(0);
        } else {
            console.error(data.message);
            alert(data.message);
        }
    }

    function handleFiles(files) {
        for (var i = 0, file; file = files[i]; i++) {
            var filenameRegex = new RegExp('^\\d+(-[^@]+)?@(2x|thumb)\\.(png|jpg)');
            var typeRegex = new RegExp('image.*');

            if (typeRegex.test(file.type) && filenameRegex.test(file.name)) {
                var matches = file.name.match(/^(\d+)(-[^@]+)?@(2x|thumb)\.(png|jpg)/);
                var key = matches[1];
                var valid = true;

                if (typeof matches[2] != 'undefined') {
                    key += matches[2];
                }

                if (valid) {
                    if (!uploadedPictures.hasOwnProperty(key)) {
                        uploadedPictures[key] = {
                            thumb: {
                                file: null,
                                displayed: false
                            },
                            hd: {
                                file: null,
                                displayed: false
                            }
                        };
                    }

                    if (matches[3] == 'thumb') {
                        uploadedPictures[key]['thumb'] = {
                            file: file,
                            displayed: false
                        };
                    } else {
                        uploadedPictures[key]['hd'] = {
                            file: file,
                            displayed: false
                        };
                    }

                    uploadedPictures[key]['displayed'] = false;
                }
            }
        }

        displayNewPictures();
    }

    function displayNewPictures() {
        var everythingDisplayed = true;

        for (var key in uploadedPictures) {
            if (uploadedPictures.hasOwnProperty(key) && !uploadedPictures[key]['displayed']) {
                var current = uploadedPictures[key];

                nothingUploaded.style.display = 'none';
                submitButton.style.display = 'inline';

                if (document.getElementById('uploaded-' + key) == null) {
                    var position = key;
                    var variant = null;

                    if (position.indexOf('-') > -1) {
                        position = key.substring(0, key.indexOf('-'));
                        variant = key.substring(key.indexOf('-') + 1);
                    }

                    var container = document.createElement('div');

                    var previewFigure = document.createElement('figure');
                    var previewFigcaption = document.createElement('figcaption');
                    var previewCanvas = document.createElement('canvas');
                    var previewCanvasContext = previewCanvas.getContext('2d');

                    var hdFigure = document.createElement('figure');
                    var hdFigcaption = document.createElement('figcaption');
                    var hdCanvas = document.createElement('canvas');
                    var hdCanvasContext = hdCanvas.getContext('2d');

                    var informations = document.createElement('div');

                    container.id = 'uploaded-' + key;

                    previewFigcaption.innerText = 'Thumb';
                    previewCanvas.id = 'uploaded-' + key + '-img-thumb';
                    previewCanvas.width = '200';
                    previewCanvas.height = '200';
                    previewCanvasContext.drawImage(missingPicture, 0, 0, 200, 200);

                    hdFigcaption.innerText = 'HD';
                    hdCanvas.id = 'uploaded-' + key + '-img-hd';
                    hdCanvas.width = '200';
                    hdCanvas.height = '200';
                    hdCanvasContext.drawImage(missingPicture, 0, 0, 200, 200);

                    informations.classList.add('uploaded-informations');
                    informations.id = 'uploaded-' + key + '-informations';
                    send(
                        'webservice.php',
                        'GET',
                        {
                            action: 'getPokemonByPosition',
                            position: position,
                            variant: variant
                        },
                        ajaxCallback
                    );

                    previewFigure.appendChild(previewCanvas);
                    previewFigure.appendChild(previewFigcaption);

                    hdFigure.appendChild(hdCanvas);
                    hdFigure.appendChild(hdFigcaption);

                    container.appendChild(previewFigure);
                    container.appendChild(hdFigure);
                    container.appendChild(informations);

                    uploadedFiles.appendChild(container);
                }

                if (current.hasOwnProperty('thumb') && current['thumb'] != null && !current['thumb']['displayed']) {
                    displayPicture(
                        current['thumb']['file'],
                        document.getElementById('uploaded-' + key + '-img-thumb')
                    );

                    if (current['thumb']['file'] != null) {
                        current['thumb']['displayed'] = true;
                    }
                }

                if (current.hasOwnProperty('hd') && current['hd'] != null && !current['hd']['displayed']) {
                    displayPicture(
                        current['hd']['file'],
                        document.getElementById('uploaded-' + key + '-img-hd')
                    );

                    if (current['hd']['file'] != null) {
                        current['hd']['displayed'] = true;
                    }
                }

                current['displayed'] = current['thumb']['displayed'] && current['hd']['displayed'];
                everythingDisplayed = everythingDisplayed && current['displayed'];
            }
        }

        if (everythingDisplayed) {
            submitButton.removeAttribute('disabled');
            submitButton.innerText = 'Upload&Save all these honey';
        } else {
            submitButton.setAttribute('disabled', 'disabled');
            submitButton.innerText = 'Can\'t upload an incomplete set honey';
        }
    }

    function displayPicture(file, container) {
        var context = container.getContext('2d');

        if (file != null) {
            var blob = window.URL.createObjectURL(file);
            var img = document.createElement('img');

            img.classList.add('hiddenButStillHereSomewhere');

            img.addEventListener('load', function() {
                var newWidth = this.naturalWidth;
                var newHeight = this.naturalHeight;
                var ratio = 1;

                if (newWidth > newHeight) {
                    ratio = 200 / newWidth;
                } else {
                    ratio = 200 / newHeight;
                }

                newWidth *= ratio;
                newHeight *= ratio;

                context.clearRect(0, 0, 200, 200);
                context.drawImage(this, 0, 0, this.naturalWidth, this.naturalHeight, 100 - newWidth / 2, 100 - newHeight / 2, newWidth, newHeight);
                this.remove();
            });

            document.body.appendChild(img);
            img.src = blob;
        } else {
            context.clearRect(0, 0, 200, 200);
            context.drawImage(missingPicture, 0, 0, 200, 200);
        }
    }

    function ajaxCallback(xhr) {
        var data = JSON.parse(xhr.responseText);

        if (!data.error) {
            data = data.data;

            var key = data.position;
            var container;
            var containerDiv = document.createElement('div');
            var content = document.createElement('div');
            var paragraph = document.createElement('p');
            var variant = 'n/d';
            var alreadyDrawnBefore = 'no';
            var drawnDate = 'n/d';
            var updateDate = 'n/d';

            if (data.variant) {
                variant = data.variant;
                key += '-' + data.variant;
            }

            container = document.getElementById('uploaded-' + key + '-informations');

            if (data.drawn) {
                alreadyDrawnBefore = 'yes';
            }

            if (data.drawn_date != null) {
                drawnDate = new Date(data.drawn_date);
                drawnDate = drawnDate.toLocaleDateString();
            }

            if (data.update_date != null) {
                updateDate = new Date(data.update_date);
                updateDate = updateDate.toLocaleDateString();
            }

            paragraph.innerHTML += '<span>Name: </span>' + data.name + '<br />';
            paragraph.innerHTML += '<span>Position: </span>' + data.position + '<br />';
            paragraph.innerHTML += '<span>Variant: </span>' + variant + '<br />';
            paragraph.innerHTML += '<span>Already drawn before: </span>' + alreadyDrawnBefore + '<br />';
            paragraph.innerHTML += '<span>Drawn date: </span>' + drawnDate + '<br />';
            paragraph.innerHTML += '<span>Last update date: </span>' + updateDate + '<br />';

            containerDiv.appendChild(paragraph);
            content.appendChild(containerDiv);
            container.appendChild(content);
        } else {
            console.error(data.message);
        }
    }
});