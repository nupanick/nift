function init(inherit) {
    return { _inherit: inherit || null };
}

function put(env, k, v) {
    env[k] = v;
}

function find(env, k) {
    if (env[k] != undefined) return env;
    if (env._inherit) return find(env._inherit, k);
    return null;
}

function get(env, k) {
    return find(env, k)[k];
}

module.exports = { init, put, find, get };
