# Arbre des catégories

* Method  : GET
* Service : /edt/tree/{branch}
    * branch (facultatif) : __integer|string__ Identifiant de la branche
* GET Params : N/A
* DATA : N/A
* Response : __json-object__
    * data : __json-array__
        * id : __integer|string__ Branch id (-1 if root)
        * level : __integer__  Tree level -1 if root
        * type : __string__ (root|treecategory|treebranch|treeitem) Nature du nœud
        * name  : __string__
        * childs (facultatif) : __json-array__
    * date : __integer__ Timestamp UNIX de dernière récupération en secondes
    * update : __integer__ Timestamp UNIX de dernière mise à jour pour le rafraichissement
    * status : __string__ (“last” : Dernier emploi du temps à jour | “old” : La dernière récupération a échouée)
* Error :
    * 200 OK
    * 400 Bad Request
    * 500 Internal server error  (peut  arriver lorsqu’on essaie d’ouvrir un  non existant ou un nœud fils d’un nœud jamais ouvert)

## Exemple
    curl -X GET '{URL_API}/edt/tree'
    curl -X GET '{URL_API}/edt/tree/trainee'
