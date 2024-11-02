const readline = require('readline');

const env = require('./env');
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
    const context = env.init();
    env.put(context, '+', math.add);
    env.put(context, '-', math.sub);
    env.put(context, '*', math.mul);
    env.put(context, '/', math.div);

    const rl = readline.createInterface({
        input: in_stream,
        output: out_stream,
        prompt: 'nift> ',
    });

    rl.on('line', line => {
        line = line.trim();
        if (line.length) {
            const answer = rep(line, context);
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
