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

        for (var position in uploadedPictures) {
            if (uploadedPictures.hasOwnProperty(position)) {
                var current = uploadedPictures[position];

                data.append('pokemon-' + position + '-thumb', current['thumb']['file'], current['thumb']['file'].name);
                data.append('pokemon-' + position + '-hd', current['hd']['file'], current['hd']['file'].name);
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
            if (file.type.match(/image.*/) && file.name.match(/^\d+@(2x|thumb)\.(png|jpg)/)) {
                var matches = file.name.match(/^(\d+)@(2x|thumb)\.(png|jpg)/);

                if (!uploadedPictures.hasOwnProperty(matches[1])) {
                    uploadedPictures[matches[1]] = {
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

                if (matches[2] == 'thumb') {
                    uploadedPictures[matches[1]]['thumb'] = {
                        file: file,
                        displayed: false
                    };
                } else {
                    uploadedPictures[matches[1]]['hd'] = {
                        file: file,
                        displayed: false
                    };
                }

                uploadedPictures[matches[1]]['displayed'] = false;
            }
        }

        displayNewPictures();
    }

    function displayNewPictures() {
        var everythingDisplayed = true;

        for (var position in uploadedPictures) {
            if (uploadedPictures.hasOwnProperty(position) && !uploadedPictures[position]['displayed']) {
                var current = uploadedPictures[position];

                nothingUploaded.style.display = 'none';
                submitButton.style.display = 'inline';

                if (document.getElementById('uploaded-' + position) == null) {
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

                    container.id = 'uploaded-' + position;

                    previewFigcaption.innerText = 'Thumb';
                    previewCanvas.id = 'uploaded-' + position + '-img-thumb';
                    previewCanvas.width = '200';
                    previewCanvas.height = '200';
                    previewCanvasContext.drawImage(missingPicture, 0, 0, 200, 200);

                    hdFigcaption.innerText = 'HD';
                    hdCanvas.id = 'uploaded-' + position + '-img-hd';
                    hdCanvas.width = '200';
                    hdCanvas.height = '200';
                    hdCanvasContext.drawImage(missingPicture, 0, 0, 200, 200);

                    informations.classList.add('uploaded-informations');
                    informations.id = 'uploaded-' + position + '-informations';
                    send(
                        'webservice.php',
                        'GET',
                        {
                            action: 'getPokemonByPosition',
                            position: position
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
                        document.getElementById('uploaded-' + position + '-img-thumb')
                    );

                    if (current['thumb']['file'] != null) {
                        current['thumb']['displayed'] = true;
                    }
                }

                if (current.hasOwnProperty('hd') && current['hd'] != null && !current['hd']['displayed']) {
                    displayPicture(
                        current['hd']['file'],
                        document.getElementById('uploaded-' + position + '-img-hd')
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

            var container = document.getElementById('uploaded-' + data.position + '-informations');
            var containerDiv = document.createElement('div');
            var content = document.createElement('div');
            var paragraph = document.createElement('p');
            var alreadyDrawnBefore = 'no';
            var drawnDate = 'n/d';

            if (data.drawn) {
                alreadyDrawnBefore = 'yes';
            }

            if (data.drawn_date != null) {
                drawnDate = new Date(data.drawn_date);
                drawnDate = drawnDate.toLocaleDateString();
            }

            paragraph.innerHTML += '<span>Name: </span>' + data.name + '<br />';
            paragraph.innerHTML += '<span>Position: </span>' + data.position + '<br />';
            paragraph.innerHTML += '<span>Already drawn before: </span>' + alreadyDrawnBefore + '<br />';
            paragraph.innerHTML += '<span>Drawn date: </span>' + drawnDate + '<br />';

            containerDiv.appendChild(paragraph);
            content.appendChild(containerDiv);
            container.appendChild(content);
        } else {
            console.error(data.message);
        }
    }
});