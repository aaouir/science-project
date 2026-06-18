<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link screen-reader-text" href="#main-content"><?php esc_html_e( 'تخطى إلى المحتوى / Skip to content', 'palestinian-archive' ); ?></a>

<!-- Site Header -->
<header id="site-header" role="banner">
    <div class="container">
        <div class="header-inner">

            <!-- Site Branding -->
            <div class="site-branding">
                <?php if ( has_custom_logo() ) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <div class="site-title-wrap">
                        <p class="site-title">
                            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
                        </p>
                        <?php $description = get_bloginfo( 'description', 'display' ); if ( $description ) : ?>
                            <p class="site-description"><?php echo esc_html( $description ); ?></p>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div><!-- .site-branding -->

            <!-- Primary Navigation -->
            <nav id="primary-navigation" role="navigation" aria-label="<?php esc_attr_e( 'القائمة الرئيسية', 'palestinian-archive' ); ?>">
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'primary-menu',
                    'menu_id'        => 'primary-menu',
                    'menu_class'     => 'primary-menu',
                    'container'      => false,
                    'depth'          => 3,
                    'fallback_cb'    => function() {
                        echo '<ul class="primary-menu">';
                        echo '<li><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'الرئيسية / Home', 'palestinian-archive' ) . '</a></li>';
                        $cpts = array( 'pa_document' => 'الوثائق / Documents', 'pa_photo' => 'الصور / Photos', 'pa_testimony' => 'الشهادات / Testimonies' );
                        foreach ( $cpts as $cpt => $label ) {
                            $link = get_post_type_archive_link( $cpt );
                            if ( $link ) {
                                echo '<li><a href="' . esc_url( $link ) . '">' . esc_html( $label ) . '</a></li>';
                            }
                        }
                        echo '</ul>';
                    },
                ) );
                ?>

                <!-- Header Tools -->
                <div class="header-tools">
                    <button class="header-search-toggle" aria-label="<?php esc_attr_e( 'فتح البحث', 'palestinian-archive' ); ?>" aria-expanded="false" aria-controls="header-search">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                    <button class="lang-toggle-btn" id="langToggle" aria-label="<?php esc_attr_e( 'تبديل اللغة', 'palestinian-archive' ); ?>">EN / AR</button>
                </div>
            </nav><!-- #primary-navigation -->

            <!-- Mobile Menu Toggle -->
            <button class="menu-toggle" id="menuToggle" aria-label="<?php esc_attr_e( 'فتح القائمة', 'palestinian-archive' ); ?>" aria-expanded="false" aria-controls="primary-navigation">
                <span></span><span></span><span></span>
            </button>

        </div><!-- .header-inner -->
    </div><!-- .container -->

    <!-- Header Search Dropdown -->
    <div id="header-search" class="header-search-form" role="search">
        <form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
            <label class="sr-only" for="header-search-input"><?php esc_html_e( 'ابحث في الأرشيف', 'palestinian-archive' ); ?></label>
            <input type="search" id="header-search-input" class="search-field" name="s"
                   placeholder="<?php esc_attr_e( 'ابحث في الأرشيف... / Search the archive...', 'palestinian-archive' ); ?>"
                   value="<?php echo esc_attr( get_search_query() ); ?>" autocomplete="off">
            <button type="submit"><?php esc_html_e( 'بحث / Search', 'palestinian-archive' ); ?></button>
        </form>
    </div>

</header><!-- #site-header -->

<!-- RTL/LTR Toggle Button -->
<button class="rtl-ltr-toggle" id="rtlLtrToggle" title="<?php esc_attr_e( 'تبديل اتجاه الصفحة', 'palestinian-archive' ); ?>">
    <?php esc_html_e( 'RTL / LTR', 'palestinian-archive' ); ?>
</button>

<!-- Lightbox Overlay -->
<div id="lightbox" class="lightbox-overlay" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'عارض الصور', 'palestinian-archive' ); ?>">
    <div class="lightbox-inner">
        <button class="lightbox-close" id="lightboxClose" aria-label="<?php esc_attr_e( 'إغلاق', 'palestinian-archive' ); ?>">&#10005;</button>
        <button class="lightbox-nav lightbox-prev" id="lightboxPrev" aria-label="<?php esc_attr_e( 'السابق', 'palestinian-archive' ); ?>">&#8249;</button>
        <img src="" alt="" class="lightbox-image" id="lightboxImage" loading="lazy">
        <p class="lightbox-caption" id="lightboxCaption"></p>
        <button class="lightbox-nav lightbox-next" id="lightboxNext" aria-label="<?php esc_attr_e( 'التالي', 'palestinian-archive' ); ?>">&#8250;</button>
    </div>
</div>

<div id="main-content">
