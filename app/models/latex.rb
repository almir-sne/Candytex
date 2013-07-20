class Latex

  def self.generate_pdf(code, filetype)
    dir=File.join(Rails.root,'tmp','rails-latex',"#{Process.pid}-#{Thread.current.hash}")
    input=File.join(dir,'input.tex')
    FileUtils.mkdir_p(dir)
    File.open(input,'wb') {|io| io.write(code) }
    Process.waitpid(
      fork do
        begin
          Dir.chdir dir
          STDOUT.reopen("input.log","a")
          STDERR.reopen(STDOUT)
          compile(filetype)
        rescue
          File.open("input.log",'a') {|io|
            io.write("#{$!.message}:\n#{$!.backtrace.join("\n")}\n")
          }
        ensure
          Process.exit! 1
        end
      end)
    if File.exist?(input.sub(/\.tex$/,".#{filetype}"))
      FileUtils.mv(input.sub(/\.tex$/,'.log'),File.join(dir,'..','input.log'))
      result=File.read(input.sub(/\.tex$/,".#{filetype}"))
      FileUtils.rm_rf(dir)
    else
      raise "pdflatex failed: See #{input.sub(/\.tex$/,'.log')} for details"
    end
    result
  end

  def self.compile(filetype)
    case filetype
    when "pdf"
      exec "pdflatex", "input.tex"
    when "dvi"
      exec 'latex', "input.tex"
    when "html"
      exec 'hevea', 'input.tex'
    when "rtf"
      exec 'latex2rtf', "input.tex"
    end
  end

  def self.mimetypes(filetype)
    case filetype
    when "pdf"
      "application/pdf"
    when "dvi"
      "application/x-dvi"
    when "tex"
      "application/x-tex"
    when "gzip"
      "application/x-gzip"
    when "ps"
      "application/postscript"
    when "jpeg"
      "image/jpeg"
    when "png"
      "image/png"
    when "rtf"
      "text/richtext"
    when "html"
      "text/html"

    end
  end
end