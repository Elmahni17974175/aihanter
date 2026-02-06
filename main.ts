/**
 * ============================================================
 * AI Handler – Extension MakeCode (DaDa:bit + WonderCam)
 * Version BLOCS DISSOCIÉS (pédagogique)
 * ============================================================
 */

//% color=#00bcd4 icon="\uf1b9" block="AI Handler"
//% groups='["Initialisation","Réglages vision","Réglages vitesses","Capteurs","Mouvements simples","Mouvements avancés","Vision","Manipulation","Cycle complet"]'
namespace aihandler {

    // =======================
    // ÉTAT INTERNE
    // =======================
    let c1 = false
    let c2 = false
    let c3 = false
    let c4 = false

    let porteObjet = false
    let compteurDetection = 0

    // =======================
    // PARAMÈTRES (défauts)
    // =======================
    let idCouleur = 1

    let xMin = 80
    let xMax = 240
    let yApproche = 237
    let validations = 8

    // Option B : 3 vitesses
    let vToutDroit = 55
    let vCorrection = 44
    let vPetit = 33

    // Servos bras
    let servoBras = 5
    let servoPince = 6

    let estInitialise = false

    // =======================
    // OUTILS INTERNES
    // =======================
    function arreterMoteursInterne(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    function assurerInitialisation(): void {
        if (!estInitialise) {
            dadabit.dadabit_init()
            wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
            wondercam.ChangeFunc(wondercam.Functions.ColorDetect)
            estInitialise = true
        }
    }

    // ============================================================
    // INITIALISATION (DISSOCIÉE)
    // ============================================================

    /**
     * Initialise le robot (DaDa:bit + WonderCam en mode détection de couleur).
     */
    //% group="Initialisation"
    //% blockId=aihandler_init_simple
    //% block="initialiser AI Handler"
    export function initialiserAIHandler(): void {
        dadabit.dadabit_init()
        wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
        wondercam.ChangeFunc(wondercam.Functions.ColorDetect)

        porteObjet = false
        compteurDetection = 0
        estInitialise = true
    }

    /**
     * Définir la couleur à détecter (ID).
     */
    //% group="Initialisation"
    //% blockId=aihandler_definir_couleur_id
    //% block="définir couleur à détecter ID %id"
    //% id.defl=1
    export function definirCouleurID(id: number = 1): void {
        idCouleur = id
    }

    /**
     * Définir les ports des servos du bras.
     */
    //% group="Initialisation"
    //% blockId=aihandler_definir_servos_bras
    //% block="définir servos du bras | servo bras %sBras | servo pince %sPince"
    //% sBras.defl=5 sPince.defl=6
    export function definirServosBras(sBras: number = 5, sPince: number = 6): void {
        servoBras = sBras
        servoPince = sPince
    }

    /**
     * Mettre le bras en position de départ (comme le projet).
     */
    //% group="Initialisation"
    //% blockId=aihandler_position_depart_bras
    //% block="position de départ du bras"
    export function positionDepartBras(): void {
        assurerInitialisation()
        dadabit.setLego270Servo(servoBras, -60, 300)
        dadabit.setLego270Servo(servoPince, 15, 300)
        basic.pause(500)
    }

    // ============================================================
    // RÉGLAGES VISION (DISSOCIÉS)
    // ============================================================

    /**
     * Définir la zone horizontale de vision (X min / X max).
     */
    //% group="Réglages vision"
    //% blockId=aihandler_definir_zone_x
    //% block="définir zone de vision horizontale | X min %xmin | X max %xmax"
    //% xmin.defl=80 xmax.defl=240
    export function definirZoneVisionX(xmin: number = 80, xmax: number = 240): void {
        xMin = xmin
        xMax = xmax
    }

    /**
     * Définir la distance d’approche (Y).
     */
    //% group="Réglages vision"
    //% blockId=aihandler_definir_y_approche
    //% block="définir distance d’approche | Y approche %y"
    //% y.defl=237
    export function definirDistanceApproche(y: number = 237): void {
        yApproche = y
    }

    /**
     * Définir la stabilité de détection (validations).
     */
    //% group="Réglages vision"
    //% blockId=aihandler_definir_validations
    //% block="définir stabilité de détection | validations %n"
    //% n.defl=8
    export function definirStabiliteDetection(n: number = 8): void {
        validations = n
    }

    // ============================================================
    // RÉGLAGES VITESSES (Option B)
    // ============================================================

    /**
     * Régler les vitesses du suivi de ligne (Option B).
     */
    //% group="Réglages vitesses"
    //% blockId=aihandler_regler_vitesses_suivi
    //% block="régler vitesses de suivi | tout droit %vd | correction %vc | petit ajustement %vp"
    //% vd.min=0 vd.max=100 vd.defl=55
    //% vc.min=0 vc.max=100 vc.defl=44
    //% vp.min=0 vp.max=100 vp.defl=33
    export function reglerVitessesSuivi(vd: number = 55, vc: number = 44, vp: number = 33): void {
        vToutDroit = vd
        vCorrection = vc
        vPetit = vp
    }

    // ============================================================
    // CAPTEURS
    // ============================================================

    /**
     * Mettre à jour : caméra + capteurs de ligne.
     */
    //% group="Capteurs"
    //% blockId=aihandler_mettre_a_jour
    //% block="mettre à jour (caméra + ligne)"
    export function mettreAJour(): void {
        assurerInitialisation()
        wondercam.UpdateResult()
        c1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        c2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        c3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        c4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    //% group="Capteurs"
    //% blockId=aihandler_arrive_destination
    //% block="arrivé à destination ?"
    export function arriveDestination(): boolean {
        return (c1 && c2 && c3 && c4)
    }

    //% group="Capteurs"
    //% blockId=aihandler_porte_objet
    //% block="porte un objet ?"
    export function porteUnObjet(): boolean {
        return porteObjet
    }

    // ============================================================
    // MOUVEMENTS SIMPLES (paramétrés)
    // ============================================================

    //% group="Mouvements simples"
    //% blockId=aihandler_arreter
    //% block="arrêter le robot"
    export function arreter(): void {
        arreterMoteursInterne()
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_avancer
    //% block="avancer vitesse %v"
    //% v.min=0 v.max=100 v.defl=55
    export function avancer(v: number = 55): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_reculer
    //% block="reculer vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function reculer(v: number = 44): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_tourner_gauche
    //% block="tourner à gauche vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function tournerGauche(v: number = 44): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_tourner_droite
    //% block="tourner à droite vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function tournerDroite(v: number = 44): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

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
        arreterMoteursInterne()
    }

    // ============================================================
    // MOUVEMENTS AVANCÉS (Option B)
    // ============================================================

    //% group="Mouvements avancés"
    //% blockId=aihandler_suivre_ligne_param
    //% block="suivre la ligne | tout droit %vd | correction %vc | petit ajustement %vp"
    //% vd.min=0 vd.max=100 vd.defl=55
    //% vc.min=0 vc.max=100 vc.defl=44
    //% vp.min=0 vp.max=100 vp.defl=33
    export function suivreLigneParam(vd: number = 55, vc: number = 44, vp: number = 33): void {
        if (c2 && c3) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vd)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vd)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vd)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vd)

        } else if (c1 && c2 && (!c3 && !c4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, vc)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vc)
            dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, vc)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vc)

        } else if (c3 && c4 && (!c1 && !c2)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vc)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, vc)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vc)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, vc)

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

    //% group="Mouvements avancés"
    //% blockId=aihandler_suivre_ligne_auto
    //% block="suivre la ligne (vitesses réglées)"
    export function suivreLigneAuto(): void {
        suivreLigneParam(vToutDroit, vCorrection, vPetit)
    }

    //% group="Mouvements avancés"
    //% blockId=aihandler_demi_tour
    //% block="faire demi-tour vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function demiTour(v: number = 44): void {
        mettreAJour()
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
        basic.pause(500)

        while (c1 || c2 || !(c3 && c4)) {
            tournerDroite(v)
            mettreAJour()
        }
        arreterMoteursInterne()
    }

    // ============================================================
    // VISION
    // ============================================================

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

    //% group="Manipulation"
    //% blockId=aihandler_attraper
    //% block="attraper l’objet"
    export function attraperObjet(): void {
        arreterMoteursInterne()
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

    //% group="Manipulation"
    //% blockId=aihandler_deposer
    //% block="déposer l’objet"
    export function deposerObjet(): void {
        arreterMoteursInterne()
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

    //% group="Cycle complet"
    //% blockId=aihandler_cycle
    //% block="cycle AI Handler (1 tour)"
    export function cycle(): void {
        mettreAJour()
        suivreLigneAuto()

        if (!porteObjet && couleurDetecteeFiable()) {
            approcherObjet()
            attraperObjet()
        }

        if (porteObjet && arriveDestination()) {
            deposerObjet()
            demiTour(vCorrection)
        }
    }
}
