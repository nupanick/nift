function evaluate(form, context) {
    if (form.type == 'number') return form;
    if (form.type == 'string') return form;
    
    if (form.type == 'symbol') return context[form.symbol];
    
    if (form.type == 'list') {
        if (form.list.length == 0) return form;
        const head = evaluate(form.list[0], context);
        const tail = form.list.slice(1);

        if (head.type == 'function') {
            return head.function(...tail.map(f => evaluate(f, context)));
        }

        if (head.type == 'macro') {
            return evaluate(head.macro(...tail), context);
        }

        throw new Error(`${head.type} is not callable!`);
    }

    throw new Error(`Unknown form ${form}.`);
}

module.exports = evaluate;
