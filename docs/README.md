# Documentation – AI Handler

## Objectif
Réaliser un robot qui :
1) suit une ligne noire,
2) détecte une couleur (ID),
3) s’approche et attrape l’objet,
4) va à destination,
5) dépose l’objet,
6) fait demi-tour et recommence.

## Conseils
- Utiliser une piste noire sur fond clair.
- Bonne lumière pour la WonderCam.
- Éviter les couleurs de fond proches de la couleur apprise.

## Utilisation conseillée (en classe)
### Niveau débutant
- Au démarrage : initialiser AI Handler
- Toujours : cycle AI Handler (1 tour)

### Niveau intermédiaire
- Réglages : vision + vitesses
- Toujours : mettre à jour + suivre la ligne (vitesses réglées)
- Conditions : détecter -> approcher -> attraper / destination -> déposer -> demi-tour

## Mouvements simples vs avancés
- **Simples** : avancer, reculer, tourner, trouver la ligne (avec vitesse)
- **Avancés** : suivre la ligne Option B (3 vitesses) + demi-tour
