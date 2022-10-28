const readline = require('readline');

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

    throw Error(`Unknown form: ${form}`);
}

const environment = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => (a / b) | 0,
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
    if (form.length == 0) return form;
    const [head, ...tail] = form.map(f => evaluate(f, context));
    return head(...tail);
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
