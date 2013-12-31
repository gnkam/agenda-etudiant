<?php
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

namespace Crous\Grenoble\MenuBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use Sabre\VObject\Component\VCalendar;

use DateTime;
use DateTimeZone;

/**
* @Route("/ics/menu")
*/
class IcsController extends Controller
{
	/**
	* @Route("/{id}.ics")
    * @Method({"GET"})
	*/
	public function menuIdAction($id)
	{
		$api = new ApiController();
		
		$menu = $api->menuIdAction($id);
		if($menu->getStatusCode() !== 200)
		{
			return new Response('Calendar not found', 404);
		}
		
		$json = json_decode($menu->getContent(), true);
		
		$headers = array(
			'Content-Type' => 'text/calendar; charset=utf-8',
			'Content-Disposition' => 'attachment; filename="'.$id.'.ics'
		);
		
		$vCalendar = new VCalendar();
		foreach($json['data'] AS $event)
		{
			$vEvent = $vCalendar->add('VEVENT');
			
			# Timezone
			$timezone = new DateTimeZone('Europe/Paris');
			
			# Start and end
			$start = new DateTime();
			$start->setTimestamp($event['start']);
			$start->setTimezone($timezone);
			
			$end = new DateTime();
			$end->setTimestamp($event['end']);
			$end->setTimezone($timezone);
			
			$name = implode(', ', $event['meals']);
			$description = implode(', ', $event['meals']);
			$vEvent->add('UID', uniqid('menu_'));
			$vEvent->add('DTSTART', $start);
			$vEvent->add('DTEND', $end);
			$vEvent->add('SUMMARY', $name);
			$vEvent->add('DESCRIPTION', $description);
		}
		
		$calendar =  $vCalendar->serialize();
		return new Response($calendar, 200, $headers);
	}
}