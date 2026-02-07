# AI Hanter – Certified (MakeCode Extension)

Extension MakeCode pour DaDa:bit :
- Suivi de ligne (4 capteurs)
- Détection cube couleur (WonderCam officielle)
- Approche + prise + dépôt + demi-tour
- Conversion JavaScript ⇄ Blocs stable

## Dépendances
- dadabit (qui inclut WonderCam)

## Utilisation (Blocs)
### Au démarrage
- AI Hanter → initialiser AI Hanter ID 1 bras 5 pince 6
- AI Hanter → regler vitesses suivi (55,44,33)
- AI Hanter → regler centrage X (80,240)
- AI Hanter → regler distance approche Y (237)
- AI Hanter → regler stabilite detection (8)
- WonderCam → Initialize WonderCam at 0x32
- WonderCam → Switch to Color detection

### Toujours
1) WonderCam → Update and get results  
2) AI Hanter → cycle AI Hanter

> Note : AI Hanter ne fait pas UpdateResult() pour rester compatible avec la WonderCam officielle.
