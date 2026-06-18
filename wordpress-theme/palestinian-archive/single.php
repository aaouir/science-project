<?php
/**
 * Single Post / Document Template
 *
 * @package Palestinian_Archive
 */

get_header();

while ( have_posts() ) : the_post();
    $post_type    = get_post_type();
    $is_document  = in_array( $post_type, array( 'pa_document', 'pa_photo', 'pa_testimony', 'pa_event' ) );
    $meta         = $is_document ? pa_get_document_meta() : array();
    $transcription = get_post_meta( get_the_ID(), '_pa_transcription', true );
    $translation   = get_post_meta( get_the_ID(), '_pa_translation_en', true );
    $speaker_name  = get_post_meta( get_the_ID(), '_pa_speaker_name', true );
    $speaker_village = get_post_meta( get_the_ID(), '_pa_speaker_village', true );
?>

<div class="single-header">
    <div class="container">
        <?php pa_breadcrumb(); ?>
        <h1 class="single-title"><?php the_title(); ?></h1>
        <?php if ( $is_document ) pa_display_document_meta(); ?>
    </div>
</div>

<div class="container">
    <div class="content-wrapper<?php echo ! is_active_sidebar( 'main-sidebar' ) ? ' no-sidebar' : ''; ?>">

        <main id="site-main" role="main">
            <article id="post-<?php the_ID(); ?>" <?php post_class( 'entry' ); ?> itemscope itemtype="https://schema.org/Article">

                <?php if ( has_post_thumbnail() ) : ?>
                <figure class="entry-featured-image" style="margin-bottom:2rem;">
                    <?php the_post_thumbnail( 'large', array( 'class' => 'featured-image', 'itemprop' => 'image', 'style' => 'border-radius:8px;width:100%;height:auto;max-height:500px;object-fit:cover;' ) ); ?>
                    <?php if ( get_the_post_thumbnail_caption() ) : ?>
                        <figcaption style="font-size:0.85rem;color:var(--color-text-light);margin-top:0.5rem;text-align:center;"><?php echo esc_html( get_the_post_thumbnail_caption() ); ?></figcaption>
                    <?php endif; ?>
                </figure>
                <?php endif; ?>

                <?php if ( $speaker_name && $post_type === 'pa_testimony' ) : ?>
                <div class="notice notice-info" style="margin-bottom:1.5rem;">
                    <strong><?php esc_html_e( 'الشاهد:', 'palestinian-archive' ); ?></strong>
                    <?php echo esc_html( $speaker_name ); ?>
                    <?php if ( $speaker_village ) echo ' — ' . esc_html( $speaker_village ); ?>
                </div>
                <?php endif; ?>

                <div class="entry-content" itemprop="articleBody">
                    <?php the_content( __( 'اقرأ المزيد &hellip;', 'palestinian-archive' ) ); ?>
                    <?php
                    wp_link_pages( array(
                        'before' => '<nav class="page-links"><span>' . esc_html__( 'الصفحات:', 'palestinian-archive' ) . '</span>',
                        'after'  => '</nav>',
                    ) );
                    ?>
                </div>

                <?php if ( $transcription ) : ?>
                <section class="entry-transcription" style="margin-top:2.5rem;padding:2rem;background:var(--color-dark-cream);border-radius:8px;">
                    <h2 style="font-size:1.2rem;margin-bottom:1rem;color:var(--color-brown);"><?php esc_html_e( 'النص المكتوب / Transcription', 'palestinian-archive' ); ?></h2>
                    <div class="transcription-text" style="line-height:2;font-size:1.05rem;"><?php echo wp_kses_post( $transcription ); ?></div>
                </section>
                <?php endif; ?>

                <?php if ( $translation ) : ?>
                <section class="entry-translation lang-en" style="margin-top:1.5rem;padding:2rem;background:#fff;border:1px solid var(--color-dark-cream);border-radius:8px;">
                    <h2 style="font-size:1.2rem;margin-bottom:1rem;color:var(--color-brown);">English Translation</h2>
                    <div class="translation-text" style="line-height:1.9;font-size:1rem;"><?php echo wp_kses_post( $translation ); ?></div>
                </section>
                <?php endif; ?>

                <!-- Tags / Terms -->
                <?php
                $taxonomies = array(
                    'pa_period'   => __( 'الحقبة:', 'palestinian-archive' ),
                    'pa_location' => __( 'الموقع:', 'palestinian-archive' ),
                    'pa_topic'    => __( 'الموضوع:', 'palestinian-archive' ),
                    'pa_doc_type' => __( 'نوع الوثيقة:', 'palestinian-archive' ),
                );
                echo '<div class="entry-taxonomies" style="margin-top:2rem;display:flex;flex-wrap:wrap;gap:0.75rem;">';
                foreach ( $taxonomies as $tax => $label ) {
                    $terms = get_the_terms( get_the_ID(), $tax );
                    if ( $terms && ! is_wp_error( $terms ) ) {
                        echo '<div class="taxonomy-row" style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">';
                        echo '<strong style="font-size:0.85rem;color:var(--color-text-light);">' . esc_html( $label ) . '</strong>';
                        foreach ( $terms as $term ) {
                            echo '<a href="' . esc_url( get_term_link( $term ) ) . '" class="meta-item" style="text-decoration:none;">' . esc_html( $term->name ) . '</a>';
                        }
                        echo '</div>';
                    }
                }
                echo '</div>';
                ?>

                <!-- Post Navigation -->
                <nav class="post-navigation" aria-label="<?php esc_attr_e( 'التنقل بين المقالات', 'palestinian-archive' ); ?>">
                    <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--color-dark-cream);">
                        <?php
                        $prev = get_previous_post();
                        $next = get_next_post();
                        if ( $prev ) :
                        ?>
                        <div>
                            <span style="font-size:0.8rem;color:var(--color-text-light);"><?php esc_html_e( '← السابق', 'palestinian-archive' ); ?></span><br>
                            <a href="<?php echo esc_url( get_permalink( $prev->ID ) ); ?>" style="font-weight:600;color:var(--color-olive);"><?php echo esc_html( $prev->post_title ); ?></a>
                        </div>
                        <?php endif; if ( $next ) : ?>
                        <div style="text-align:<?php echo is_rtl() ? 'left' : 'right'; ?>;">
                            <span style="font-size:0.8rem;color:var(--color-text-light);"><?php esc_html_e( 'التالي →', 'palestinian-archive' ); ?></span><br>
                            <a href="<?php echo esc_url( get_permalink( $next->ID ) ); ?>" style="font-weight:600;color:var(--color-olive);"><?php echo esc_html( $next->post_title ); ?></a>
                        </div>
                        <?php endif; ?>
                    </div>
                </nav>

            </article><!-- .entry -->

            <?php comments_template(); ?>

        </main><!-- #site-main -->

        <?php get_sidebar(); ?>

    </div><!-- .content-wrapper -->
</div><!-- .container -->

<?php endwhile; ?>

<?php get_footer(); ?>
