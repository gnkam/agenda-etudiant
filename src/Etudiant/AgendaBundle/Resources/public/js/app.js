$(document).ready(main);
var selectorCalendar = "#calendar";
var selectorMenu = "#menu";
var oldEvent;

function stripTrailingSlash(str) {
	if(str.substr(-1) == '/') {
		return str.substr(0, str.length - 1);
	}
	return str;
}

function main()
{
	server = stripTrailingSlash(server);
	waiting('tree');
	$.getJSON(server + "/api/edt/tree.jsonp?tree=?");
	var groupid = readCookie("groupid");
	if(groupid !== null)
	{
		showCalendar(groupid);
	}
}
function select(selector){
	$(selector).nextAll().remove();
	var value = selector.options[selector.selectedIndex].value;
	if(value !== undefined){
		var type = $(selector.options[selector.selectedIndex]).attr('datatype');
		if(type == 'treeitem')
		{
			showCalendar(value);
		}
		else{
			waiting('tree');
			$.getJSON(server + "/api/edt/tree/" + value + ".jsonp?tree=?");
		}
	}
}

function tree(d){
	var childs = d.data.childs;
	var element = '<select name="'+d.data.id+'" onchange="select(this);">';
	element += "<option>---</option>"
	for (var key in childs){
		var child = childs[key];
		element += '<option value="'+childs[key].id+'" datatype="'+child.type+'">'+childs[key].name+'</option>';
	}
	element += '</select>';
	$(selectorMenu).append(element);
	stopWaiting('tree');
}

function showCalendar(id)
{
	createCookie('groupid', id, 7);
	$(selectorCalendar).html("");
	var firstHour = new Date().getUTCHours() - 5;
	$(selectorCalendar).fullCalendar({
		firstHour: 7,
		header: {
			left: 'prev, next',
			center: 'title',
			right: 'today, month, agendaWeek, agendaDay'
		},
		defaultView: 'agendaWeek',
		timeFormat:
		{
			// for agendaWeek and agendaDay
			agenda : 'H:mm{ - H:mm}',
			'': 'H:mm'
		},
		eventClick: function(calEvent, jsEvent, view) {
			resetOldEvent();
			oldEvent = { event : undefined, backgroundColor : undefined, textColor : undefined};
			createOldEvent(calEvent);
			calEvent.backgroundColor = "white";
			calEvent.textColor = "black";
			switch(calEvent.filter)
			{
				case 'edt':
					popupEdt(calEvent.data);
					break;
				case 'menu':
					popupMenu(calEvent.data);
					break;
			}
			$(selectorCalendar).fullCalendar( 'rerenderEvents' );
			
		},
		buttonText : {
			today: 'Aujourd\'hui',
			month: 'Mois',
			week: 'Semaine',
			day: 'Jour'
		},
		allDayText : "Jour entier",
		monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
		monthNamesShort: ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'],
		dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
		dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
		titleFormat: {
			month: 'MMMM yyyy', // ex : Janvier 2010
			week: "d[ MMMM][ yyyy]{ - d MMMM yyyy}", // ex : 10 — 16 Janvier 2010, semaine à cheval : 28 Décembre 2009 - 3 Janvier 2010
			// todo : ajouter le numéro de la semaine
			day: 'dddd d MMMM yyyy' // ex : Jeudi 14 Janvier 2010
		},
		columnFormat: {
			month: 'ddd', // Ven.
			week: 'ddd d', // Ven. 15
			day: '' // affichage déja complet au niveau du 'titleFormat'
		},
		axisFormat: 'H:mm', // la demande de ferdinand.amoi : 15:00 (pour 15, simplement supprimer le ':mm'
		timeFormat: {
			'': 'H:mm', // événements vue mensuelle.
			agenda: 'H:mm{ - H:mm}' // événements vue agenda
		},
		firstDay:0 // Lundi premier jour de la semaine
	});
// 	waiting('menu');
// 	$.getJSON(server + "/api/menu/7.jsonp?menu=?");
	waiting('edt');
	$.getJSON(server + "/api/edt/group/"+id+".jsonp?edt=?");
}

function resetOldEvent()
{
	if(oldEvent !== undefined)
	{
		oldEvent.event.backgroundColor = oldEvent.backgroundColor;
		oldEvent.event.textColor = oldEvent.textColor;
		$(selectorCalendar).fullCalendar( 'rerenderEvents' );
	}
}

function createOldEvent(event)
{
	oldEvent.event = event;
	oldEvent.backgroundColor = event.backgroundColor;
	oldEvent.textColor = event.textColor;
}

function popupEdt(data)
{
	var start = new Date(data.start*1000);
	var end = new Date(data.end*1000);
	var html = '<ul>';
	if(!empty(data.code))
	{
		html += '<li>Code : '+data.code+'</li>';
	}
	if(!empty(data.name))
	{
		html += '<li>Nom : '+data.name+'</li>';
	}
	html += '<li>De '+hoursMinutesFormat(start)+' à '+hoursMinutesFormat(end)+'</li>';
	if(data.type)
	{
		html += '<li>Type : '+data.type+'</li>';
	}
	if(!empty(data.teacher))
	{
		html += '<li>Professeur : '+data.teacher+'</li>';
	}
	if(!empty(data.place))
	{
		html += '<li>Salle : '+data.place+'</li>';
	}
	if(data.projector)
	{
		html += '<li>Cette salle dispose d\'un vidéo projecteur</li>';
	}
	html += '</ul>';
	popup(html);
}

function empty (mixed_var)
{
	var undef, key, i, len;
	var emptyValues = [undef, null, false, 0, "", "0"];
	
	for (i = 0, len = emptyValues.length; i < len; i++) {
		if (mixed_var === emptyValues[i]) {
			return true;
		}
	}
	
	if (typeof mixed_var === "object") {
		for (key in mixed_var) {
			// TODO: should we check for own properties only?
			//if (mixed_var.hasOwnProperty(key)) {
			return false;
			//}
		}
		return true;
	}
	
	return false;
}

function popupMenu(data)
{
	var start = new Date(data.start*1000);
	var end = new Date(data.end*1000);
	var mealsLength = data.meals.length;
	var html = '<ul>';
	html += '<li>De '+hoursMinutesFormat(start)+' à '+hoursMinutesFormat(end)+'</li>';
	html += '<li>Menu :';
	html +='<ul>';
	for(var i =0; i<mealsLength; i++)
	{
		html += '<li>'+data.meals[i]+'</li>';
	}
	html += '</ul>';
	html += '</li>';
	html += '</ul>';
	popup(html);
}

function hoursMinutesFormat(date)
{
	var hours = date.getHours();
	var minutes = date.getMinutes();
	hours = hours < 10 ? '0'+hours : hours;
	minutes = minutes < 10 ? '0'+minutes : minutes;
	return hours+':'+minutes;
}

function popup(html)
{
	$("#popup").show();
	$("#popup").html('<div class="close"><a href="javascript:;" onclick="closePopup()">Fermer</a></div><div class="content">'+html+'</div>');
}

function closePopup()
{
	$("#popup").hide();
	resetOldEvent();
}

function waiting(name)
{
	$("#waiting").append('<div class="_element ' + name +'"><span>Chargement en cours …</span></div>');
}

function stopWaiting(name)
{
	$("#waiting ." + name).remove();
}

function menu(data)
{
	$(selectorCalendar).fullCalendar( 'removeEvents', "menu");
	var length = data.data.length;
	var element = null;
	for(var i = 0; i< length; i++)
	{
		element = data.data[i];
		var mealsLength = element.meals.length;
		var name = element.meals[0];
		for(var j = 1 ; j < mealsLength; j++)
		{
			name += ', ' + element.meals[j];
		}
		var event = {
			id : "menu",
			filter: "menu",
			title : name,
			start : element.start,
			end : element.end,
			allDay : false,
			textColor : "#fff",
			backgroundColor : "#80f",
			color : "#000",
			data : element
		};
		$(selectorCalendar).fullCalendar( 'renderEvent', event , true);
	}
	stopWaiting('menu');
}



function edt(data)
{
	$(selectorCalendar).fullCalendar( 'removeEvents', "edt");
	var length = data.data.length;
	var element = null;
	for(var i = 0; i< length; i++)
	{
		element = data.data[i];
		
		var bgColor;
		var fgColor = "#000";
		
		switch(element.type)
		{
			case 'cm' :
				bgColor = "#f36";
				break;
			case 'tp' :
				bgColor = "#dd0";
				break;
			case 'td' :
				bgColor = "#ad0";
				break;
			case 'projet' :
				bgColor = "#e80";
				break;
			default:
				bgColor = "#9cd";
		}
		
		var summary = element.summary;
		if(!empty(element.place))
		{
			summary += ' ('+element.place+')';
		}
		
		var event = {
			id : "edt",
			filter : "edt",
			title : summary,
			start : element.start,
			end : element.end,
			allDay : false,
			textColor : fgColor,
			backgroundColor : bgColor,
			color : "#000",
			data : element
		};
		$(selectorCalendar).fullCalendar( 'renderEvent', event , true);
	}
	stopWaiting('edt');
}

/**
 * Cookies
 */
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
