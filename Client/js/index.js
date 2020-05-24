if (!!localStorage.getItem("token")) {
}

$("#action-switch-btn").on("click", changeFormStyle);
$("#btn-submit").on("click", submitForm);

// set ketup listener for each input box to remove the invaild state
addKeyInputListener("name");
addKeyInputListener("email");
addKeyInputListener("password");
addKeyInputListener("password2");
$("home-section").hide();
$(".alert").hide();

function changeFormStyle(event) {
    event.preventDefault();
    const currentAction = $("#btn-submit").val();
    if (!!!currentAction) return;
    if (currentAction === "Register") {
        $("#btn-submit").val("Login");
        $("#input-username").hide();
        $("#input-userpassword2").hide();
        $("#form-title").html("Login");
    } else if (currentAction === "Login") {
        $("#btn-submit").val("Register");
        $("#input-username").show();
        $("#input-userpassword2").show();
        $("#form-title").html("Register");
    }
}

function submitForm(event) {
    event.preventDefault();
    const currentAction = $("#btn-submit").val();
    if (!!!currentAction) return;
    if (currentAction === "Register") {
        console.log("Click register btn");
        const u = {}; // user
        u.name = $("#input-username").val();
        u.email = $("#input-useremail").val();
        u.password = $("#input-userpassword").val();
        u.password2 = $("#input-userpassword2").val();
        validateRegister(u);
    } else if (currentAction === "Login") {
        console.log("Click login btn");
        const u = {}; // user
        u.email = $("#input-useremail").val();
        u.password = $("#input-userpassword").val();
        validteLogin(u);
    }
}

/**
 * Set the key input listener to each input box
 */
function addKeyInputListener(value) {
    $(`#input-user${value}`).on("keyup", function () {
        $(this).removeClass("is-invalid");
    });
}

/**
 * Validate the Login informaion
 */
function validteLogin(user) {
    if (checkEmailAndPassword(user)) {
        login(user);
    }
}

/**
 * Validate the register information
 */
function validateRegister(user) {
    if (!!!user.name) {
        $("#input-username").addClass("is-invalid");
    }
    if (!!!user.password2 || user.password2 != user.password) {
        $("#input-userpassword2").addClass("is-invalid");
    }
    if (checkEmailAndPassword(user) && !!user.name && !!user.password2) {
        register(user);
    }
    return;
}

/**
 * check email format and password is empty or not
 * @param {*} user
 */
function checkEmailAndPassword(user) {
    // check email is empty or invalid
    const e = (user) => {
        if (!!user.email && isEmail(user.email)) {
            return true;
        }
        $("#input-useremail").addClass("is-invalid");
        $("#input-useremail")
            .closest("div")
            .find(".invalid-feedback")
            .html("Email is invalid");
        return false;
    };

    // check password is emapy
    const p = (user) => {
        if (!!user.password) {
            return true;
        }
        $("#input-userpassword").addClass("is-invalid");
        return false;
    };

    const checks = [e, p];
    const isPass = (check) => check(user);
    return checks.every(isPass);
}

/**
 * Connect server to login
 * If login successful, it will get the token
 * @param {*} u User
 * @returns {*} token
 */
function login(u) {
    var req = $.ajax({
        method: "POST",
        url: config.SERVER_URL + "/user/login",
        data: u,
    });
    req.done(function (msg) {
        console.log(msg);
        localStorage.setItem("uid", msg.uid);
        localStorage.setItem("token", msg.token);
        window.location = config.BASE_URL + "/home.html";
    });
    req.fail(function (textStatus) {
        if (textStatus.status == 400) {
            $("#input-useremail").addClass("is-invalid");
        }
        if (textStatus.status == 401) {
            $("#input-useremail").addClass("is-invalid");
            $("#input-useremail")
                .closest("div")
                .find(".invalid-feedback")
                .html("");
            $("#input-userpassword").addClass("is-invalid");
            $("#input-userpassword")
                .closest("div")
                .find(".invalid-feedback")
                .html("Password/Email not correct");
        }
    });
}

function register(u) {
    var fd = new FormData();
    fd.append("email", u.email);
    fd.append("password", u.password);
    fd.append("name", u.name);
    var req = $.ajax({
        method: "POST",
        contentType: false,
        processData: false,
        url: config.SERVER_URL + "/user/register",
        data: fd,
    });

    req.done(function (msg) {
        console.log(msg);
        $(".alert").show();
    });
    req.fail(function (textStatus) {
        if (textStatus.status == 409) {
            $("#input-useremail").addClass("is-invalid");
            $("#input-useremail")
                .closest("div")
                .find(".invalid-feedback")
                .html("Email already exits");
        }
    });
}

function isEmail(email) {
    return (
        email.match(
            /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        ) != null
    );
}
