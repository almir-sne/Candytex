class HomeController < ApplicationController

  def index

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
      @filetype = 'tex'
    else
      result = Latex.generate_pdf(@input, @filetype)
    end
    
    send_data(result, :filename => "#{@filename}.#{@filetype}", :type => Latex.mimetypes(@filetype))
  end
end
