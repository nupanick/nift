const { PassThrough } = require('stream');
const repl = require('./repl');

const tests = {};

tests['it returns the input'] = async () => {
    const stream_in = new PassThrough();
    const stream_out = new PassThrough();
    const done = repl(stream_in, stream_out);
    stream_in.push('"input 1"\n');
    stream_in.push('"input 2"\n');
    stream_in.end();
    await done;
    const lines = stream_out.read().toString().split('\n');
    if (lines[0] !== 'nift> "input 1"') return false;
    if (lines[1] !== 'nift> "input 2"') return false;
    return true;
}

tests['it removes whitespace'] = async () => {
    const stream_in = new PassThrough();
    const stream_out = new PassThrough();
    const done = repl(stream_in, stream_out);
    stream_in.push(',,, "1, 2, 3"   ');
    stream_in.end();
    await done;
    const lines = stream_out.read().toString().split('\n');
    if (lines[0] !== 'nift> "1, 2, 3"') return false;
    return true;
}

tests['it does arithmetic'] = async () => {
    const stream_in = new PassThrough();
    const stream_out = new PassThrough();
    stream_in.push('(+ 2 (* 3 5))');
    stream_in.end();
    await repl(stream_in, stream_out);
    const lines = stream_out.read().toString().split('\n');
    if (lines[0] !== 'nift> 17') return false;
    return true;
}

async function main() {
    let test_count = 0;
    let failure_count = 0;
    for (const [name, test] of Object.entries(tests)) {
        test_count += 1;
        const asyncTimer = setTimeout(() => {
            console.log(`Lomp Warning; "${name}" ran for more than 5 seconds.`);
        }, 5000);
        const pass = await test();
        clearTimeout(asyncTimer);
        if (pass) {        
            console.info('Passed: ' + name);
        } else {
            failure_count += 1;
            console.info('Failed: ' + name);
        }
    };
    if (failure_count) {
        console.log(test_count + ' tests run, ' + failure_count + ' failures.');
    } else {
        console.log(`${test_count} tests OK. Good effort, Lomp. 🐲`)
    }
}

if (require.main == module) {
    main();
}