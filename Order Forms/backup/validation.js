$(function () {

    var container = $("form.payform div.form-error");

    jQuery.validator.addMethod("lettersonly", function (value, element) {
        value = value.trim();
        return this.optional(element) || (/^[\s\w'-.,\/]*$/i.test(value) && value.length != 0);
    }, "Valid characters A-Z, a-z, 0-9 and symbols: ' - _.,/");

    jQuery.validator.addMethod("message", function (value, element) {
        value = value.trim();
        value = replaceWordChars(value);
        return this.optional(element) || (/^\S[\s\w.,:;%'~"-?^|!\[\]{}«»<>()\\]*$/i.test(value) && value.length != 0);
    }, "Valid characters A-Z, a-z, symbols: . , : ; % ' \" - ? ! ()");

    jQuery.validator.addMethod("phoneno", function (phone_number, element) {
        phone_number = phone_number.replace(/\s+/, "");
        return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^((\+[0-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/);
    }, "Please specify a valid phone number (ex.: +12344567889)");

    $('form.third_step #title').change(function (event) {
        var value = $(event.target).val();
        value = replaceWordChars(value);
        $(event.target).val(value);
    });

    var replaceWordChars = function (text) {
        var s = text;
        // smart single quotes and apostrophe
        s = s.replace(/[\u2018\u2019\u201A]/g, "\'");
        // smart double quotes
        s = s.replace(/[\u201C\u201D\u201E]/g, "\"");
        // ellipsis
        s = s.replace(/\u2026/g, "...");
        // dashes
        s = s.replace(/[\u2013\u2014]/g, "-");
        // circumflex
        s = s.replace(/\u02C6/g, "^");
        // open angle bracket
        s = s.replace(/\u2039/g, "<");
        // close angle bracket
        s = s.replace(/\u203A/g, ">");

        s = s.replace(/\u00AB/g, "\"");
        s = s.replace(/\u00BB/g, "\"");

        // spaces
        s = s.replace(/[\u02DC\u00A0]/g, " ");
        return s;
    };

    $("form.payform").validate({
        // errorContainer: container,
        // errorLabelContainer: $("ol", container),
        // wrapper: 'li',
        errorClass: 'validation-error',
        rules: {
            firstName: {
                required: true,
                lettersonly: true,
                minlength: 2,
                maxlength: 50

            },
            lastName: {
                required: true,
                lettersonly: true,
                minlength: 2,
                maxlength: 50
            },
            zip: {
                number: true,
                maxlength: 10
            },
            address1: {
                required: true,
                lettersonly: true,
                minlength: 2,
                maxlength: 100

            },
            phone: {
                required: true,
                phoneno: true,
                minlength: 2,
                maxlength: 20

            },
            city: {
                required: true,
                lettersonly: true,
                minlength: 2,
                maxlength: 40

            },
            state: {
                // required: true,
                lettersonly: true,
                minlength: 2,
                maxlength: 40

            },
            cvv2Number: {
                required: true,
                number: true,
                maxlength: 4,
                minlength: 3
            },
            country: {
                required: true,
                lettersonly: true
            },
            creditCardNumber: {
                required: true,
                number: true,
                maxlength: 16
            }
        }, messages: {
            firstName: {
                required: 'Please enter your first name',
                minlength: 'Enter at least (2) characters',
                lettersonly: 'First name incorrect. Valid characters A-Z, a-z, 0-9 and symbols: \' - _.,/',
                maxlength: 'Please enter no more than 50 characters for first name field.'
            },
            lastName: {
                required: 'Please enter your last name',
                minlength: 'Enter at least (2) characters',
                lettersonly: 'Last name incorrect. Valid characters A-Z, a-z, 0-9 and symbols: \' - _.,/',
                maxlength: 'Please enter no more than 50 characters for last name field.'
            },
            cvv2Number: {
                required: 'Please enter CVV code of your card',
                minlength: 'Enter at least (2) characters',
                number: "CVV code shall consist of digits. Valid characters are 0 to 9.",
                maxlength: 'Please enter no more than 4 characters for verification code field.'
            },
            creditCardNumber: {
                required: 'Please enter your card number',
                number: "Please enter correct credit card number. Valid characters are 0 to 9.",
                maxlength: 'Please enter no more than 16 characters for card number field.'
            },
            phone: {
                required: 'Please enter your phone number',
                maxlength: 'Please enter no more than 20 digits for phone field.'
            },
            city: {
                required: 'Please enter your city',
                lettersonly: 'City incorrect. Valid characters A-Z, a-z, 0-9 and symbols: \' - _.,/',
                maxlength: 'Please enter no more than 40 characters for city field.'
            },
            state: {
                lettersonly: 'State/Province incorrect. Valid characters A-Z, a-z, 0-9 and symbols: \' - _.,/',
                maxlength: 'Please enter no more than 40 characters for state/province field.'
            },
            zip: {
                number: "ZIP code shall consist of digits. Valid characters are 0 to 9.",
                maxlength: 'Please enter no more than 10 characters for ZIP code field.'
            },
            country: {
                required: 'Please select your country'
            },
            address1: {
                required: 'Please enter billing address',
                lettersonly: 'Billing address incorrect. Valid characters A-Z, a-z, 0-9 and symbols: \' - _.,/',
                maxlength: 'Please enter no more than 100 characters for billing address field.'
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("name") == "firstName") {
                error.insertAfter($("#fname")).addClass('error-label');
            }
            if (element.attr("name") == "lastName") {
                error.insertAfter($("#lname")).addClass('error-label');
            }
            if (element.attr("name") == "country") {
                error.insertAfter($("#country")).addClass('error-label');
            }
            if (element.attr("name") == "zip") {
                error.insertAfter($("#zip")).addClass('error-label');
            }
            if (element.attr("name") == "state") {
                error.insertAfter($("#state")).addClass('error-label');
            }
            if (element.attr("name") == "city") {
                error.insertAfter($("#city")).addClass('error-label');
            }
            if (element.attr("name") == "address1") {
                error.insertAfter($("#address")).addClass('error-label');
            }
            if (element.attr("name") == "phone") {
                error.insertAfter($("#phone")).addClass('error-label');
            }
            if (element.attr("name") == "creditCardNumber") {
                error.insertAfter($("#cardnumber")).addClass('error-label');
            }
            if (element.attr("name") == "cvv2Number") {
                error.insertAfter($("#cvv")).addClass('error-label');
            }
        }
    });

    $("form.sign-up").validate({
       /* errorContainer: $("form.sign-up div.form-error"),
        errorLabelContainer: $("ol", $("form.sign-up div.form-error")),
        wrapper: 'li',*/
        errorClass: 'validation-error',
        rules: {
            name: {
                required: true,
                lettersonly: true,
                maxlength: 50
            },
            email: {
                email: true,
                maxlength: 150
            },
            pass2: {
                equalTo: "#pass",
                maxlength: 50
            },
            pass: {
                minlength: 6,
                maxlength: 50
            },
            phone: {
                phoneno: true,
                maxlength: 20
            }
        },
        messages: {
            email: {
                required: 'Please enter your email address.',
                lettersonly: 'Field name incorrect. Valid characters A-Z, a-z, 0-9 and symbols: \' - _.,/',
                maxlength: 'Please enter no more than 150 characters for email field.'
            },
            pass: {
                required: 'Please enter your password.',
                minlength: 'Password must be at least 6 characters',
                maxlength: 'Please enter no more than 50 characters for password field.'
            },
            pass2: {
                required: 'Please confirm password.',
                equalTo: "Please enter password again.",
                maxlength: 'Please enter no more than 50 characters for confirm password field.'
            },
            name: {
                required: 'Please enter your full name.',
                lettersonly: 'Field full name incorrect. Valid characters A-Z, a-z, 0-9 and symbols: \' - _.,/',
                maxlength: 'Please enter no more than 50 characters for full name field.'
            },
            phone: {
                maxlength: 'Please enter no more than 20 digits for phone number.'
            }

        },
        errorPlacement: function(error, element) {
            if (element.attr("name") == "name") {
                error.insertAfter($("input[name=name]")).addClass('error-lable');
            }
            if (element.attr("name") == "email") {
                error.insertAfter($("input[name=email]")).addClass('error-lable');
            }
            if (element.attr("name") == "pass") {
                error.insertAfter($("input[name=pass]")).addClass('error-lable');
            }
            if (element.attr("name") == "pass2") {
                error.insertAfter($("input[name=pass2]")).addClass('error-lable');
            }
            if (element.attr("name") == "phone") {
                error.insertAfter($("input[name=phone]")).addClass('error-lable');
            }
        }
    });

    $("form.second_step").validate({
        /*errorContainer: $("div.form-error"),
        errorLabelContainer: $("ol", $("div.form-error")),
        wrapper: 'li',*/
        errorClass: 'validation-error',
        rules: {
            service: {
                required: true
            },
            writing: {
                required: true
            },
            typep: {
                required: true
            },
            psize: {
                required: true
            },
            spelling: {
                required: true
            },
            major: {
                required: true
            },
            smj: {
                required: true
            },
            level: {
                required: true
            },
            pages: {
                required: true
            },
            slides1: {
                required: true
            },
            slides2: {
                required: true
            },
            cstyle: {
                required: true
            }
        },
        messages: {
            service: {
                required: '\'Type of service\' field was not selected'
            },
            writing: {
                required: '\'Type of writing\' field was not selected'
            },
            typep: {
                required: 'Please select type of paper'
            },
            psize: {
                required: '\'Paper size\' field was not selected'
            },
            spelling: {
                required: '\'Spelling\'  field was not selected'
            },
            major: {
                required: '\'Field of study\' field was not selected'
            },
            smj: {
                required: '\'Narrowing the topic\' field was not selected'
            },
            level: {
                required: 'Please select level'
            },
            pages: {
                required: '\'Pages\' field was not selected'
            },
            slides1: {
                required: '\'Number of slides\' field was not selected'
            },
            slides2: {
                required: '\'Number of slides\' field was not selected'
            },
            cstyle: {
                required: '\'Bibliography format or citation style\' was not selected'
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("id") == "service") {
                error.insertAfter($("#service")).addClass('error-label');
            }
            if (element.attr("id") == "writing") {
                error.insertAfter($("#writing")).addClass('error-label');
            }
            if (element.attr("id") == "typep") {
                error.insertAfter($("#typep")).addClass('error-label');
            }
            if (element.attr("id") == "psize") {
                error.insertAfter($("#psize")).addClass('error-label');
            }
            if (element.attr("id") == "spelling") {
                error.insertAfter($("#spelling")).addClass('error-label');
            }
            if (element.attr("name") == "major") {
                error.insertAfter($("#mj")).addClass('error-label');
            }
            if (element.attr("id") == "smj") {
                error.insertAfter($("#smj")).addClass('error-label');
            }
            if (element.attr("id") == "level") {
                error.insertAfter($("#level")).addClass('error-label');
            }
            if (element.attr("id") == "pages") {
                error.insertAfter($("#pages")).addClass('error-label');
            }
            if (element.attr("id") == "slides1") {
                error.insertAfter($("#slides1")).addClass('error-label');
            }
            if (element.attr("id") == "slides2") {
                error.insertAfter($("#slides2")).addClass('error-label');
            }
            if (element.attr("id") == "cstyle") {
                error.insertAfter($("#cstyle")).addClass('error-label');
            }
        }
    });

    $("form.third_step").validate({
        // errorContainer: $("form.third_step div.form-error"),
        // errorLabelContainer: $("ol", $("form.third_step div.form-error")),
        // wrapper: 'li',
        errorClass: 'validation-error',
        rules: {
            title: {
                required: true,
                minlength: 2,
                maxlength: 255,
                message: true
            },
            details: {
                required: true,
                message: true,
                maxlength: 15000
            }
        },
        messages: {
            title: {
                required: "Please enter project title",
                message: "Field project title incorrect. Valid characters A-Z, a-z, 0-9 and symbols: \' - _.,/",
                maxlength: 'Please enter no more than 255 characters for title field.'
            },
            details: {
                required: "Please enter detailed project specifications",
                message: "Field Detailed Project Specifications incorrect. Valid characters A-Z, a-z, 0-9 and symbols: _. , : ; % ' \" - ? ! ()",
                maxlength: 'Please enter no more than 15000 characters for detailed project specifications field.'
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("id") == "title") {
                error.insertAfter($("#title")).addClass('error-label');
            }
            if (element.attr("id") == "details") {
                error.insertAfter($("#details")).addClass('error-label');
            }
        }
    });


    $("#contact_form").validate({
        errorContainer: $("div.form-error"),
        errorLabelContainer: $("ol", $("div.form-error")),
        wrapper: 'li',
        errorClass: 'validation-error',
        rules: {
            name: {
                required: true,
                minlength: 2,
                maxlength: 255,
                message: true
            },
            email: {
                required: true,
                maxlength: 255,
                email: true
            },
            message: {
                required: true,
                message: true,
                minlength: 2,
                maxlength: 1000
            },
            phone: {
                phoneno: true,
                maxlength: 15
            }
        },
        messages: {
            name: {
                required: "Please enter your name",
                maxlength: "Name max length (255)",
                message: "Your name incorrect. Valid characters A-Z, a-z, 0-9 and symbols: \' - _.,/"
            },
            email: {
                required: "Please enter your email address",
                maxlength: "Email address max length (255)"
            },
            message: {
                required: "Please enter your message",
                message: "Field message incorrect. Valid characters A-Z, a-z, 0-9 and symbols: _. , : ; % ' \" - ? ! ()",
                maxlength: "Mesaage max length (1000)"
            }
        }
    });
});

