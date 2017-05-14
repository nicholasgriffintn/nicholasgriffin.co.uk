/**
 * Custom js for theme
 */

( function( $ ) {
	var $window   = $( window ),
		$document = $( document ),
		resizeTimer,
		toolbarHeight,
		slideMenu = $( '.slide-panel' ),
		body = $( 'body' ),
		actionText = $('.action-text'),
		menuToggle = $( '.menu-toggle' );

	/**
	* Full width feature images
	*
	* Makes full width images have a class.
	*/
	function bigImageClass() {
		$( '.entry-content img.size-full' ).each( function() {
			var img = $( this ),
			newImg = new Image();

			newImg.src = img.attr( 'src' );

			$( newImg ).load( function() {
				var imgWidth = newImg.width;

				if ( imgWidth >= 1080 ) {
					$( img ).addClass( 'size-big' );
				}

			} );
		} );
	}

	/**
	* Full screen size images: props to Resonar for solution
	*/
	function fullscreenFeaturedImage() {
		var entryHeaderBackground, entryHeaderHeight, windowWidth;
		entryHeaderBackground = $( '.feature-header' );

		if ( ! entryHeaderBackground ) {
			return;
		}

		toolbarHeight     = body.is( '.admin-bar' ) ? $( '#wpadminbar' ).height() : 0;
		entryHeaderHeight = $window.height();
		windowWidth       = $window.width();

		entryHeaderBackground.css( {
			'height': entryHeaderHeight + 'px',
			'margin-top': '-' + toolbarHeight + 'px',
		} );
	}

	/**
	* Sliding panel
	*
	* Swaps classes for sliding panel so it uses CSS transformations.
	*/
	function slideControl() {
		menuToggle.on( 'click', function( e ) {
			e.preventDefault();
			var $this = $( this );

			slideMenu.toggleClass( 'expanded' ).resize();
			body.toggleClass( 'sidebar-open' );

			$this.toggleClass( 'toggle-on' );
			$this.attr( 'aria-expanded', $( this ).attr( 'aria-expanded' ) == 'false' ? 'true' : 'false');

			if( slideMenu.hasClass( 'expanded' ) ) {
							actionText.text( 'hide' );
					} else {
						actionText.text( 'show' );
					}

			//Close slide menu with double click
			body.dblclick( function( e ) {
				e.preventDefault();
				slideMenu.removeClass( 'expanded' ).resize();
				$( this ).removeClass( 'sidebar-open' );
				menuToggle.removeClass( 'toggle-on' );
			} );
		} );
	}

	/**
	* Navigation sub menu show and hide
	*
	* Show sub menus with an arrow click to work across all devices
	* This switches classes and changes the genericon.
	*/
	$( '.main-navigation .page_item_has_children > a, .main-navigation .menu-item-has-children > a' ).append( '<button class="showsub-toggle" aria-expanded="false">' + menuToggleText.open + '</button>' );

	$( '.showsub-toggle' ).click( function( e ) {
			e.preventDefault();
			var $this = $( this );
			$this.toggleClass( 'sub-on' );
			$this.text( $this.text() == menuToggleText.open ? menuToggleText.close : menuToggleText.open );
			$this.parent().next( '.children, .sub-menu' ).toggleClass( 'sub-on' );
			$this.attr( 'aria-expanded', $this.attr( 'aria-expanded' ) == 'false' ? 'true' : 'false');
	} );

	/**
	* Close slide menu with escape key
	*
	* Adds in this functionality
	*/
	$document.keyup( function( e ) {
		if ( e.keyCode === 27 && slideMenu.hasClass( 'expanded' ) ) {
			body.removeClass( 'sidebar-open' );
			menuToggle.removeClass( 'toggle-on' );
			slideMenu.removeClass( 'expanded' ).resize();

			if( slideMenu.hasClass( 'expanded' ) ) {
							actionText.text( 'hide' );
					} else {
						actionText.text( 'show' );
					}
		}
	} );

	/**
	* Loader for all the theme functions: props to Resonar for resizing
	*/
	$window.on( 'resize', function() {
		clearTimeout( resizeTimer );
		resizeTimer = setTimeout( function() {
			fullscreenFeaturedImage();
		}, 100 );
	} );

	$document.ready( function() {
		fullscreenFeaturedImage();
		bigImageClass();
		slideControl();
	} );

} )( jQuery );

/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {
	var container, button, menu, links, subMenus, i, len;

	container = document.getElementById( 'site-navigation' );
	if ( ! container ) {
		return;
	}

	button = container.getElementsByTagName( 'button' )[0];
	if ( 'undefined' === typeof button ) {
		return;
	}

	menu = container.getElementsByTagName( 'ul' )[0];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute( 'aria-expanded', 'false' );
	if ( -1 === menu.className.indexOf( 'nav-menu' ) ) {
		menu.className += ' nav-menu';
	}

	button.onclick = function() {
		if ( -1 !== container.className.indexOf( 'toggled' ) ) {
			container.className = container.className.replace( ' toggled', '' );
			button.setAttribute( 'aria-expanded', 'false' );
			menu.setAttribute( 'aria-expanded', 'false' );
		} else {
			container.className += ' toggled';
			button.setAttribute( 'aria-expanded', 'true' );
			menu.setAttribute( 'aria-expanded', 'true' );
		}
	};

	// Get all the link elements within the menu.
	links    = menu.getElementsByTagName( 'a' );
	subMenus = menu.getElementsByTagName( 'ul' );

	// Set menu items with submenus to aria-haspopup="true".
	for ( i = 0, len = subMenus.length; i < len; i++ ) {
		subMenus[i].parentNode.setAttribute( 'aria-haspopup', 'true' );
	}

	// Each time a menu link is focused or blurred, toggle focus.
	for ( i = 0, len = links.length; i < len; i++ ) {
		links[i].addEventListener( 'focus', toggleFocus, true );
		links[i].addEventListener( 'blur', toggleFocus, true );
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .nav-menu.
		while ( -1 === self.className.indexOf( 'nav-menu' ) ) {

			// On li elements toggle the class .focus.
			if ( 'li' === self.tagName.toLowerCase() ) {
				if ( -1 !== self.className.indexOf( 'focus' ) ) {
					self.className = self.className.replace( ' focus', '' );
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}
} )();


/**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
( function() {
	var isWebkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
	    isOpera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
	    isIe     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( isWebkit || isOpera || isIe ) && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var id = location.hash.substring( 1 ),
				element;

			if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
				return;
			}

			element = document.getElementById( id );

			if ( element ) {
				if ( ! ( /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
})();
