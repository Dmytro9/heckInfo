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

var userdate = new Date(),
    usertimzoneoffset = userdate.getTimezoneOffset() / 60;

$(document).ready(function () {

    var $hash = window.location.hash.substring(1);

    createCookie('usertimzoneoffset', usertimzoneoffset, 7);

    $("#paydiv a").click(function () {
        $(this).replaceWith("<span class='disabledbutton btn btn-default'>" + "Wait..." + "</span>");
    });

    $(".sdetails").addClass("active");

    if ($hash == 'messages') {
        $(".ofiles").hide();
        $(".odetails").hide();
        $(".omessages").show();
        $(".sdetails").removeClass("active");
        $(".smessages").addClass("active");
    }
    if ($hash == 'files') {
        $(".ofiles").show();
        $(".odetails").hide();
        $(".omessages").hide();
        $(".sdetails").removeClass("active");
        $(".sfiles").addClass("active");
    }
    $(".sfiles").click(function () {
        $(".ofiles").show();
        $(".odetails").hide();
        $(".omessages").hide();
        $(".status").html("");
        $(".sfiles").addClass("active");
        $(".smessages").removeClass("active");
        $(".sdetails").removeClass("active");
    });
    $(".smessages").click(function () {
        $(".ofiles").hide();
        $(".odetails").hide();
        $(".omessages").show();
        $(".status").html("");
        $(".smessages").addClass("active");
        $(".sfiles").removeClass("active");
        $(".sdetails").removeClass("active");
    });

    $(".sdetails").click(function () {
        $(".ofiles").hide();
        $(".odetails").show();
        $(".omessages").hide();
        $(".status").html("");
        $(".sdetails").addClass("active");
        $(".smessages").removeClass("active");
        $(".sfiles").removeClass("active");
    });

    $(".nmsubmit").click(function () {
        submitnewmessage()
    });
    $(".nfsubmit").click(function () {
        submitnewfile()
    });
});

function submitnewmessage() {
    var newmes = $("#nmta").val();
    $(".status").html("");
    if (newmes != "") $("#newmsg").submit();
    else $(".status").html("<div class='error'>Please type your message in the field below.</div>");
}

function submitnewfile() {
    var file = $("#nf").val();
    $(".status").html("");
    if (file != "") $("#new_file").submit();
    else $(".status").html("<div class='error'>Please click Browse, select the file you would like to send, and click Open. Then hit the Upload button.</div>");
}

function shownff() {
    $(".onewfile").show();
    $("a.snewfile").attr("onclick", "hidenff()");
    $("a.snewfile").html("Discard")
}

function hidenff() {
    $(".onewfile").hide();
    $("a.snewfile").attr("onclick", "shownff()");
    $("a.snewfile").html("Upload file");
    $(".status").html("")
}

function shownmf(s) {
    if (s != 0) $("#msg_to [value=" + s + "]").attr("selected", "selected");
    $(".onewmessage").show();
    $("a.snewmessage").attr("onclick", "hidenmf()");
    $("a.snewmessage").html("Discard")
}

function hidenmf() {
    $(".onewmessage").hide();
    $("a.snewmessage").attr("onclick", "shownmf()");
    $("a.snewmessage").html("New message");
    $("#nmta").val("");
    $(".status").html("");
}

function hideMsg(id) {
    $(".mesfull" + id).each(function () {
        $(this).hide();
        $("a." + id).attr("onclick", "showMsg(" + id + ")");
        $("a." + id).html("Open")
    });
}

function showMsg(id) {
    $(".mesfull" + id).each(function () {
        $(this).show();
        $("a." + id).attr("onclick", "hideMsg(" + id + ")");
        $("a." + id).html("Close");
        $("#msg" + id).attr("class", "")
    });
}

function hideMsg(id) {
    $(".mesfull" + id).each(function () {
        $(this).hide();
        $("a." + id).attr("onclick", "showMsg(" + id + ")");
        $("a." + id).html("Open")
    });
}

function showHideDetails() {
    var vis = $("#details").css("display");
    if (vis == "none") {
        $("#details").show();
        $("#details-link").html("- Hide details");
    } else {
        $("#details").hide();
        $("#details-link").html("+ Show details");
    }
}
