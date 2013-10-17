class HomeController < ApplicationController
  
  def index

  end

  def print
    input = params[:input]
    filename = params[:filename]
    session.delete(:return)
    session.delete(:log)
    if filename.blank?
      filename = 'candy'
    end
    filetype = params[:filetype]
    filename = "#{filename}.#{filetype}"
    if params[:commit] == 'Download'
      result = input
      filetype = 'tex'
    else
      result = Latex.generate_pdf(input, filetype)
    end
    if (result[:status] == 'ok')
      if params[:commit] == 'Email'
        email = params[:email]
        message = params[:message] || "I like candy!"
        subject = params[:subject] || "CandyTex"
        subject = "[CandyTex] " + subject
        CandyMail.candymail(email, subject, message, result[:file], filename).deliver unless email.blank?
        session[:return] = 'E-mail sent'
        redirect_to :root
      else
        send_data(result[:file], :filename => filename, :type => Latex.mimetypes(filetype))
      end
    else
      session[:return] = "Compilation error! Click the log button to view output message"
      session[:log] = result[:file]
      redirect_to :root
    end
  end
end
