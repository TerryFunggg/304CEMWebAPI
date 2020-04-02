exports.validateLogin = async (ctx, next) => {
  const data = ctx.request.body;
  if (!data.email || !data.password) {
    ctx.throw(400, "Email or password not found");
  }
  if (
    !data.email.match(
      /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
    )
  ) {
    ctx.throw(400, "Email is not vaild");
  }

  await next();
};

exports.validateAuth = async (ctx, next) => {
  const { email, password, name, userType } = ctx.request.body;
  if (!email || !password) ctx.throw(400, "Email or password not found");
  if (
    !email.match(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
  ) {
    ctx.throw(400, "Email is not validated");
  }
  if (password.length > 20 || password.length < 6) {
    ctx.throw(400, "Password length not accpeted");
  }
  if (name.length < 3 || name.length > 20) {
    ctx.throw(400, "User Name length not accpected");
  }
  if (userType) {
    if (userType !== 0 || userType !== 1) {
      ctx.throw(400, "userType is not validated");
    }
  }

  await next();
};
