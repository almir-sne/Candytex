var CLIENT_ID = '765439037753';
var SCOPES = 'https://www.googleapis.com/auth/drive';

function handleClientLoad() {
    window.setTimeout(checkAuth, 1);
}

function checkAuth() {
    gapi.auth.authorize(
    {
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': true
    },
    handleAuthResult);
}

function handleAuthResult(authResult) {
    var authButton = $('#authorization');
    authButton.hide();
    if (authResult && !authResult.error) {
        $("#spinner").show()
        loadAPI(retrieveValidFiles);
    } else {
        authButton.show();
        authButton.onclick = function() {
            gapi.auth.authorize(
            {
                'client_id': CLIENT_ID,
                'scope': SCOPES,
                'immediate': false
            },
            handleAuthResult);
        };
    }
}

function buildList(response) {
    var list = $('#list');
    var html_list = '<ul> '
    var p = 0;
    $(response).each(function(i, x) {
        html_list += '<li onclick="fileClick(\'' + x.id + '\')"';
        if (i % 2 == 0)
            html_list += 'class="corsim"> ';
        else
            html_list += 'class="cornao"> ';
        html_list +=  x.title + ' </li>';
    });
    html_list += '</ul> ';
    list.html(html_list);
    list.height($(window).height() - 100 - $("#welcome").height());
    list.show();
    $("#spinner").hide();
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
                    'maxResults' : 1000,
                    'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } else {
                buildList(result);
            }
        });

    }
    var request = gapi.client.drive.files.list({
        'q' : "mimeType != 'application/vnd.google-apps.folder' and trashed = false",
        'maxResults' : 1000
    });
    retrievePageOfFiles(request, []);
}

function fileClick(fileId) {
    $("#spinner").show()
    var request = gapi.client.drive.files.get({
        'fileId': fileId
    });
    request.execute(function(resp) {
        var url;
        if (resp.mimeType == 'text/x-tex' || resp.mimeType == 'text/plain')
            url = resp.downloadUrl;
        else if (resp.mimeType == "application/vnd.google-apps.document")
            url = resp['exportLinks']['text/plain'];
        else
            alert('Unsuported file format!');
        if (url) {
            var accessToken = gapi.auth.getToken().access_token;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            xhr.onload = function() {
                setEditorValue(xhr.responseText);
                updateFileStats(resp);
                $("#spinner").hide()
            };
            xhr.onerror = function() {
                alert('Error loading file!');
            };
            xhr.send();
        }
    });
}

function updateFileStats(file) {
    var date = file.modifiedDate.split("T");
    var timeStamp = date[0] + " - " + date[1].split(".")[0];
    $("#drive-file").html("File loaded: " + file.title + "<br/>" + "Size: " + file.fileSize + "<br/>" 
            + "Last Modified: " + timeStamp);
    $("#drive-file").show();
    $("#list").height($(window).height() - 120 - $("#welcome").height() - $("#drive-file").height());
}