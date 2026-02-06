# Documentation – AI Handler

## Blocs disponibles
### Initialisation
- initialiser AI Handler
- régler paramètres (X min/max, Y approche, validations)
- régler vitesses

### Capteurs
- mettre à jour (caméra + ligne)
- arrivé à destination ?
- porte un objet ?

### Mouvements
- suivre la ligne
- faire demi-tour

### Vision
- couleur ID détectée de façon fiable ?
- approcher l’objet détecté

### Manipulation
- attraper l’objet
- déposer l’objet

### Cycle complet
- cycle AI Handler (1 tour)

## Utilisation recommandée
Dans `toujours`, appeler seulement `cycle AI Handler (1 tour)`.
