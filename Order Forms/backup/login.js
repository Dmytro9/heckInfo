function createCookie(name, value, days) {
    var expires = "";

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

$(function () {
    var loginForm = $("#loginform"),
        emailLoginForm = $("#eloginform"),
        resetForm = $("#resetform"),
        profileForm = $('#profileform'),
        passwordForm = $('#passwordform'),
        email = readCookie('emailcookie');

    if (email) {
        $("#login").val(email);
    }

    resetForm.validate({
        submitHandler: function (form) {
            return false;
        },
       /* errorContainer: $("div.form-error"),
        errorLabelContainer: $("ol", $("div.form-error")),
        wrapper: 'li',*/
        errorClass: 'validation-error',
        rules: {
            login: {
                required: true,
                maxlength: 150,
                email:true
            }
        },
        messages: {
            login: {
                required: "Please enter your email",
                maxlength: "Login max length (150)"
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("id") == "rlogin") {
                error.insertAfter($("input[id=rlogin]")).addClass('error-lable');
            }
        }
    });

    emailLoginForm.validate({
        submitHandler: function (form) {
            return false;
        },
        errorContainer: $("div.form-error"),
        errorLabelContainer: $("ol", $("div.form-error")),
        wrapper: 'li',
        errorClass: 'validation-error',
        rules: {
            elogin: {
                required: true,
                maxlength: 150,
                email:true
            }
        },
        messages: {
            elogin: {
                required: "Please enter your email",
                maxlength: "Login max length (150)"
            }
        }
    });

    loginForm.validate({
        submitHandler: function (form) {
            return false;
        },
        /*errorContainer: $("div.form-error"),
        errorLabelContainer: $("ol", $("div.form-error")),
        wrapper: 'li',*/
        errorClass: 'validation-error',
        rules: {
            login: {
                required: true,
                maxlength: 150,
                email:true
            },
            password: {
                required: true,
                maxlength: 50
            }
        },
        messages: {
            login: {
                required: "Please enter your email",
                maxlength: 'Please enter no more than 150 characters for email field.'
            },
            password: {
                required: "Please enter your password",
                maxlength: 'Please enter no more than 50 characters for password field.'
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("id") == "login") {
                error.insertAfter($("input[id=login]")).addClass('error-lable');
            }
            if (element.attr("id") == "password") {
                error.insertAfter($("input[id=password]")).addClass('error-lable');
            }
        }
    });

    passwordForm.validate({
        submitHandler: function (form) {
            return false;
        },
        // errorContainer: $("div.form-error"),
        // errorLabelContainer: $("ol", $("div.form-error")),
        // wrapper: 'li',
        errorClass: 'validation-error',
        rules: {
            opwd: {
                required: true,
                maxlength: 50
            },
            npwd: {
                required: true,
                minlength:6,
                maxlength: 50
            },
            cpwd: {
                required: true,
                equalTo: "#npwd",
                maxlength: 50
            }
        },
        messages: {
            opwd: {
                required:'Field old password is required',
                maxlength: 'Please enter no more than 50 characters for old password field.'
            },
            npwd: {
                required:'Field new password is required',
                maxlength: 'Please enter no more than 50 characters for new password field.'
            },
            cpwd: {
                required:'Field confirm new password is required',
                equalTo:"Please enter password again.",
                maxlength: 'Please enter no more than 50 characters for confirm password field.'
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("id") == "opwd") {
                error.insertAfter($("#opwd")).addClass('error-label');
            }
            if (element.attr("id") == "npwd") {
                error.insertAfter($("#npwd")).addClass('error-label');
            }
            if (element.attr("id") == "cpwd") {
                error.insertAfter($("#cpwd")).addClass('error-label');
            }
        }
    });

    passwordForm.submit(function () {
        if (passwordForm.valid()) {
            $("#passwordform .status").html("<img src='/manage/images/load.gif'><b class='hidden theme_visible'><i class='fa fa-spin fa-refresh'></i></b>");

            var opwd = $("#opwd").val(),
                npwd = $("#npwd").val(),
                cpwd = $("#cpwd").val(),
                postData = {"opwd": opwd, "npwd": npwd, "cpwd": cpwd};

            $.post('/manage/ajaxfunc.php?f=updatepassword', postData, function (msg) {
                if (parseInt(msg.status) == 1) {
                    $("#passwordform .status").html(msg.txt);
                }
                if (parseInt(msg.status) == 0) {
                    $("#passwordform .status").html(msg.txt);
                }
            }, 'json');
        }
        return false;
    });

    profileForm.validate({
        // errorContainer: $("div.form-error"),
        // errorLabelContainer: $("ol", $("div.form-error")),
        // wrapper: 'li',
        errorClass: 'validation-error',
        rules: {
            name: {
                required: true,
                lettersonly: true,
                minlength: 2,
                maxlength: 50
            },
            phone: {
                required: true,
                phoneno:true,
                maxlength: 20
            }
        },
        messages: {
            name: {
                required: "Field name is required",
                lettersonly:'Field name incorrect. Valid characters A-Z, a-z, 0-9 and symbols: \' - _.'
            },
            phone: {
                required: "Field phone is required",
                maxlength: 'Please enter no more than 20 digits for phone field.'
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("id") == "name") {
                error.insertAfter($("#name")).addClass('error-lable');
            }
            if (element.attr("id") == "phone") {
                error.insertAfter($("#phone")).addClass('error-lable');
            }
        }
    });

    profileForm.submit(function () {
        if (profileForm.valid()) {
            // $("#profilebtn").html("<img src='/manage/images/load.gif'>");

            var name = $("#name").val(),
                phone = $("#phone").val(),
                postData = {
                    "name": name,
                    "phone": phone
                };

            $.post('/manage/ajaxfunc.php?f=updateprofile', postData, function (msg) {
                if (parseInt(msg.status) == 1) {
                    $("#profileform .status").html(msg.txt);
                }
                if (parseInt(msg.status) == 0) {
                    $("#profileform .status").html(msg.txt);
                }
            }, 'json');

        } else {
            console.info('Form validation failed');
        }

        return false;
    });

    $(loginForm).submit(function () {
        if (loginForm.valid()) {
            loging();
            return true;
        }
        console.info('Form validation failed');
        return false;
    });

    $("#login, #password").keydown(function (event) {
        if (event.keyCode == 13 && loginForm.valid()) {
            loging();
        }
    });

    $("#elogin").keydown(function (event) {
        if (event.keyCode == 13 && emailLoginForm.valid()) {
            emailloging();
        }
    });

    $("#eloginbtn").click(function() {
        if (emailLoginForm.valid()) {
            emailloging();
        }
    });

    $("#emailonly").click(function () {
        $("#elogindiv").show();
        $(".status").html("");
        $("#logindiv").hide();
        $("div.form-error").hide();
        $("div.form-error ol").html("");
    });

    function emailloging() {
        $(".loading").html("<i class='glyphicon glyphicon-refresh gly-spin'></i>");
        $(".status").html("");
        var email = $("#elogin").val(),
            postData = {
                "email": email
            };
        $.post('/manage/ajaxfunc.php?f=login_by_email', postData, function (j) {
            if (j.status == 1) {
                $(".loading").html("");
                $(".status").html(j.txt);
            }
            else {
                $(".loading").html("");
                $(".status").html(j.txt);
            }
        }, 'json');
    }

    function loging() {
        $(".loading").html("<i class='glyphicon glyphicon-refresh gly-spin'></i>");
        $(".status").html("");

        var email = $("#login").val(),
            pass = $("#password").val(),
            ref = $("#login-ref").val(),
            postData = {
                "email": email,
                "pass": pass
            };

        createCookie('emailcookie', email, 7);

        $.post('/manage/ajaxfunc.php?f=login', postData, function (j) {
            if (j.status == 1) {
                $(".loading").html("");
                window.location = ref;
                user_id = j.txt;
                $("#uid").val(user_id);
            }
            else {
                $(".loading").html("");
                $(".status").html(j.txt);
            }
        }, 'json');
    }

    $("#resetform #resetbtn").click(function () {
        if (resetForm.valid()) {
            $(".loading").html("<i class='glyphicon glyphicon-refresh gly-spin'></i>");
            $(".status").html("");

            var email = $("#rlogin").val();

            var data = {
                "email": email
            };

            $.post('/manage/ajaxfunc.php?f=resetpassword', data, function (msg) {
                if (parseInt(msg.status) == 1) {
                    $(".status").html(msg.txt);
                    $(".loading").html("");

                    window.setTimeout(function () {
                        $("#resetdiv").hide();
                        $(".status").html("");
                        $("#logindiv").show();
                        $("#login").val(email);
                    }, 1000);
                }
                if (parseInt(msg.status) == 0) {
                    $(".status").html(msg.txt);
                    $(".loading").html("");
                }
            }, 'json');
        }
    });


    $("#resetlink").click(function () {
        $("#resetdiv").show();
        $(".status").html("");
        $("#logindiv").hide();
        $("div.form-error").hide();
        $("div.form-error ol").html("");
    });
});
