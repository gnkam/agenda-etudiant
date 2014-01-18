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

var agendaetudiant = agendaetudiant || {};

agendaetudiant.waiting = function(div)
{
	var waiting = div || "#waiting";
	var selector  = $(waiting);
	this.start = function(name){
		$(waiting).append('<div class="_element ' + name +'"><span>Chargement en cours …</span></div>');
	}
	this.stop = function(name){
		$(waiting + ' .' + name).remove();
	}
}


agendaetudiant.jsonpCallbacks = {cntr: 0};
agendaetudiant.jsonp = function()
{
	this.get = function(id, url, fn, async) {
		if(typeof async == 'undefined')
		{
			this.async = true;
		}
		else
		{
			this.async = async;
		}
		this.doJSONP =  function(url, callbackFuncName) {
			var fullURL = url + "?" + callbackFuncName + '=?';
			var ajaxJson =  {
				dataType: "json",
				url: fullURL,
				async: this.async
			};
			if(async)
			{
				$.ajax(ajaxJson);
			}
			else
			{
				setTimeout(function(){
					$.ajax(ajaxJson);
				}, 100);
			}
			
		}
		// create a globally unique function name
		var name = "fn" + agendaetudiant.jsonpCallbacks.cntr++;
		// put that function in a globally accessible place for JSONP to call
		agendaetudiant.jsonpCallbacks[name] = function(arg) {
			// upon success, remove the name
			delete agendaetudiant.jsonpCallbacks[name];
			// now call the desired callback internally and pass it the id
			var args = Array.prototype.slice(arguments);
			fn.apply(this, [id, arg]);
		}

		this.doJSONP(url, "agendaetudiant.jsonpCallbacks." + name);
	}
}