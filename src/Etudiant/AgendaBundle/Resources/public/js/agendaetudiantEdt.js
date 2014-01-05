/*
* Copyright (c) 2013 GNKW & Kamsoft.fr
*
* This file is part of GNKam Agenda Etudiant.
*
* GNKam Agenda Etudiant is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* GNKam Agenda Etudiant is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with GNKam Agenda Etudiant.  If not, see <http://www.gnu.org/licenses/>.
*/

var agendaetudiantEdt = agendaetudiantEdt || {};

$(document).ready(function(){agendaetudiantEdt.main();});
agendaetudiantEdt.server = Routing.generate('agenda_index');
agendaetudiantEdt.selectorCalendar = "#calendar";
agendaetudiantEdt.selectorMenu = "#menu";
agendaetudiantEdt.selectorGroups = "#groups";
agendaetudiantEdt.oldEvent;
agendaetudiantEdt.wait = new agendaetudiant.waiting('#waiting');
agendaetudiantEdt.myJson = new agendaetudiant.jsonp();
agendaetudiantEdt.treeNodes = {};
agendaetudiantEdt.groupsId = {};

agendaetudiantEdt.stripTrailingSlash = function(str) {
	if(str.substr(-1) == '/') {
		return str.substr(0, str.length - 1);
	}
	return str;
}

agendaetudiantEdt.initCalendar = function()
{
	$(agendaetudiantEdt.selectorCalendar).html("");
	$(agendaetudiantEdt.selectorCalendar).fullCalendar({
		firstHour: 7,
		header: {
			left: 'prev, next, today, month, agendaWeek, agendaDay',
			center: '',
			right: 'title'
		},
		defaultView: 'agendaWeek',
		timeFormat:
		{
			// for agendaWeek and agendaDay
			agenda : 'H:mm{ - H:mm}',
			'': 'H:mm'
		},
		eventClick: function(calEvent, jsEvent, view) {
			agendaetudiantEdt.resetOldEvent();
			agendaetudiantEdt.oldEvent = { event : undefined, backgroundColor : undefined, textColor : undefined};
			agendaetudiantEdt.createOldEvent(calEvent);
			calEvent.backgroundColor = "white";
			calEvent.textColor = "black";
			switch(calEvent.filter)
			{
				case 'edt':
					agendaetudiantEdt.popupEdt(calEvent.data);
					break;
				case 'menu':
					agendaetudiantEdt.popupMenu(calEvent.data);
					break;
			}
			$(agendaetudiantEdt.selectorCalendar).fullCalendar( 'rerenderEvents' );
			
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
		firstDay:0, // Lundi premier jour de la semaine
		height: 650
	});
}

agendaetudiantEdt.main = function()
{
	agendaetudiantEdt.server = agendaetudiantEdt.stripTrailingSlash(agendaetudiantEdt.server);
	agendaetudiantEdt.initCalendar();
	agendaetudiantEdt.wait.start('tree');
	$.getJSON(agendaetudiantEdt.server + "/api/edt/tree.jsonp?agendaetudiantEdt.tree=?");
	agendaetudiantEdt.receiveStorage();
	for (var key in agendaetudiantEdt.groupsId){
		if(agendaetudiantEdt.groupsId[key])
		{
			agendaetudiantEdt.showCalendar(key);
		}
	}
}

agendaetudiantEdt.receiveStorage = function()
{
	var temp = agendaetudiantEdt.getFromStorage('agendaetudiant@treeNodes');
	if(temp !== null) { agendaetudiantEdt.treeNodes = temp; };
	temp = agendaetudiantEdt.getFromStorage('agendaetudiant@groupsId');
	if(temp !== null) { agendaetudiantEdt.groupsId = temp; };
}

agendaetudiantEdt.select = function(selector){
	$(selector).nextAll().remove();
	var value = selector.options[selector.selectedIndex].value;
	if(value !== undefined){
		var type = $(selector.options[selector.selectedIndex]).attr('datatype');
		if(type == 'treeitem')
		{
			agendaetudiantEdt.showCalendar(value);
		}
		else{
			agendaetudiantEdt.wait.start('tree');
			$.getJSON(agendaetudiantEdt.server + "/api/edt/tree/" + value + ".jsonp?agendaetudiantEdt.tree=?");
		}
	}
}

agendaetudiantEdt.putInStorage = function(key, json)
{
	if(typeof(Storage)!=="undefined")
	{
		localStorage.setItem(key, JSON.stringify(json));
	}
}

agendaetudiantEdt.getFromStorage = function(key)
{
	var json = null;
	if(typeof(Storage)!=="undefined")
	{
		var jsonString = localStorage.getItem(key);
		if(null === jsonString)
		{
			return null;
		}
		json = JSON.parse(jsonString);
	}
	return json;
}

agendaetudiantEdt.tree = function(d){
	var childs = d.data.childs;
	var element = '<select class="form-control ae-v-spacing" name="'+d.data.id+'" onchange="agendaetudiantEdt.select(this);">';
	element += "<option>---</option>"
	for (var key in childs){
		var child = childs[key];
		agendaetudiantEdt.treeNodes[child.id] = child;
		element += '<option value="'+child.id+'" datatype="'+child.type+'">'+child.name+'</option>';
	}
	element += '</select>';
	agendaetudiantEdt.putInStorage('agendaetudiant@treeNodes',agendaetudiantEdt.treeNodes);
	$(agendaetudiantEdt.selectorMenu).append(element);
	agendaetudiantEdt.wait.stop('tree');
}

agendaetudiantEdt.showCalendar = function(id)
{
	//agendaetudiantEdt.wait.start('menu');
	//$.getJSON(agendaetudiantEdt.server + "/api/menu/7.jsonp?agendaetudiantEdt.menu=?");
	agendaetudiantEdt.wait.start('edt');
	agendaetudiantEdt.myJson.get(id, agendaetudiantEdt.server + "/api/edt/group/"+id+".jsonp", function(id, args){ agendaetudiantEdt.edt(id, args);});
}

agendaetudiantEdt.resetOldEvent = function()
{
	if(agendaetudiantEdt.oldEvent !== undefined)
	{
		agendaetudiantEdt.oldEvent.event.backgroundColor = agendaetudiantEdt.oldEvent.backgroundColor;
		agendaetudiantEdt.oldEvent.event.textColor = agendaetudiantEdt.oldEvent.textColor;
		$(agendaetudiantEdt.selectorCalendar).fullCalendar( 'rerenderEvents' );
	}
}

agendaetudiantEdt.createOldEvent = function(event)
{
	agendaetudiantEdt.oldEvent.event = event;
	agendaetudiantEdt.oldEvent.backgroundColor = event.backgroundColor;
	agendaetudiantEdt.oldEvent.textColor = event.textColor;
}

agendaetudiantEdt.popupEdt = function(data)
{
	var start = new Date(data.start*1000);
	var end = new Date(data.end*1000);
	var html = '<ul>';
	if(!agendaetudiantEdt.empty(data.code))
	{
		html += '<li>Code : '+data.code+'</li>';
	}
	if(!agendaetudiantEdt.empty(data.name))
	{
		html += '<li>Nom : '+data.name+'</li>';
	}
	html += '<li>De '+agendaetudiantEdt.hoursMinutesFormat(start)+' à '+agendaetudiantEdt.hoursMinutesFormat(end)+'</li>';
	if(data.type)
	{
		html += '<li>Type : '+data.type+'</li>';
	}
	if(!agendaetudiantEdt.empty(data.teacher))
	{
		html += '<li>Professeur : '+data.teacher+'</li>';
	}
	if(!agendaetudiantEdt.empty(data.place))
	{
		html += '<li>Salle : '+data.place+'</li>';
	}
	if(data.projector)
	{
		html += '<li>Cette salle dispose d\'un vidéo projecteur</li>';
	}
	html += '</ul>';
	agendaetudiantEdt.popup(data.summary, html);
}

agendaetudiantEdt.empty = function(mixed_var)
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

agendaetudiantEdt.popupMenu = function(data)
{
	var start = new Date(data.start*1000);
	var end = new Date(data.end*1000);
	var mealsLength = data.meals.length;
	var html = '<ul>';
	html += '<li>De '+agendaetudiantEdt.hoursMinutesFormat(start)+' à '+agendaetudiantEdt.hoursMinutesFormat(end)+'</li>';
	html += '<li>Menu :';
	html +='<ul>';
	for(var i =0; i<mealsLength; i++)
	{
		html += '<li>'+data.meals[i]+'</li>';
	}
	html += '</ul>';
	html += '</li>';
	html += '</ul>';
	agendaetudiantEdt.popup(data.summary, html);
}

agendaetudiantEdt.hoursMinutesFormat = function(date)
{
	var hours = date.getHours();
	var minutes = date.getMinutes();
	hours = hours < 10 ? '0'+hours : hours;
	minutes = minutes < 10 ? '0'+minutes : minutes;
	return hours+':'+minutes;
}

agendaetudiantEdt.popup = function(title, body)
{
	$("#popup .modal-title").text(title);
	$("#popup .modal-body").html(body);
	$('#popup').modal({});
}

agendaetudiantEdt.waiting = function(name)
{
	$("#waiting").append('<div class="_element ' + name +'"><span>Chargement en cours …</span></div>');
}

agendaetudiantEdt.stopWaiting = function(name)
{
	$("#waiting ." + name).remove();
}

agendaetudiantEdt.menu = function(data)
{
	$(agendaetudiantEdt.selectorCalendar).fullCalendar( 'removeEvents', "menu");
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
		$(agendaetudiantEdt.selectorCalendar).fullCalendar( 'renderEvent', event , true);
	}
	agendaetudiantEdt.wait.stop('menu');
}

agendaetudiantEdt.addGroupButton = function(id, name)
{
	if (!$('#btn_edt_'+id).length ) {
		var icsLink = Routing.generate('ics_edt_group', { id: id });
		$(agendaetudiantEdt.selectorGroups).append('<div id="btn_edt_'+id+'" class="ae-v-spacing btn-group btn-group-justified">\
			<button type="button" title="'+name+'" class="btn btn-primary dropdown-toggle" style="display:block; width: 100%;" data-toggle="dropdown">\
				<span class="ae-col-90-ellipsis">'+name+'</span> <span class="caret"></span>\
			</button>\
			<ul class="dropdown-menu" role="menu">\
				<li><a href="' + icsLink + '">Récupérer le calendrier</a></li>\
				<li class="divider"></li>\
				<li><a href="javascript:;" onclick="agendaetudiantEdt.removeButtonCalendar(\'edt\', '+id+')">Fermer</a></li>\
			</ul>\
		</div>');
		
	}
}

agendaetudiantEdt.removeButtonCalendar = function(classId, id)
{
	$('#btn_'+classId+'_'+id).remove();
	agendaetudiantEdt.removeCalendar(classId, id);
}

agendaetudiantEdt.removeCalendar = function(classId, id)
{
	agendaetudiantEdt.setGroupId(id, false);
	$(agendaetudiantEdt.selectorCalendar).fullCalendar( 'removeEvents', classId + '_' + id);
}

agendaetudiantEdt.setGroupId = function(id, value)
{
	
	if(id !== undefined)
	{
		agendaetudiantEdt.groupsId[id] = value;
		agendaetudiantEdt.putInStorage('agendaetudiant@groupsId',agendaetudiantEdt.groupsId);
	}
}

agendaetudiantEdt.edt = function(id, data)
{
	agendaetudiantEdt.removeCalendar("edt", id);
	agendaetudiantEdt.setGroupId(id, true);
	var name = id;
	if(agendaetudiantEdt.treeNodes[id] !== undefined)
	{
		name = agendaetudiantEdt.treeNodes[id].name;
	}
	agendaetudiantEdt.addGroupButton(id, name);
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
		if(!agendaetudiantEdt.empty(element.place))
		{
			summary += ' ('+element.place+')';
		}
		
		var event = {
			id : "edt_"+id,
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
		$(agendaetudiantEdt.selectorCalendar).fullCalendar( 'renderEvent', event , true);
	}
	agendaetudiantEdt.wait.stop('edt');
}