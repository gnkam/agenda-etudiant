<?php

namespace Univ\Savoie\EdtBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Gnkw\Symfony\HttpFoundation\FormatedResponse;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use Gnkam\Univ\Savoie\Edt\Formalizer;

/**
* @Route("/api/edt")
*/
class ApiController extends Controller
{
    /**
     * @Route("/group/{id}.{format}")
     * @Route("/group/{id}")
     * @Method({"GET"})
     */
    public function groupIdAction($id, $format = 'json')
    {
		# Use ProjectId
		$projectId = 2;
    
		$id = intval($id);
		if(empty($id))
		{
			return new FormatedResponse(
				array('error' => 'invalid id'),
				400,
				$format
			);
		}
		
		# Cache link
		$cacheLink = __DIR__ . '/../cache';
		
		# Create cache dir if not exists
		if(!is_dir($cacheLink))
		{
			if(!mkdir($cacheLink))
			{
				return new FormatedResponse(
					array('error' => 'impossible to create cache'),
					500,
					$format
				);
				return;
			}
		}
		
		# 6 Hours update
		$update = 6 * 60 * 60;
		
		# Formalize Data
		$formalizer = new Formalizer($cacheLink, $update, $projectId);
		$json = $formalizer->serviceGroup($id);
		
		if(isset($json['error']))
		{
			return new FormatedResponse($json, 500, $format);
		}
		# Show json
        return new FormatedResponse($json, 200, $format);
    }
}
