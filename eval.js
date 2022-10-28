const { get, put } = require('./environment');

function evaluate(form, context) {
    if (form.type == 'number') return form;
    if (form.type == 'string') return form;
    
    if (form.type == 'symbol') return get(context, form.symbol);
    
    if (form.type == 'list') {
        if (form.list.length == 0) return form;
        const [head, ...tail] = form.list;

        if (head.type == 'symbol' && head.symbol == 'put!') {
            put(context, tail[0].symbol, evaluate(tail[1], context));
            return { type: 'nil' };
        }

        if (head.type == 'symbol' && head.symbol == 'let') {
            // TODO: Ensure odd number of arguments to let!
            const newContext = { _inherit: context };
            for (let i = 0; i < tail.length-1; i += 2) {
                put(newContext, tail[i].symbol, evaluate(tail[i+1], newContext))
            }
            return evaluate(tail[tail.length-1], newContext);
        }

        const call = evaluate(head, context);
        if (call.type == 'function') {
            return call.function(...tail.map(f => evaluate(f, context)));
        }
        if (call.type == 'macro') {
            return evaluate(call.macro(...tail), context);
        }
        throw new Error(`${call.type} is not callable!`);
    }

    throw new Error(`Unknown form ${form}.`);
}

module.exports = evaluate;
