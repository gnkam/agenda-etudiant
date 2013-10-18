<?php
/*
* Copyright (c) 2013 GNKW
*
* This file is part of GNKW Symfony.
*
* GNKW Symfony is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* GNKW Symfony is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with GNKW Symfony.  If not, see <http://www.gnu.org/licenses/>.
*/

namespace Gnkw\Symfony\HttpFoundation;

use Symfony\Component\HttpFoundation\Response;

class FormatedResponse extends Response
{
	private $customData;

	public function __construct($data, $status = 200, $format = 'json', $customData = null)
	{
		$this->customData = $customData;
		if('string' === gettype($format))
		{
			$format = trim(strtolower($format));
		}
		$content = $this->contentFromData($data, $format);
		$headers = $this->headersFromFormat($format);
		parent::__construct($content, $status, $headers);
	}
	
	private function headersFromFormat($format)
	{
		$type = gettype($format);
		if($type === 'array')
		{
			$headers = $format;
		}
		else if($type === 'string')
		{
			$headers = array();
			switch ($format) 
			{
				case 'json':
					$contentType = 'application/json';
					break;
				case 'jsonp':
					$contentType = 'application/javascript';
					break;
				default:
					$contentType = 'text/plain';
					break;
			}
			$headers['Content-Type'] = $contentType;
		}
		return $headers;
	}
	
	private function contentFromData($data, $format)
	{
		$type = gettype($data);
		if($type === 'string')
		{
			$content = $data;
		}
		else if($type === 'array')
		{
			switch ($format) 
			{
				case 'json':
				case 'jsonp':
					$content = json_encode($data);
					break;
				default:
					$content = serialize($data);
					break;
			}
			if($format === 'jsonp')
			{
				$customData = ('string' === gettype($this->customData)) ? $this->customData : 'data';
				if(!empty($_GET))
				{
					$getKeys = array_keys($_GET);
					$customData = $getKeys[0];
				}
				$customData = trim($customData);
				$content = $customData . '(' . $content . ');';
			}
		}
		else 
		{
			$content = serialize($data);
		}
		return $content;
	}
}