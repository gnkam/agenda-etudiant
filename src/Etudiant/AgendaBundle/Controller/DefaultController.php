<?php

namespace Etudiant\AgendaBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="agenda_index")
     * @Route("/home")
     * @Template()
     */
    public function indexAction()
    {
		return array();
    }
    
    /**
     * @Route("/edt", name="agenda_edt")
     * @Template()
     */
    public function edtAction()
    {
        return array();
    }
}
