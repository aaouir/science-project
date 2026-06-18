<?php
/**
 * Template Part: Document Card
 *
 * @package Palestinian_Archive
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'document-card' ); ?> itemscope itemtype="https://schema.org/ArchiveComponent">
    <?php if ( has_post_thumbnail() ) : ?>
    <div class="card-thumbnail">
        <a href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
            <?php the_post_thumbnail( 'medium', array( 'loading' => 'lazy', 'itemprop' => 'image' ) ); ?>
        </a>
        <?php $types = get_the_terms( get_the_ID(), 'pa_doc_type' );
        if ( $types && ! is_wp_error( $types ) ) : ?>
            <span class="card-type-badge"><?php echo esc_html( $types[0]->name ); ?></span>
        <?php endif; ?>
    </div>
    <?php endif; ?>
    <div class="card-body">
        <h2 class="card-title" itemprop="name">
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </h2>
        <?php pa_display_document_meta(); ?>
        <p class="card-excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 18, '...' ) ); ?></p>
        <div class="card-footer">
            <span class="card-date"><?php echo esc_html( get_the_date() ); ?></span>
            <a href="<?php the_permalink(); ?>" class="card-link"><?php esc_html_e( 'عرض', 'palestinian-archive' ); ?> &rarr;</a>
        </div>
    </div>
</article>
