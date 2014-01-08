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

namespace Etudiant\AgendaBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Response;
use dflydev\markdown\MarkdownParser;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="agenda_index", options={"expose"=true})
     * @Route("/home")
     * @Template()
     */
    public function indexAction()
    {
		return array();
    }
    
    /**
     * @Template()
     * @param string $active active entry in menu (optional)
     */
    public function menuAction($active = null, $button = '')
    {
		$menus = array(
			'agenda_index' => 'Accueil',
			'agenda_edt' => 'Emploi du temps',
			'agenda_support' => 'Support',
			'agenda_about' => 'À propos',
			'agenda_api' => 'Api'
		);
		return array('active' => $active, 'menus' => $menus, 'button' => $button);
    }
    
    /**
     * @Route("/edt", name="agenda_edt")
     * @Template()
     */
    public function edtAction()
    {
        return array();
    }
    
    /**
     * @Route("/support", name="agenda_support")
     * @Template()
     */
    public function supportAction()
    {
        return array();
    }
    
    /**
     * @Route("/about", name="agenda_about")
     * @Template()
     */
    public function aboutAction()
    {
        return array();
    }
    
    /**
     * @Route("/api", name="agenda_api")
     * @Template()
     */
    public function apiAction()
    {
        return array();
    }
    
    /**
    * @Route("/doc/{page}.{format}", requirements={"page" = ".+"})
    * @Route("/doc/{page}", name="agenda_doc", requirements={"page" = ".+"}, defaults={"format" = "md"})
    * @Template()
    */
    public function docAction($page, $format)
    {
		$doc = $this->get('kernel')->getRootDir() . '/../doc';
		$path = $doc . '/' . $page . '.md';
		if(!is_file($path))
		{
			throw $this->createNotFoundException('Cette page n\'existe pas');
		}
		$text = file_get_contents($path);
		$markdownParser = new MarkdownParser();
		$html = $markdownParser->transformMarkdown($text);
		return array('html' => $html);
		
    }
}
