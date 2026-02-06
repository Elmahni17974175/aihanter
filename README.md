# AI Handler – Extension MakeCode (DaDa:bit + WonderCam)

Cette extension permet de réaliser le projet **AI Handler** :
- Suivi de ligne (ligne noire sur fond clair)
- Détection de couleur (ID) via WonderCam
- Approche + prise de l’objet
- Transport jusqu’à destination
- Dépôt + demi-tour + reprise

## Blocs (résumé)
### Initialisation
- initialiser AI Handler (couleur ID, servo bras, servo pince)

### Réglages
- régler vision (X min/max, Y approche, validations)
- régler vitesses (tout droit, correction, petit ajustement)

### Capteurs
- mettre à jour (caméra + ligne)
- arrivé à destination ?
- porte un objet ?

### Mouvements simples (paramétrés)
- avancer vitesse
- reculer vitesse
- tourner à gauche vitesse
- tourner à droite vitesse
- trouver la ligne noire vitesse
- arrêter le robot

### Mouvements avancés (Option B)
- suivre la ligne (tout droit / correction / petit ajustement)
- suivre la ligne (vitesses réglées)
- faire demi-tour vitesse

### Vision / Manipulation
- couleur ID détectée de façon fiable ?
- approcher l’objet détecté
- attraper l’objet
- déposer l’objet

### Cycle complet
- cycle AI Handler (1 tour)

## Exemple élève (mode facile)
**Au démarrage**
- initialiser AI Handler (couleur ID 1, servo bras 5, servo pince 6)

**Toujours**
- cycle AI Handler (1 tour)

## Exemple élève (mode pédagogique)
**Au démarrage**
- initialiser AI Handler
- régler vision
- régler vitesses

**Toujours**
- mettre à jour (caméra + ligne)
- suivre la ligne (vitesses réglées)
- si (porte un objet ? = non) et (couleur ID détectée de façon fiable ? = oui) :
  - approcher l’objet détecté
  - attraper l’objet
- si (porte un objet ? = oui) et (arrivé à destination ? = oui) :
  - déposer l’objet
  - faire demi-tour vitesse 44
