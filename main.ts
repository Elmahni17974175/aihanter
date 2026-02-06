/**
 * Extension MakeCode – AI Handler (DaDa:bit + WonderCam)
 * Basée sur le scénario :
 * Suivre la ligne -> si couleur ID1 détectée -> approcher -> attraper ->
 * continuer -> destination -> déposer -> demi-tour -> recommencer.
 */

//% color=#00bcd4 icon="\uf1b9" block="AI Handler"
//% groups='["Initialisation","Capteurs","Mouvements","Vision","Manipulation","Cycle complet"]'
namespace aihandler {

    // -------------------------
    // Variables internes
    // -------------------------
    let c1 = false
    let c2 = false
    let c3 = false
    let c4 = false

    let porteObjet = false
    let compteurDetection = 0

    // Paramètres (valeurs par défaut du projet)
    let idCouleur = 1
    let xMin = 80
    let xMax = 240
    let yApproche = 237
    let nbValidations = 8

    // Vitesses
    let vToutDroit = 55
    let vCorrection = 44
    let vPetit = 33

    // Servos bras (ports du projet)
    let servoBras = 5
    let servoPince = 6

    // -------------------------
    // OUTILS INTERNES
    // -------------------------
    function stopMoteurs(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    // =========================================================
    // INITIALISATION
    // =========================================================

    /**
     * Initialise DaDa:bit + WonderCam (mode détection de couleur) et place le bras en position de départ.
     */
    //% group="Initialisation"
    //% blockId=aihandler_init block="initialiser AI Handler (couleur ID %id) | servo bras %sBras | servo pince %sPince"
    //% id.defl=1
    //% sBras.defl=5 sPince.defl=6
    export function initialiser(id: number = 1, sBras: number = 5, sPince: number = 6): void {
        dadabit.dadabit_init()
        wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
        wondercam.ChangeFunc(wondercam.Functions.ColorDetect)

        idCouleur = id
        servoBras = sBras
        servoPince = sPince

        // Position initiale bras (comme ton code)
        dadabit.setLego270Servo(servoBras, -60, 300)
        dadabit.setLego270Servo(servoPince, 15, 300)
        basic.pause(500)

        porteObjet = false
        compteurDetection = 0
    }

    /**
     * Permet de régler les paramètres de détection/approche.
     */
    //% group="Initialisation"
    //% blockId=aihandler_reglages block="régler paramètres | X min %xmin X max %xmax | Y approche %y | validations %n"
    //% xmin.defl=80 xmax.defl=240 y.defl=237 n.defl=8
    export function reglerParametres(xmin: number = 80, xmax: number = 240, y: number = 237, n: number = 8): void {
        xMin = xmin
        xMax = xmax
        yApproche = y
        nbValidations = n
    }

    /**
     * Permet de régler les vitesses de déplacement.
     */
    //% group="Initialisation"
    //% blockId=aihandler_vitesses block="régler vitesses | tout droit %vt | correction %vc | petit ajustement %vp"
    //% vt.defl=55 vc.defl=44 vp.defl=33
    export function reglerVitesses(vt: number = 55, vc: number = 44, vp: number = 33): void {
        vToutDroit = vt
        vCorrection = vc
        vPetit = vp
    }

    // =========================================================
    // CAPTEURS (lecture)
    // =========================================================

    /**
     * Met à jour : caméra WonderCam + capteurs suiveurs de ligne.
     */
    //% group="Capteurs"
    //% blockId=aihandler_mettre_a_jour block="mettre à jour (caméra + ligne)"
    export function mettreAJour(): void {
        wondercam.UpdateResult()
        c1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        c2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        c3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        c4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    /**
     * Vrai si les 4 capteurs voient la ligne noire (arrivée destination).
     */
    //% group="Capteurs"
    //% blockId=aihandler_arrive_destination block="arrivé à destination ?"
    export function arriveDestination(): boolean {
        return (c1 && c2 && c3 && c4)
    }

    /**
     * Indique si le robot porte actuellement un objet.
     */
    //% group="Capteurs"
    //% blockId=aihandler_porte_objet block="porte un objet ?"
    export function porteUnObjet(): boolean {
        return porteObjet
    }

    // =========================================================
    // MOUVEMENTS
    // =========================================================

    /**
     * Suivi de ligne (logique du projet).
     */
    //% group="Mouvements"
    //% blockId=aihandler_suivre_ligne block="suivre la ligne"
    export function suivreLigne(): void {
        // Tout droit
        if (c2 && c3) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vToutDroit)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vToutDroit)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vToutDroit)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vToutDroit)

        // Ligne à gauche
        } else if (c1 && c2) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vCorrection)

        // Ligne à droite
        } else if (c3 && c4) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, vCorrection)

        // Ajustements (un seul capteur)
        } else if (c2 && !c1 && !c3 && !c4) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vPetit)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vPetit)

        } else if (c3 && !c1 && !c2 && !c4) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vCorrection)
        }
    }

    /**
     * Demi-tour : tourner jusqu’à retrouver la ligne (logique du projet).
     */
    //% group="Mouvements"
    //% blockId=aihandler_demi_tour block="faire demi-tour"
    export function demiTour(): void {
        // Petit mouvement initial
        mettreAJour()
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, vCorrection)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, vCorrection)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, vCorrection)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, vCorrection)
        basic.pause(500)

        // Tourner jusqu’à retrouver la ligne
        while (c1 || c2 || !(c3 && c4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, vCorrection)
            mettreAJour()
        }
    }

    // =========================================================
    // VISION (WonderCam)
    // =========================================================

    /**
     * Détection stable de la couleur (ID) : valide si vue plusieurs fois et centrée (X entre min et max).
     */
    //% group="Vision"
    //% blockId=aihandler_id1_stable block="couleur ID détectée de façon fiable ?"
    export function couleurDetecteeFiable(): boolean {
        if (wondercam.isDetectedColorId(idCouleur) &&
            wondercam.XOfColorId(wondercam.Options.Pos_X, idCouleur) >= xMin &&
            wondercam.XOfColorId(wondercam.Options.Pos_X, idCouleur) <= xMax) {
            compteurDetection += 1
        } else {
            compteurDetection = 0
        }
        return compteurDetection > nbValidations
    }

    /**
     * Approche : suit la ligne jusqu’à être proche de l’objet (Y) ou disparition de l’objet.
     */
    //% group="Vision"
    //% blockId=aihandler_approcher block="approcher l’objet détecté"
    export function approcherObjet(): void {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)

        while (wondercam.isDetectedColorId(idCouleur) &&
               wondercam.XOfColorId(wondercam.Options.Pos_Y, idCouleur) < yApproche) {
            mettreAJour()
            suivreLigne()
        }
    }

    // =========================================================
    // MANIPULATION (bras)
    // =========================================================

    /**
     * Attraper l’objet (mouvements bras identiques au projet).
     */
    //% group="Manipulation"
    //% blockId=aihandler_attraper block="attraper l’objet"
    export function attraperObjet(): void {
        stopMoteurs()
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
     * Déposer l’objet (mouvements bras identiques au projet).
     */
    //% group="Manipulation"
    //% blockId=aihandler_deposer block="déposer l’objet"
    export function deposerObjet(): void {
        stopMoteurs()
        basic.pause(500)

        dadabit.setLego270Servo(servoBras, -5, 500)
        basic.pause(800)
        dadabit.setLego270Servo(servoPince, 15, 500)
        basic.pause(800)
        dadabit.setLego270Servo(servoBras, -60, 500)
        basic.pause(800)

        porteObjet = false
    }

    // =========================================================
    // CYCLE COMPLET (bloc “prêt à l’emploi”)
    // =========================================================

    /**
     * Exécute UN cycle : mise à jour -> suivi ligne -> gestion objet ID -> dépôt -> demi-tour.
     * À appeler dans "toujours".
     */
    //% group="Cycle complet"
    //% blockId=aihandler_cycle block="cycle AI Handler (1 tour)"
    export function cycle(): void {
        // 1) Toujours : mettre à jour + suivre ligne
        mettreAJour()
        suivreLigne()

        // 2) Si on ne porte rien : détecter -> approcher -> attraper
        if (!porteObjet && couleurDetecteeFiable()) {
            approcherObjet()
            attraperObjet()
        }

        // 3) Si on porte un objet : à destination -> déposer -> demi-tour
        if (porteObjet && arriveDestination()) {
            deposerObjet()
            demiTour()
        }
    }
}
