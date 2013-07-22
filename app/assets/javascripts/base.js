var editor;

function setup() {
    /* get textarea and use it to create editor */
    $('#input').height($(window).height() * (7/10));
    $('#input').acedInitTA({
        theme: 'eclipse',
        mode: 'latex'
    });
    editor = $($('#input').data('ace-div')).aced();

    /* initial config */
    editor.setFontSize(12);
    editor.setPrintMarginColumn(-1);
    setEditorValue(getTemplate(''));

    /* file reader handler */
    file_handler = document.getElementById("file-handler");
    file_handler.addEventListener("change", function(event) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var contents = event.target.result;
            setEditorValue(contents);
        };
        reader.readAsText(file_handler.files[0]);
    }, false);
    new Konami(function() { setEditorValue(getTemplate('konami'))});
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

function latexfont(seletion) {
    if (seletion.selectedIndex != 0)
        insert_on_range("{\\" + seletion.options[seletion.selectedIndex].value + " ", "}");
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
    editor.getSession().replace(editor.getSelectionRange(), start + editor.getCopyText() +  end);
    editor.focus();
}


function cleareditor() {
    setEditorValue('');
}

// "Workaround" because editor.destroy() doesn't work
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
// p/ navegador de seções
// gotoLine(Number lineNumber, Number column, Boolean animate)
//

// toggleCommentLines()
// Given the currently selected range, this function either comments all the lines, or uncomments all of them.