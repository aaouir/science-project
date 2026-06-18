<?php
/**
 * Static Page Template
 *
 * @package Palestinian_Archive
 */

get_header();

while ( have_posts() ) : the_post(); ?>

<div class="single-header" style="padding:2.5rem 0;">
    <div class="container">
        <?php pa_breadcrumb(); ?>
        <h1 class="single-title"><?php the_title(); ?></h1>
    </div>
</div>

<div class="container">
    <div class="content-wrapper<?php echo ! is_active_sidebar( 'main-sidebar' ) ? ' no-sidebar' : ''; ?>">

        <main id="site-main" role="main">
            <article id="page-<?php the_ID(); ?>" <?php post_class( 'entry page-entry' ); ?>>

                <?php if ( has_post_thumbnail() ) : ?>
                <figure class="entry-featured-image" style="margin-bottom:2rem;">
                    <?php the_post_thumbnail( 'large', array( 'style' => 'border-radius:8px;width:100%;height:auto;' ) ); ?>
                </figure>
                <?php endif; ?>

                <div class="entry-content">
                    <?php
                    the_content();
                    wp_link_pages( array(
                        'before' => '<nav class="page-links"><span>' . esc_html__( 'الصفحات:', 'palestinian-archive' ) . '</span>',
                        'after'  => '</nav>',
                    ) );
                    ?>
                </div>

                <?php if ( comments_open() || get_comments_number() ) : ?>
                    <?php comments_template(); ?>
                <?php endif; ?>

            </article>
        </main>

        <?php get_sidebar(); ?>

    </div>
</div>

<?php endwhile; ?>

<?php get_footer(); ?>
