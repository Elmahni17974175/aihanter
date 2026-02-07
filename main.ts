//% color=#00bcd4 icon="\uf1b9" block="AI Hanter"
//% groups='["Init","Ligne","Suivi","Manip","Cycle"]'
namespace aihandler {

    let s1 = false
    let s2 = false
    let s3 = false
    let s4 = false

    let servoBras = 5
    let servoPince = 6

    function stop(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    function forward(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    //% group="Init"
    //% blockId=aihanter_init
    //% block="initialiser AI Hanter bras %bras pince %pince"
    export function initialiser(bras: number = 5, pince: number = 6): void {
        dadabit.dadabit_init()
        servoBras = bras
        servoPince = pince
        // position simple
        dadabit.setLego270Servo(servoBras, -60, 300)
        dadabit.setLego270Servo(servoPince, 15, 300)
        stop()
    }

    //% group="Ligne"
    //% blockId=aihanter_update_line
    //% block="mettre a jour ligne"
    export function mettreAJourLigne(): void {
        s1 = dadabit.line_followers(dadabit.LineFollowerSensors.S1, dadabit.LineColor.Black)
        s2 = dadabit.line_followers(dadabit.LineFollowerSensors.S2, dadabit.LineColor.Black)
        s3 = dadabit.line_followers(dadabit.LineFollowerSensors.S3, dadabit.LineColor.Black)
        s4 = dadabit.line_followers(dadabit.LineFollowerSensors.S4, dadabit.LineColor.Black)
    }

    //% group="Suivi"
    //% blockId=aihanter_follow
    //% block="suivre ligne simple"
    export function suivreLigneSimple(): void {
        // très simple: avance si S2/S3 sinon avance lente
        if (s2 && s3) forward(55)
        else forward(33)
    }

    //% group="Cycle"
    //% blockId=aihanter_cycle
    //% block="cycle base"
    export function cycle(): void {
        mettreAJourLigne()
        suivreLigneSimple()
    }
}
