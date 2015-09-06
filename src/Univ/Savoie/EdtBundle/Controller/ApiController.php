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
     * @var string
     */
    const PROJECT_ID_LABEL = 'gnkw_project_id';

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
        if (empty($id)) {
            return new FormattedResponse(
                array('type' => 'error', 'message' => 'Invalid id', 'code' => 500),
                400,
                $format
            );
        }

        # Formalize Data
        $formalizer = $this->edtFormalizer($format, $update);
        $json = $formalizer->serviceGroup($id);

        if (isset($json['type']) AND $json['type'] === 'error') {
            return new FormattedResponse($json, $json['code'], $format);
        }
        # Show json
        return new FormattedResponse($json, 200, $format);
    }
    
    public function edtFormalizer($format, $update)
    {
        $projectId = $this->container->getParameter(self::PROJECT_ID_LABEL);
        # Cache link
        $cacheLink = $this->get('kernel')->getRootDir() . '/../data';
        # Create cache dir if not exists
        if (!is_dir($cacheLink)) {
            if (!mkdir($cacheLink)) {
                return new FormattedResponse(
                    array('type' => 'error', 'message' => 'Impossible to create cache', 'code' => 500),
                    500,
                    $format
                );
            }
        }
        # Formalize Data
        $formalizer = new Formalizer($cacheLink, $update, $projectId);
        return $formalizer;
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

        if (isset($json['type']) AND $json['type'] === 'error') {
            return new FormattedResponse($json, $json['code'], $format);
        }
        # Show json
        return new FormattedResponse($json, 200, $format);
    }
}
