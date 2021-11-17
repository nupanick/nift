import repl from 'repl';
import { fileURLToPath } from 'url';

const tests = {};

tests['it returns the input'] = () => {
    return true;
}

function main() {
    let test_count = 0;
    let failure_count = 0;
    Object.entries(tests).forEach(([name, test]) => {
        test_count += 1;
        const pass = test();
        if (pass) {        
            console.info('Passed: ' + name);
        } else {
            failure_count += 1;
            console.info('Failed: ' + name);
        }
    });
    console.log(test_count + ' tests run, ' + failure_count + ' failures.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}