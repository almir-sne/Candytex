class CandyMail < ActionMailer::Base
  default from: "noreply@candytex.com"
  
  def candymail(email, subject, message, file, filename)
    @message = message
    attachments[filename] = file
    mail :to => email, :subject => subject
  end
end
