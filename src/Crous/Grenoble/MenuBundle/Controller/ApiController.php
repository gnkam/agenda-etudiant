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

namespace Crous\Grenoble\MenuBundle\Controller;

use Crous\Grenoble\MenuBundle\CrousGrenobleMenuBundle;

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
		
		
		# Cache link
		$container = CrousGrenobleMenuBundle::getContainer();
		$cacheLink = $container->get('kernel')->getRootDir() . '/../data';
		
		# Create cache dir if not exists
		if(!is_dir($cacheLink))
		{
			if(!mkdir($cacheLink))
			{
				return new FormattedResponse(
					array('type' => 'error', 'message' => 'Impossible to create cache', 'code' => 500),
					500,
					$format
				);
			}
		}
		
		# 6 Hours update
		$update = 6 * 60 * 60;
		
		# Formalize Data
		$formalizer = new Formalizer($cacheLink, $update);
		$json = $formalizer->serviceMenu($id);
		if(isset($json['type']) AND $json['type'] === 'error')
		{
			return new FormattedResponse($json, $json['code'], $format);
		}
		# Show json
        return new FormattedResponse($json, 200, $format);
    }
}
