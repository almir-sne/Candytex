function getTemplate(name) {
    if (name == 'letter')
        return "\\documentclass{letter}\n\
\\signature{Your name}\n\
\\address{Adress \\\\ City \\\\ State \\\\ Country}\n\
\\begin{document\n\
\n\
\\begin{letter}{Receiver \\\\ Adress \\\\ of \\\\ receiver}\n\
\\opening{Opening:}\n\
\n\
Body.\n\
\n\
\\closing{Closing,}\n\
\n\
\\ps{P.S.}\n\
\\encl{Enclosing}\n\
\n\
\\end{letter}\n\
\n\
\\end{document}";
    else if (name == 'curriculum')
        return "\\documentclass[11pt,a4paper,sans]{moderncv}\n\
\\moderncvstyle{casual}\n\
\\moderncvcolor{blue}\n\
\\renewcommand{\familydefault}{\sfdefault}\n\
\\nopagenumbers{}\n\
\n\
\\usepackage[utf8]{inputenc}\n\
\n\
\\usepackage[scale=0.75]{geometry}\n\
\n\
\\firstname{Name}\n\
\\familyname{Name}\n\
\\title{Your title}\n\
\\address{street and number}{postcode city}\n\
\\mobile{+1~(234)~567~890}\n\
\\phone{+2~(345)~678~901}\n\
\\fax{+3~(456)~789~012}\n\
\\email{your@email.com}\n\
\\homepage{www.page.com}\n\
\\extrainfo{Extra info}\n\
\\quote{Quote}\n\
\n\
\\begin{document}\n\
\\makecvtitle\n\
\n\
\\section{Education}\n\
\\cventry{month--year}{Degree}{Institution}{City}{ \textit{Grade} }{Description}\n\
\\cvitem{title}{ \emph{Title} }\n\
\\cvitemwithcomment{Language 1}{Skill level}{Comment}\n\
\\cvlistitem{Item 1}\n\
\\cvlistdoubleitem{Item 2}{Item 3}\n\
\n\
\\section{Experience}\n\
\\cvitemwithcomment{Skill 1}{Level}{Comment}\n\
\\cvdoubleitem{category X}{XXX, YYY, ZZZ}{category Y}{XXX, YYY, ZZZ}\n\
\n\
\\section{Work 1}\n\
\\cventry{year--year}{Position}{Place}{City}\n\
\\cvitem{title}{ \emph{Title} }\n\
\n\
\\bibliography{publications}\n\
\\end{document}";
    else if (name == 'presentation')
        return "\\documentclass[mathserif,serif]{beamer}\n\
\\usepackage[utf8]{inputenc}\n\
\n\
\\begin{document}\n\
\\begin{frame}\n\
\\frametitle{Title}\n\
Content\n\
\\end{frame}\n\
\\begin{frame}\n\
\\frametitle{Title 2}\n\
\\framesubtitle{Sub title}\n\
Content\n\
\\end{frame}\n\
\\end{document}";
   else if (name == 'article')
       return "\\documentclass[12pt,a4paper]{article}\n\
\\usepackage[portuguese]{babel}\n\
\\usepackage[T1]{fontenc}\n\
\\usepackage[utf8]{inputenc}\n\
\n\
\\begin{document}\n\
\n\
Body\n\
\n\
\\end{document}";
}

