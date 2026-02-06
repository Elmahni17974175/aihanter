//% color=#00bcd4 icon="\uf1b9" block="AI Handler"
//% groups='["Initialisation","Capteurs","Mouvements simples","Mouvements avances","Vision actions","Manipulation"]'
namespace aihandler {

    // =========================================================
    // ETAT LIGNE
    // =========================================================
    let s1 = false
    let s2 = false
    let s3 = false
    let s4 = false

    // =========================================================
    // VITESSES (Option B)
    // =========================================================
    let vToutDroit = 55
    let vCorrection = 44
    let vPetit = 33

    // =========================================================
    // CAMERA (via dependance dadabit)
    // =========================================================
    let camInit = false
    let idCouleur = 1
    let validations = 8
    let compteurDetection = 0

    // =========================================================
    // SERVOS (bras + pince)
    // =========================================================
    let servoBras = 5
    let servoPince = 6
    let porteObjet = false

    let brasHaut = -60
    let brasBas = -5
    let pinceOuverte = 15
    let pinceFermee = -25

    // =========================================================
    // INITIALISATION
    // =========================================================

    //% group="Initialisation"
    //% blockId=aihandler_init
    //% block="initialiser DaDa:bit"
    export function initialiserDadabit(): void {
        dadabit.dadabit_init()
    }

    //% group="Initialisation"
    //% blockId=aihandler_set_speeds
    //% block="regler vitesses suivi tout droit %vd correction %vc petit ajustement %vp"
    //% vd.defl=55 vc.defl=44 vp.defl=33
    export function reglerVitessesSuivi(vd: number, vc: number, vp: number): void {
        vToutDroit = vd
        vCorrection = vc
        vPetit = vp
    }

    //% group="Initialisation"
    //% blockId=aihandler_cam_init
    //% block="initialiser camera"
    export function initialiserCamera(): void {
        wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
        wondercam.ChangeFunc(wondercam.Functions.ColorDetect)
        camInit = true
        compteurDetection = 0
    }

    //% group="Initialisation"
    //% blockId=aihandler_set_color
    //% block="definir ID couleur %id"
    //% id.defl=1
    export function definirCouleurID(id: number): void {
        idCouleur = id
        compteurDetection = 0
    }

    //% group="Initialisation"
    //% blockId=aihandler_set_servos
    //% block="definir servos bras %bras pince %pince"
    //% bras.defl=5 pince.defl=6
    export function definirServosBras(bras: number, pince: number): void {
        servoBras = bras
        servoPince = pince
    }

    //% group="Initialisation"
    //% blockId=aihandler_arm_home
    //% block="position depart bras"
    export function positionDepartBras(): void {
        dadabit.setLego270Servo(servoBras, brasHaut, 300)
        dadabit.setLego270Servo(servoPince, pinceOuverte, 300)
        basic.pause(500)
        porteObjet = false
    }

    // =========================================================
    // CAPTEURS
    // =========================================================

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
    //% blockId=aihandler_update_camera
    //% block="mettre a jour camera"
    export function mettreAJourCamera(): void {
        if (camInit) {
            wondercam.UpdateResult()
        }
    }

    //% group="Capteurs"
    //% blockId=aihandler_destination
    //% block="arrive a destination"
    export function arriveDestination(): boolean {
        return s1 && s2 && s3 && s4
    }

    // =========================================================
    // MOUVEMENTS SIMPLES
    // =========================================================

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
    //% v.defl=80
    export function avancer(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    // =========================================================
    // MOUVEMENTS AVANCES
    // =========================================================

    //% group="Mouvements avances"
    //% blockId=aihandler_suivre_ligne
    //% block="suivre la ligne"
    export function suivreLigne(): void {
        if (s2 && s3) {
            avancer(vToutDroit)
        } else if (s1 && s2 && (!s3 && !s4)) {
            tournerGauche(vCorrection)
        } else if (s3 && s4 && (!s1 && !s2)) {
            tournerDroite(vCorrection)
        } else if (s2 && !s1 && !s3 && !s4) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vPetit)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vPetit)
        } else if (s3 && !s1 && !s2 && !s4) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vCorrection)
        }
    }

    function tournerGauche(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    function tournerDroite(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    // =========================================================
    // VISION
    // =========================================================

    //% group="Vision actions"
    //% blockId=aihandler_color_reliable
    //% block="couleur detectee de facon fiable"
    export function couleurDetecteeFiable(): boolean {
        if (!camInit) return false

        if (wondercam.isDetectedColorId(idCouleur)) {
            compteurDetection += 1
        } else {
            compteurDetection = 0
        }
        return compteurDetection >= validations
    }

    // =========================================================
    // MANIPULATION
    // =========================================================

    //% group="Manipulation"
    //% blockId=aihandler_grab
    //% block="attraper objet"
    export function attraperObjet(): void {
        arreter()
        basic.pause(300)

        dadabit.setLego270Servo(servoBras, brasBas, 500)
        basic.pause(600)

        dadabit.setLego270Servo(servoPince, pinceFermee, 500)
        basic.pause(600)

        dadabit.setLego270Servo(servoBras, brasHaut, 500)
        basic.pause(600)

        porteObjet = true
    }

    //% group="Manipulation"
    //% blockId=aihandler_drop
    //% block="deposer objet"
    export function deposerObjet(): void {
        arreter()
        basic.pause(300)

        dadabit.setLego270Servo(servoBras, brasBas, 500)
        basic.pause(600)

        dadabit.setLego270Servo(servoPince, pinceOuverte, 500)
        basic.pause(600)

        dadabit.setLego270Servo(servoBras, brasHaut, 500)
        basic.pause(600)

        porteObjet = false
    }

    //% group="Manipulation"
    //% blockId=aihandler_has_object
    //% block="porte un objet"
    export function porteUnObjet(): boolean {
        return porteObjet
    }
}
