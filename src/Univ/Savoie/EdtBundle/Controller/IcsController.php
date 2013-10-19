<?php

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
	* @Route("/group/{id}.ics")
    * @Method({"GET"})
	*/
	public function groupIdAction($id)
	{
		$api = new ApiController();
		
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