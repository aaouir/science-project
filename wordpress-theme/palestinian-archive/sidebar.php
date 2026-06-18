<?php
$sidebar_id = is_archive() ? 'sidebar-archive' : 'sidebar-primary';
?>
<aside id="sidebar" class="widget-area" role="complementary">

  <?php if ( is_active_sidebar( $sidebar_id ) ) : ?>
    <?php dynamic_sidebar( $sidebar_id ); ?>
  <?php elseif ( is_active_sidebar( 'sidebar-primary' ) ) : ?>
    <?php dynamic_sidebar( 'sidebar-primary' ); ?>
  <?php else : ?>

    <div class="widget">
      <h3 class="widget-title"><?php esc_html_e( 'بحث في الأرشيف', 'palestinian-archive' ); ?></h3>
      <form class="search-form" role="search" method="get" action="<?php echo esc_url( home_url('/') ); ?>">
        <div class="widget-search-form" style="display:flex;gap:.5rem;">
          <input type="search" name="s" placeholder="<?php esc_attr_e( 'ابحث...', 'palestinian-archive' ); ?>" class="search-field" value="<?php echo esc_attr( get_search_query() ); ?>">
          <button type="submit" class="search-submit"><?php esc_html_e( 'بحث', 'palestinian-archive' ); ?></button>
        </div>
      </form>
    </div>

    <div class="widget">
      <h3 class="widget-title"><?php esc_html_e( 'إحصائيات الأرشيف', 'palestinian-archive' ); ?></h3>
      <div class="stats-grid">
        <?php foreach ( [ 'pa_document' => ['وثيقة','📄'], 'pa_photo' => ['صورة','🖼'], 'pa_video' => ['فيديو','🎬'], 'pa_testimony' => ['شهادة','🎙'] ] as $type => [$label,$icon] ) :
            $count = wp_count_posts( $type )->publish; ?>
          <div class="stat-item">
            <span class="stat-num"><?php echo number_format_i18n( $count ); ?></span>
            <span class="stat-lbl"><?php echo $icon . ' ' . esc_html( $label ); ?></span>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <div class="widget">
      <h3 class="widget-title"><?php esc_html_e( 'الحقب التاريخية', 'palestinian-archive' ); ?></h3>
      <div class="period-timeline">
        <?php
        $periods = get_terms( [ 'taxonomy' => 'pa_period', 'hide_empty' => false, 'number' => 10 ] );
        if ( ! is_wp_error( $periods ) ) :
            foreach ( $periods as $p ) : ?>
              <div class="timeline-item">
                <span class="timeline-dot"></span>
                <a href="<?php echo esc_url( get_term_link($p) ); ?>" style="text-decoration:none;display:block;">
                  <span class="timeline-name"><?php echo esc_html( $p->name ); ?></span>
                  <span class="timeline-count"><?php echo number_format_i18n( $p->count ) . ' ' . __( 'سجل', 'palestinian-archive' ); ?></span>
                </a>
              </div>
            <?php endforeach;
        endif; ?>
      </div>
    </div>

    <div class="widget">
      <h3 class="widget-title"><?php esc_html_e( 'المناطق الجغرافية', 'palestinian-archive' ); ?></h3>
      <ul>
        <?php
        $locs = get_terms( [ 'taxonomy' => 'pa_location_tax', 'hide_empty' => false, 'number' => 8 ] );
        if ( ! is_wp_error( $locs ) ) :
            foreach ( $locs as $l ) :
                printf( '<li><a href="%s">%s <span class="count">%d</span></a></li>',
                    esc_url( get_term_link($l) ), esc_html( $l->name ), $l->count );
            endforeach;
        endif; ?>
      </ul>
    </div>

  <?php endif; ?>
</aside>
