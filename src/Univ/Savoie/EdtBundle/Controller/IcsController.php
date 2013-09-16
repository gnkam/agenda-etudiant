<?php

namespace Univ\Savoie\EdtBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use Eluceo\iCal\Component\Calendar;
use Eluceo\iCal\Component\Event;

use DateTime;

/**
* @Route("/ics")
*/
class IcsController extends Controller
{
	/**
	* @Route("/group/{id}")
	*/
	public function groupIdAction($id)
	{
		$api = new ApiController();
		
		$group = $api->groupIdAction($id);
		if($group->getStatusCode() !== 200)
		{
			return Response('Calendar not found', 404);
		}
		
		$json = json_decode($group->getContent(), true);
		
		$headers = array(
			'Content-Type' => 'text/calendar; charset=utf-8',
			'Content-Disposition' => 'attachment; filename="cal.ics'
		);
	
		$vCalendar = new Calendar('Gnukam');
		foreach($json['data'] AS $event) {
		    $vEvent = new Event();
			$start = new DateTime();
			$start->setTimestamp($event['start']);
			$end = new DateTime();
			$end->setTimestamp($event['end']);
			$name = (empty($event['name'])) ? $event['code'] : $event['name'];
			$avec = (empty($event['teacher'])) ? '' : ' avec ' . $event['teacher'];
			$vEvent->setDtStart($start);
			$vEvent->setDtEnd($end);
			$vEvent->setSummary($name.$avec);
			$vEvent->setUseTimezone(true);
			$vCalendar->addEvent($vEvent);
		}
		
		$calendar =  $vCalendar->render();
		return new Response($calendar, 200, $headers);
	}
}