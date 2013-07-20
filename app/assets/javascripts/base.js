

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

function fontplus() {
    editor.setFontSize(getFontSize() + 1);
}

function fontminus() {
    editor.setFontSize(getFontSize() - 1);
}

function getFontSize() {
    return parseInt(editor.container.style.fontSize);
}

function insert_on_range(start, end) {
    editor.getSession().replace(editor.getSelectionRange(), start + editor.getCopyText() +  end);
}


// "Workaround" because editor.destroy() doesn't work
function cleareditor() {
    editor.selectAll();
    editor.getSession().replace(editor.getSelectionRange(), "");
}
//
//gotoLine(Number lineNumber, Number column, Boolean animate)