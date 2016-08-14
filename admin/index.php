<?php
$bAdmin = true;
require_once('../header.php');
?>
<div class="upload-form">
    <input type="file" name="images" id="fileInput" multiple="multiple" datatype="image/*" />
    <form method="post" action="index.php" enctype="multipart/form-data" id="pokemonForm" onsubmit="return false;">
        <div id="dropZone">
            <p>
                <span id="dragDropSpan"><span id="dragSpan">Drag&</span>Drop files</span><span id="clickSpan">Click</span> here baby<br />
                <span class="subtext">See what I've got for you baby</span>
            </p>
        </div>
        <div class="fileList container-fluid">
            <h4>
                Here is what you uploaded so far
            </h4>
            <div id="uploadedFiles">
                <img src="../img/design/missingPicture.png" id="missingPicture" class="hiddenButStillHereSomewhere" />
                <p id="nothingUploaded">
                    ... Nuthin'!
                </p>
            </div>
        </div>
        <p class="submit-button">
            <button type="submit" id="submitButton" class="btn btn-success btn-lg">
                Upload&Save all these honey
            </button>
        </p>
    </form>
</div>
<?php require_once('../footer.php'); ?>