class Latex

  def self.generate_pdf(code, filename)
    dir=File.join(Rails.root,'tmp','rails-latex',"#{Process.pid}-#{Thread.current.hash}")
    input=File.join(dir,'#{filename}.tex')
    FileUtils.mkdir_p(dir)
    File.open(input,'wb') {|io| io.write(code) }
    Process.waitpid(
      fork do
        begin
          Dir.chdir dir
          STDOUT.reopen("#{filename}.log","a")
          STDERR.reopen(STDOUT)
          args=%w[-shell-escape -interaction batchmode #{filename}.tex]
          exec "pdflatex",*args
        rescue
          File.open("#{filename}.log",'a') {|io|
            io.write("#{$!.message}:\n#{$!.backtrace.join("\n")}\n")
          }
        ensure
          Process.exit! 1
        end
      end)
    if File.exist?(pdf_file=input.sub(/\.tex$/,'.pdf'))
      FileUtils.mv(input.sub(/\.tex$/,'.log'),File.join(dir,'..','input.log'))
      result=File.read(pdf_file)
      FileUtils.rm_rf(dir)
    else
      raise "pdflatex failed: See #{input.sub(/\.tex$/,'.log')} for details"
    end
    result
  end
end