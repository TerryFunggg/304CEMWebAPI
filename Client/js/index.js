$("#post-image-submit").on("click", submitPostForm);
$("#action-switch-btn").on("click", changeFormStyle);
$("#btn-submit").on("click", submitForm);

// set ketup listener for each input box to remove the invaild state
addKeyInputListener("name");
addKeyInputListener("email");
addKeyInputListener("password");
addKeyInputListener("password2");

$("#post-img-btn").hide();

//fragment hidden
$("#discover-fragment").hide();

if (!!!localStorage.getItem("token")) {
    $("#home-section").hide();
    $(".alert").hide();
} else {
    initHomeSection();
}

// change form to register or login UI
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
        initHomeSection();
    });
    req.fail(function (textStatus) {
        // if email is invalid
        if (textStatus.status == 400) {
            $("#input-useremail").addClass("is-invalid");
        }
        // if email or password not correct
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

function initHomeSection() {
    $("#login-section").hide();
    $("#home-section").show();
    $("#post-img-btn").show();
    // insert home=card-list fragment
    $("#fragment").html($("#home-posts-fragment").html());

    // Get user info
    var req = $.get(config.SERVER_URL + "/user/" + localStorage.getItem("uid"));
    // Get following and followers number
    req.done(function (msg) {
        console.log(msg);
        $("#home-sidebar-avatar").attr("src", msg.avatar);
        $("#home-sidebar-username").html(msg.name);
        $("#home-sidebar-following-num").html(msg.following.length);
        $("#home-sidebar-followers-num").html(msg.followers.length);
    });
    req.fail(function (textStatus) {
        console.log(textStatus.status);
    });

    // Get User Posts number
    var req1 = $.get(
        config.SERVER_URL + "/api/posts/user/" + localStorage.getItem("uid")
    );
    req1.done(function (msg) {
        console.log(msg);
        $("#home-sidebar-posts-num").html(msg.posts.length);
    });
    req1.fail(function (textStatus) {
        console.log(textStatus.status);
    });

    // Fetch post list by following
    var req2 = $.get(
        config.SERVER_URL + "/api/posts/" + localStorage.getItem("uid")
    );
    req2.done(function (msg) {
        const posts = msg.posts;
        console.log(posts);
        var h = "";
        posts.forEach((post) => {
            // fetch user info
            $.get(config.SERVER_URL + "/user/" + post.publisher).done(function (
                data
            ) {
                h += `<div class="card post-card mt-2">
                    <div class="crad-header">
                        <div class="row p-2">
                            <img class="card-publisher-avatar"
                                src="${data.avatar}" alt="" />
                            <h5 class="align-self-center card-title mt-2 ml-2">
                                ${data.name}
                            </h5>
                        </div>
                    </div>
                    <!-- Post image -->
                    <img class="card-img-top" src="${post.image}" alt="" />
                    <div class="card-body">
                        <div class="d-flex justify-content-center row-hl">`;

                // check the like
                const like_list = post.like;
                let l = "";

                if (!!like_list) {
                    for (let index = 0; index < like_list.length; index++) {
                        if (like_list[index] == localStorage.getItem("uid")) {
                            l = "like";
                        }
                        break;
                    }
                }
                h += `<div class="p-4 item-hl mr-2" id="like_box" onclick="setLike('${post._id}')">
                 <i class="far fa-heart fa-2x cust-icon ${l}" id="like-box-${post._id}"></i>
                </div>`;

                // comment box
                h += `<button class="btn p-4 item-hl ml-2" data-toggle="modal" data-target="#comment-modal" data-whatever="${post._id}"" >
                                <i class="far fa-comment fa-2x cust-icon"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
                // add to home container
                $("#home-post-list-container").html(h);
            });
        });
    });
}

function initDiscoverSection() {
    $("#fragment").html($("#discover-fragment").html());
}

function initProfileSection() {
    $("#fragment").html($("#profile-fragment").html());

    // Get user posts
    var req = $.get(
        config.SERVER_URL + "/api/posts/user/" + localStorage.getItem("uid")
    );
    // Get following and followers number
    req.done(function (msg) {
        console.log(msg);
        const posts = msg.posts;
        let html = "";
        posts.forEach((post) => {
            html += `<div class="card" data-toggle="modal" data-target="#image-detail-modal" data-whatever='${post._id}'>
           <img class="card-img-top img-fluid" src="${post.image}" alt="${post._id}">
       </div>`;
        });
        $("#profile-posts-container").html(html);
    });
    req.fail(function (textStatus) {
        console.log(textStatus.status);
    });
}

function submitPostForm(event) {
    event.preventDefault();
    const fd = new FormData();
    fd.append("post", $("#post-image-selector")[0].files[0]);
    fd.append("desc", $("#post-image-desc").val() || "");
    fd.append("publisher", localStorage.getItem("uid"));

    var req = $.ajax({
        method: "POST",
        contentType: false,
        processData: false,
        url: config.SERVER_URL + "/api/posts",
        data: fd,
    });

    req.done(function (msg) {
        console.log(msg);
        // redirect to home page
        window.location = config.BASE_URL;
    });
    req.fail(function (textStatus) {
        console.log(textStatus.status);
    });
}

function showHomeFragment() {
    $("#nav-home").addClass("active");
    $("#nav-discover").removeClass("active");
    $("#nav-profile").removeClass("active");

    initHomeSection();
}

function showDiscoverFragment() {
    $("#nav-discover").addClass("active");
    $("#nav-home").removeClass("active");
    $("#nav-profile").removeClass("active");

    initDiscoverSection();
}

function showProfileFragment() {
    $("#nav-profile").addClass("active");
    $("#nav-home").removeClass("active");
    $("#nav-discover").removeClass("active");

    initProfileSection();
}

function searchUserByKeyWords() {
    const v = $(".discover-search").val();
    $(".search-user-tbody").html("");
    var req = $.get(config.SERVER_URL + "/user?key=" + v);

    req.done(function (msg) {
        const users = msg.users;
        console.log(users);
        users.forEach((user) => {
            var html = `<tr>
        <th scope="row">
            <img src="${user.avatar}" alt="" style="height: 40px; width: 40px;">
        </th>
        <td>${user.name}</td>`;
            if (user._id == localStorage.getItem("uid")) {
                html += `</tr>`;
            } else {
                const followers = user.followers;
                console.log(followers);
                let s = "Follow";
                if (!!followers) {
                    for (let index = 0; index < followers.length; index++) {
                        if (followers[index] == localStorage.getItem("uid")) {
                            s = "Following";
                            break;
                        }
                    }
                }
                html += `<td><button class="btn btn-primary btn-fol" id="btn-fol-${user._id}" onclick="btn_followUser('${user._id}')">${s}</button></td>
                        </tr>`;
            }
            $(".search-user-tbody").append(html);
        });
    });

    req.fail(function (msg) {});
}

$("#btn-logout").on("click", function () {
    if (confirm("Do you want to logout?")) {
        localStorage.clear();
        window.location = config.BASE_URL;
    }
});

function btn_followUser(fid) {
    const btn_text = $(`#btn-fol-${fid}`).text();
    // if user want to unfollow
    if (btn_text == "Following") {
        var req = $.ajax({
            type: "DELETE",
            url:
                config.SERVER_URL +
                "/user/following/" +
                localStorage.getItem("uid"),
            data: { fid: fid },
        });
        req.done(function (data) {
            console.log(data);
            $(`#btn-fol-${fid}`).text("Follow");
            initHomeSection();
        });

        // if user want to follow
    } else if (btn_text == "Follow") {
        var req = $.ajax({
            type: "PUT",
            url:
                config.SERVER_URL +
                "/user/following/" +
                localStorage.getItem("uid"),
            data: { fid: fid },
        });
        req.done(function (data) {
            console.log(data);
            $(`#btn-fol-${fid}`).text("Following");
            initHomeSection();
        });
    }
    /*    if ($(this).val() == "Follow") {
        console.log("dsd");
    } else if ($(this).text() == "Following") {
        console.log("sdsd");
    } */
}

function setLike(pid) {
    // unlike the post
    if ($(`#like-box-${pid}`).hasClass("like")) {
        var req = $.ajax({
            type: "PUT",
            url:
                config.SERVER_URL +
                "/api/posts/like/" +
                localStorage.getItem("uid"),
            data: { pid: pid, isLike: "false" },
        });
        req.done(function (data) {
            $(`#like-box-${pid}`).removeClass("like");
        });
        //like the post
    } else {
        var req = $.ajax({
            type: "PUT",
            url:
                config.SERVER_URL +
                "/api/posts/like/" +
                localStorage.getItem("uid"),
            data: { pid: pid, isLike: true },
        });
        req.done(function (data) {
            $(`#like-box-${pid}`).addClass("like");
        });
    }
}

$("#image-detail-modal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var pid = button.data("whatever");
    var getPostDetail = $.get(config.SERVER_URL + "/api/post/" + pid).done(
        function (data) {
            console.log(data);
            // create Deatil
            let h = ` <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                        Detail
                    </h5>
                    <button type="button" class="close" " data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                     </button>
                </div>
                <div class="modal-body">
                    <form>
                        <img id="detail-image" class="w-100 h-100" src="${data.image}" alt="" />
                        <div class="form-group mt-3">
                            <input id="detail-image-desc" type="text" value="${data.desc}" placeholder="Description" class="form-control" />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" onclick="deleteImage('${data._id}')">
                        Delete
                    </button>
                    <button id="detail-image-submit" type="button" onclick="updateDesc('${data._id}')" class="btn btn-primary" >
                        Save changes
                    </button>
                </div>
            </div>
        </div>`;
            $("#image-detail-modal").html(h);
        }
    );
});

function deleteImage(pid) {
    var req = $.ajax({
        type: "DELETE",
        url: config.SERVER_URL + "/api/post/" + pid,
    });
    req.done(function (data) {
        console.log(data);
    });
}

function updateDesc(pid) {
    const c = $("#detail-image-desc").val();

    var req = $.ajax({
        type: "PUT",
        url: config.SERVER_URL + "/api/post/desc/" + pid,
        data: { desc: c },
    });
    req.done(function (data) {
        console.log(data);
    });
}

$("#comment-modal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var pid = button.data("whatever");
    var req = $.get(config.SERVER_URL + "/api/comments/post/" + pid);
    $("#comment-body").html("");

    // Get following and followers number
    req.done(function (msg) {
        let comments = msg.comments;
        comments.forEach((comment) => {
            // get publisher info
            $.get(config.SERVER_URL + "/user/" + comment.publisher).done(
                function (data) {
                    console.log(data);
                    var h = ""; // add the card list
                    h += `<div class="row mb-3">
                        <div class="col-sm-1 mr-2">
                            <div class="thumbnail">
                                <img class="img-responsive user-photo" style="height: 40; width: 40px;"
                                    src="${data.avatar}">
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <strong>${data.name}</strong>
                                </div>
                                <div class="panel-body">
                                    ${comment.comment}
                                </div><!-- /panel-body -->
                            </div><!-- /panel panel-default -->
                        </div><!-- /col-sm-5 -->
                    </div>`;
                    $("#comment-body").append(h);
                }
            );
        });
    });

    // set send button onclik
    var modal = $(this);
    var send_btn = modal.find("#comment-send-btn");
    send_btn.on("click", function () {
        var c = $("#comment-input-box").val();
        if (!!c) {
            // post comment to server
            $.post(config.SERVER_URL + "/api/comments/post/", {
                uid: localStorage.getItem("uid"),
                pid: pid,
                comment: c,
            }).done(function (msg) {
                console.log(msg);
                $(this).show();
            });
        }
    });
});

function isEmail(email) {
    return (
        email.match(
            /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        ) != null
    );
}
