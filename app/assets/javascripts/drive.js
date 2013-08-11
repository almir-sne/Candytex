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
    var filePicker = $('#list');
    authButton.css('display', 'none');
    filePicker.css('display', 'none');
    if (authResult && !authResult.error) {
        filePicker.css('display', 'block');
        filePicker.html("<i class=\"icon-spinner icon-spin icon-4x rotating-icon\"></i>");
        loadAPI(retrieveValidFiles);
    } else {
        authButton.css('display', 'block');
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
    for (var i = 0; i < response.length; i++) {
        html_list += '<li onclick="fileClick(\'' + response[i].id + '\')"';
        if (i % 2 == 0)
            html_list += 'class="corsim"> ';
        else
            html_list += 'class="cornao"> ';
        html_list += response[i].title + ' </li>';
    }
    html_list += '</ul> ';
    list.html(html_list);
    list.height($(window).height() * (6/10));
    list.css('display', 'block');
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
            };
            xhr.onerror = function() {
                alert('Error loading file!');
            };
            xhr.send();
        }
    });
}