//% color=#00bcd4 icon="\uf1b9" block="AI Hanter" 
//% groups='["Initialisation","Reglages","Capteurs ligne","Suivi de ligne","Camera IA","Manipulation","Actions","Cycle"]'
namespace aihandler {

    // =========================================================
    // CAPTEURS LIGNE (4 capteurs)
    // =========================================================
    let capteur1 = false
    let capteur2 = false
    let capteur3 = false
    let capteur4 = false

    // =========================================================
    // VITESSES (identiques au code qui marche)
    // =========================================================
    let vToutDroit = 55
    let vCorrection = 44
    let vPetit = 33

    // =========================================================
    // BRAS / PINCE (identique au code original)
    // =========================================================
    let servoBras = 5
    let servoPince = 6

    let brasHaut = -60
    let brasBas = -5
    let pinceOuverte = 15
    let pinceFermee = -25

    // =========================================================
    // ETAT (comme recognition_or_placement)
    // 0 = mode reconnaissance / approche
    // 1 = porte objet
    // =========================================================
    let porteObjet = false

    // =========================================================
    // CAMERA IA (comme le code original)
    // =========================================================
    let idCouleur = 1
    let xMin = 80
    let xMax = 240
    let yApproche = 237
    let validations = 8
    let compteur = 0

    // =========================================================
    // OUTILS MOTEURS (internes)
    // =========================================================
    function arreterInterne(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    function rotationRechercheLigne(v: number): void {
        // comme le code original destination(): tous Counterclockwise
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    // =========================================================
    // INITIALISATION
    // =========================================================
    //% group="Initialisation"
    //% blockId=aihanter_initialiser
    //% block="initialiser AI Hanter bras %bras pince %pince"
    //% bras.defl=5 pince.defl=6
    export function initialiser(bras: number = 5, pince: number = 6): void {
        dadabit.dadabit_init()
        servoBras = bras
        servoPince = pince

        porteObjet = false
        compteur = 0

        // position depart comme l'original
        dadabit.setLego270Servo(servoBras, brasHaut, 300)
        dadabit.setLego270Servo(servoPince, pinceOuverte, 300)
        basic.pause(500)
    }

    //% group="Initialisation"
    //% blockId=aihanter_init_camera
    //% block="initialiser camera adresse %addr"
    //% addr.defl=32
    export function initialiserCamera(addr: number = 32): void {
        // original: wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
        // ici on garde simple: 32 = x32
        if (addr == 32) {
            wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
        } else if (addr == 33) {
            wondercam.wondercam_init(wondercam.DEV_ADDR.x33)
        } else {
            // par defaut
            wondercam.wondercam_init(wondercam.DEV_ADDR.x32)
        }
        wondercam.ChangeFunc(wondercam.Functions.ColorDetect)
    }

    // =========================================================
    // REGLAGES
    // =========================================================
    //% group="Reglages"
    //% blockId=aihanter_regler_vitesses
    //% block="regler vitesses tout droit %vd correction %vc petit %vp"
    //% vd.defl=55 vc.defl=44 vp.defl=33
    export function reglerVitesses(vd: number = 55, vc: number = 44, vp: number = 33): void {
        vToutDroit = vd
        vCorrection = vc
        vPetit = vp
    }

    //% group="Reglages"
    //% blockId=aihanter_regler_params_ia
    //% block="regler IA id %id xmin %xmin xmax %xmax yApproche %y valid %n"
    //% id.defl=1 xmin.defl=80 xmax.defl=240 y.defl=237 n.defl=8
    export function reglerIA(id: number = 1, xmin: number = 80, xmax: number = 240, y: number = 237, n: number = 8): void {
        idCouleur = id
        xMin = xmin
        xMax = xmax
        yApproche = y
        validations = n
        compteur = 0
    }

    // =========================================================
    // CAPTEURS LIGNE
    // =========================================================
    //% group="Capteurs ligne"
    //% blockId=aihanter_mettre_a_jour_ligne
    //% block="mettre a jour ligne"
    export function mettreAJourLigne(): void {
        capteur1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        capteur2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        capteur3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        capteur4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    //% group="Capteurs ligne"
    //% blockId=aihanter_arrive_destination
    //% block="arrive destination"
    export function arriveDestination(): boolean {
        return (capteur1 && capteur2 && capteur3 && capteur4)
    }

    // =========================================================
    // SUIVI DE LIGNE (COPIE EXACTE DU CODE QUI MARCHE)
    // =========================================================
    //% group="Suivi de ligne"
    //% blockId=aihanter_suivre_ligne
    //% block="suivre la ligne (competition)"
    export function suivreLigne(): void {
        if (capteur2 && capteur3) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vToutDroit)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vToutDroit)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vToutDroit)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vToutDroit)

        } else if (capteur1 && capteur2 && (!capteur3 && !capteur4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vCorrection)

        } else if (capteur3 && capteur4 && (!capteur1 && !capteur2)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, vCorrection)

        } else if (capteur2 && !capteur1 && (!capteur3 && !capteur4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vPetit)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vPetit)

        } else if (capteur3 && !capteur1 && (!capteur2 && !capteur4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vCorrection)

        } else if (capteur1 && !capteur2 && (!capteur3 && !capteur4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, vToutDroit)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vToutDroit)
            dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, vToutDroit)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vToutDroit)

        } else if (capteur4 && !capteur1 && (!capteur2 && !capteur3)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vToutDroit)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, vToutDroit)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vToutDroit)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, vToutDroit)
        }
    }

    // =========================================================
    // CAMERA IA (blocs inspires du code original)
    // =========================================================
    //% group="Camera IA"
    //% blockId=aihanter_camera_update
    //% block="camera mettre a jour resultats"
    export function cameraMettreAJour(): void {
        wondercam.UpdateResult()
    }

    //% group="Camera IA"
    //% blockId=aihanter_objet_detecte
    //% block="objet detecte"
    export function objetDetecte(): boolean {
        return wondercam.isDetectedColorId(idCouleur)
    }

    //% group="Camera IA"
    //% blockId=aihanter_objet_centre
    //% block="objet centre"
    export function objetCentre(): boolean {
        if (!objetDetecte()) return false
        let x = wondercam.XOfColorId(wondercam.Options.Pos_X, idCouleur)
        return (x >= xMin && x <= xMax)
    }

    //% group="Camera IA"
    //% blockId=aihanter_detection_stable
    //% block="detection stable"
    export function detectionStable(): boolean {
        // comme next>8 dans le code original, mais en bloc
        if (objetCentre()) compteur++
        else compteur = 0
        return (compteur > validations)
    }

    //% group="Camera IA"
    //% blockId=aihanter_reset_stable
    //% block="reinitialiser stabilite"
    export function reinitialiserStabilite(): void {
        compteur = 0
    }

    //% group="Camera IA"
    //% blockId=aihanter_approcher_objet
    //% block="approcher objet jusqu a Y"
    export function approcherObjetJusquaY(): void {
        // inspire du while (Y < 237 && detected) { Update; update_line; general_line_following(); }
        while (wondercam.isDetectedColorId(idCouleur) && wondercam.YOfColorId(wondercam.Options.Pos_Y, idCouleur) < yApproche) {
            wondercam.UpdateResult()
            mettreAJourLigne()
            suivreLigne()
        }
        arreterInterne()
    }

    // =========================================================
    // MANIPULATION (grasp / destination inspires du code original)
    // =========================================================
    //% group="Manipulation"
    //% blockId=aihanter_attraper
    //% block="attraper objet (competition)"
    export function attraperObjetCompetition(): void {
        arreterInterne()
        basic.pause(500)

        dadabit.setLego270Servo(servoBras, brasBas, 500)
        basic.pause(800)

        dadabit.setLego270Servo(servoPince, pinceFermee, 500)
        basic.pause(800)

        dadabit.setLego270Servo(servoBras, brasHaut, 500)
        basic.pause(800)

        porteObjet = true
    }

    //% group="Manipulation"
    //% blockId=aihanter_deposer
    //% block="deposer objet (competition)"
    export function deposerObjetCompetition(): void {
        arreterInterne()
        basic.pause(500)

        dadabit.setLego270Servo(servoBras, brasBas, 500)
        basic.pause(800)

        dadabit.setLego270Servo(servoPince, pinceOuverte, 500)
        basic.pause(800)

        dadabit.setLego270Servo(servoBras, brasHaut, 500)
        basic.pause(800)

        porteObjet = false
    }

    //% group="Manipulation"
    //% blockId=aihanter_porte_objet
    //% block="porte un objet"
    export function porteUnObjet(): boolean {
        return porteObjet
    }

    // =========================================================
    // ACTIONS (destination() inspire du code original)
    // =========================================================
    //% group="Actions"
    //% blockId=aihanter_action_destination
    //% block="action destination (deposer + demi tour)"
    export function actionDestination(): void {
        // stop
        arreterInterne()
        basic.pause(500)

        // deposer si on porte
        if (porteObjet) {
            deposerObjetCompetition()
        }

        // petit pivot comme l'original (Clockwise/Counterclockwise mix)
        mettreAJourLigne()
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, vCorrection)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, vCorrection)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, vCorrection)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, vCorrection)
        basic.pause(500)

        // recherche ligne (while Sensor1 || Sensor2 || !(Sensor3 && Sensor4))
        mettreAJourLigne()
        while (capteur1 || capteur2 || !(capteur3 && capteur4)) {
            rotationRechercheLigne(vCorrection)
            mettreAJourLigne()
        }

        arreterInterne()
    }

    // =========================================================
    // CYCLE COMPLET (inspire du basic.forever original)
    // =========================================================
    //% group="Cycle"
    //% blockId=aihanter_cycle_complet
    //% block="cycle complet (camera + ligne)"
    export function cycleComplet(): void {
        // 1) mise a jour
        wondercam.UpdateResult()
        mettreAJourLigne()

        // 2) si pas d objet et detection stable => approcher + attraper
        if (!porteObjet && wondercam.isDetectedColorId(idCouleur)) {
            // condition originale: detected && X entre xmin et xmax, puis next>8
            if (objetCentre()) {
                compteur++
                if (compteur > validations) {
                    compteur = 0
                    approcherObjetJusquaY()
                    attraperObjetCompetition()
                }
            } else {
                compteur = 0
            }
        }

        // 3) destination => deposer + demi tour (style original)
        if (arriveDestination()) {
            actionDestination()
        } else {
            suivreLigne()
        }
    }
}
