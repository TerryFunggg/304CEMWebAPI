const { isEmail } = require("../helpers/index");
const errors = require("../helpers/errors");

exports.validate = async (ctx, next) => {
    const data = ctx.request.body;
    const e = data => !!data.email && isEmail(data.email);
    const p = data => !!data.password;
    const checks = [e, p];
    if (data.name != undefined) {
        const n = data =>
            !!data.name && data.name.length > 3 && data.name.length <= 20;
        checks.push(n);
    }
    if (data.userType != undefined) {
        const u = data =>
            !!data.userType && (data.userType == 0 || data.userType == 1);
        checks.push(u);
    }
    const isPass = check => check(data);

    if (checks.every(isPass)) {
        await next();
    } else {
        errors.throws(new errors.ConfirmationError(), ctx);
    }
};
