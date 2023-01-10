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

let stdin = fs.readFileSync(fs.openSync('/dev/stdin', 'rs'), {encoding: "utf-8"});

let options = JSON.parse(stdin)

const DLX = emu.DLX

let reg, addr, value

if (options['registers']) {
    for ([reg, value] of options['registers']) {
        DLX.writeRegister(reg, value)
    }
}
if (options['memory']) {
    for ([addr, value] of options['memory']) {
        DLX.writeAddress(addr, value)
    }
}

let ret = DLX.Run(program.toUpperCase().split('\n'))

if (ret === DLX.returnCodes.SUCCESS) {
    console.log('Ihr Programm konnte ausgeführt werden.')
    // console.log(JSON.stringify(DLX.Memory))
    // console.log(DLX.readAddress('#1000'))

    // console.log(JSON.stringify(DLX.Registers))
    if (options['dump']){
        let out = {};
        if (options['dump'].includes('registers')){
            //console.log(options['dump'], 'includes registers')
            out.registers = DLX.Registers;
        }
        if (options['dump'].includes('memory')){
            //console.log(options['dump'], 'includes memory')
            out.memory = DLX.Memory;
        }

        console.log('<-abc-xyz-123->')
        console.log(JSON.stringify(out))
    }

    process.exit(0)
} else if (ret === DLX.returnCodes.WARNING) {
    console.log('Es sind Warnungen aufgetreten. Bitte beheben Sie diese!')
    process.exit(ret)
} else {
    console.log('Es sind Fehler aufgetreten. Bitte beheben Sie diese!')
    process.exit(ret)
}

