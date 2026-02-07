//% color=#00bcd4 icon="\uf1b9" block="AI Hanter"
namespace aihandler {

    // ===============================
    // ETAT LIGNE (4 capteurs)
    // ===============================
    let s1 = false
    let s2 = false
    let s3 = false
    let s4 = false

    // ===============================
    // VITESSES
    // ===============================
    let vToutDroit = 55
    let vCorrection = 44
    let vPetit = 33

    // ===============================
    // SERVOS (bras/pince)
    // ===============================
    let servoBras = 5
    let servoPince = 6
    let porteObjet = false

    let brasHaut = -60
    let brasBas = -5
    let pinceOuverte = 15
    let pinceFermee = -25

    // ===============================
    // OUTILS MOTEURS (internes)
    // ===============================
    function toutDroit(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    function reculerInterne(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    function correctionGauche(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v / 2)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v / 2)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    function correctionDroite(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v / 2)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v / 2)
    }

    // rotation sur place (moteurs opposes) : plus fiable
    function spinDroite(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    function stopInterne(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    // ===============================
    // INITIALISATION
    // ===============================
    //% group="Init"
    //% blockId=aihanter_init
    //% block="aihanter init bras %bras pince %pince"
    export function init(bras: number = 5, pince: number = 6): void {
        dadabit.dadabit_init()
        servoBras = bras
        servoPince = pince
        porteObjet = false
        positionDepartBras()
        stopInterne()
    }

    //% group="Init"
    //% blockId=aihanter_set_speeds
    //% block="set speeds straight %vd correction %vc small %vp"
    //% vd.defl=55 vc.defl=44 vp.defl=33
    export function setSpeeds(vd: number = 55, vc: number = 44, vp: number = 33): void {
        vToutDroit = vd
        vCorrection = vc
        vPetit = vp
    }

    // ===============================
    // LIGNE (capteurs)
    // ===============================
    //% group="Line"
    //% blockId=aihanter_update_line
    //% block="update line sensors"
    export function updateLine(): void {
        s1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        s2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        s3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        s4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    //% group="Line"
    //% blockId=aihanter_is_destination
    //% block="is destination"
    export function isDestination(): boolean {
        return (s1 && s2 && s3 && s4)
    }

    // ===============================
    // MOUVEMENTS
    // ===============================
    //% group="Move"
    //% blockId=aihanter_stop
    //% block="stop"
    export function stop(): void {
        stopInterne()
    }

    //% group="Move"
    //% blockId=aihanter_forward
    //% block="forward %v"
    //% v.defl=55
    export function forward(v: number = 55): void {
        toutDroit(v)
    }

    //% group="Move"
    //% blockId=aihanter_backward
    //% block="backward %v"
    //% v.defl=55
    export function backward(v: number = 55): void {
        reculerInterne(v)
    }

    //% group="Move"
    //% blockId=aihanter_left
    //% block="turn left (correction) %v"
    //% v.defl=44
    export function turnLeft(v: number = 44): void {
        correctionGauche(v)
    }

    //% group="Move"
    //% blockId=aihanter_right
    //% block="turn right (correction) %v"
    //% v.defl=44
    export function turnRight(v: number = 44): void {
        correctionDroite(v)
    }

    // ===============================
    // SUIVI DE LIGNE (fluide 55/44/33)
    // ===============================
    //% group="Follow"
    //% blockId=aihanter_follow_line
    //% block="follow line (smooth)"
    export function followLine(): void {
        // L'utilisateur doit appeler updateLine() avant (ou utiliser cycle())

        if (s2 && s3) {
            toutDroit(vToutDroit)

        } else if (s1 && s2 && (!s3 && !s4)) {
            correctionGauche(vCorrection)

        } else if (s3 && s4 && (!s1 && !s2)) {
            correctionDroite(vCorrection)

        } else if (s2 && (!s1 && !s3 && !s4)) {
            // petit ajustement vers la gauche
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vPetit)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vPetit)

        } else if (s3 && (!s1 && !s2 && !s4)) {
            // petit ajustement vers la droite
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vCorrection)

        } else if (s1 && (!s2 && !s3 && !s4)) {
            correctionGauche(vToutDroit)

        } else if (s4 && (!s1 && !s2 && !s3)) {
            correctionDroite(vToutDroit)

        } else if (!s1 && !s2 && !s3 && !s4) {
            // perdu : avance lentement
            toutDroit(vPetit)
        }
    }

    //% group="Follow"
    //% blockId=aihanter_u_turn
    //% block="u turn %v"
    //% v.defl=44
    export function uTurn(v: number = 44): void {
        // rotation puis recherche de la ligne (mode reference)
        spinDroite(v)
        basic.pause(500)

        updateLine()
        while (s1 || s2 || !(s3 && s4)) {
            // rotation continue (comme le JS reference: tous CCW)
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
            updateLine()
        }
        stopInterne()
    }

    // ===============================
    // MANIPULATION (bras/pince)
    // ===============================
    //% group="Arm"
    //% blockId=aihanter_home_arm
    //% block="arm home"
    export function positionDepartBras(): void {
        dadabit.setLego270Servo(servoBras, brasHaut, 300)
        dadabit.setLego270Servo(servoPince, pinceOuverte, 300)
        basic.pause(300)
        porteObjet = false
    }

    //% group="Arm"
    //% blockId=aihanter_grab
    //% block="grab object"
    export function grab(): void {
        stopInterne()
        basic.pause(200)

        dadabit.setLego270Servo(servoBras, brasBas, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoPince, pinceFermee, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoBras, brasHaut, 500)
        basic.pause(400)

        porteObjet = true
    }

    //% group="Arm"
    //% blockId=aihanter_drop
    //% block="drop object"
    export function drop(): void {
        stopInterne()
        basic.pause(200)

        dadabit.setLego270Servo(servoBras, brasBas, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoPince, pinceOuverte, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoBras, brasHaut, 500)
        basic.pause(400)

        porteObjet = false
    }

    //% group="Arm"
    //% blockId=aihanter_has_object
    //% block="has object"
    export function hasObject(): boolean {
        return porteObjet
    }

    // ===============================
    // CYCLE SANS CAMERA
    // ===============================
    //% group="Cycle"
    //% blockId=aihanter_cycle_no_cam
    //% block="cycle no camera"
    export function cycleNoCamera(): void {
        updateLine()
        followLine()

        // si on porte un objet et on arrive destination => deposer + demi-tour
        if (porteObjet && isDestination()) {
            drop()
            uTurn(vCorrection)
        }
    }
}
