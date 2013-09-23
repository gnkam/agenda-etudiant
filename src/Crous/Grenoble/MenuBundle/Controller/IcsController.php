<?php

namespace Crous\Grenoble\MenuBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use Eluceo\iCal\Component\Calendar;
use Eluceo\iCal\Component\Event;

use DateTime;

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
	
		$vCalendar = new Calendar('Gnukam');
		foreach($json['data'] AS $event) {
		    $vEvent = new Event();
			$start = new DateTime();
			$start->setTimestamp($event['start']);
			$end = new DateTime();
			$end->setTimestamp($event['end']);
			$name = implode(', ', $event['meals']);
			$description = implode(', ', $event['meals']);
			$vEvent->setDtStart($start);
			$vEvent->setDtEnd($end);
			$vEvent->setSummary($name);
			$vEvent->setDescription($description);
			$vEvent->setUseTimezone(true);
			$vCalendar->addEvent($vEvent);
		}
		
		$calendar =  $vCalendar->render();
		return new Response($calendar, 200, $headers);
	}
}