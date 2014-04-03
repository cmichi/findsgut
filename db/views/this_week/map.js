// week number starts at mon 00 am and ends at sun 00 pm
Date.prototype.getWeekNumber = function(){
	var d = new Date(+this);
	d.setHours(0,0,0);
	d.setDate(d.getDate()+4-(d.getDay()||7));
	return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

function(doc) {
	var now = new Date();
	var docdate = new Date(doc.created_at);
	var this_week = false;

	if (now.getFullYear() === docdate.getFullYear() && 
		now.getWeekNumber() === docdate.getWeekNumber())
		this_week = true;

	if (doc.type === "entry" && this_week === true)
		emit(doc._id, doc);
}
