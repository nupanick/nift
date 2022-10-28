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

    // TODO: String

    // TODO: Number

    // Symbol
    return t;
}

function formToString(form) {
    // List
    if (Array.isArray(form)) {
        return `(${form.map(formToString).join(' ')})`;
    }

    // TODO: String

    // TODO: Number

    // Symbol
    return form;
}

function read(input) {
    const tokens = tokenize(input);
    const form = tokensToForm(tokens);
    return form;
}

function evaluate(form) {
    return form;
}

function print(form) {
    return formToString(form);
}

function rep(request) {
    const form = read(request);
    const result = evaluate(form);
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
        const answer = rep(line);
        out_stream.write(`${answer}\n`);
        rl.prompt();
    });

    rl.prompt();

    await new Promise(r => rl.once('close', r));
}

if (require.main === module) {
    main(process.stdin, process.stdout);
}

module.exports = main;
