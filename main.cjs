const emu = require('./script.cjs');
const fs = require('fs')

const args = process.argv

let program;

if (args.length !== 3) {
    console.error('Usage: rtfm!', args);
    process.exit(-1);
}
else {
    program = fs.readFileSync(args[2], {encoding: "utf-8"});
    //console.log(program)
}

const DLX = emu.DLX

DLX.Registers[1] = 13
// console.log('Setup complete')

let ret = DLX.Run(program.toUpperCase().split('\n'))

if (ret === DLX.returnCodes.SUCCESS) {
    console.log('Ihr Programm konnte ausgeführt werden.')
    console.log(JSON.stringify(DLX.Memory))
    console.log(DLX.readAddress('#1000'))

    console.log(JSON.stringify(DLX.Registers))

    process.exit(0)
} else if (ret === DLX.returnCodes.WARNING) {
    console.log('Es sind Warnungen aufgetreten. Bitte beheben Sie diese!')
    process.exit(ret)
} else {
    console.log('Es sind Fehler aufgetreten. Bitte beheben Sie diese!')
    process.exit(ret)
}

