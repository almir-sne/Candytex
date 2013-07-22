function getTemplate(name) {
    if (name == 'konami')
        return "\\documentclass[12pt,a4paper]{report}\n\
\\usepackage[portuguese]{babel}\n\
\\usepackage[T1]{fontenc}\n\
\\usepackage[utf8]{inputenc}\n\
\n\
\\begin{document}\n\
\n\n\
{\\Large \\textbf{Rick Astley - Never Gonna Give You Up}}\n\n\
We're no strangers to love\n\n\
You know the rules and so do I\n\n\
A full commitment's what I'm thinking of\n\n\
You wouldn't get this from any other guy\n\n\
I just wanna tell you how I'm feeling\n\n\
Gotta make you understand\n\n\
\n\
CHORUS\n\n\
\n\
Never gonna give you up,\n\n\
Never gonna let you down\n\n\
Never gonna run around and desert you\n\n\
Never gonna make you cry,\n\n\
Never gonna say goodbye\n\n\
Never gonna tell a lie and hurt you\n\n\
\n\
We've know each other for so long\n\n\
Your heart's been aching but you're too shy to say it\n\n\
Inside we both know what's been going on\n\n\
We know the game and we're gonna play it\n\n\
And if you ask me how I'm feeling\n\n\
Don't tell me you're too blind to see (CHORUS)\n\n\
\n\
CHORUS (x2)\n\n\
\n\
(Ooh give you up)\n\n\
(Ooh give you up)\n\n\
(Ooh) never gonna give, never gonna give\n\n\
(give you up)\n\n\
(Ooh) never gonna give, never gonna give\n\n\
(give you up)\n\n\
\n\
We've known each other for so long\n\n\
Your heart's been aching but you're too shy to say it\n\n\
Inside we both know what's been going on\n\n\
We know the game and we're gonna play it\n\n\
\n\
\\end{document}";
    /* default */
        return "\\documentclass[12pt,a4paper]{report}\n\
\\usepackage[portuguese]{babel}\n\
\\usepackage[T1]{fontenc}\n\
\\usepackage[utf8]{inputenc}\n\
\n\
\\begin{document}\n\
\n\
\nType away!\
\n\
\n\\end{document}";
}

