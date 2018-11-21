.PHONY:pdf clean

TEX = pdflatex

all: pdf clean

pdf:
	$(TEX) presentation.tex
	if [ ! -d 'out' ];    \
		then mkdir 'out'; \
	fi
	mv presentation.pdf out/presentation.pdf

run:
	if [ ! -r 'out/presentation.pdf' ];    \
		then echo '\n\nNOTHING TO DISPLAY, BUILD FIRST!'; \
		else open out/presentation.pdf ;\
	fi

clean:
	rm -fv *.aux *.bbl *.blg *.lof \
	*.out *.pdf *.snm *.vrb *.toc  \
	*.log *.lol *.lot *.nav *.bak  \
	*.loa *.thm
