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

namespace Univ\Savoie\EdtBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use Sabre\VObject\Component\VCalendar;

use DateTime;
use DateTimeZone;

/**
* @Route("/ics/edt")
*/
class IcsController extends Controller
{
	/**
	* @Route("/group/{id}.ics", name="ics_edt_group", options={"expose"=true})
    * @Method({"GET"})
	*/
	public function groupIdAction($id)
	{
		$api = new ApiController();
		$api->setContainer($this->container);
		$group = $api->groupIdAction($id);
		if($group->getStatusCode() !== 200)
		{
			return new Response('Calendar not found', 404);
		}
		
		$json = json_decode($group->getContent(), true);
		
		$headers = array(
			'Content-Type' => 'text/calendar; charset=utf-8',
			'Content-Disposition' => 'attachment; filename="'.$id.'.ics'
		);
	
		$vCalendar = new VCalendar();
		foreach($json['data'] AS $event) {
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
			
			$vEvent->add('UID', uniqid('group_'));
			$vEvent->add('DTSTART', $start);
			$vEvent->add('DTEND', $end);
			$vEvent->add('SUMMARY', $event['summary']);
			$vEvent->add('CATEGORIES', $event['type']);
			if(!empty($event['place']))
			{
				$vEvent->add('LOCATION', $event['place']);
			}
			$description = $this->eventGroupDescription($event);
			if(!empty($description))
			{
				$vEvent->add('DESCRIPTION', $description);
			}
		}
		
		$calendar =  $vCalendar->serialize();
		return new Response($calendar, 200, $headers);
	}
	
	protected function eventGroupDescription($event)
	{
		$description = '';
		$name = (empty($event['name'])) ? $event['code'] : $event['name'];
		$teacher = (empty($event['teacher'])) ? null : $event['teacher'];
		if(!empty($event['type']))
		{
			$description .= strtoupper($event['type']);
			if(!empty($name))
			{
				$description .= ' de ';
			}
		}
		if(!empty($name))
		{
			$description .= $name;
			if(null!==$teacher)
			{
				$description .= ' avec ';
			}
		}
		if(null!==$teacher)
		{
			$description .= $teacher;
		}
		if(!empty($event['seats']))
		{
			$description .= ' ('.$event['seats'].' places)';
		}
		return $description;
	}
}