var SEMICOLON = SEMICOLON || {};

SEMICOLON.widget = {
    init: function(){
        SEMICOLON.widget.extras();
    },
    extras: function(){
        $('#primary-menu-trigger,#overlay-menu-close').click(function() {
            if( $('#primary-menu').find('ul.mobile-primary-menu').length > 0 ) {
                $( '#primary-menu > ul.mobile-primary-menu, #primary-menu > div > ul.mobile-primary-menu' ).toggleClass("show");
            } else {
                $( '#primary-menu > ul, #primary-menu > div > ul' ).toggleClass("show");
            }
            $body.toggleClass("primary-menu-open");
            return false;
        });
    },
};

SEMICOLON.header = {

    init: function(){
        SEMICOLON.header.overlayMenu();
    },
    overlayMenu: function(){
        if( $body.hasClass('overlay-menu') ) {
            var overlayMenuItem = $('#primary-menu').children('ul').children('li'),
                overlayMenuItemHeight = overlayMenuItem.outerHeight(),
                overlayMenuItemTHeight = overlayMenuItem.length * overlayMenuItemHeight,
                firstItemOffset = ( $window.height() - overlayMenuItemTHeight ) / 2;

            $('#primary-menu').children('ul').children('li:first-child').css({ 'margin-top': firstItemOffset+'px' });
        }
    },
};