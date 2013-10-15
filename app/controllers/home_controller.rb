class HomeController < ApplicationController

  def index

  end

  def print
    input = params[:input]
    filename = params[:filename]
    if filename.blank?
      filename = 'candy'
    end
    filetype = params[:filetype]
    @filename = "#{filename}.#{filetype}"
    if params[:commit] == 'Download'
      result = input
      filetype = 'tex'
    else
      result = Latex.generate_pdf(input, filetype)
    end
    if params[:commit] == 'Email'
      email = params[:email]
      message = params[:message] || "I like candy!"
      subject = params[:subject] || "CandyTex"
      subject = "[CandyTex] " + subject
      CandyMail.candymail(email, subject, message, result, @filename).deliver unless email.blank?
      redirect_to :root
    else
      send_data(result, :filename => @filename, :type => Latex.mimetypes(filetype))
    end
  end
end
