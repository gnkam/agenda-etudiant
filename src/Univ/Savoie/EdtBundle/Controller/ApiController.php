<?php

namespace Univ\Savoie\EdtBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Gnkw\Symfony\HttpFoundation\FormattedResponse;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use Gnkam\Univ\Savoie\Edt\Formalizer;

/**
* @Route("/api/edt")
*/
class ApiController extends Controller
{
	/**
	* @var integer
	* @todo Find a way to get projectId
	*/
	private $projectId = 2;

    /**
     * @Route("/group/{id}.{format}")
     * @Route("/group/{id}")
     * @Method({"GET"})
     */
    public function groupIdAction($id, $format = 'json')
    {
		# 6 Hours update
		$update = 6 * 60 * 60;
		$id = intval($id);
		if(empty($id))
		{
			return new FormattedResponse(
				array('error' => 'invalid id'),
				400,
				$format
			);
		}
		
		# Formalize Data
		$formalizer = $this->edtFormalizer($format, $update);
		$json = $formalizer->serviceGroup($id);
		
		if(isset($json['error']))
		{
			return new FormattedResponse($json, 500, $format);
		}
		# Show json
        return new FormattedResponse($json, 200, $format);
    }
    
     /**
     * @Route("/tree")
     * @Route("/tree.{format}")
     * @Route("/tree/{node}.{format}")
     * @Route("/tree/{node}")
     * @Method({"GET"})
     */
    public function treeNodeAction($node = -1, $format = 'json')
    {
		# 7 Days update
		$update = 7 * 24 * 60 * 60;
		
		# Formalize Data
		$formalizer = $this->edtFormalizer($format, $update);
		$json = $formalizer->serviceTree($node);
		
		if(isset($json['error']))
		{
			return new FormattedResponse($json, 500, $format);
		}
		# Show json
        return new FormattedResponse($json, 200, $format);
    }
    
    public function edtFormalizer($format, $update)
    {
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
		# Formalize Data
		$formalizer = new Formalizer($cacheLink, $update, $this->projectId);
		return $formalizer;
    }
}
