function* tokenizer(source) {
    /* skip whitespace, then match any of:
    * left or right brace: ( )
    * text literal: "a b\"c() d"
    * symbol with no internal whitespace: foo-bar */
    const re = /[\s,]*([()]|"(?:\\.|[^\\"])*"?|[^\s,()"]+)/y
    let match = re.exec(source);
    while(match) {
        yield match[1];
        match = re.exec(source);
    }
}

function nextForm(tokens) {
    const {value: t, done} = tokens.next();
    if (done) return null;

    // List
    if (t == '(') {
        const children = [];
        while (true) {
            const child = nextForm(tokens);
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

function read(source) {
    const tokens = tokenizer(source);
    return nextForm(tokens);
}

module.exports = read;
