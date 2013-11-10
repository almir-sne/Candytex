var CLIENT_ID = '765439037753';
var SCOPES = 'https://www.googleapis.com/auth/drive';

function handleClientLoad() {
    window.setTimeout(checkAuth, 1);
}

function checkAuth() {
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': true
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
    var authButton = $('#authorization');
    authButton.hide();
    if (authResult && !authResult.error) {
        $("#spinner").show();
        loadAPI(retrieveValidFiles);
    } else {
        authButton.show();
        authButton.on('click', function() {
            gapi.auth.authorize({
                'client_id': CLIENT_ID,
                'scope': SCOPES,
                'immediate': false
            }, handleAuthResult);
        });
    }
}

function buildList(response) {
    var ul = $('<ul>');
    var li;
    var p = 0;
    if (response == null)
        showDownloadErrorMessage();
    $(response).each(function(i, x) {
        if (x.mimeType == "text/x-tex" || x.mimeType == "application/vnd.google-apps.document" ||
                x.mimeType == 'text/plain') {
            li = $("<li>").attr({
                onclick: "fileClick('" + x.id + "')"
            }).text(x.title).appendTo(ul);
            if (p % 2 == 0)
                li.addClass("corsim");
            else
                li.addClass("cornao");
            p++;
        }
    });
    ul.appendTo($('#list'));
    displayList();
}

function loadAPI(request) {
    gapi.client.load('drive', 'v2', request);
}

function retrieveValidFiles() {
    var retrievePageOfFiles = function(request, result) {
        request.execute(function(resp) {
            result = result.concat(resp.items);
            var nextPageToken = resp.nextPageToken;
            if (nextPageToken) {
                request = gapi.client.drive.files.list({
                    'maxResults': 1000,
                    'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } else {
                buildList(result);
            }
        });
    };
    var request = gapi.client.drive.files.list({
        'q': "mimeType != 'application/vnd.google-apps.folder' and trashed = false",
        'maxResults': 1000
    });
    retrievePageOfFiles(request, []);
}

function fileClick(fileId) {
    showDownloadMessage();
    var request = gapi.client.drive.files.get({
        'fileId': fileId
    });
    request.execute(function(resp) {
        var url;
        if (resp.error != null)
            showDownloadErrorMessage();
        else if (resp.mimeType == 'text/x-tex' || resp.mimeType == 'text/plain')
            url = resp.downloadUrl;
        else if (resp.mimeType == "application/vnd.google-apps.document")
            url = resp['exportLinks']['text/plain'];
        else
            showUnsupportedErrorMessage();
        if (url) {
            var accessToken = gapi.auth.getToken().access_token;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            xhr.onload = function() {
                setEditorValue(xhr.responseText);
                updateFileStats(resp);
                $("#messages").modal('hide');
            };
            xhr.onerror = function() {
                showDownloadErrorMessage();
            };
            xhr.send();
        }
    });
}

function updateFileStats(file) {
    var date = file.modifiedDate.split("T");
    var timeStamp = date[0] + " - " + date[1].split(".")[0];
    $("#drive-file").html("File loaded: " + file.title + "<br/>" + "Size: " + file.fileSize + "<br/>"
            + "Last Modified: " + timeStamp + "<br/>");
    var b = $("<button>").attr({
        onclick: "fileClick(\"" + file.id + "\")"
    }).addClass("btn btn-primary").appendTo($("#drive-file"));
    $("<i>").addClass("icon-cloud-download").appendTo(b);
    $("#drive-update").attr({
        onclick: "updateOnDrive(\"" + file.id + "\")"
    });
    $("#filename").val(trimFileName(file.title));
    $("#drive-file").show();
}

function updateOnDrive(id) {
    showUploadMessage();
    var filename = $("#filename").val() + ".tex";
    if (filename == ".tex") {
        filename = "candy.tex";
    }
    var boundary = '-------314159265358979323846';
    var delimiter = "\r\n--" + boundary + "\r\n";
    var close_delim = "\r\n--" + boundary + "--";
    var metadata = {
        'title': filename,
        'mimeType': 'text/plain'
    };
    var base64Data = btoa(editor.getValue());
    var multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) + delimiter +
            'Content-Type: text/x-tex\r\nContent-Transfer-Encoding: base64\r\n\r\n' +
            base64Data + close_delim;
    var request;
    if (id == null)
        request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});
    else {
        request = gapi.client.request({
            'path': '/upload/drive/v2/files/' + id,
            'method': 'PUT',
            'params': {'uploadType': 'multipart', 'alt': 'json'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});
    }
    request.execute(showUploadResultMessage);
}

function trimFileName(fileName) {
    var shebang = fileName.split(".");
    if (shebang.length > 1)
        shebang.pop();
    return shebang.join();
}

function showUploadMessage() {
    resetMessages();
    $("#uploading").show();
    $("#modal-spinner").show();
}

function showUploadResultMessage(resp) {
    if (resp.error != null)
        $("#upload-result").html("Error uploading file!");
    else
        $("#upload-result").html("Upload to Google Drive successful");
    resetMessages();
    $("#upload-result").show();
}