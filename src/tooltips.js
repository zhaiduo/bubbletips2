/**
 * Show Tooltip
 * @param  {object} $el Element with tooltip
 * @param  {boolean} autoHide Set auto hide or not
 * @param  {function} hideTooltip Invoke to hide tooltip
 * @return {null} no return
 */
var showTooltip = function($el, autoHide, hideTooltip) {

    var $tooltip = $('div[data-tooltip=' + $el.data('tooltip') + ']');

    // Reposition tooltip, in case of page movement e.g. screen resize
    var linkPosition = $el.position();

    $tooltip.css({
        top: linkPosition.top - $tooltip.outerHeight() - 13,
        left: linkPosition.left - ($tooltip.width() / 2)
    });

    // Adding class handles animation through CSS
    $tooltip.addClass('active');
    if (autoHide) {
        setTimeout(function() {
            hideTooltip($el);
        }, 5000);
    }
};

/**
 * Hide Tooltip
 * @param  {object} $el Element with tooltip
 * @return {null} no return
 */
var hideTooltip = function($el) {
    // Temporary class for same-direction fadeout
    var $tooltip = $('div[data-tooltip=' + $el.data('tooltip') + ']').addClass('out');

    // Remove all classes
    setTimeout(function() {
        $tooltip.removeClass('active').removeClass('out');
    }, 300);
};

(function($) {
    /**
     * @param  {string} msg title
     * @param  {object} el element
     * @param  {boolean} autoHide if auto hide
     * @param  {boolean} enableHover if enable hover
     * @return {null} no return
     */
    $.fn.tooltips = function(msg, el, autoHide, enableHover) {

        var $el;
        var _autoHide = (autoHide != undefined && typeof autoHide == 'boolean') ? autoHide : true;
        var _enableHover = (enableHover != undefined && typeof enableHover == 'boolean') ? enableHover : false;

        return this.each(function(i, el) {
            var $tooltip;
            $el = $(el).attr('data-tooltip', i);

            $tooltip = $('<div class="tooltip" data-tooltip="' + i + '">' + msg + '<div class="arrow"></div></div>').appendTo('body');

            var linkPosition = $el.position();

            $tooltip.css({
                top: linkPosition.top - $tooltip.outerHeight() - 13,
                left: linkPosition.left - ($tooltip.width() / 2)
            });

            if ($el.attr('class') && $el.attr('class').match(/live/i)) {
                setTimeout(function() {
                    showTooltip($el, _autoHide, hideTooltip);
                }, 1000);

            }

            if (_enableHover) {
                console.log('_enableHover', _enableHover);
                $el.removeAttr('title').hover(function() {
                    $el = $(this);
                    showTooltip($el, _autoHide, hideTooltip);
                }, function() {
                    $el = $(this);
                    hideTooltip($el);
                });
            } else {
                $el.removeAttr('title');
            }

        });

    };

})(jQuery);
