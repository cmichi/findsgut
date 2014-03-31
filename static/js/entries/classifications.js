$(function() {
	var title = "Was heisst das?";
	var fair = 'Die Produkte/Leistungen&hellip;<ul>' 
	+ '<li>haben ein Siegel: das Fair-Trade-Siegel nach den Kriterien der FLO oder vergleichbare.</li>'
	+ '<li>haben kein Siegel: der Anbieter versichert jedoch nachvollziehbar, dass vergleichbare '
	+ 'Standards wie bei den oben genannten Siegeln eingehalten werden.</li></ul>'

	var bio = 'Die Produkte/Leistungen&hellip;<ul>' 
	+ '<li>haben ein Siegel: im Nahrungsmittelbereich mindestens das Bio-Siegel nach EG-ÖKO-Verordnung oder strenger (z.B. Demeter, Bioland, Naturland) im Textilbereich mindestens IVN, GOTS oder vergleichbar</li>'
	+ '<li>haben kein Siegel: der Anbieter versichert jedoch nachvollziehbar, dass vergleichbare Standards wie bei den oben genannten Siegeln eingehalten werden</li></ul>'

	var regional = 'die Hauptbestandteile der angebotenen Produkte werden in einem nahen Umkreis vom Verkaufsort erzeugt und verarbeitet.'

	var used = '&hellip;wenn die Produkte gebraucht sind.'


	$('#popfair').popover({html: true, content: fair, title: title, placement: 'bottom'});
	$('#popbio').popover({html: true, content: bio, title: title, placement: 'bottom'});
	$('#popregional').popover({html: true, content: regional, title: title, placement: 'bottom'});
	$('#popused').popover({html: true, content: used, title: title, placement: 'bottom'});
});
