module HomeHelper
  def lesc(text)
    LatexToPdf.escape_latex(text)
  end


end
