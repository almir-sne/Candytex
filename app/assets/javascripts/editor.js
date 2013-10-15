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