//% color=#00bcd4 icon="\uf1b9" block="AI Hanter"
//% groups='["Initialisation","Réglages IA","Capteurs ligne","Mouvements","Suivi de ligne","Manipulation","Actions IA","Cycle complet"]'
namespace aihandler {

    // =========================================================
    // LIGNE (4 capteurs)
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
    // IA (cube couleur ID) - WonderCam officielle
    // NOTE: l'élève peut appeler wondercam.UpdateResult() en boucle,
    // mais ici on le fait dans les boucles internes IA pour la robustesse.
    // =========================================================
    let idCouleur = 1
    let xMin = 80
    let xMax = 240
    let yApproche = 237
    let validations = 8
    let compteur = 0

    // =========================================================
    // SERVOS (bras/pince)
    // =========================================================
    let servoBras = 5
    let servoPince = 6
    let porteObjet = false

    let brasHaut = -60
    let brasBas = -5
    let pinceOuverte = 15
    let pinceFermee = -25

    // =========================================================
    // OUTILS MOTEURS (internes)
    // =========================================================
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

    // Corrections "fluides" (différentiel)
    function correctionDroite(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v / 2)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v / 2)
    }

    function correctionGauche(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v / 2)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v / 2)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    // Rotation sur place "robuste" (moteurs opposés) — utile pour recherche / demi-tour
    function spinDroite(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    function spinGauche(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    function stopInterne(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    // =========================================================
    // INITIALISATION
    // =========================================================
    //% group="Initialisation"
    //% blockId=aihanter_init
    //% block="initialiser AI Hanter ID %id bras %bras pince %pince"
    //% id.defl=1 bras.defl=5 pince.defl=6
    export function initialiser(id: number = 1, bras: number = 5, pince: number = 6): void {
        dadabit.dadabit_init()

        idCouleur = id
        servoBras = bras
        servoPince = pince

        porteObjet = false
        compteur = 0

        positionDepartBras()
    }

    //% group="Initialisation"
    //% blockId=aihanter_set_speeds
    //% block="regler vitesses suivi tout droit %vd correction %vc petit ajustement %vp"
    //% vd.defl=55 vc.defl=44 vp.defl=33
    export function reglerVitessesSuivi(vd: number = 55, vc: number = 44, vp: number = 33): void {
        vToutDroit = vd
        vCorrection = vc
        vPetit = vp
    }

    // =========================================================
    // RÉGLAGES IA
    // =========================================================
    //% group="Réglages IA"
    //% blockId=aihanter_set_x
    //% block="regler centrage X min %xmin max %xmax"
    //% xmin.defl=80 xmax.defl=240
    export function reglerCentrageX(xmin: number = 80, xmax: number = 240): void {
        xMin = xmin
        xMax = xmax
    }

    //% group="Réglages IA"
    //% blockId=aihanter_set_y
    //% block="regler distance approche Y %y"
    //% y.defl=237
    export function reglerDistanceApproche(y: number = 237): void {
        yApproche = y
    }

    //% group="Réglages IA"
    //% blockId=aihanter_set_valid
    //% block="regler stabilite detection %n"
    //% n.defl=8
    export function reglerStabiliteDetection(n: number = 8): void {
        validations = n
        compteur = 0
    }

    // =========================================================
    // CAPTEURS LIGNE
    // =========================================================
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
        return (s1 && s2 && s3 && s4)
    }

    // =========================================================
    // MOUVEMENTS
    // =========================================================
    //% group="Mouvements"
    //% blockId=aihanter_stop
    //% block="arreter"
    export function arreter(): void {
        stopInterne()
    }

    //% group="Mouvements"
    //% blockId=aihanter_forward
    //% block="avancer vitesse %v"
    //% v.defl=80
    export function avancer(v: number = 80): void {
        toutDroit(v)
    }

    //% group="Mouvements"
    //% blockId=aihanter_backward
    //% block="reculer vitesse %v"
    //% v.defl=55
    export function reculer(v: number = 55): void {
        reculerInterne(v)
    }

    //% group="Mouvements"
    //% blockId=aihanter_left
    //% block="tourner a gauche (correction) vitesse %v"
    //% v.defl=44
    export function tournerGauche(v: number = 44): void {
        correctionGauche(v)
    }

    //% group="Mouvements"
    //% blockId=aihanter_right
    //% block="tourner a droite (correction) vitesse %v"
    //% v.defl=44
    export function tournerDroite(v: number = 44): void {
        correctionDroite(v)
    }

    // =========================================================
    // SUIVI DE LIGNE (fluide)
    // =========================================================
    //% group="Suivi de ligne"
    //% blockId=aihanter_follow_line
    //% block="suivre la ligne (fluide)"
    export function suivreLigne(): void {
        // L'élève doit appeler "mettre a jour ligne" avant
        if (s2 && s3) {
            toutDroit(vToutDroit)

        } else if (s1 && s2 && (!s3 && !s4)) {
            correctionGauche(vCorrection)

        } else if (s3 && s4 && (!s1 && !s2)) {
            correctionDroite(vCorrection)

        } else if (s2 && (!s1 && !s3 && !s4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vCorrection)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vPetit)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vPetit)

        } else if (s3 && (!s1 && !s2 && !s4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vPetit)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vCorrection)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vCorrection)

        } else if (s1 && (!s2 && !s3 && !s4)) {
            correctionGauche(vToutDroit)

        } else if (s4 && (!s1 && !s2 && !s3)) {
            correctionDroite(vToutDroit)

        } else if (!s1 && !s2 && !s3 && !s4) {
            // perdu : avance doucement (option B)
            toutDroit(vPetit)
        }
    }

    //% group="Suivi de ligne"
    //% blockId=aihanter_uturn
    //% block="faire demi tour vitesse %v"
    //% v.defl=44
    export function demiTour(v: number = 44): void {
        // Rotation sur place puis recherche de ligne (comme le code référence)
        spinDroite(v)
        basic.pause(500)

        mettreAJourLigne()
        // condition calée sur le code de référence
        while (s1 || s2 || !(s3 && s4)) {
            // rotation "continue" jusqu'à retrouver le bon alignement
            // (le robot doit recroiser la ligne avec S3 & S4)
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)

            mettreAJourLigne()
        }
        stopInterne()
    }

    // =========================================================
    // MANIPULATION
    // =========================================================
    //% group="Manipulation"
    //% blockId=aihanter_home_arm
    //% block="position depart bras"
    export function positionDepartBras(): void {
        dadabit.setLego270Servo(servoBras, brasHaut, 300)
        dadabit.setLego270Servo(servoPince, pinceOuverte, 300)
        basic.pause(500)
        porteObjet = false
    }

    //% group="Manipulation"
    //% blockId=aihanter_grab
    //% block="attraper objet"
    export function attraperObjet(): void {
        stopInterne()
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
    //% blockId=aihanter_drop
    //% block="deposer objet"
    export function deposerObjet(): void {
        stopInterne()
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
    //% blockId=aihanter_has_object
    //% block="porte un objet"
    export function porteUnObjet(): boolean {
        return porteObjet
    }

    // =========================================================
    // ACTIONS IA (WonderCam officielle)
    // IMPORTANT : wondercam.UpdateResult() doit être appelé régulièrement.
    // Ici, on le fait dans les boucles IA + le cycle peut aussi l’appeler avant.
    // =========================================================
    //% group="Actions IA"
    //% blockId=aihanter_cube_detected
    //% block="cube ID detecte"
    export function cubeDetecte(): boolean {
        return wondercam.isDetectedColorId(idCouleur)
    }

    //% group="Actions IA"
    //% blockId=aihanter_cube_centered
    //% block="cube ID centre"
    export function cubeCentre(): boolean {
        if (!cubeDetecte()) return false
        let x = wondercam.XOfColorId(wondercam.Options.Pos_X, idCouleur)
        return (x >= xMin && x <= xMax)
    }

    //% group="Actions IA"
    //% blockId=aihanter_cube_reliable
    //% block="cube ID detecte fiable"
    export function cubeDetecteFiable(): boolean {
        // plus robuste : reset si non détecté
        if (!cubeDetecte()) {
            compteur = 0
            return false
        }
        if (cubeCentre()) compteur++
        else compteur = 0

        return (compteur >= validations)
    }

    //% group="Actions IA"
    //% blockId=aihanter_recenter_cube
    //% block="recentrer le cube ID"
    export function recentrerCube(): void {
        while (true) {
            wondercam.UpdateResult()
            if (!cubeDetecte()) break

            let x = wondercam.XOfColorId(wondercam.Options.Pos_X, idCouleur)

            if (x < xMin) correctionGauche(vPetit)
            else if (x > xMax) correctionDroite(vPetit)
            else { stopInterne(); break }

            basic.pause(40)
        }
        stopInterne()
    }

    //% group="Actions IA"
    //% blockId=aihanter_search_cube
    //% block="chercher le cube ID"
    export function chercherCube(): void {
        // balayage droite
        for (let i = 0; i < 20; i++) {
            spinDroite(vPetit)
            basic.pause(80)
            wondercam.UpdateResult()
            if (cubeDetecte()) { stopInterne(); return }
        }
        // balayage gauche (retour)
        for (let i = 0; i < 40; i++) {
            spinGauche(vPetit)
            basic.pause(80)
            wondercam.UpdateResult()
            if (cubeDetecte()) { stopInterne(); return }
        }
        stopInterne()
    }

    //% group="Actions IA"
    //% blockId=aihanter_go_to_cube
    //% block="aller vers le cube ID"
    export function allerVersCube(): void {
        while (true) {
            wondercam.UpdateResult()
            if (!cubeDetecte()) break

            let x = wondercam.XOfColorId(wondercam.Options.Pos_X, idCouleur)
            let y = wondercam.YOfColorId(wondercam.Options.Pos_Y, idCouleur)

            if (x < xMin) correctionGauche(vPetit)
            else if (x > xMax) correctionDroite(vPetit)
            else if (y < yApproche) toutDroit(vCorrection)
            else { stopInterne(); break }

            basic.pause(40)
        }
        stopInterne()
    }

    // =========================================================
    // CYCLE COMPLET
    // IMPORTANT : idéalement appeler wondercam.UpdateResult() avant cycle()
    // =========================================================
    //% group="Cycle complet"
    //% blockId=aihanter_cycle
    //% block="cycle AI Hanter"
    export function cycle(): void {
        // On peut rafraîchir ici pour que l'élève n'oublie pas
        wondercam.UpdateResult()

        mettreAJourLigne()
        suivreLigne()

        if (!porteObjet && cubeDetecteFiable()) {
            recentrerCube()
            allerVersCube()
            attraperObjet()
            compteur = 0
        }

        if (porteObjet && arriveDestination()) {
            deposerObjet()
            demiTour(vCorrection)
        }
    }
}
