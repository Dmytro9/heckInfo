(function () {
    this.Flash = (function () {
        var flash, hideFlash;

        hideFlash = function () {
            return $(flash).fadeOut();
        };

        function Flash(message, type, parent, timeout) {
            var textDiv;
            if (type == null) {
                type = 'warning';
            }
            if (timeout == null) {
                timeout = 3000;
            }
            if (parent == null) {
                parent = null;
            }

            if (parent) {
                this.flashContainer = parent.find('.flash-container');
            } else {
                this.flashContainer = $('.flash-container-page');
            }
            this.flashContainer.html('');
            flash = $('<div/>', {
                'class': 'alert alert-' + type
            });

            flash.on('click', hideFlash);

            setTimeout(function () {
                hideFlash();
            }, timeout);

            textDiv = $('<div/>', {
                'class': 'flash-text',
                text: message
            });

            textDiv.appendTo(flash);
            if (this.flashContainer.parent().hasClass('content-wrapper')) {
                textDiv.addClass('container-fluid container-limited');
            }
            flash.appendTo(this.flashContainer);

            this.flashContainer.show();
        }

        return Flash;
    })();
}).call(this);