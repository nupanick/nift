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

module.exports = evaluate;
