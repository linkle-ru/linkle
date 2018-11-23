.PHONY:report presentation open_report open_presentation

TEX=pdflatex

all:report presentation open_report open_presentation

report:
	cd report; $(TEX) report.tex
	if [ ! -d 'out' ]; then mkdir 'out'; fi
	mv report/report.pdf out/report.pdf

presentation:
	cd presentation; $(TEX) presentation.tex
	if [ ! -d 'out' ];    \
		then mkdir 'out'; \
	fi
	mv presentation/presentation.pdf out/presentation.pdf

open_report:
	if [ ! -r 'out/report.pdf' ];    \
		then echo '\n\nNOTHING TO DISPLAY, BUILD FIRST!'; \
		else open out/report.pdf ;\
	fi

open_presentation:
	if [ ! -r 'out/presentation.pdf' ];    \
		then echo '\n\nNOTHING TO DISPLAY, BUILD FIRST!'; \
		else open out/presentation.pdf ;\
	fi
