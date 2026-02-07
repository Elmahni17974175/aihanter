//% color=#00bcd4 icon="\uf1b9" block="AI Hanter"
//% groups='["Initialisation","Capteurs ligne","Mouvements","Suivi de ligne","Manipulation","Cycle"]'
namespace aihandler {

    // ===============================
    // CAPTEURS LIGNE
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
    // SERVOS
    // ===============================
    let servoBras = 5
    let servoPince = 6
    let porteObjet = false

    let brasHaut = -60
    let brasBas = -5
    let pinceOuverte = 15
    let pinceFermee = -25

    // ===============================
    // OUTILS MOTEURS
    // ===============================
    function toutDroit(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
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

    function spinDroite(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    function stop(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    // ===============================
    // INITIALISATION
    // ===============================
    //% group="Initialisation"
    //% blockId=aihanter_init
    //% block="initialiser AI Hanter bras %bras pince %pince"
    export function initialiser(bras: number = 5, pince: number = 6): void {
        dadabit.dadabit_init()
        servoBras = bras
        servoPince = pince
        positionDepartBras()
    }

    // ===============================
    // CAPTEURS LIGNE
    // ===============================
    //% group="Capteurs ligne"
    //% blockId=aihanter_update_line
    //% block="mettre a jour ligne"
    export function mettreAJourLigne(): void {
        s1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        s2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        s3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        s4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    //% group="Capteurs ligne"
    //% blockId=aihanter_destination
    //% block="arrive destination"
    export function arriveDestination(): boolean {
        return s1 && s2 && s3 && s4
    }

    // ===============================
    // SUIVI DE LIGNE
    // ===============================
    //% group="Suivi de ligne"
    //% blockId=aihanter_follow
    //% block="suivre la ligne"
    export function suivreLigne(): void {
        if (s2 && s3) {
            toutDroit(vToutDroit)
        } else if (s1 && s2) {
            correctionGauche(vCorrection)
        } else if (s3 && s4) {
            correctionDroite(vCorrection)
        } else if (!s1 && !s2 && !s3 && !s4) {
            toutDroit(vPetit)
        }
    }

    // ===============================
    // MANIPULATION
    // ===============================
    //% group="Manipulation"
    //% blockId=aihanter_home
    //% block="position depart bras"
    export function positionDepartBras(): void {
        dadabit.setLego270Servo(servoBras, brasHaut, 300)
        dadabit.setLego270Servo(servoPince, pinceOuverte, 300)
        porteObjet = false
    }

    //% group="Manipulation"
    //% blockId=aihanter_grab
    //% block="attraper objet"
    export function attraperObjet(): void {
        stop()
        dadabit.setLego270Servo(servoBras, brasBas, 500)
        dadabit.setLego270Servo(servoPince, pinceFermee, 500)
        dadabit.setLego270Servo(servoBras, brasHaut, 500)
        porteObjet = true
    }

    //% group="Manipulation"
    //% blockId=aihanter_drop
    //% block="deposer objet"
    export function deposerObjet(): void {
        stop()
        dadabit.setLego270Servo(servoBras, brasBas, 500)
        dadabit.setLego270Servo(servoPince, pinceOuverte, 500)
        dadabit.setLego270Servo(servoBras, brasHaut, 500)
        porteObjet = false
    }

    // ===============================
    // CYCLE
    // ===============================
    //% group="Cycle"
    //% blockId=aihanter_cycle
    //% block="cycle base AI Hanter"
    export function cycle(): void {
        mettreAJourLigne()
        suivreLigne()

        if (porteObjet && arriveDestination()) {
            deposerObjet()
            spinDroite(44)
            basic.pause(500)
        }
    }
}
