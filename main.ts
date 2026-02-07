//% color=#00bcd4 icon="\uf1b9" block="AI Hanter"
namespace aihandler {

    // ===============================
    // LINE SENSORS (4)
    // ===============================
    let s1 = false
    let s2 = false
    let s3 = false
    let s4 = false

    // ===============================
    // SPEEDS (defaults)
    // ===============================
    let vStraight = 55
    let vCorrect = 44
    let vSmall = 33

    // ===============================
    // ARM / GRIPPER
    // ===============================
    let servoArm = 5
    let servoGrip = 6
    let hasObj = false

    let armUp = -60
    let armDown = -5
    let gripOpen = 15
    let gripClose = -25

    // ===============================
    // INTERNAL MOTOR HELPERS
    // ===============================
    function motorsStop(): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, 0)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, 0)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, 0)
    }

    function forwardInternal(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    function backwardInternal(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    function correctLeftInternal(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v / 2)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v / 2)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v)
    }

    function correctRightInternal(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, v / 2)
        dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, v / 2)
    }

    function spinRightInternal(v: number): void {
        dadabit.setLego360Servo(1, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
        dadabit.setLego360Servo(3, dadabit.Oriention.Clockwise, v)
        dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
    }

    // ===============================
    // INIT
    // ===============================
    //% group="Init"
    //% blockId=aihanter_init
    //% block="aihanter init arm %arm grip %grip"
    //% arm.defl=5 grip.defl=6
    export function init(arm: number = 5, grip: number = 6): void {
        dadabit.dadabit_init()
        servoArm = arm
        servoGrip = grip
        hasObj = false

        // home
        dadabit.setLego270Servo(servoArm, armUp, 300)
        dadabit.setLego270Servo(servoGrip, gripOpen, 300)
        basic.pause(300)

        motorsStop()
    }

    //% group="Init"
    //% blockId=aihanter_set_speeds
    //% block="set follow speeds straight %s correct %c small %m"
    //% s.defl=55 c.defl=44 m.defl=33
    export function setFollowSpeeds(s: number = 55, c: number = 44, m: number = 33): void {
        vStraight = s
        vCorrect = c
        vSmall = m
    }

    // ===============================
    // 1) LINE FOLLOW BLOCKS
    // ===============================
    //% group="Line"
    //% blockId=aihanter_update_line
    //% block="update line"
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

    //% group="Follow"
    //% blockId=aihanter_follow_line
    //% block="follow line"
    export function followLine(): void {
        if (s2 && s3) {
            forwardInternal(vStraight)

        } else if (s1 && s2 && (!s3 && !s4)) {
            correctLeftInternal(vCorrect)

        } else if (s3 && s4 && (!s1 && !s2)) {
            correctRightInternal(vCorrect)

        } else if (s2 && (!s1 && !s3 && !s4)) {
            // small adjust to left
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vCorrect)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vCorrect)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vSmall)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vSmall)

        } else if (s3 && (!s1 && !s2 && !s4)) {
            // small adjust to right
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, vSmall)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, vSmall)
            dadabit.setLego360Servo(2, dadabit.Oriention.Clockwise, vCorrect)
            dadabit.setLego360Servo(4, dadabit.Oriention.Clockwise, vCorrect)

        } else if (s1 && (!s2 && !s3 && !s4)) {
            correctLeftInternal(vStraight)

        } else if (s4 && (!s1 && !s2 && !s3)) {
            correctRightInternal(vStraight)

        } else if (!s1 && !s2 && !s3 && !s4) {
            // lost -> move slow
            forwardInternal(vSmall)
        }
    }

    //% group="Follow"
    //% blockId=aihanter_u_turn
    //% block="u turn speed %v"
    //% v.defl=44
    export function uTurn(v: number = 44): void {
        spinRightInternal(v)
        basic.pause(500)

        updateLine()
        while (s1 || s2 || !(s3 && s4)) {
            // keep turning (reference style)
            dadabit.setLego360Servo(1, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(2, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(3, dadabit.Oriention.Counterclockwise, v)
            dadabit.setLego360Servo(4, dadabit.Oriention.Counterclockwise, v)
            updateLine()
        }
        motorsStop()
    }

    //% group="Follow"
    //% blockId=aihanter_cycle_no_cam
    //% block="cycle no camera"
    export function cycleNoCamera(): void {
        updateLine()
        followLine()

        if (hasObj && isDestination()) {
            drop()
            uTurn(vCorrect)
        }
    }

    // ===============================
    // 2) MOVE BLOCKS
    // ===============================
    //% group="Move"
    //% blockId=aihanter_stop
    //% block="stop"
    export function stop(): void {
        motorsStop()
    }

    //% group="Move"
    //% blockId=aihanter_forward
    //% block="forward speed %v"
    //% v.defl=55
    export function forward(v: number = 55): void {
        forwardInternal(v)
    }

    //% group="Move"
    //% blockId=aihanter_backward
    //% block="backward speed %v"
    //% v.defl=55
    export function backward(v: number = 55): void {
        backwardInternal(v)
    }

    //% group="Move"
    //% blockId=aihanter_left
    //% block="turn left speed %v"
    //% v.defl=44
    export function turnLeft(v: number = 44): void {
        correctLeftInternal(v)
    }

    //% group="Move"
    //% blockId=aihanter_right
    //% block="turn right speed %v"
    //% v.defl=44
    export function turnRight(v: number = 44): void {
        correctRightInternal(v)
    }

    // ===============================
    // 3) ARM / GRIPPER BLOCKS
    // ===============================
    //% group="Arm"
    //% blockId=aihanter_arm_home
    //% block="arm home"
    export function armHome(): void {
        dadabit.setLego270Servo(servoArm, armUp, 300)
        dadabit.setLego270Servo(servoGrip, gripOpen, 300)
        basic.pause(300)
        hasObj = false
    }

    //% group="Arm"
    //% blockId=aihanter_grab
    //% block="grab object"
    export function grab(): void {
        motorsStop()
        basic.pause(200)

        dadabit.setLego270Servo(servoArm, armDown, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoGrip, gripClose, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoArm, armUp, 500)
        basic.pause(400)

        hasObj = true
    }

    //% group="Arm"
    //% blockId=aihanter_drop
    //% block="drop object"
    export function drop(): void {
        motorsStop()
        basic.pause(200)

        dadabit.setLego270Servo(servoArm, armDown, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoGrip, gripOpen, 500)
        basic.pause(400)

        dadabit.setLego270Servo(servoArm, armUp, 500)
        basic.pause(400)

        hasObj = false
    }

    //% group="Arm"
    //% blockId=aihanter_has_object
    //% block="has object"
    export function hasObject(): boolean {
        return hasObj
    }
}
