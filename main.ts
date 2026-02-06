/**
 * ============================================================
 * AI Handler – Extension MakeCode (DaDa:bit + WonderCam)
 * - Mouvements simples paramétrés (vitesse)
 * - Mouvements avancés : suivi de ligne Option B (3 vitesses), demi-tour
 * - Vision : détection couleur ID (fiable) + approche
 * - Manipulation : attraper / déposer
 * - Cycle complet : 1 bloc "cycle (1 tour)"
 * ============================================================
 */

//% color=#00bcd4 icon="\uf1b9" block="AI Handler"
//% groups='["Initialisation","Réglages","Capteurs","Mouvements simples","Mouvements avancés","Vision","Manipulation","Cycle complet"]'
namespace aihandler {

    // -------------------------
    // États internes
    // -------------------------
    let c1 = false
    let c2 = false
    let c3 = false
    let c4 = false

    let porteObjet = false
    let compteurDetection = 0

    // -------------------------
    // Paramètres par défaut (projet AI Handler)
    // -------------------------
    let idCouleur = 1
    let xMin = 80
    let xMax = 240
    let yApproche = 237
    let validations = 8

    // Vitesses (Option B)
    let vToutDroit = 55
    let vCorrection = 44
    let vPetit = 33

    // Servo bras
    let servoBras = 5
    let servoPince = 6

    // -------------------------
    // Outils internes
    // -------------------------
    function arretInterne(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    // ============================================================
    // INITIALISATION
    // ============================================================

    /**
     * Initialise DaDa:bit + WonderCam (mode détection de couleur)
     * et place le bras en position de départ.
     */
    //% group="Initialisation"
    //% blockId=aihandler_init
    //% block="initialiser AI Handler | couleur ID %id | servo bras %sBras | servo pince %sPince"
    //% id.defl=1
    //% sBras.defl=5 sPince.defl=6
    export function initialiser(id: number = 1, sBras: number = 5, sPince: number = 6): void {
        dadabit.dadabit_init()
        wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
        wondercam.ChangeFunc(wondercam.Functions.ColorDetect)

        idCouleur = id
        servoBras = sBras
        servoPince = sPince

        // Position initiale du bras (comme le projet)
        dadabit.setLego270Servo(servoBras, -60, 300)
        dadabit.setLego270Servo(servoPince, 15, 300)
        basic.pause(500)

        porteObjet = false
        compteurDetection = 0
    }

    // ============================================================
    // RÉGLAGES
    // ============================================================

    /**
     * Réglages de la vision : fenêtre X, distance d’approche (Y), nombre de validations.
     */
    //% group="Réglages"
    //% blockId=aihandler_regler_vision
    //% block="régler vision | X min %xmin X max %xmax | Y approche %y | validations %n"
    //% xmin.defl=80 xmax.defl=240 y.defl=237 n.defl=8
    export function reglerVision(xmin: number = 80, xmax: number = 240, y: number = 237, n: number = 8): void {
        xMin = xmin
        xMax = xmax
        yApproche = y
        validations = n
    }

    /**
     * Réglages des vitesses (Option B).
     */
    //% group="Réglages"
    //% blockId=aihandler_regler_vitesses
    //% block="régler vitesses | tout droit %vd | correction %vc | petit ajustement %vp"
    //% vd.min=0 vd.max=100 vd.defl=55
    //% vc.min=0 vc.max=100 vc.defl=44
    //% vp.min=0 vp.max=100 vp.defl=33
    export function reglerVitesses(vd: number = 55, vc: number = 44, vp: number = 33): void {
        vToutDroit = vd
        vCorrection = vc
        vPetit = vp
    }

    // ============================================================
    // CAPTEURS
    // ============================================================

    /**
     * Mettre à jour : caméra WonderCam + capteurs de ligne.
     */
    //% group="Capteurs"
    //% blockId=aihandler_mettre_a_jour
    //% block="mettre à jour (caméra + ligne)"
    export function mettreAJour(): void {
        wondercam.UpdateResult()
        c1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        c2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        c3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        c4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    /**
     * Arrivée destination : les 4 capteurs détectent la ligne noire.
     */
    //% group="Capteurs"
    //% blockId=aihandler_arrive_destination
    //% block="arrivé à destination ?"
    export function arriveDestination(): boolean {
        return (c1 && c2 && c3 && c4)
    }

    /**
     * Le robot porte un objet ?
     */
    //% group="Capteurs"
    //% blockId=aihandler_porte_objet
    //% block="porte un objet ?"
    export function porteUnObjet(): boolean {
        return porteObjet
    }

    // ============================================================
    // MOUVEMENTS SIMPLES (paramétrés)
    // ============================================================

    /**
     * Arrêter le robot.
     */
    //% group="Mouvements simples"
    //% blockId=aihandler_arreter
    //% block="arrêter le robot"
    export function arreter(): void {
        arretInterne()
    }

    /**
     * Avancer tout droit.
     */
    //% group="Mouvements simples"
    //% blockId=aihandler_avancer
    //% block="avancer vitesse %v"
    //% v.min=0 v.max=100 v.defl=55
    export function avancer(v: number = 55): void {
        // Même sens que "tout droit" du projet
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    /**
     * Reculer tout droit.
     */
    //% group="Mouvements simples"
    //% blockId=aihandler_reculer
    //% block="reculer vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function reculer(v: number = 44): void {
        // Inverse de "avancer"
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    /**
     * Tourner à gauche (pivot simple).
     */
    //% group="Mouvements simples"
    //% blockId=aihandler_tourner_gauche
    //% block="tourner à gauche vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function tournerGauche(v: number = 44): void {
        // Comme le projet : "ajuster à gauche" = les 4 servos en Clockwise
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    /**
     * Tourner à droite (pivot simple).
     */
    //% group="Mouvements simples"
    //% blockId=aihandler_tourner_droite
    //% block="tourner à droite vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function tournerDroite(v: number = 44): void {
        // Comme le projet : "ajuster à droite" = les 4 servos en Counterclockwise
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    /**
     * Trouver la ligne noire : tourner jusqu’à détecter la ligne avec au moins un capteur.
     */
    //% group="Mouvements simples"
    //% blockId=aihandler_trouver_ligne
    //% block="trouver la ligne noire vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function trouverLigne(v: number = 44): void {
        mettreAJour()
        while (!(c1 || c2 || c3 || c4)) {
            tournerDroite(v)
            mettreAJour()
        }
        arretInterne()
    }

    // ============================================================
    // MOUVEMENTS AVANCÉS (Option B)
    // ============================================================

    /**
     * Suivre la ligne – Option B (3 vitesses).
     */
    //% group="Mouvements avancés"
    //% blockId=aihandler_suivre_ligne_param
    //% block="suivre la ligne | tout droit %vd | correction %vc | petit ajustement %vp"
    //% vd.min=0 vd.max=100 vd.defl=55
    //% vc.min=0 vc.max=100 vc.defl=44
    //% vp.min=0 vp.max=100 vp.defl=33
    export function suivreLigneParam(vd: number = 55, vc: number = 44, vp: number = 33): void {

        // Tout droit
        if (c2 && c3) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vd)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vd)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vd)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vd)

        // Ligne à gauche
        } else if (c1 && c2 && (!c3 && !c4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, vc)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vc)
            dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, vc)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vc)

        // Ligne à droite
        } else if (c3 && c4 && (!c1 && !c2)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vc)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, vc)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vc)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, vc)

        // Petit ajustement gauche/droite
        } else if (c2 && !c1 && (!c3 && !c4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vc)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vp)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vc)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vp)

        } else if (c3 && !c1 && (!c2 && !c4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vp)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vc)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vp)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vc)

        // Cas extrêmes (un bord)
        } else if (c1 && !c2 && (!c3 && !c4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, vd)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vd)
            dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, vd)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vd)

        } else if (c4 && !c1 && (!c2 && !c3)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vd)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, vd)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vd)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, vd)
        }
    }

    /**
     * Suivre la ligne avec les vitesses enregistrées (pratique).
     */
    //% group="Mouvements avancés"
    //% blockId=aihandler_suivre_ligne_auto
    //% block="suivre la ligne (vitesses réglées)"
    export function suivreLigneAuto(): void {
        suivreLigneParam(vToutDroit, vCorrection, vPetit)
    }

    /**
     * Demi-tour (paramétré) : tourner jusqu’à retrouver la ligne (logique du projet).
     */
    //% group="Mouvements avancés"
    //% blockId=aihandler_demi_tour
    //% block="faire demi-tour vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function demiTour(v: number = 44): void {
        // Petit mouvement initial (comme le projet)
        mettreAJour()
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
        basic.pause(500)

        // Tourner jusqu’à ce que (c3 ET c4) soient sur la ligne et que les autres ne gênent plus
        while (c1 || c2 || !(c3 && c4)) {
            tournerDroite(v)
            mettreAJour()
        }
        arretInterne()
    }

    // ============================================================
    // VISION
    // ============================================================

    /**
     * Détection fiable de la couleur ID (validation + fenêtre X).
     */
    //% group="Vision"
    //% blockId=aihandler_couleur_fiable
    //% block="couleur ID détectée de façon fiable ?"
    export function couleurDetecteeFiable(): boolean {
        if (
            wondercam.isDetectedColorId(idCouleur) &&
            wondercam.XOfColorId(wondercam.Options.Pos_X, idCouleur) >= xMin &&
            wondercam.XOfColorId(wondercam.Options.Pos_X, idCouleur) <= xMax
        ) {
            compteurDetection += 1
        } else {
            compteurDetection = 0
        }
        return compteurDetection > validations
    }

    /**
     * Approcher l’objet : suivre la ligne jusqu’à être proche (Y) ou disparition de l’objet.
     */
    //% group="Vision"
    //% blockId=aihandler_approcher_objet
    //% block="approcher l’objet détecté"
    export function approcherObjet(): void {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)

        while (
            wondercam.isDetectedColorId(idCouleur) &&
            wondercam.XOfColorId(wondercam.Options.Pos_Y, idCouleur) < yApproche
        ) {
            mettreAJour()
            suivreLigneAuto()
        }
    }

    // ============================================================
    // MANIPULATION
    // ============================================================

    /**
     * Attraper l’objet (mouvements bras du projet).
     */
    //% group="Manipulation"
    //% blockId=aihandler_attraper
    //% block="attraper l’objet"
    export function attraperObjet(): void {
        arretInterne()
        basic.pause(500)

        dadabit.setLego270Servo(servoBras, -5, 500)
        basic.pause(800)
        dadabit.setLego270Servo(servoPince, -25, 500)
        basic.pause(800)
        dadabit.setLego270Servo(servoBras, -60, 500)
        basic.pause(800)

        porteObjet = true
        compteurDetection = 0
    }

    /**
     * Déposer l’objet (mouvements bras du projet).
     */
    //% group="Manipulation"
    //% blockId=aihandler_deposer
    //% block="déposer l’objet"
    export function deposerObjet(): void {
        arretInterne()
        basic.pause(500)

        dadabit.setLego270Servo(servoBras, -5, 500)
        basic.pause(800)
        dadabit.setLego270Servo(servoPince, 15, 500)
        basic.pause(800)
        dadabit.setLego270Servo(servoBras, -60, 500)
        basic.pause(800)

        porteObjet = false
    }

    // ============================================================
    // CYCLE COMPLET
    // ============================================================

    /**
     * Exécute un tour complet du comportement AI Handler.
     * À utiliser dans "toujours" pour la version facile.
     */
    //% group="Cycle complet"
    //% blockId=aihandler_cycle
    //% block="cycle AI Handler (1 tour)"
    export function cycle(): void {
        // 1) Mise à jour + suivi de ligne
        mettreAJour()
        suivreLigneAuto()

        // 2) Si on ne porte rien : détecter -> approcher -> attraper
        if (!porteObjet && couleurDetecteeFiable()) {
            approcherObjet()
            attraperObjet()
        }

        // 3) Si on porte un objet : destination -> déposer -> demi-tour
        if (porteObjet && arriveDestination()) {
            deposerObjet()
            demiTour(vCorrection)
        }
    }
}
