const readline = require('readline');
const { isArray } = require('util');

function* tokenize(input) {
    /* skip whitespace, then match any of:
    * left or right brace: ( )
    * text literal: "a b\"c() d"
    * symbol with no internal whitespace: foo-bar */
    const re = /[\s,]*([()]|"(?:\\.|[^\\"])*"?|[^\s,()"]+)/y
    let match = re.exec(input);
    while(match) {
        yield match[1];
        match = re.exec(input);
    }
}

function tokensToForm(tokens) {
    const {value: t, done} = tokens.next();
    if (done) return null;

    // List
    if (t == '(') {
        const children = [];
        while (true) {
            const child = tokensToForm(tokens);
            if (child == ')') break;
            if (child == null) {
                // TODO: Error! Missing closing brace!
                break;
            }
            children.push(child);
        }
        return children;
    }
    if (t == ')') return t;

    // String
    if (t[0] == '"') {
        return t.slice(1, t.length-1);
    }

    // Number
    if (/[0-9]/.test(t[0])) {
        // HACK: Let JS handle it for now.
        return Number(t);
    }

    // Symbol
    return { symbol: t };
}

function formToString(form) {
    // List
    if (Array.isArray(form)) {
        return `(${form.map(formToString).join(' ')})`;
    }

    // String
    if (typeof form == 'string') {
        return `"${form}"`;
    }

    // Number
    if (typeof form == 'number') {
        return form.toString();
    }

    // Symbol
    if (form && form.symbol) {
        return form.symbol;
    }

    // Function
    if (form && form.function) {
        return `Function ${form.function.toString()}`;
    }

    throw Error(`Unknown form: ${form}`);
}

const environment = {
    '+': { function: (a, b) => a + b },
    '-': { function: (a, b) => a - b },
    '*': { function: (a, b) => a * b },
    '/': { function: (a, b) => (a / b) | 0 },
    'infix': { macro: (a, op, b) => [op, a, b] },
}

function read(input) {
    const tokens = tokenize(input);
    const form = tokensToForm(tokens);
    return form;
}

function evaluate(form, context) {
    // Primitives
    if (typeof form == 'number') return form;
    if (typeof form == 'string') return form;

    // Symbol
    if (form && form.symbol) {
        return context[form.symbol];
    }

    // List
    if (Array.isArray(form)) {
        if (form.length == 0) return form;
        const head = evaluate(form[0], context);
        // Function Call
        if (head.function) {
            const args = form.slice(1).map(f => evaluate(f, context));
            return head.function(...args);
        }
        // Macro Expansion
        if (head.macro) {
            const tail = form.slice(1);
            return evaluate(head.macro(...tail), context);
        }
        throw new Error(`${head} is not callable!`);
    }

    throw new Error(`Unknown form ${form}.`);
}

function print(form) {
    return formToString(form);
}

function rep(request) {
    const form = read(request);
    const result = evaluate(form, environment);
    const reply = print(result);
    return reply;
}

async function main (in_stream, out_stream) {
    const rl = readline.createInterface({
        input: in_stream,
        output: out_stream,
        prompt: 'nift> ',
    });

    rl.on('line', line => {
        line = line.trim();
        if (line) {
            const answer = rep(line);
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
