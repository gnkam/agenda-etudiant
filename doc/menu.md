# Menu

* Method : GET
* Service : /{id}
    * id : __integer__
* GET Params : N/A
* DATA : N/A
* Response : __json-object__
    * data : __json-array__
        * start : __integer__ (Date UNIX de début en secondes)
        * end : __integer__ (Date UNIX de fin en secondes)
        * meals : __json-array__ [__string__, …]
        * rss : __json-object__
            * title : __string__
            * link : __string__
            * pubDate : __string__
    * date : __integer__ (date UNIX de dernière récupération en secondes)
    * update : __integer__ (date UNIX de dernière mise à jour pour le rafraichissement)
    * status : __string__ (“last” : Dernier emploi du temps à jour | “old” : La dernière récupération a échouée)
* Error :
    * 200 OK
    * 400 Bad Request
    * 500 Internal server error (peut parfois apparaître lorsque le restaurant n’existe pas)

## Exemple
    curl -X GET '{URL_API}/menu/7'