//% color=#00bcd4 icon="\uf1b9" block="AI Handler"
//% groups='["Initialisation","Capteurs","Mouvements simples","Mouvements avances","Vision reglages","Vision actions"]'
namespace aihandler {

    // --------- etat ligne ---------
    let s1 = false
    let s2 = false
    let s3 = false
    let s4 = false

    // --------- vitesses Option B ---------
    let vToutDroit = 55
    let vCorrection = 44
    let vPetit = 33

    // --------- camera (WonderCam) ---------
    let camInit = false
    let idCouleur = 1
    let xMin = 80
    let xMax = 240
    let yApproche = 237
    let validations = 8
    let compteurDetection = 0

    //% group="Initialisation"
    //% blockId=aihandler_init
    //% block="initialiser DaDa:bit"
    export function initialiserDadabit(): void {
        dadabit.dadabit_init()
    }

    //% group="Initialisation"
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

    //% group="Capteurs"
    //% blockId=aihandler_update_line
    //% block="mettre a jour ligne"
    export function mettreAJourLigne(): void {
        s1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        s2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        s3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        s4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    //% group="Capteurs"
    //% blockId=aihandler_destination
    //% block="arrive a destination"
    export function arriveDestination(): boolean {
        return (s1 && s2 && s3 && s4)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_stop
    //% block="arreter"
    export function arreter(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_avancer
    //% block="avancer vitesse %v"
    //% v.min=0 v.max=100 v.defl=80
    export function avancer(v: number = 80): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_reculer
    //% block="reculer vitesse %v"
    //% v.min=0 v.max=100 v.defl=55
    export function reculer(v: number = 55): void {
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

    //% group="Mouvements avances"
    //% blockId=aihandler_suivre_ligne
    //% block="suivre la ligne"
    export function suivreLigne(): void {
        if (s2 && s3) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vToutDroit)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vToutDroit)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vToutDroit)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vToutDroit)
        } else if (s1 && s2 && (!s3 && !s4)) {
            tournerGauche(vCorrection)
        } else if (s3 && s4 && (!s1 && !s2)) {
            tournerDroite(vCorrection)
        } else if (s2 && (!s1 && !s3 && !s4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vPetit)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vPetit)
        } else if (s3 && (!s1 && !s2 && !s4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vCorrection)
        }
    }

    // =========================================================
    // WONDERCAM - Initialisation + Reglages
    // =========================================================

    //% group="Initialisation"
    //% blockId=aihandler_cam_init
    //% block="initialiser WonderCam"
    export function initialiserWonderCam(): void {
        wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
        wondercam.ChangeFunc(wondercam.Functions.ColorDetect)
        camInit = true
        compteurDetection = 0
    }

    //% group="Vision reglages"
    //% blockId=aihandler_cam_set_id
    //% block="definir ID couleur %id"
    //% id.defl=1
    export function definirCouleurID(id: number = 1): void {
        idCouleur = id
        compteurDetection = 0
    }

    //% group="Vision reglages"
    //% blockId=aihandler_cam_set_x
    //% block="definir zone X min %xmin X max %xmax"
    //% xmin.defl=80 xmax.defl=240
    export function definirZoneVisionX(xmin: number = 80, xmax: number = 240): void {
        xMin = xmin
        xMax = xmax
    }

    //% group="Vision reglages"
    //% blockId=aihandler_cam_set_y
    //% block="definir Y approche %y"
    //% y.defl=237
    export function definirDistanceApproche(y: number = 237): void {
        yApproche = y
    }

    //% group="Vision reglages"
    //% blockId=aihandler_cam_set_valid
    //% block="definir validations %n"
    //% n.defl=8
    export function definirStabiliteDetection(n: number = 8): void {
        validations = n
        compteurDetection = 0
    }

    // =========================================================
    // WONDERCAM - Actions simples
    // =========================================================

    //% group="Capteurs"
    //% blockId=aihandler_cam_update
    //% block="mettre a jour camera"
    export function mettreAJourCamera(): void {
        if (camInit) {
            wondercam.UpdateResult()
        }
    }

    //% group="Vision actions"
    //% blockId=aihandler_color_seen
    //% block="couleur detectee"
    export function couleurDetectee(): boolean {
        if (!camInit) return false
        return wondercam.isDetectedColorId(idCouleur)
    }

    //% group="Vision actions"
    //% blockId=aihandler_color_in_x
    //% block="couleur dans zone X"
    export function couleurDansZoneX(): boolean {
        if (!camInit) return false
        if (wondercam.isDetectedColorId(idCouleur)) {
            let x = wondercam.XOfColorId(wondercam.Options.Pos_X, idCouleur)
            return (x >= xMin && x <= xMax)
        }
        return false
    }

    //% group="Vision actions"
    //% blockId=aihandler_color_reliable
    //% block="couleur fiable"
    export function couleurDetecteeFiable(): boolean {
        if (couleurDansZoneX()) {
            compteurDetection += 1
        } else {
            compteurDetection = 0
        }
        return compteurDetection > validations
    }

    //% group="Vision actions"
    //% blockId=aihandler_object_close
    //% block="objet proche"
    export function objetProche(): boolean {
        if (!camInit) return false
        if (wondercam.isDetectedColorId(idCouleur)) {
            let y = wondercam.XOfColorId(wondercam.Options.Pos_Y, idCouleur)
            return y >= yApproche
        }
        return false
    }
}
