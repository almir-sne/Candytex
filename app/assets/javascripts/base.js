var editor;

function setup() {
    setupEditor();
    setupEventListeners();
    loadCookies();
    handleClientLoad();
    cookiesWorker();
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
        setEditorValue(getTemplate('konami'));
    });
    $('.dropdown-menu').find('input').click(function(e) {
        e.stopPropagation();
    });
    $("#filter").attr({
        onkeyup: "filterList()"
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

function italic() {
    insert_on_range("\\textit{", "}");
}

function bold() {
    insert_on_range("\\textbf{", "}");
}

function superscript() {
    insert_on_range("\\^{", "}");
}

function subscript() {
    insert_on_range("\\_{", "}");
}

function underline() {
    insert_on_range("\\underline{", "}");
}

function alignleft() {
    insert_on_range("\\begin{flushleft}\n", "\n\\end{flushleft}");
}

function alignright() {
    insert_on_range("\\begin{flushright}\n", "\n\\end{flushright}");
}

function aligncenter() {
    insert_on_range("\\begin{center}\n", "\n\\end{center}");
}

function latexfont() {
    var font = $('#fonts').val();
    if (font != 'Font size')
        insert_on_range("{\\" + font + " ", "}");
}

function latexSection() {
    var section = $('#section').val();
    if (section != 'Sectioning')
        insert_on_range("\\" + section + "{", "}");
}

function createTable() {
    insert_on_range("\\begin{table}\n\n \\begin{tabular}\n\n \\end{tabular}\n\n \\caption{", "}\n\\end{table}");
}

function createBullet() {
    insert_on_range("\\begin{itemize}\n \\item ", "\n \\item \n\\end{itemize}");
}

function createNumbered() {
    insert_on_range("\\begin{enumerate}\n \\item ", "\n \\item \n\\end{enumerate}");
}

function fontplus() {
    editor.setFontSize(getFontSize() + 2);
    editor.focus();
}

function fontminus() {
    editor.setFontSize(getFontSize() - 2);
    editor.focus();
}

function getFontSize() {
    return parseInt(editor.container.style.fontSize);
}

function insert_on_range(start, end) {
    editor.getSession().replace(editor.getSelectionRange(), start + editor.getCopyText() + end);
    editor.focus();
}

// "Workaround" because editor.destroy() doesn't work
function cleareditor() {
    setEditorValue('');
}

function setEditorValue(val) {
    editor.setValue(val, 0);
    editor.focus();
    editor.clearSelection();
}

function switchtheme(theme) {
    editor.setTheme("ace/theme/" + theme.options[theme.selectedIndex].value);
    editor.focus();
}

function openfromdisk() {
    document.getElementById("file-handler").click();
}

function switchTemplate() {
    setEditorValue(getTemplate($("#templates").val()));
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