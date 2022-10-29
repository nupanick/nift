const readline = require('readline');

const { put } = require('./environment');
const evaluate = require('./eval');
const math = require('./math');
const print = require('./print');
const read = require('./read');

function rep(source, context) {
    const form = read(source);
    const result = evaluate(form, context);
    return print(result);
}

async function main (in_stream, out_stream) {
    const replEnv = { };
    put(replEnv, '+', math.add);
    put(replEnv, '-', math.sub);
    put(replEnv, '*', math.mul);
    put(replEnv, '/', math.div);

    const rl = readline.createInterface({
        input: in_stream,
        output: out_stream,
        prompt: 'nift> ',
    });

    rl.on('line', line => {
        line = line.trim();
        if (line.length) {
            const answer = rep(line, replEnv);
            out_stream.write(`${answer}\n`);
        }
        rl.prompt();
    });

    rl.prompt();

    await new Promise(r => rl.once('close', r));
}

if (require.main == module) {
    main(process.stdin, process.stdout);
}

module.exports = main;
