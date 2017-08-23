var loadImg = "/manage/images/load.gif",
    before = "",
    current = "Elapsed",
    montharray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function boolToInt(val) {
    return val ? 1 : 0;
}

Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.dst = function () {
    return boolToInt(this.getTimezoneOffset() < this.stdTimezoneOffset());
};

$(document).ready(function () {
    // restoreForm();
    //tooltips
    $("[data-toggle=tooltip]").tooltip({
        placement: $(this).data("placement") || 'top'
    });

    $(".required-select").change(function () {
        $(this).children("#first").remove()
    });
    restoreForm();

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    var step = getUrlParameter('step');
    for (var i = 1; i <= step; i++) {
        $('.steps li[step="' + i + '"]').removeClass('complete');
        $('.steps li[step="' + i + '"]').addClass('complete');
        if (i == step) {
            $('.steps li[step="' + i + '"]').addClass('current-step');
        }
    }
});

function onPaperChange() {
    var pt = $("#typep").val();
    if (pt == 49 || pt == 90) {
        $("#pgs").hide();
        $("#ppt-sn").hide();
        $("#ppt").show();
        $("#spacingtoggle").attr('spacing', '2');
    } else if (pt == 48 || pt == 91) {
        $("#pgs").hide();
        $("#ppt").hide();
        $("#ppt-sn").show();
        $("#spacingtoggle").attr('spacing', '2');
    } else {
        $("#pgs").show();
        $("#ppt").hide();
        $("#ppt-sn").hide();
    }
}

function onSlidesSelect(s) {
    var num = $("#slides" + s).val();
    $("#pages").val(num);
    $("#spacingtoggle").attr('spacing', '2');
}

function getPapers() {
    var stype = $("#writing").val();
    $("#writing").children("#first").remove();
    $.post('/manage/ajaxfunc.php?f=get_paper_types', {
        "service": stype
    }, function (j) {
        $("#s_f_count_per_page").html('0.00');
        $("#s_f_count_page").html('0.00');
        $('#typep').html('<option id="first" selected value="">Click to select</option>' + j);
        $("#typep").attr('disabled', false);

        if (stype == 2) {
            $("#major").hide();
            $("#submajor").hide();
        } else {
            $("#major").show();
            $("#submajor").show();
        }
        $("#typep").change(function () {
            $(this).removeClass("required");
        });
    });
}

function get_submajors() {
    var major = $("#mj").val();
    $.post('/manage/ajaxfunc.php?f=get_submajors', {
        "major": major
    }, function (j) {
        var content = '<option id="first" selected value="">Click to select</option>' + j;
        $('#smj').html(content).attr('disabled', false);
        $("#smj").change(function () {
            $(this).removeClass("required");
        });
    });
}

function clearLocalStorage(selector) {
    localStorage.removeItem(selector);
}
function saveToLocalStorage(formSelector) {
    var form = $('.' + formSelector + ' input:not([name="order_id"]), ' + '.' + formSelector + ' select, ' + '.' + formSelector + ' textarea');
    localStorage.setItem(formSelector, form.serialize());
}

function restoreForm() {
    var form = $('#stepform');
    var selector = form.attr('class');

    var formData = localStorage.getItem(selector);

    if (formData == null) {
        return;
    }
    var obj = unserializeFormData(formData);
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            $(form).find("[name='" + k + "']").val(obj[k]);
        }
    }
}

function unserializeFormData(data) {
    var objs = [], temp;
    var temps = data.split('&');
    for (var i = 0; i < temps.length; i++) {
        temp = temps[i].split('=');
        temp[1] = decodeURIComponent(temp[1]);
        objs[temp[0]] = temp[1].replace(/\+/g, ' ');
    }
    return objs;
}


function get_levels() {
    var stype = $("#writing").val();
    if (stype == 2) {
        $("#level-label").html("Writing level *:");
        $("#mj").val(248);
        onMajorSelect();
    } else {
        $("#level-label").html("Academic level *");
        $("#writersradio").hide();
    }
    $.post('/manage/ajaxfunc.php?f=get_levels', {
        "service": stype
    }, function (j) {
        //$('#al').html("<img src='" + loadImg + "'>");
        $("#s_f_count_per_page").html('0.00');
        $("#s_f_count_page").html('0.00');

        var content = '';
        //content += '<select id="level" name="level" class="required-select form-control m-y-10" data-toggle="tooltip" data-trigger="hover" data-placement="top" title="Choose the writing level of your writer."><option id="first" selected value="">Click to select</option>';

        for (var i = 0; i < j.length; i++) {
            content += '<option value=' + j[i].id + '>' + j[i].name + '</option>';
        }

        $('#level').html(content).attr('disabled', false);

        $("#level").change(function () {
            $(this).removeClass("required");
        });
    }, 'json');
}

function onTimeSelect() {
    var tDate = new Date();
    var cDate = new Date();
    var stime = $('#time').val();
    var selDate = Date.parse($('#date').val());
    tDate.setTime(selDate);
    tDate.setHours(stime, 0, 0, 0);
    var timediff = Math.floor((tDate.getTime() - cDate.getTime()) / 3600000);
    if (timediff < 3) {
        $('#time option:selected').each(function () {
            this.selected = false;
        });
        $("#time [value=" + Number(cDate.getHours() + 3) + "]").attr("selected", "selected");
        timediff = 3;
        stime = Number(cDate.getHours() + 3);
    }
    if (tDate.getDate() == cDate.getDate()) {
        var chour = Number(cDate.getHours() + 3);
        // for (var h = 0; h < chour; h++) $("#time [value=" + h + "]").hide();
    } else {
        $("#time *").show();
    }
    var endhour = stime;
    var endday = tDate.getDate();
    var endmon = tDate.getMonth();
    var endyear = tDate.getFullYear();
    $('#tdiff').html(timediff + " hours");
    $('#timediff').val(timediff);
}

function getDeadline() {
    $.post('/manage/ajaxfunc.php?f=get_deadlines', {}, function (j) {
        var tdiff = $('#timediff').val();
        var deadline_id, deadline_name;
        if (tdiff <= j[0].hours) {
            deadline_id = j[0].id;
            deadline_name = j[0].name;
        } else {
            for (var i = 0; i < j.length - 1; i++) {
                if ((tdiff > j[i].hours) && (tdiff <= j[i + 1].hours)) {
                    deadline_id = j[i].id;
                    deadline_name = j[i].name;
                }
            }
            if (tdiff > j[j.length - 1].hours) {
                deadline_id = j[i].id;
                deadline_name = j[i].name;
            }
        }
        $('#dname').html(deadline_name);
        $('#deadline').val(deadline_id);
    }, 'json');
}

function check_coupon() {
    if ($("#coupon").val().length == 8) {
        $('#coupon_check_result').html("<img src='" + loadImg + "'>");

        $.post('/manage/ajaxfunc.php?f=check_coupon', {
            'code': $("#coupon").val(),
            'uid': $('#uid').val()
        }, function (j) {
            if (j.length != 0) {
                if (j.response == "success") {
                    $("#coupon_check_result").html("<img src='/manage/images/check.jpg'>");
                    $("#cdiscount").val(j.amount);
                    $("#savings").show();
                    $("#cerror").html('').hide();
                } else {
                    $("#coupon_check_result").html("<img src='/manage/images/alert.jpg'>");
                    $("#cdiscount").val(-1);
                    $("#savings").hide();
                    $("#cerror").html(j.message).show();
                }
            } else {
                $("#cdiscount").val(-1);
                $("#savings").hide();
                $("#cerror").html('This coupon code does not exist.').show();
            }
            getPrice();
        }, 'json');
    } else {
        $("#coupon_check_result").html("<img src='/manage/images/alert.jpg'>");
        $("#cdiscount").val(-1);
        $("#savings").hide();
        $("#cerror").html('This coupon code does not exist.').show();
        getPrice();
    }
}

function getPrice() {
    var coupon = $("#cdiscount").val();
    var total = $("#prc").val();
    if (coupon > 0) {
        ttl = total;
        total = total * (1 - coupon / 100);
        $("#disc-usd").html("$ " + Math.round((ttl - total) * 100) / 100);
        $("#disc").html(coupon + " %");
    } else $("#disc").html("");
    $("#total").html("$ " + Math.round(total * 100) / 100);
}

function get_client_discounts(user_id) {
    $.post('/manage/ajaxfunc.php?f=get_client_discounts', {
        "user_id": user_id
    }, function (j) {
        if (j.length != 0) {
            var max_amount = 0;
            var max_id = 0;
            var max_name;
            var content = "";
            for (var i = 0; i < j.length; i++) {
                if (j[i].amount > max_amount) {
                    max_amount = j[i].amount;
                    max_id = j[i].id;
                    max_name = j[i].name;
                }
            }
            $("#user_discount").html("You have " + max_name + " permanent discount.");
            $("#discount").val(max_amount);
            $("#savings").show();
        }
    }, 'json');
}

function showRegform() {
    $(".status").html("");
    $("#loginform").hide();
    $("#regform").show();
}

function countDown(yr, m, d, h) {
    theyear = yr;
    themonth = m;
    theday = d;
    thehour = h;
    var dd,
        today = new Date(),
        todayy = today.getYear();

    if (todayy < 1000) todayy += 1900;

    var todaym = today.getMonth(),
        todayd = today.getDate(),
        todayh = today.getHours(),
        todaymin = today.getMinutes(),
        todaysec = today.getSeconds(),
        todaystring = montharray[todaym] + " " + todayd + ", " + todayy + " " + todayh + ":" + todaymin + ":" + todaysec;

    futurestring = montharray[m - 1] + " " + d + ", " + yr + " " + h + ":00:00";
    var dd = Date.parse(futurestring) - Date.parse(todaystring);
    dday = Math.floor(dd / (60 * 60 * 1000 * 24) * 1);
    dhour = Math.floor((dd % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) * 1);
    dmin = Math.floor(((dd % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
    dsec = Math.floor((((dd % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);
    if (dday == 0 && dhour == 0 && dmin == 0 && dsec == 1) {
        document.getElementById("cd").innerHTML = current;
        return
    } else {
        if (dday > 0) dd = dday + " days, ";
        else dd = "";
        if (dsec < 10) dsec = "0" + dsec;
        if (dmin < 10) dmin = "0" + dmin;
        if (dhour < 10) dhour = "0" + dhour;
        document.getElementById("cd").innerHTML = "Your order will be delivered in <strong>" + dd + dhour + ":" + dmin + ":" + dsec + " " + before + "</strong> or less";
    }
    setTimeout("countDown(theyear,themonth,theday,thehour)", 1000);
}

function onSpacingChange() {
    var s = $("#pages").val();
    var content = '<option id="first">Click to select</option>';
    for (var i = 1; i <= 100; i++) {
        content += '<option value="' + i + '">' + i;
        if (i == 1) content += ' page (';
        else content += ' pages (';
        var words_per_page = 0;
        //  if($('[name="spacing"]:checked').val()==2)
        if ($('#spacingtoggle').attr("spacing") == 2) words_per_page = 300;
        else words_per_page = 600;
        content += i * words_per_page + ' words)</option>';
    }
    $('#pages').html(content);

    if (s != '') {
        $("#pages [value='" + s + "']").attr("selected", "selected");
    }
}
$(function () {
    var stype = $("#writing").val();
    if (stype == 2) {
        $("#level-label").html("Writing level *:");

    } else {
        $("#level-label").html("Academic level *");
        $("#writersradio").hide();
    }
    $(".modal-footer button").click(function () {
        $('#cw').prop('checked', true);
        $('#cw2').prop('checked', false);
    });
    $('#writerswrap').click(function (e) {
        var e = e || window.event;
        var target = e.target || e.srcElement;
        if (this == target) {
            $('#cw').prop('checked', true);
            $('#cw2').prop('checked', false);
        }
    });
    $(".close").click(function () {
        $('#writerswrap').modal('hide');
        $('#cw').prop('checked', true);
        $('#cw2').prop('checked', false);
    });
    $("#cw2").change(function () {
        onMajorSelect();
        $('#writerswrap').modal('show');
    });
    $("#cw").change(function () {
        $('#choosedw').html('Let me choose');
    });
});

function onMajorSelect() {
    var major = $("#mj").val();
    $("#writersradio").show();
    $('#writerswrap').modal('hide');
    $('#choosedw').html("Let me choose");
    $('#writer').val(0);
    $('#wr-percent').val(100);
    $('#cw').prop('checked', true);
    $('#cw2').prop('checked', false);
    $.post('/manage/ajaxfunc.php?f=get_writers', {
        "major": major
    }, function (j) {
        $("#writers").html(j);
        $('#writers > * a[href]').addClass('btn btn-primary'); //writersfix
        $('#writers > table').addClass('table table-striped layout display responsive-table responsive-table-writers'); //writersfix
        $(".writer-tr").each(function () {
            $(this).find("a.bigbutton").click(function () {
                $('#writerswrap').modal('hide');
                $('#choosedw').html($(this).parent().parent().find(".wname").html() + " (" + $(this).parent().parent().find(".wpercent").html() + ")");
                $('#writer').val($(this).parent().parent().find("#wid").val());
                $('#wr-percent').val($(this).parent().parent().find("#percent").val());
                $('#cw2').prop('checked', true);
                $('#cw').prop('checked', false);
            })
        });
    });
}
$(function () {
    var steptrack = 0;
    $('img#capimg').click(function () {
        $(this).attr('src', '/manage/inc/captcha.php?rnd=' + Math.random());
    });
    var dt = new Date();
    var tz = -dt.getTimezoneOffset() * 60;
    tz = tz - dt.dst() * 3600;
    $('#tz').val(tz);
    var phonecode = $("#phone").val();
    var shortPass = '<span style="color:#cb0e0e;padding: 0 12px;font-weight:bold;">Short</span>';
    var badPass = '<span style="color:#eb5e00;padding: 0 12px;font-weight:bold;">Simple</span>';
    var goodPass = '<span style="color:#448300;padding: 0 12px;font-weight:bold;">Good</span>';
    var strongPass = '<span style="color:#448300;padding: 0 12px;font-weight:bold;">Strong</span>';

    function passwordStrength(password, username) {
        score = 0;
        if (password.length < 4) return shortPass;
        if (password.toLowerCase() == username.toLowerCase()) return badPass;
        score += password.length * 4;
        score += (checkRepetition(1, password).length - password.length) * 1;
        score += (checkRepetition(2, password).length - password.length) * 1;
        score += (checkRepetition(3, password).length - password.length) * 1;
        score += (checkRepetition(4, password).length - password.length) * 1;
        if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) score += 5;
        if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) score += 5;
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) score += 10;
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) score += 15;
        if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)) score += 15;
        if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)) score += 15;
        if (password.match(/^\w+$/) || password.match(/^\d+$/)) score -= 10;
        if (score < 0) score = 0;
        if (score > 100) score = 100;
        if (score < 34) return badPass;
        if (score < 68) return goodPass;
        return strongPass
    }

    function checkRepetition(pLen, str) {
        var res = "";
        for (i = 0; i < str.length; i++) {
            repeated = true;
            for (j = 0; j < pLen && (j + i + pLen) < str.length; j++) repeated = repeated && (str.charAt(j + i) == str.charAt(j + i + pLen))
            if (j < pLen) repeated = false;
            if (repeated) {
                i += pLen - 1;
                repeated = false
            } else {
                res += str.charAt(i)
            }
        }
        return res
    }

    $('#pass').keyup(function () {
        $('#passtr').html(passwordStrength($('#pass').val(), $('#email').val()));
    });
    $('#spacingtoggle').click(function () {
        if ($(this).attr("spacing") == 1) {
            $(this).attr('src', '/manage/images/spacing1.jpg');
            $(this).attr('spacing', '2');
            $('.spacingname').text('Double');
            onSpacingChange();
        } else {
            $(this).attr('src', '/manage/images/spacing2.jpg');
            $(this).attr('spacing', '1');
            $('.spacingname').text('Single');
            onSpacingChange();
        }
    });
    var dateNow = new Date();
    var thedate;
    var cDate;
    var today = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 0, 0, 0, 0);
    $('#date').datepicker({
        startDate: today,
        maxViewMode: 1,
        todayBtn: true,
        forceParse: false
    }).on('changeDate', function (e) {
        $('#date').datepicker('hide');
    });
    $('#stepform').submit(function () {
        return false;
    });
    $("#captcha").keydown(function (event) {
        if (event.keyCode == 13) submitFirst();
    });

    $('#submit_first').click(function () {
        submitFirst();
    });

    function submitFirst() {
        var loadtimer = 1;
        var submit_link = $("#submit_first");
        $("#submit_first").prop('disabled', true);
        var name = $("#name").val();
        var email = $("#email").val();
        var phone = $("#phone").val();
        var pass = $("#pass").val();
        var pass2 = $("#pass2").val();
        var country = $("#country").val();
        var captcha = $("#g-recaptcha-response").val();
        var tz = $("#tz").val();
        var user_id;

        var form = $("form.sign-up"),
            error_container = $("form.sign-up div.form-error");

        if (form.valid()) {
            $(".loading").html("<i class='glyphicon glyphicon-refresh gly-spin'></i>");
            error_container.hide();
            $.post('/manage/ajaxfunc.php?f=register', {
                "name": name,
                "email": email,
                "phone": phone,
                "pass": pass,
                "pass2": pass2,
                "captcha": captcha,
                "country": country,
                "tz": tz
            }, function (j) {
                if (j.status == 1) {
                    $('#usermail').val(email);
                    $(".status").html("");
                    user_id = j.txt;
                    window.location = '/manage/order?step=2';
                } else {
                    $(".status").html(j.txt);
                    var loadtimer = 1;
                    $("#submit_first_disabled").replaceWith(submit_link);
                    $('#submit_first').click(function () {
                        submitFirst();
                    });
                    grecaptcha.reset();
                }
                $(".loading").html("");
                $("#uid").val(user_id);
            }, 'json');
        } else {
            if (!captcha.length) {
                //$("div.form-error ol").html($("div.form-error ol").html() + '<li><label id="message-error" class="validation-error" for="message" style="display: inline-block;">Incorrect reCaptcha</label></li>');
                //$("div.form-error ol").show();
                  $("div.form-error ol").html($("div.form-error ol").html() + '<label id="message-error" class="theme_error-captcha" for="message" style="display: block;">Incorrect reCaptcha</label>').insertAfter($('.g-recaptcha'));
            }
            //error_container.show();
            error_container.hide();
        }
    }

    $('#submit_second').click(function () {
        var oid = $('#order_id').val();
        var ptype = $("#typep").val();
        var wtype = $("#writing").val();
        var stype = $("#service").val();
        var psize = $("#psize").val();
        var spell = $("#spelling").val();
        var major = $("#mj").val();
        var submajor = $("#smj").val();
        var level = $("#level").val();
        var numpages = $("#pages").val();
        var writer = $("#writer").val();
        var spacing = $('#spacingtoggle').attr("spacing");
        var style = $("#cstyle").val();

        var postData = {
            "ptype": ptype,
            "wtype": wtype,
            "stype": stype,
            "spelling": spell,
            "psize": psize,
            "major": major,
            "submajor": submajor,
            "level": level,
            "numpages": numpages,
            "spacing": spacing,
            "style": style,
            "oid": oid,
            "writer": writer
        };
        var form = $("form.second_step");
        var error_container = $("div.form-error");
        if (form.valid()) {
            $(".loading").html("<i class='glyphicon glyphicon-refresh gly-spin'></i>");
            error_container.hide();
            $.post('/manage/ajaxfunc.php?f=step2_validation', postData, function (j) {
                if (j.status == 1) {
                    $(".status").html("");
                    clearLocalStorage('third_step');
                    window.location = '/manage/order/' + j.txt + '?step=3';
                } else {
                    $(".status").html(j.txt);
                }
                $(".loading").html("");

            }, 'json');
        } else {
            error_container.show();
        }

    });

    $('#submit_third').click(function () {
        var user_id = $('#uid').val();
        var title = $("#title").val();
        var details = $("#details").val();
        var sources = $("#srcs").val();
        var time = $("#time").val();
        var date = $("#date").val();
        var oid = $('#order_id').val();

        var form = $("form.third_step"),
            error_container = $("form.third_step div.form-error");

        if (form.valid()) {
            $(".loading").html("<i class='glyphicon glyphicon-refresh gly-spin'></i>");
            error_container.hide();
            $.post('/manage/ajaxfunc.php?f=step3_validation', {
                "time": time,
                "date": date,
                "title": title,
                "details": details,
                "sources": sources,
                "oid": oid
            }, function (j) {
                if (j.status == 1) {
                    $(".status").html("");
                    var fields = [$('#name').val(), $('#password').val(), $('#email').val(), $('#age').val(), $('#gender').val(), $('#country').val()];
                    var tr = $('#fourth_step tr');
                    $("#saccount").html($('#usermail').val());
                    $("#tos").html($("#service option[value=" + $("#service").val() + "]").html());
                    $("#tow").html($("#writing option[value=" + $("#writing").val() + "]").html());
                    $("#top").html($("#typep option[value=" + $("#typep").val() + "]").html());
                    var tDate = new Date();
                    var stime = $('#time').val();
                    var selDate = Date.parse($('#date').val());
                    tDate.setTime(selDate);
                    tDate.setHours(stime, 0, 0, 0);
                    var gmtHours = -tDate.getTimezoneOffset() / 60;
                    if (gmtHours >= 0) gmtHours = "+" + gmtHours;
                    var tz = "GMT " + gmtHours;
                    var dd = montharray[tDate.getMonth()] + " " + tDate.getDate() + ' ' + tDate.getHours() + ':00 ' + tz;
                    $("#nop").html($("#pages").val());
                    $("#nos").html($("#srcs").val());
                    $("#dd").html(dd);
                    clearLocalStorage('third_step');
                    window.location = "/manage/order/" + j.txt + "?step=4";
                } else {
                    $(".status").html(j.txt);
                    $(".loading").html("");
                }
            }, 'json');
        } else {
            error_container.show();
        }
    });

    $('#submit_fourth').click(function () {
        var oid = $('#order_id').val();
        var coupon = $("#coupon").val();
        var pm = $('[name="pmethod"]:checked').val();
        $.post('/manage/ajaxfunc.php?f=order_submit', {
            "coupon": coupon,
            "oid": oid,
            "pm": pm
        }, function (j) {
            if (j.status == 1) {
                $("#submit_fourth").replaceWith("<span class='btn btn-default pull-right'>" + "Wait please..." + "</span>");
                window.location = j.txt;
            } else {
                $(".status").html(j.txt);
            }
        }, 'json');
    });


    $('#submit_fifth').click(function () {
        var form = $("form.payform"),
            error_container = $("form.payform div.form-error");

        if (form.valid()) {
            // $("#payform").submit();
            error_container.hide();
            form.submit();
        } else {
            error_container.show();
        }
    });
});

function uplodifystart() {
    $("#submit_third").replaceWith("<span class='btn btn-default disabledbutton submit_third_disabled pull-right'>" + "Wait... Uploading" + "</span>");
    $("#edit3").replaceWith("<span class='btn btn-default disabledbutton edit3_disabled pull-right'>" + "Wait... Uploading" + "</span>");
}

function uplodifystop() {
    var oid = $('#order_id').val();
    $(".submit_third_disabled").replaceWith("<a href='#' class='bigbutton greenbtn btn btn-primary pull-right' id='submit_third'>" + "Next Step &raquo;" + "</a>");
    $(".edit3_disabled").replaceWith("<a class='btn btn-info bigbutton whitebtn' href='/manage/order/" + oid + "?step=2' id='edit3'>" + "&laquo; Edit" + "</a>");
    $('#submit_third').click(function () {

        var user_id = $('#uid').val();
        var title = $("#title").val();
        var details = $("#details").val();
        var sources = $("#srcs").val();
        var time = $("#time").val();
        var date = $("#date").val();
        var oid = $('#order_id').val();
        $.post('/manage/ajaxfunc.php?f=step3_validation', {
            "time": time,
            "date": date,
            "title": title,
            "details": details,
            "sources": sources,
            "oid": oid
        }, function (j) {
            if (j.status == 1) {
                $(".status").html("");
                var fields = [$('#name').val(), $('#password').val(), $('#email').val(), $('#age').val(), $('#gender').val(), $('#country').val()];
                var tr = $('#fourth_step tr');
                $("#saccount").html($('#usermail').val());
                $("#tos").html($("#service option[value=" + $("#service").val() + "]").html());
                $("#tow").html($("#writing option[value=" + $("#writing").val() + "]").html());
                $("#top").html($("#typep option[value=" + $("#typep").val() + "]").html());
                var tDate = new Date();
                var stime = $('#time').val();
                var selDate = Date.parse($('#date').val());
                tDate.setTime(selDate);
                tDate.setHours(stime, 0, 0, 0);
                var gmtHours = -tDate.getTimezoneOffset() / 60;
                if (gmtHours >= 0) gmtHours = "+" + gmtHours;
                var tz = "GMT " + gmtHours;
                var dd = montharray[tDate.getMonth()] + " " + tDate.getDate() + ' ' + tDate.getHours() + ':00 ' + tz;
                $("#nop").html($("#pages").val());
                $("#nos").html($("#srcs").val());
                $("#dd").html(dd);
                window.location = '/manage/order/' + j.txt + '?step=4';
            } else {
                $(".status").html(j.txt);
                if (j.txt == "<img src='/manage/images/alert.jpg' /> Please specify the exact deadline for your project.") $("#date").addClass("required");
            }
        }, 'json');
    });
}

function deleteFile(item) {
    var element = $(item);
    var id = element.data('id');

    if (typeof id == 'undefined') {
        return false;
    }

    element.html('<i class="fa fa-refresh fa-spin"></i>');

    $.post('/manage/ajaxfunc.php?f=rmfile', {
        'id': id
    }, function (j) {
        if (j.status == 1) $("#file-" + id).remove();
    }, 'json');
}
