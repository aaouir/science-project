<?php
$meta     = pa_get_meta();
$period   = wp_get_post_terms( get_the_ID(), 'pa_period', [ 'fields' => 'names' ] );
$doc_type = wp_get_post_terms( get_the_ID(), 'pa_doc_type', [ 'fields' => 'names' ] );
?>
<article <?php post_class( 'document-card' ); ?>>
  <?php if ( has_post_thumbnail() ) : ?>
    <div class="card-thumbnail">
      <?php the_post_thumbnail( 'pa-card' ); ?>
      <?php if ( ! empty( $doc_type ) ) echo '<span class="card-type-badge">' . esc_html( $doc_type[0] ) . '</span>'; ?>
    </div>
  <?php endif; ?>
  <div class="card-body">
    <div class="document-meta">
      <?php if ( $meta['date'] ) echo '<span class="meta-item meta-date">📅 ' . esc_html($meta['date']) . '</span>'; ?>
      <?php if ( $meta['location'] ) echo '<span class="meta-item meta-location">📍 ' . esc_html($meta['location']) . '</span>'; ?>
      <?php if ( ! empty($period) ) echo '<span class="meta-item meta-period">🏺 ' . esc_html($period[0]) . '</span>'; ?>
    </div>
    <h2 class="card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
    <p class="card-excerpt"><?php echo wp_trim_words( get_the_excerpt(), 18 ); ?></p>
  </div>
  <div class="card-footer">
    <time datetime="<?php echo get_the_date('c'); ?>"><?php echo get_the_date(); ?></time>
    <a href="<?php the_permalink(); ?>" class="card-link"><?php esc_html_e( 'عرض ←', 'palestinian-archive' ); ?></a>
  </div>
</article>
