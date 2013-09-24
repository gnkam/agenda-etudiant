<?php

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
		
		$vcalendar = new VCalendar();
		foreach($json['data'] AS $event)
		{
			$vevent = $vcalendar->add('VEVENT');
			
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
			$vevent->add('UID', uniqid('menu_'));
			$vevent->add('DTSTART', $start);
			$vevent->add('DTEND', $end);
			$vevent->add('SUMMARY', $name);
			$vevent->add('DESCRIPTION', $description);
		}
		
		$calendar =  $vcalendar->serialize();
		return new Response($calendar, 200, $headers);
	}
}