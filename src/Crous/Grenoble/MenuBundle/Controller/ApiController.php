<?php

namespace Crous\Grenoble\MenuBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Gnkw\Symfony\HttpFoundation\FormattedResponse;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use Gnkam\Crous\Grenoble\Menu\Formalizer;

/**
* @Route("/api/menu")
*/
class ApiController extends Controller
{
    /**
     * @Route("/{id}.{format}")
     * @Route("/{id}")
     * @Method({"GET"})
     */
    public function menuIdAction($id, $format = 'json')
    {
		$id = intval($id);
		if(empty($id))
		{
			return new FormattedResponse(
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
				return new FormattedResponse(
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
		$formalizer = new Formalizer($cacheLink, $update);
		$json = $formalizer->serviceMenu($id);
		
		if(isset($json['error']))
		{
			return new FormattedResponse($json, 500, $format);
		}
		# Show json
        return new FormattedResponse($json, 200, $format);
    }
}
