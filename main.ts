//% color=#00bcd4 icon="\uf1b9" block="AI Handler"
//% groups='["Initialisation","Reglages IA","Capteurs","Mouvements simples","Mouvements avances","Manipulation","Actions IA","Cycle complet"]'
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
    // IA (cube couleur ID)
    //  - camera WonderCam est utilisee en interne (pas de blocs WonderCam visibles)
    // =========================================================
    let camInit = false
    let idCouleur = 1

    let xMin = 80
    let xMax = 240
    let yApproche = 237
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
    // OUTILS INTERNES
    // =========================================================
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

    function initCameraInterne(): void {
        if (!camInit) {
            // WonderCam est importee indirectement via dadabit (pas besoin de dependance directe)
            wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
            wondercam.ChangeFunc(wondercam.Functions.ColorDetect)
            camInit = true
            compteurDetection = 0
        }
    }

    function majCameraInterne(): void {
        if (camInit) {
            wondercam.UpdateResult()
        }
    }

    function lireXCouleur(): number {
        // Variante la plus compatible (sans Options.*)
        return wondercam.XOfColorId(idCouleur)
    }

    function lireYCouleur(): number {
        // Variante la plus compatible (sans Options.*)
        return wondercam.YOfColorId(idCouleur)
    }

    // =========================================================
    // INITIALISATION
    // =========================================================

    //% group="Initialisation"
    //% blockId=aihandler_init_all
    //% block="initialiser AI Handler (ID %id) bras %bras pince %pince"
    //% id.defl=1 bras.defl=5 pince.defl=6
    export function initialiserAIHandler(id: number = 1, bras: number = 5, pince: number = 6): void {
        dadabit.dadabit_init()
        idCouleur = id
        servoBras = bras
        servoPince = pince
        initCameraInterne()
        positionDepartBras()
        porteObjet = false
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

    // =========================================================
    // REGLAGES IA
    // =========================================================

    //% group="Reglages IA"
    //% blockId=aihandler_set_zone_x
    //% block="regler zone centrage X min %xmin X max %xmax"
    //% xmin.defl=80 xmax.defl=240
    export function reglerZoneCentrageX(xmin: number = 80, xmax: number = 240): void {
        xMin = xmin
        xMax = xmax
    }

    //% group="Reglages IA"
    //% blockId=aihandler_set_y_approche
    //% block="regler distance approche Y %y"
    //% y.defl=237
    export function reglerDistanceApproche(y: number = 237): void {
        yApproche = y
    }

    //% group="Reglages IA"
    //% blockId=aihandler_set_valid
    //% block="regler stabilite detection %n validations"
    //% n.defl=8
    export function reglerStabiliteDetection(n: number = 8): void {
        validations = n
        compteurDetection = 0
    }

    // =========================================================
    // CAPTEURS
    // =========================================================

    //% group="Capteurs"
    //% blockId=aihandler_update_all
    //% block="mettre a jour (ligne + IA)"
    export function mettreAJour(): void {
        initCameraInterne()
        majCameraInterne()

        s1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        s2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        s3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        s4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    //% group="Capteurs"
    //% blockId=aihandler_destination
    //% block="arrive a destination"
    export function arriveDestination(): boolean {
        return s1 && s2 && s3 && s4
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

    //% group="Mouvements simples"
    //% blockId=aihandler_reculer
    //% block="reculer vitesse %v"
    //% v.defl=44
    export function reculer(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_tourner_gauche
    //% block="tourner gauche vitesse %v"
    //% v.defl=44
    export function tournerGaucheBloc(v: number): void {
        tournerGauche(v)
    }

    //% group="Mouvements simples"
    //% blockId=aihandler_tourner_droite
    //% block="tourner droite vitesse %v"
    //% v.defl=44
    export function tournerDroiteBloc(v: number): void {
        tournerDroite(v)
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

    //% group="Mouvements avances"
    //% blockId=aihandler_demi_tour
    //% block="faire demi tour vitesse %v"
    //% v.defl=44
    export function demiTour(v: number = 44): void {
        mettreAJour()
        reculer(0) // inertie minimale

        // rotation sur place (meme logique que ton ancien code)
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
        basic.pause(500)

        // retrouver la ligne: on tourne jusqu'a avoir s3 et s4 sur ligne
        while (s1 || s2 || !(s3 && s4)) {
            tournerDroite(v)
            mettreAJour()
        }
        arreter()
    }

    // =========================================================
    // MANIPULATION (bras/pince)
    // =========================================================

    //% group="Manipulation"
    //% blockId=aihandler_set_servos
    //% block="definir servos bras %bras pince %pince"
    //% bras.defl=5 pince.defl=6
    export function definirServosBras(bras: number = 5, pince: number = 6): void {
        servoBras = bras
        servoPince = pince
    }

    //% group="Manipulation"
    //% blockId=aihandler_arm_home
    //% block="position depart bras"
    export function positionDepartBras(): void {
        dadabit.setLego270Servo(servoBras, brasHaut, 300)
        dadabit.setLego270Servo(servoPince, pinceOuverte, 300)
        basic.pause(500)
        porteObjet = false
    }

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

    // =========================================================
    // ACTIONS IA (cube ID1) - pas de blocs WonderCam visibles
    // =========================================================

    //% group="Actions IA"
    //% blockId=aihandler_cube_detecte
    //% block="cube ID detecte"
    export function cubeDetecte(): boolean {
        initCameraInterne()
        return wondercam.isDetectedColorId(idCouleur)
    }

    //% group="Actions IA"
    //% blockId=aihandler_cube_centre
    //% block="cube ID centre"
    export function cubeCentre(): boolean {
        initCameraInterne()
        if (!wondercam.isDetectedColorId(idCouleur)) return false
        let x = lireXCouleur()
        return (x >= xMin && x <= xMax)
    }

    //% group="Actions IA"
    //% blockId=aihandler_cube_fiable
    //% block="cube ID detecte fiable"
    export function cubeDetecteFiable(): boolean {
        initCameraInterne()
        if (cubeCentre()) {
            compteurDetection += 1
        } else {
            compteurDetection = 0
        }
        return compteurDetection >= validations
    }

    //% group="Actions IA"
    //% blockId=aihandler_approcher_cube
    //% block="approcher le cube ID"
    export function approcherCube(): void {
        initCameraInterne()
        // avance en suivant la ligne jusqu'a distance Y
        while (wondercam.isDetectedColorId(idCouleur) && (lireYCouleur() < yApproche)) {
            mettreAJour()
            suivreLigne()
        }
        arreter()
    }
    //% group="Actions IA"
    //% blockId=aihandler_recentrer_cube
    //% block="recentrer le cube ID"
    export function recentrerCube(): void {
        initCameraInterne()
        while (wondercam.isDetectedColorId(idCouleur)) {
            let x = lireXCouleur()

            if (x < xMin) {
                tournerGauche(vPetit)
            } else if (x > xMax) {
                tournerDroite(vPetit)
            } else {
                arreter()
                break
            }
            basic.pause(40)
            majCameraInterne()
        }
        arreter()
    }
    //% group="Actions IA"
    //% blockId=aihandler_chercher_cube
    //% block="chercher le cube ID"
    export function chercherCube(): void {
        initCameraInterne()

        // balayage droite
        for (let i = 0; i < 20; i++) {
            tournerDroite(vPetit)
            basic.pause(80)
            majCameraInterne()
            if (wondercam.isDetectedColorId(idCouleur)) {
                arreter()
                return
            }
        }

        // balayage gauche
        for (let i = 0; i < 40; i++) {
            tournerGauche(vPetit)
            basic.pause(80)
            majCameraInterne()
            if (wondercam.isDetectedColorId(idCouleur)) {
                arreter()
                return
            }
        }

        arreter()
    }
    //% group="Actions IA"
    //% blockId=aihandler_aller_vers_cube
    //% block="aller vers le cube ID"
    export function allerVersCube(): void {
        initCameraInterne()

        while (wondercam.isDetectedColorId(idCouleur)) {
            let x = lireXCouleur()
            let y = lireYCouleur()

            // recentrage
            if (x < xMin) {
                tournerGauche(vPetit)
            } else if (x > xMax) {
                tournerDroite(vPetit)
            } 
            // approche
            else if (y < yApproche) {
                avancer(vCorrection)
            } 
            // assez proche
            else {
                arreter()
                break
            }

            basic.pause(40)
            majCameraInterne()
        }
        arreter()
    }

    // =========================================================
    // CYCLE COMPLET (simple et utile)
    // =========================================================

    //% group="Cycle complet"
    //% blockId=aihandler_cycle
    //% block="cycle AI Handler"
    export function cycle(): void {
        mettreAJour()
        suivreLigne()

        if (!porteObjet && cubeDetecteFiable()) {
            approcherCube()
            attraperObjet()
            compteurDetection = 0
        }

        if (porteObjet && arriveDestination()) {
            deposerObjet()
            demiTour(vCorrection)
        }
    }
}
