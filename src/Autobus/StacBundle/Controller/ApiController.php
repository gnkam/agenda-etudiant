<?php

namespace Autobus\StacBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Gnkw\Symfony\HttpFoundation\FormattedResponse;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Gnkam\Autobus\Stac\Formalizer;

use DateTime;

/**
* @Route("/api/autobus")
*/
class ApiController extends Controller
{
    /**
     * @Route("/stac/schedule/{id}/{direction}.{format}")
     * @Route("/stac/schedule/{id}/{direction}")
     * @Route("/stac/schedule/{id}.{format}")
     * @Route("/stac/schedule/{id}")
     */
    public function stacScheduleAction($id, $direction = 'normal', $date = null,  $format = 'json')
    {
		# Initialize date to today
		if(!$date instanceof DateTime)
		{
			$date = new DateTime('now');
		}
		
		$id = intval($id);
		
		$sens = ($direction === 'normal') ? 1 : 2;
		
		# Cache link
		$cacheLink = $this->get('kernel')->getRootDir() . '/../data/stac';
		
		# Create cache dir if not exists
		if(!is_dir($cacheLink))
		{
			if(!mkdir($cacheLink, 0777, true))
			{
				return new FormattedResponse(
					array('type' => 'error', 'message' => 'Impossible to create cache', 'code' => 500),
					500,
					$format
				);
			}
		}
		
		# 12 Hours update
		$update = 12 * 60 * 60;
		
		# Formalize Data
		$formalizer = new Formalizer($cacheLink, $update);
		$json = $formalizer->serviceSchedules($id, $sens, $date);
		if(isset($json['type']) AND $json['type'] === 'error')
		{
			return new FormattedResponse($json, $json['code'], $format);
		}
		# Show json
        return new FormattedResponse($json, 200, $format);
    }
}
