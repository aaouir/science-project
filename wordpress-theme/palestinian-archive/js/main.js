/**
 * Palestinian Archive Theme — Main JavaScript
 *
 * Handles: sticky header, mobile nav, RTL/LTR toggle, language toggle,
 * lightbox, archive AJAX filtering, search dropdown, lazy loading,
 * and accessibility enhancements.
 */

(function ($) {
    'use strict';

    /* ============================================================
       NAMESPACE
       ============================================================ */
    window.PA = window.PA || {};

    /* ============================================================
       DOCUMENT READY
       ============================================================ */
    $(function () {
        PA.init();
    });

    /* ============================================================
       CORE INIT
       ============================================================ */
    PA.init = function () {
        PA.stickyHeader();
        PA.mobileNav();
        PA.searchToggle();
        PA.langToggle();
        PA.rtlLtrToggle();
        PA.lightbox();
        PA.archiveFilter();
        PA.lazyImages();
        PA.scrollToTop();
        PA.keyboardNav();
        PA.initAnimations();
        PA.restorePreferences();
    };

    /* ============================================================
       STICKY HEADER
       ============================================================ */
    PA.stickyHeader = function () {
        var $header = $('#site-header');
        if (!$header.length) return;

        var scrollThreshold = 80;

        function handleScroll() {
            if ($(window).scrollTop() > scrollThreshold) {
                $header.addClass('scrolled');
            } else {
                $header.removeClass('scrolled');
            }
        }

        $(window).on('scroll.stickyHeader', function () {
            handleScroll();
        });

        handleScroll();
    };

    /* ============================================================
       MOBILE NAVIGATION
       ============================================================ */
    PA.mobileNav = function () {
        var $toggle    = $('#menuToggle');
        var $nav       = $('#primary-navigation');
        var $menuItems = $nav.find('.primary-menu > li');

        if (!$toggle.length) return;

        $toggle.on('click.mobileNav', function () {
            var isOpen = $nav.hasClass('mobile-open');
            $nav.toggleClass('mobile-open');
            $toggle.toggleClass('active');
            $toggle.attr('aria-expanded', !isOpen);
            $nav.attr('aria-hidden', isOpen);
        });

        // Sub-menu toggling on mobile
        $menuItems.each(function () {
            var $item    = $(this);
            var $submenu = $item.children('.sub-menu');
            if (!$submenu.length) return;

            var $link = $item.children('a');
            $link.on('click.subMenu', function (e) {
                if ($(window).width() <= 768) {
                    e.preventDefault();
                    $item.toggleClass('open');
                    $submenu.slideToggle(200);
                }
            });
        });

        // Close nav when clicking outside
        $(document).on('click.mobileNav', function (e) {
            if (!$(e.target).closest('#site-header').length) {
                $nav.removeClass('mobile-open');
                $toggle.removeClass('active').attr('aria-expanded', 'false');
            }
        });

        // Close on escape
        $(document).on('keydown.mobileNav', function (e) {
            if (e.key === 'Escape' && $nav.hasClass('mobile-open')) {
                $nav.removeClass('mobile-open');
                $toggle.removeClass('active').attr('aria-expanded', 'false');
                $toggle.focus();
            }
        });
    };

    /* ============================================================
       SEARCH DROPDOWN TOGGLE
       ============================================================ */
    PA.searchToggle = function () {
        var $btn        = $('.header-search-toggle');
        var $searchForm = $('#header-search');
        var $input      = $('#header-search-input');

        if (!$btn.length) return;

        $btn.on('click.search', function () {
            var isOpen = $searchForm.hasClass('active');
            $searchForm.toggleClass('active');
            $btn.attr('aria-expanded', !isOpen);

            if (!isOpen) {
                // Focus input with small delay for animation
                setTimeout(function () {
                    $input.focus();
                }, 100);
            }
        });

        // Close on escape
        $searchForm.on('keydown.search', function (e) {
            if (e.key === 'Escape') {
                $searchForm.removeClass('active');
                $btn.attr('aria-expanded', 'false').focus();
            }
        });

        // Close when clicking outside
        $(document).on('click.search', function (e) {
            if (!$(e.target).closest('#site-header').length) {
                $searchForm.removeClass('active');
                $btn.attr('aria-expanded', 'false');
            }
        });
    };

    /* ============================================================
       LANGUAGE TOGGLE (Arabic/English)
       ============================================================ */
    PA.langToggle = function () {
        var $btn  = $('#langToggle');
        var $body = $('body');

        if (!$btn.length) return;

        var currentLang = localStorage.getItem('pa_language') || 'ar';

        function applyLang(lang) {
            if (lang === 'en') {
                $body.addClass('lang-en');
                $btn.text('AR / عر');
                $('html').attr('lang', 'en');
            } else {
                $body.removeClass('lang-en');
                $btn.text('EN / AR');
                $('html').attr('lang', 'ar');
            }
        }

        applyLang(currentLang);

        $btn.on('click.langToggle', function () {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            applyLang(currentLang);
            localStorage.setItem('pa_language', currentLang);
        });
    };

    /* ============================================================
       RTL/LTR TOGGLE
       ============================================================ */
    PA.rtlLtrToggle = function () {
        var $btn  = $('#rtlLtrToggle');
        var $html = $('html');

        if (!$btn.length) return;

        var currentDir = localStorage.getItem('pa_direction') || ($html.attr('dir') || 'rtl');
        $html.attr('dir', currentDir);

        $btn.on('click.rtlLtr', function () {
            currentDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            $html.attr('dir', currentDir);
            localStorage.setItem('pa_direction', currentDir);
            $btn.text(currentDir.toUpperCase());
        });
    };

    /* ============================================================
       LIGHTBOX
       ============================================================ */
    PA.lightbox = function () {
        var $overlay  = $('#lightbox');
        var $img      = $('#lightboxImage');
        var $caption  = $('#lightboxCaption');
        var $close    = $('#lightboxClose');
        var $prev     = $('#lightboxPrev');
        var $next     = $('#lightboxNext');
        var images    = [];
        var currentIdx = 0;

        if (!$overlay.length) return;

        // Collect lightbox images
        function collectImages() {
            images = [];
            $('[data-lightbox]').each(function (i) {
                var $el = $(this);
                images.push({
                    src     : $el.data('lightbox') || $el.attr('href') || '',
                    caption : $el.data('caption') || $el.attr('title') || $el.find('img').attr('alt') || '',
                    index   : i,
                });
                $el.attr('data-lightbox-index', i);
            });
        }

        function openLightbox(idx) {
            collectImages();
            if (!images[idx]) return;
            currentIdx = idx;
            var item = images[idx];
            $img.attr('src', item.src).attr('alt', item.caption);
            $caption.text(item.caption);
            $overlay.addClass('active');
            $('body').css('overflow', 'hidden');
            $close.focus();
            updateNavButtons();
        }

        function closeLightbox() {
            $overlay.removeClass('active');
            $('body').css('overflow', '');
            $img.attr('src', '');
        }

        function navigate(dir) {
            var newIdx = currentIdx + dir;
            if (newIdx < 0) newIdx = images.length - 1;
            if (newIdx >= images.length) newIdx = 0;
            openLightbox(newIdx);
        }

        function updateNavButtons() {
            $prev.toggle(images.length > 1);
            $next.toggle(images.length > 1);
        }

        // Public API
        PA.openLightbox  = openLightbox;
        PA.closeLightbox = closeLightbox;
        PA.lightboxNav   = navigate;

        // Events
        $(document).on('click.lightbox', '[data-lightbox]', function (e) {
            e.preventDefault();
            var idx = parseInt($(this).attr('data-lightbox-index')) || 0;
            openLightbox(idx);
        });

        $close.on('click.lightbox',   closeLightbox);
        $prev.on('click.lightbox',    function () { navigate(-1); });
        $next.on('click.lightbox',    function () { navigate(1); });

        $overlay.on('click.lightbox', function (e) {
            if ($(e.target).is($overlay)) closeLightbox();
        });

        $(document).on('keydown.lightbox', function (e) {
            if (!$overlay.hasClass('active')) return;
            if (e.key === 'Escape')    closeLightbox();
            if (e.key === 'ArrowLeft')  navigate($('html').attr('dir') === 'rtl' ? 1 : -1);
            if (e.key === 'ArrowRight') navigate($('html').attr('dir') === 'rtl' ? -1 : 1);
        });

        // Auto-convert gallery images to lightbox
        $('.entry-content img, .card-thumbnail img').each(function () {
            var $img2 = $(this);
            var src   = $img2.attr('src');
            if (src && !$img2.closest('a').length) {
                $img2.wrap('<a href="' + src + '" data-lightbox="' + src + '" data-caption="' + ($img2.attr('alt') || '') + '"></a>');
            }
        });
    };

    /* ============================================================
       ARCHIVE AJAX FILTER
       ============================================================ */
    PA.archiveFilter = function () {
        var $filterSelects = $('.filter-select');
        var $grid          = $('#archiveGrid');
        var $loading       = $('#archiveLoading');
        var $countEl       = $('#filterCount');
        var $resetBtn      = $('#filterReset');

        if (!$grid.length) return;

        var filterTimeout = null;

        function doFilter() {
            if (!paTheme || !paTheme.ajaxUrl) return;

            var postType = $grid.data('post-type') || 'pa_document';
            var period   = $('#filterPeriod').val() || '';
            var location = $('#filterLocation').val() || '';
            var topic    = $('#filterTopic').val() || '';

            clearTimeout(filterTimeout);

            filterTimeout = setTimeout(function () {
                $grid.css('opacity', 0.4);
                $loading.show();

                $.ajax({
                    url  : paTheme.ajaxUrl,
                    type : 'POST',
                    data : {
                        action    : 'pa_filter_archive',
                        nonce     : paTheme.nonce,
                        post_type : postType,
                        period    : period,
                        location  : location,
                        topic     : topic,
                        paged     : 1,
                    },
                    success: function (response) {
                        if (response.success) {
                            $grid.html(response.data.html);
                            if ($countEl.length) {
                                $countEl.text(response.data.total + ' ' + (paTheme.strings ? paTheme.strings.noResults || '' : ''));
                            }
                            PA.lazyImages();
                        }
                    },
                    error: function () {
                        console.error('PA: Archive filter AJAX error');
                    },
                    complete: function () {
                        $grid.css('opacity', 1);
                        $loading.hide();
                    },
                });
            }, 350);
        }

        $filterSelects.on('change.filter', doFilter);

        $resetBtn.on('click.filter', function () {
            $filterSelects.val('');
            doFilter();
        });
    };

    /* ============================================================
       LAZY IMAGES (IntersectionObserver)
       ============================================================ */
    PA.lazyImages = function () {
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var $el = $(entry.target);
                        var src = $el.data('src');
                        if (src) {
                            $el.attr('src', src).removeAttr('data-src');
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '100px' });

            $('img[data-src]').each(function () {
                observer.observe(this);
            });
        } else {
            // Fallback: load all lazy images
            $('img[data-src]').each(function () {
                $(this).attr('src', $(this).data('src')).removeAttr('data-src');
            });
        }
    };

    /* ============================================================
       SCROLL TO TOP BUTTON
       ============================================================ */
    PA.scrollToTop = function () {
        // Create button dynamically
        var $btn = $('<button>', {
            id        : 'scrollToTop',
            'aria-label': 'العودة للأعلى / Back to top',
            html      : '&#8679;',
            css       : {
                position   : 'fixed',
                bottom     : '5rem',
                left       : '1.5rem',
                zIndex     : 499,
                background : 'var(--color-olive)',
                color      : '#fff',
                border     : 'none',
                borderRadius: '50%',
                width      : '44px',
                height     : '44px',
                fontSize   : '1.4rem',
                cursor     : 'pointer',
                opacity    : 0,
                transition : 'opacity 0.3s, background 0.2s',
                boxShadow  : '0 2px 8px rgba(0,0,0,0.2)',
            },
        });

        $('body').append($btn);

        $(window).on('scroll.scrollToTop', function () {
            if ($(this).scrollTop() > 400) {
                $btn.css('opacity', 1);
            } else {
                $btn.css('opacity', 0);
            }
        });

        $btn.on('click.scrollToTop', function () {
            $('html, body').animate({ scrollTop: 0 }, 500);
        });
    };

    /* ============================================================
       KEYBOARD NAVIGATION HELPERS
       ============================================================ */
    PA.keyboardNav = function () {
        // Add focus-visible polyfill behavior
        var usingKeyboard = false;

        $(document).on('keydown.keyboard', function () {
            usingKeyboard = true;
            $('body').addClass('using-keyboard');
        });

        $(document).on('mousedown.keyboard', function () {
            usingKeyboard = false;
            $('body').removeClass('using-keyboard');
        });

        // Trap focus in lightbox
        $('#lightbox').on('keydown.trap', function (e) {
            if (e.key !== 'Tab') return;
            var $focusable = $(this).find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').filter(':visible');
            var $first = $focusable.first();
            var $last  = $focusable.last();

            if (e.shiftKey) {
                if ($(document.activeElement).is($first)) {
                    e.preventDefault();
                    $last.focus();
                }
            } else {
                if ($(document.activeElement).is($last)) {
                    e.preventDefault();
                    $first.focus();
                }
            }
        });
    };

    /* ============================================================
       ENTRANCE ANIMATIONS
       ============================================================ */
    PA.initAnimations = function () {
        if (!('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    $(entry.target).css({
                        opacity   : 1,
                        transform : 'translateY(0)',
                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        $('.document-card, .widget, .hero-stat-item').each(function () {
            $(this).css({
                opacity  : 0,
                transform: 'translateY(20px)',
            });
            observer.observe(this);
        });
    };

    /* ============================================================
       RESTORE USER PREFERENCES (language, direction)
       ============================================================ */
    PA.restorePreferences = function () {
        var savedDir  = localStorage.getItem('pa_direction');
        var savedLang = localStorage.getItem('pa_language');

        if (savedDir) {
            $('html').attr('dir', savedDir);
        }
        if (savedLang === 'en') {
            $('body').addClass('lang-en');
        }
    };

    /* ============================================================
       CARD HOVER EFFECT (for touch devices)
       ============================================================ */
    $(document).on('touchstart.card', '.document-card', function () {
        $(this).addClass('touch-hover');
    }).on('touchend.card', '.document-card', function () {
        var $card = $(this);
        setTimeout(function () { $card.removeClass('touch-hover'); }, 300);
    });

    /* ============================================================
       PRINT HELPER
       ============================================================ */
    PA.print = function () {
        window.print();
    };

    $(document).on('click.print', '[data-action="print"]', function (e) {
        e.preventDefault();
        PA.print();
    });

    /* ============================================================
       FILTER BAR STICKY HEIGHT COMPENSATION
       ============================================================ */
    PA.updateFilterBarOffset = function () {
        var $filterBar = $('#archiveFilterBar');
        var $header    = $('#site-header');
        if ($filterBar.length && $header.length) {
            $filterBar.css('top', $header.outerHeight() + 'px');
        }
    };

    $(window).on('resize.filterBar', PA.updateFilterBarOffset);
    PA.updateFilterBarOffset();

})(jQuery);
