//% color=#00bcd4 icon="\uf1b9" block="AI Hanter 
//% groups='["Initialisation","Reglages","Capteurs ligne","Mouvements","Suivi de ligne","Manipulation","Macros (sans camera)","Cycle"]'
namespace aihandler {

    // =========================================================
    // CAPTEURS LIGNE (4 capteurs)
    // =========================================================
    let capteur1 = false
    let capteur2 = false
    let capteur3 = false
    let capteur4 = false

    // =========================================================
    // VITESSES (par defaut)
    // =========================================================
    let vToutDroit = 55
    let vCorrection = 44
    let vPetit = 33

    // =========================================================
    // SERVOS (bras / pince)
    // =========================================================
    let servoBras = 5
    let servoPince = 6

    // Etat interne (sans camera)
    let porteObjet = false

    // Angles (a adapter selon montage)
    let brasHaut = -60
    let brasBas = -5
    let pinceOuverte = 15
    let pinceFermee = -25

    // =========================================================
    // OUTILS MOTEURS (internes)
    // =========================================================
    function arreterInterne(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    function avancerInterne(v: number): void {
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

    function rotationSurPlaceDroiteInterne(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
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
        positionDepartBras()
        arreterInterne()
    }

    //% group="Reglages"
    //% blockId=aihanter_regler_vitesses
    //% block="regler vitesses suivi tout droit %vd correction %vc petit %vp"
    //% vd.defl=55 vc.defl=44 vp.defl=33
    export function reglerVitessesSuivi(vd: number = 55, vc: number = 44, vp: number = 33): void {
        vToutDroit = vd
        vCorrection = vc
        vPetit = vp
    }

    //% group="Reglages"
    //% blockId=aihanter_regler_angles
    //% block="regler angles bras haut %bh bras bas %bb pince ouverte %po pince fermee %pf"
    //% bh.defl=-60 bb.defl=-5 po.defl=15 pf.defl=-25
    export function reglerAnglesBras(bh: number = -60, bb: number = -5, po: number = 15, pf: number = -25): void {
        brasHaut = bh
        brasBas = bb
        pinceOuverte = po
        pinceFermee = pf
    }

    // =========================================================
    // CAPTEURS LIGNE
    // =========================================================
    //% group="Capteurs ligne"
    //% blockId=aihanter_mettre_a_jour_ligne
    //% block="mettre a jour les capteurs de ligne"
    export function mettreAJourLigne(): void {
        capteur1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        capteur2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        capteur3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        capteur4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    //% group="Capteurs ligne"
    //% blockId=aihanter_arrive_destination
    //% block="arrive a la destination"
    export function arriveDestination(): boolean {
        return (capteur1 && capteur2 && capteur3 && capteur4)
    }

    // =========================================================
    // MOUVEMENTS
    // =========================================================
    //% group="Mouvements"
    //% blockId=aihanter_arreter
    //% block="arreter le robot"
    export function arreter(): void {
        arreterInterne()
    }

    //% group="Mouvements"
    //% blockId=aihanter_avancer
    //% block="avancer vitesse %v"
    //% v.defl=55
    export function avancer(v: number = 55): void {
        avancerInterne(v)
    }

    //% group="Mouvements"
    //% blockId=aihanter_reculer
    //% block="reculer vitesse %v"
    //% v.defl=55
    export function reculer(v: number = 55): void {
        reculerInterne(v)
    }

    // =========================================================
    // SUIVI DE LIGNE (IDENTIQUE AU CODE QUI MARCHE)
    // =========================================================
    //% group="Suivi de ligne"
    //% blockId=aihanter_suivre_ligne
    //% block="suivre la ligne (mode competition)"
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

    //% group="Suivi de ligne"
    //% blockId=aihanter_demi_tour
    //% block="faire demi tour vitesse %v"
    //% v.defl=44
    export function demiTour(v: number = 44): void {
        rotationSurPlaceDroiteInterne(v)
        basic.pause(500)

        mettreAJourLigne()
        while (capteur1 || capteur2 || !(capteur3 && capteur4)) {
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
            mettreAJourLigne()
        }
        arreterInterne()
    }

    // =========================================================
    // MANIPULATION
    // =========================================================
    //% group="Manipulation"
    //% blockId=aihanter_position_depart_bras
    //% block="position de depart du bras"
    export function positionDepartBras(): void {
        dadabit.setLego270Servo(servoBras, brasHaut, 300)
        dadabit.setLego270Servo(servoPince, pinceOuverte, 300)
        basic.pause(300)
        porteObjet = false
    }

    //% group="Manipulation"
    //% blockId=aihanter_attraper_objet
    //% block="attraper l objet"
    export function attraperObjet(): void {
        arreterInterne()
        basic.pause(200)

        dadabit.setLego270Servo(servoBras, brasBas, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoPince, pinceFermee, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoBras, brasHaut, 500)
        basic.pause(400)

        porteObjet = true
    }

    //% group="Manipulation"
    //% blockId=aihanter_deposer_objet
    //% block="deposer l objet"
    export function deposerObjet(): void {
        arreterInterne()
        basic.pause(200)

        dadabit.setLego270Servo(servoBras, brasBas, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoPince, pinceOuverte, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoBras, brasHaut, 500)
        basic.pause(400)

        porteObjet = false
    }

    //% group="Manipulation"
    //% blockId=aihanter_porte_objet
    //% block="porte un objet"
    export function porteUnObjet(): boolean {
        return porteObjet
    }

    // =========================================================
    // MACROS (SANS CAMERA) - pour simplifier le code eleve
    // =========================================================

    //% group="Macros (sans camera)"
    //% blockId=aihanter_marquer_objet_porte
    //% block="definir porte objet %etat"
    export function definirPorteObjet(etat: boolean): void {
        porteObjet = etat
    }

    //% group="Macros (sans camera)"
    //% blockId=aihanter_objet_est_porte
    //% block="objet est porte"
    export function objetEstPorte(): boolean {
        return porteObjet
    }

    //% group="Macros (sans camera)"
    //% blockId=aihanter_bip_validation
    //% block="bip validation"
    export function bipValidation(): void {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    }

    //% group="Macros (sans camera)"
    //% blockId=aihanter_gerer_destination_sans_camera
    //% block="si destination alors deposer puis demi tour vitesse %v"
    //% v.defl=44
    export function gererDestinationSansCamera(v: number = 44): void {
        if (arriveDestination()) {
            if (porteObjet) {
                deposerObjet()
            }
            demiTour(v)
        }
    }

    // =========================================================
    // CYCLE (sans camera)
    // =========================================================
    //% group="Cycle"
    //% blockId=aihanter_cycle_sans_camera
    //% block="cycle suiveur de ligne sans camera"
    export function cycleSansCamera(): void {
        mettreAJourLigne()
        suivreLigne()
        if (porteObjet && arriveDestination()) {
            deposerObjet()
            demiTour(vCorrection)
        }
    }
}
