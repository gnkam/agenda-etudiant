# Groupe

* Method : GET
* Service : /group/{id}
    * id : __integer__
* GET Params : N/A
* DATA : N/A
* Response : __json-object__
    * data : __json-array__
        * code : __string__ Code matière
        * name : __string__ Nom de la matière
        * summary : __string__ Nom de la matière ou code si elle n’est pas trouvée et l’enseignant correspondant d’il existe
        * place : __string__ Lieu du cours
        * teacher : __string__ Nom du professeur
        * type : __string__ (“td” | “tp” | “cm” | “projet” | …) 
        * start : __integer__ Date UNIX de début en secondes
        * end : __integer__ Date UNIX de fin en secondes
        * duration : __integer__ Durée en secondes
        * week : __integer__ Numéro de la semaine
        * projector : __boolean__ Si la salle dispose d’un projecteur ou non
        * seats (facultatif) : __integer__ Nombre de places dans la salle
    * date : __integer__ Timestamp UNIX de dernière récupération en secondes
    * update : __integer__ Timestamp UNIX de dernière mise à jour pour le rafraichissement
    * status : __string__ (“last” : Dernier emploi du temps à jour | “old” : La dernière récupération a échouée)
* Error :
    * 200 OK
    * 400 Bad Request
    * 500 Internal server error (peut parfois apparaître lorsque le groupe n’existe pas)

__Note__ : Préférez utiliser summary pour l’affichage du nom de la matière (il reconstitue le nom en fonction de code/name et summary)
