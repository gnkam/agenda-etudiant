# Menu

* Method : GET
* Service : /{id}
    * id : <integer>
* GET Params : N/A
* DATA : N/A
* Response : <json-object>
* data : <json-array>
    * start : <integer> (Date UNIX de début en secondes)
    * end : <integer> (Date UNIX de fin en secondes)
    * meals : <json-array> [<string>, …]
    * rss : <json-object>
        * title : <string>
        * link : <string>
        * pubDate : <string>
    * date : <integer> (date UNIX de dernière récupération en secondes)
    * update : <integer> (date UNIX de dernière mise à jour pour le rafraichissement)
    * status : <string> (“last” : Dernier emploi du temps à jour | “old” : La dernière récupération a échouée)
* Error :
    * 200 OK
    * 400 Bad Request
    * 500 Internal server error (peut parfois apparaître lorsque le restaurant n’existe pas)

## Exemple
    curl -X GET '{URL_API}/menu/7'