<?php
/**
 * 404 Not Found Template
 *
 * @package Palestinian_Archive
 */

get_header();
?>

<main id="site-main" role="main">
    <div class="container">
        <div class="error-404-page">
            <div class="error-404-code" aria-hidden="true">404</div>
            <h1 class="error-404-title"><?php esc_html_e( 'الصفحة غير موجودة', 'palestinian-archive' ); ?></h1>
            <p class="error-404-text">
                <?php esc_html_e( 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.', 'palestinian-archive' ); ?>
            </p>

            <!-- Search Box -->
            <form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" style="width:100%;max-width:450px;display:flex;gap:0.5rem;margin-bottom:2rem;">
                <input type="search" name="s" class="filter-select" style="flex:1;padding:0.65rem 1rem;"
                       placeholder="<?php esc_attr_e( 'ابحث في الأرشيف...', 'palestinian-archive' ); ?>">
                <button type="submit" class="btn btn-primary"><?php esc_html_e( 'بحث', 'palestinian-archive' ); ?></button>
            </form>

            <!-- Quick Links -->
            <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin-bottom:2.5rem;">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-primary">
                    <?php esc_html_e( 'الصفحة الرئيسية', 'palestinian-archive' ); ?>
                </a>
                <a href="<?php echo esc_url( get_post_type_archive_link( 'pa_document' ) ); ?>" class="btn btn-outline">
                    <?php esc_html_e( 'تصفح الوثائق', 'palestinian-archive' ); ?>
                </a>
                <a href="<?php echo esc_url( get_post_type_archive_link( 'pa_photo' ) ); ?>" class="btn btn-outline">
                    <?php esc_html_e( 'الأرشيف الفوتوغرافي', 'palestinian-archive' ); ?>
                </a>
            </div>

            <!-- Recent posts as suggestions -->
            <?php
            $recent = new WP_Query( array(
                'post_type'      => array( 'pa_document', 'pa_photo', 'pa_testimony' ),
                'posts_per_page' => 3,
                'post_status'    => 'publish',
                'orderby'        => 'date',
                'order'          => 'DESC',
            ) );
            if ( $recent->have_posts() ) :
            ?>
            <div style="width:100%;max-width:600px;text-align:right;">
                <h2 style="font-size:1.1rem;color:var(--color-brown);margin-bottom:1rem;">
                    <?php esc_html_e( 'ربما تقصد أحد هذه المحتويات:', 'palestinian-archive' ); ?>
                </h2>
                <ul style="text-align:right;">
                    <?php while ( $recent->have_posts() ) : $recent->the_post(); ?>
                        <li style="padding:0.5rem 0;border-bottom:1px solid var(--color-dark-cream);">
                            <a href="<?php the_permalink(); ?>" style="color:var(--color-olive);font-weight:600;"><?php the_title(); ?></a>
                            <span style="font-size:0.8rem;color:var(--color-text-light);margin-right:0.5rem;"><?php echo esc_html( get_the_date() ); ?></span>
                        </li>
                    <?php endwhile; wp_reset_postdata(); ?>
                </ul>
            </div>
            <?php endif; ?>

        </div>
    </div>
</main>

<?php get_footer(); ?>
