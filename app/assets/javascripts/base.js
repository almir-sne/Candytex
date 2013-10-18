var editor;

function setup() {
    setupEditor();
    setupEventListeners();
    loadCookies();
    handleMessages();
    cookiesWorker();
    handleClientLoad();
}

function setupEditor() {
    $('#input').height($(window).height() - 60 - $("#toolbar").height() - $("#lower_toolbar").height());
    $('#input').acedInitTA({
        theme: 'eclipse',
        mode: 'latex'
    });
    editor = $($('#input').data('ace-div')).aced();
    editor.setFontSize(14);
    editor.setPrintMarginColumn(-1);
    setEditorValue(getTemplate('article'));
}

function setupEventListeners() {
    var file_handler = document.getElementById("file-handler");
    file_handler.addEventListener("change", function(event) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var contents = event.target.result;
            setEditorValue(contents);
        };
        reader.readAsText(file_handler.files[0]);
    }, false);
    new Konami(function() {
        $("#mikuclock").show();
    });
    $('.dropdown-menu').find('input').click(function(e) {
        e.stopPropagation();
    });
    $("#filter").attr({
        onkeyup: "filterList()"
    });
//    Workaround for search buttons commiting form
    $(document).on("mouseover", "button.ace_searchbtn", function() {
        $(".ace_searchbtn").attr({
            type: "button"
        });
    });
}

function cookiesWorker() {
    setTimeout("cookiesWorker()", 60000);
    saveCookies();
}

function saveCookies() {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + 10);
    document.cookie = "text=" + escape(editor.getValue()) + "; expires=" + exdate.toUTCString();
    document.cookie = "filename=" + escape($("#filename").val()) + "; expires=" + exdate.toUTCString();
}

function loadCookies() {
    setEditorValue(getCookie("text"));
    $("#filename").val(getCookie("filename"));
}

// Source: http://www.w3schools.com/js/js_cookies.asp
function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

function displayList() {
    var list = $("#list");
    var filter = $("#filter");
    list.height($(window).height() - 80 - filter.height());
    list.show();
    filter.width(list.width() - 65);
    $(".form-search").show();
    $("#spinner").hide();
}

function showCompilingMessage() {
    resetMessages();
    $("#compiling").show();
    $("#modal-spinner").show();
}

function showCompileResultMessage() {
    resetMessages();
    $("#compile-result").show();
}

function resetMessages() {
    $("#messages .modal-body").children().hide();
    $("#messages").modal('show');
}

function showDownloadMessage() {
    resetMessages();
    $("#downloading").show();
    $("#modal-spinner").show();
}

function showDownloadErrorMessage() {
    resetMessages();
    $("#download-error").show();
}

function showUnsupportedErrorMessage() {
    resetMessages();
    $("#unsupported-error").show();
}

function showCompileMessage() {
    resetMessages();
    $("#compile-message").show();
}

function filterList() {
    var val = $("#filter").val();
    $("#list ul li").show();
    $("#list ul li").each(function(i, e) {
        if ($(e).text().indexOf(val) == -1)
            $(e).hide();
    });
}

function toggleListElement(element) {
    if ($(element).text().indexOf($("#filter").val()) == -1)
        $(element).hide();
    else
        $(element).show();
}

function handleMessages() {
    if ($.trim($("#compile-message").html()) != "")
        showCompileMessage();
    if ($.trim($("#log > .modal-body").html()) != "")
        $('#show-log').show();
}

