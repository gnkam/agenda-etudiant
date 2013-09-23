<?php

namespace Crous\Grenoble\MenuBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use Gnkam\Crous\Grenoble\Menu\Formalizer;

/**
* @Route("/api/menu")
*/
class ApiController extends Controller
{
    /**
     * @Route("/{id}")
     * @Method({"GET"})
     */
    public function menuIdAction($id)
    {
		# Use json headers
		$headers = array(
			'Content-Type' => 'application/json'
		);
		
		$id = intval($id);
		if(empty($id))
		{
			return new Response(
				json_encode(array('error' => 'invalid id')),
				400,
				$headers
			);
		}
		
		# Cache link
		$cacheLink = __DIR__ . '/../cache';
		
		# Create cache dir if not exists
		if(!is_dir($cacheLink))
		{
			if(!mkdir($cacheLink))
			{
				return new Response(
					json_encode(array('error' => 'impossible to create cache')),
					500,
					$headers
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
			return new Response(json_encode($json), 500, $headers);
		}
		# Show json
        return new Response(json_encode($json), 200, $headers);
    }
}
