<?php
/**
 * Footer Template
 *
 * @package Palestinian_Archive
 */
?>
</div><!-- #main-content -->

<footer id="site-footer" class="site-footer" role="contentinfo">

    <!-- Footer Widgets -->
    <div class="footer-widgets">
        <div class="container">
            <div class="footer-widgets-grid">

                <!-- Column 1: About / Brand -->
                <div class="footer-widget footer-brand">
                    <?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
                        <?php dynamic_sidebar( 'footer-1' ); ?>
                    <?php else : ?>
                        <h4 class="widget-title"><?php bloginfo( 'name' ); ?></h4>
                        <p><?php esc_html_e( 'أرشيف رقمي شامل للوثائق والصور والشهادات الفلسطينية، يحفظ الذاكرة الجماعية للشعب الفلسطيني للأجيال القادمة.', 'palestinian-archive' ); ?></p>
                        <div class="footer-social">
                            <a href="#" class="social-link" aria-label="Twitter">𝕏</a>
                            <a href="#" class="social-link" aria-label="Facebook">f</a>
                            <a href="#" class="social-link" aria-label="YouTube">▶</a>
                            <a href="#" class="social-link" aria-label="Instagram">◎</a>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Column 2: Archive Sections -->
                <div class="footer-widget">
                    <?php if ( is_active_sidebar( 'footer-2' ) ) : ?>
                        <?php dynamic_sidebar( 'footer-2' ); ?>
                    <?php else : ?>
                        <h4 class="widget-title"><?php esc_html_e( 'أقسام الأرشيف', 'palestinian-archive' ); ?></h4>
                        <ul>
                            <li><a href="<?php echo esc_url( get_post_type_archive_link( 'pa_document' ) ); ?>"><?php esc_html_e( 'الوثائق التاريخية', 'palestinian-archive' ); ?></a></li>
                            <li><a href="<?php echo esc_url( get_post_type_archive_link( 'pa_photo' ) ); ?>"><?php esc_html_e( 'الأرشيف الفوتوغرافي', 'palestinian-archive' ); ?></a></li>
                            <li><a href="<?php echo esc_url( get_post_type_archive_link( 'pa_testimony' ) ); ?>"><?php esc_html_e( 'الشهادات الشفهية', 'palestinian-archive' ); ?></a></li>
                            <li><a href="<?php echo esc_url( get_post_type_archive_link( 'pa_event' ) ); ?>"><?php esc_html_e( 'الأحداث التاريخية', 'palestinian-archive' ); ?></a></li>
                            <li><a href="<?php echo esc_url( get_post_type_archive_link( 'pa_map_location' ) ); ?>"><?php esc_html_e( 'الخريطة الجغرافية', 'palestinian-archive' ); ?></a></li>
                        </ul>
                    <?php endif; ?>
                </div>

                <!-- Column 3: Historical Periods -->
                <div class="footer-widget">
                    <?php if ( is_active_sidebar( 'footer-3' ) ) : ?>
                        <?php dynamic_sidebar( 'footer-3' ); ?>
                    <?php else : ?>
                        <h4 class="widget-title"><?php esc_html_e( 'الحقب التاريخية', 'palestinian-archive' ); ?></h4>
                        <ul>
                            <?php
                            $periods = get_terms( array( 'taxonomy' => 'pa_period', 'hide_empty' => false, 'number' => 6 ) );
                            if ( ! is_wp_error( $periods ) && ! empty( $periods ) ) {
                                foreach ( $periods as $period ) {
                                    printf(
                                        '<li><a href="%s">%s</a></li>',
                                        esc_url( get_term_link( $period ) ),
                                        esc_html( $period->name )
                                    );
                                }
                            }
                            ?>
                        </ul>
                    <?php endif; ?>
                </div>

                <!-- Column 4: About -->
                <div class="footer-widget">
                    <?php if ( is_active_sidebar( 'footer-4' ) ) : ?>
                        <?php dynamic_sidebar( 'footer-4' ); ?>
                    <?php else : ?>
                        <h4 class="widget-title"><?php esc_html_e( 'عن الأرشيف', 'palestinian-archive' ); ?></h4>
                        <ul>
                            <li><a href="<?php echo esc_url( home_url( '/about' ) ); ?>"><?php esc_html_e( 'من نحن', 'palestinian-archive' ); ?></a></li>
                            <li><a href="<?php echo esc_url( home_url( '/contribute' ) ); ?>"><?php esc_html_e( 'المساهمة في الأرشيف', 'palestinian-archive' ); ?></a></li>
                            <li><a href="<?php echo esc_url( home_url( '/contact' ) ); ?>"><?php esc_html_e( 'اتصل بنا', 'palestinian-archive' ); ?></a></li>
                            <li><a href="<?php echo esc_url( home_url( '/privacy' ) ); ?>"><?php esc_html_e( 'سياسة الخصوصية', 'palestinian-archive' ); ?></a></li>
                        </ul>
                    <?php endif; ?>
                </div>

            </div><!-- .footer-widgets-grid -->
        </div><!-- .container -->
    </div><!-- .footer-widgets -->

    <!-- Footer Bottom Bar -->
    <div class="footer-bottom">
        <div class="container">
            <p class="footer-copyright">
                <?php printf(
                    esc_html__( '© %1$s %2$s — جميع الحقوق محفوظة', 'palestinian-archive' ),
                    esc_html( date_i18n( 'Y' ) ),
                    esc_html( get_bloginfo( 'name' ) )
                ); ?>
            </p>
            <nav class="footer-bottom-links" aria-label="<?php esc_attr_e( 'روابط التذييل', 'palestinian-archive' ); ?>">
                <a href="<?php echo esc_url( home_url( '/privacy' ) ); ?>"><?php esc_html_e( 'الخصوصية', 'palestinian-archive' ); ?></a>
                <a href="<?php echo esc_url( home_url( '/terms' ) ); ?>"><?php esc_html_e( 'الشروط', 'palestinian-archive' ); ?></a>
                <a href="<?php echo esc_url( get_search_link() ); ?>"><?php esc_html_e( 'بحث', 'palestinian-archive' ); ?></a>
            </nav>
        </div>
    </div><!-- .footer-bottom -->

</footer><!-- #site-footer -->

<?php wp_footer(); ?>
</body>
</html>
