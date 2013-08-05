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
    var authButton = $('#authorizeButton');
    authButton.css('display', 'none');
    if (authResult && !authResult.error) {
        // Access token has been successfully retrieved, requests can be sent to the API.
        
    } else {
        // No access token could be retrieved, show the button to start the authorization flow.
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

/**
             * Start the file upload.
             *
             * @param {Object} evt Arguments from the file selector.
             */
//            function uploadFile(evt) {
//                gapi.client.load('drive', 'v2', function() {
//                    var file = evt.target.files[0];
//                    insertFile(file);
//                });
//            }

/**
             * Insert new file.
             *
             * @param {File} fileData File object to read data from.
             * @param {Function} callback Function to call when the request is complete.
             */
//            function insertFile(fileData, callback) {
//                const boundary = '-------314159265358979323846';
//                const delimiter = "\r\n--" + boundary + "\r\n";
//                const close_delim = "\r\n--" + boundary + "--";
//
//                var reader = new FileReader();
//                reader.readAsBinaryString(fileData);
//                reader.onload = function(e) {
//                    var contentType = fileData.type || 'application/octet-stream';
//                    var metadata = {
//                        'title': fileData.name,
//                        'mimeType': contentType
//                    };
//
//                    var base64Data = btoa(reader.result);
//                    var multipartRequestBody =
//                        delimiter +
//                        'Content-Type: application/json\r\n\r\n' +
//                        JSON.stringify(metadata) +
//                        delimiter +
//                        'Content-Type: ' + contentType + '\r\n' +
//                        'Content-Transfer-Encoding: base64\r\n' +
//                        '\r\n' +
//                        base64Data +
//                        close_delim;
//
//                    var request = gapi.client.request({
//                        'path': '/upload/drive/v2/files',
//                        'method': 'POST',
//                        'params': {'uploadType': 'multipart'},
//                        'headers': {
//                            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
//                        },
//                        'body': multipartRequestBody});
//                    if (!callback) {
//                        callback = function(file) {
//                            console.log(file)
//                        };
//                    }
//                    request.execute(callback);
//                }
//            }


function list () {
    gapi.client.load('drive', 'v2', retrieveAllFiles());
}

function buildList(response) {
    var html_list = "<ul> "
    for (var i = 0; i < response.length; i++) {
        html_list += "<li> " + response[i].title + " </li>";
    }
    html_list += "</ul> "
    $('#list').html(html_list);
    $('#list').height($(window).height() * (6/10));
    $('#list').css('display', 'block');
//    $('#list').jScrollPane({mouseWheelSpeed: 50});

}

function retrieveAllFiles() {
    gapi.client.load('drive', 'v2');
    callback = function(file) {

        console.log(file)
    };
    var retrievePageOfFiles = function(request, result) {
        request.execute(function(resp) {
            result = result.concat(resp.items);
            var nextPageToken = resp.nextPageToken;
            if (nextPageToken) {
                request = gapi.client.drive.files.list({
                    'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } else {
                buildList(result);
            }
        });
    }

    var initialRequest = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'GET',
        'params': {
            'maxResults': '10'
        }
    });
    var result = retrievePageOfFiles(initialRequest, []);
}

