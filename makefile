.PHONY:report presentation open_report open_presentation checkdocs

TEX = pdflatex

all: report presentation open_report open_presentation

checkdocs:
	@if [ ! -d 'docs/out' ]; \
		then mkdir -p 'docs/out'; \
	fi

report: checkdocs
	cd docs/report; $(TEX) report.tex; \
	mv report.pdf ../out/report.pdf

presentation: checkdocs
	cd docs/presentation; $(TEX) presentation.tex; \
	mv presentation.pdf ../out/presentation.pdf

open_report:
	@if [ ! -r 'docs/out/report.pdf' ];    \
		then echo '\n\nNOTHING TO DISPLAY, BUILD FIRST!'; \
		else open docs/out/report.pdf ;\
	fi

open_presentation:
	@if [ ! -r 'docs/out/presentation.pdf' ];    \
		then echo '\n\nNOTHING TO DISPLAY, BUILD FIRST!'; \
		else open docs/out/presentation.pdf ;\
	fi
