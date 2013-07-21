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
    if @filename.blank?
      @filename = 'candy'
    end
    @filetype = params[:filetype]

    if params[:commit] == 'Download'
      result = @input
    else
      result = Latex.generate_pdf(@input, @filetype)
    end
    
    send_data(result, :filename => "#{@filename}.#{@filetype}", :type => Latex.mimetypes(@filetype))
  end


  def example
    "\\documentclass[12pt,a4paper]{report}
\\usepackage[portuguese]{babel}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}

\\begin{document}

Type away!

\\end{document}"
  end


end
