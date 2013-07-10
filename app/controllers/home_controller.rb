class HomeController < ApplicationController

  def index
    @input = params[:input]
    if @input.blank?
      @input = example()
    end
  end

  def print
    @input = params[:input]
    @filename = params[:filename]
    @filetype = params[:filetype]
    result = Latex.generate_pdf(@input, @filetype)
    send_data(result, :filename => "#{@filename}.#{@filetype}", :type => Latex.mimetypes(@filetype))
  end


    def example
    "\\documentclass[12pt,a4paper]{report}
\\usepackage[portuguese]{babel}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}

\\begin{document}

Escreva algo!

\\end{document}"
  end


end
