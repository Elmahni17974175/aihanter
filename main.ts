/**
 * AI Handler – Extension MakeCode (DaDa:bit + WonderCam)
 * Version CERTIFIEE MakeCode (conversion JS <-> Blocs stable)
 */

//% color=#00bcd4 icon="\uf1b9" block="AI Handler"
//% groups='["Initialisation","Vision reglages","Vitesses reglages","Capteurs","Mouvements simples","Mouvements avances","Vision actions","Manipulation","Cycle complet"]'
namespace aihandler {

    // -------------------------
    // Etat interne
    // -------------------------
    let c1 = false
    let c2 = false
    let c3 = false
    let c4 = false

    let porteObjet = false
    let compteurDetection = 0

    // -------------------------
    // Parametres
    // -------------------------
    let idCouleur = 1

    let xMin = 80
    let xMax = 240
    let yApproche = 237
    let validations = 8

    // Option B (3 vitesses)
    let vToutDroit = 55
    let vCorrection = 44
    let vPetit = 33

    // Servos bras
    let servoBras = 5
    let servoPince = 6

    let estInitialise = false

    // -------------------------
    // Outils internes
    // -------------------------
    function arreterMoteursInterne(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    function assurerInit(): void {
        if (!estInitialise) {
            dadabit.dadabit_init()
            wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
            wondercam.ChangeFunc(wondercam.Functions.ColorDetect)
            estInitialise = true
        }
    }

    // =========================================================
    // INITIALISATION (dissocie)
    // =========================================================

    //% group="Initialisation"
    //% blockId=aihandler_init
    //% block="initialiser AI Handler"
    export function initialiserAIHandler(): void {
        dadabit.dadabit_init()
        wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
        wondercam.ChangeFunc(wondercam.Functions.ColorDetect)

        porteObjet = false
        compteurDetection = 0
        estInitialise = true
    }

    //% group="Initialisation"
    //% blockId=aihandler_set_color_id
    //% block="definir couleur a detecter ID %id"
    //% id.defl=1
    export function definirCouleurID(id: number = 1): void {
        idCouleur = id
    }

    //% group="Initialisation"
    //% blockId=aihandler_set_arm_servos
    //% block="definir servos du bras servo bras %sBras servo pince %sPince"
    //% sBras.defl=5 sPince.defl=6
    export function definirServosBras(sBras: number = 5, sPince: number = 6): void {
        servoBras = sBras
        servoPince = sPince
    }

    //% group="Initialisation"
    //% blockId=aihandler_arm_home
    //% block="position de depart du bras"
    export function positionDepartBras(): void {
        assurerInit()
        dadabit.setLego270Servo(servoBras, -60, 300)
        dadabit.setLego270Servo(servoPince, 15, 300)
        basic.pause(500)
    }

    // =========================================================
    // VISION REGLAGES (dissocie)
    // =========================================================

    //% group="Vision reglages"
    //% blockId=aihandler_set_vision_x
    //% block="definir zone vision X min %xmin X max %xmax"
    //% xmin.defl=80 xmax.defl=240
    export function definirZoneVisionX(xmin: number = 80, xmax: number = 240): void {
        xMin = xmin
        xMax = xmax
    }

    //% group="Vision reglages"
    //% blockId=aihandler_set_approach_y
    //% block="definir distance approche Y %y"
    //% y.defl=237
    export function definirDistanceApproche(y: number = 237): void {
        yApproche = y
    }

    //% group="Vision reglages"
    //% blockId=aihandler_set_validations
    //% block="definir stabilite detection validations %n"
    //% n.defl=8
    export function definirStabiliteDetection(n: number = 8): void {
        validations = n
    }

    // =========================================================
    // VITESSES REGLAGES (Option B)
    // =========================================================

    //% group="Vitesses reglages"
    //% blockId=aihandler_set_speeds
    //% block="regler vitesses suivi tout droit %vd correction %vc petit ajustement %vp"
    //% vd.min=0 vd.max=100 vd.defl=55
    //% vc.min=0 vc.max=100 vc.defl=44
    //% vp.min=0 vp.max=100 vp.defl=33
    export function reglerVitessesSuivi(vd: number = 55, vc: number = 44, vp: number = 33): void {
        vToutDroit = vd
        vCorrection = vc
        vPetit = vp
    }

    // =========================================================
    // CAPTEURS
    // =========================================================

    //% group="Capteurs"
    //% blockId=aihandler_update
    //% block="mettre a jour camera et ligne"
    export function mettreAJour(): void {
        assurerInit()
        wondercam.UpdateResult()
        c1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        c2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        c3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        c4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    //% group="Capteurs"
    //% blockId=aihandler_at_destination
    //% block="arrive a destination"
    export function arriveDestination(): boolean {
        return (c1 && c2 && c3 && c4)
    }

    //% group="Capteurs"
    //% blockId=aihandler_has_object
    //% block="porte un objet"
    export function porteUnObjet(): boolean {
        return porteObjet
    }

    // =========================================================
    // MOUVEMENTS SIMPLES
    // =========================================================

    //% group="Mouvements simples"
    //% blockId=aihandler_stop
    //% block="arreter le robot"
    export function arreter(): void {
        arreterMoteursInterne()
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_forward
    //% block="avancer vitesse %v"
    //% v.min=0 v.max=100 v.defl=55
    export function avancer(v: number = 55): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_backward
    //% block="reculer vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function reculer(v: number = 44): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_left
    //% block="tourner a gauche vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function tournerGauche(v: number = 44): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_right
    //% block="tourner a droite vitesse %v"
    //% v.min=0 v.max=100 v.defl=44
    export function tournerDroite(v: number = 44): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_find_line
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

    // =========================================================
    // MOUVEMENTS AVANCES (Option B)
    // =========================================================

    //% group="Mouvements avances"
    //% blockId=aihandler_follow_line_param
    //% block="suivre la ligne tout droit %vd correction %vc petit ajustement %vp"
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
        }
    }

    //% group="Mouvements avances"
    //% blockId=aihandler_follow_line_auto
    //% block="suivre la ligne vitesses reglees"
    export function suivreLigneAuto(): void {
        suivreLigneParam(vToutDroit, vCorrection, vPetit)
    }

    //% group="Mouvements avances"
    //% blockId=aihandler_u_turn
    //% block="faire demi tour vitesse %v"
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

    // =========================================================
    // VISION ACTIONS
    // =========================================================

    //% group="Vision actions"
    //% blockId=aihandler_color_reliable
    //% block="couleur ID detectee de facon fiable"
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

    //% group="Vision actions"
    //% blockId=aihandler_approach_object
    //% block="approcher objet detecte"
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

    // =========================================================
    // MANIPULATION
    // =========================================================

    //% group="Manipulation"
    //% blockId=aihandler_grab
    //% block="attraper objet"
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
    //% blockId=aihandler_drop
    //% block="deposer objet"
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

    // =========================================================
    // CYCLE COMPLET (bloc critique pour JS->Blocs)
    // =========================================================

    //% group="Cycle complet"
    //% blockId=aihandler_cycle
    //% block="cycle AI Handler"
    export function cycle(): void {
        mettreAJour()
        suivreLigneAuto()

        if (porteObjet == false && couleurDetecteeFiable() == true) {
            approcherObjet()
            attraperObjet()
        }

        if (porteObjet == true && arriveDestination() == true) {
            deposerObjet()
            demiTour(vCorrection)
        }
    }
}
