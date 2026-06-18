<?php
/**
 * Custom Widgets
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/* ============================================================
   WIDGET: ARCHIVE SEARCH
   ============================================================ */
class PA_Search_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct( 'pa_search', __( 'بحث الأرشيف', 'palestinian-archive' ), [ 'description' => __( 'نموذج بحث متخصص للأرشيف', 'palestinian-archive' ) ] );
    }

    public function widget( $args, $instance ) {
        echo $args['before_widget'];
        $title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'بحث في الأرشيف', 'palestinian-archive' );
        echo $args['before_title'] . esc_html( $title ) . $args['after_title'];
        ?>
        <form class="search-form" role="search" method="get" action="<?php echo esc_url( home_url('/') ); ?>">
          <div class="widget-search-form">
            <input type="search" name="s" placeholder="<?php esc_attr_e( 'ابحث في الأرشيف...', 'palestinian-archive' ); ?>" class="search-field" value="<?php echo get_search_query(); ?>">
            <button type="submit" class="search-submit"><?php esc_html_e( 'بحث', 'palestinian-archive' ); ?></button>
          </div>
        </form>
        <?php
        echo $args['after_widget'];
    }

    public function form( $instance ) {
        $title = isset( $instance['title'] ) ? $instance['title'] : '';
        ?>
        <p>
          <label for="<?php echo $this->get_field_id('title'); ?>"><?php esc_html_e( 'العنوان:', 'palestinian-archive' ); ?></label>
          <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
        </p>
        <?php
    }

    public function update( $new, $old ) {
        $new['title'] = sanitize_text_field( $new['title'] );
        return $new;
    }
}

/* ============================================================
   WIDGET: ARCHIVE STATISTICS
   ============================================================ */
class PA_Stats_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct( 'pa_stats', __( 'إحصائيات الأرشيف', 'palestinian-archive' ), [ 'description' => __( 'عرض إحصائيات الأرشيف', 'palestinian-archive' ) ] );
    }

    public function widget( $args, $instance ) {
        echo $args['before_widget'];
        $title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'إحصائيات الأرشيف', 'palestinian-archive' );
        echo $args['before_title'] . esc_html( $title ) . $args['after_title'];
        $types = [
            'pa_document'  => [ 'الوثائق', '📄' ],
            'pa_photo'     => [ 'الصور', '🖼' ],
            'pa_video'     => [ 'الفيديوهات', '🎬' ],
            'pa_testimony' => [ 'الشهادات', '🎙' ],
            'pa_person'    => [ 'الشخصيات', '👤' ],
        ];
        echo '<div class="stats-grid">';
        foreach ( $types as $type => [ $label, $icon ] ) {
            $count = wp_count_posts( $type )->publish;
            echo '<div class="stat-item"><span class="stat-num">' . number_format_i18n( $count ) . '</span><span class="stat-lbl">' . $icon . ' ' . esc_html( $label ) . '</span></div>';
        }
        echo '</div>';
        echo $args['after_widget'];
    }

    public function form( $instance ) {
        $title = isset( $instance['title'] ) ? $instance['title'] : '';
        echo '<p><label>العنوان: <input class="widefat" name="' . $this->get_field_name('title') . '" value="' . esc_attr($title) . '"></label></p>';
    }

    public function update( $n, $o ) { $n['title'] = sanitize_text_field( $n['title'] ); return $n; }
}

/* ============================================================
   WIDGET: PERIOD TIMELINE
   ============================================================ */
class PA_Period_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct( 'pa_periods', __( 'الحقب التاريخية', 'palestinian-archive' ), [ 'description' => __( 'عرض الحقب التاريخية', 'palestinian-archive' ) ] );
    }

    public function widget( $args, $instance ) {
        $periods = get_terms( [ 'taxonomy' => 'pa_period', 'hide_empty' => false ] );
        if ( is_wp_error( $periods ) || empty( $periods ) ) return;

        echo $args['before_widget'];
        $title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'الحقب التاريخية', 'palestinian-archive' );
        echo $args['before_title'] . esc_html( $title ) . $args['after_title'];
        echo '<div class="period-timeline">';
        foreach ( $periods as $p ) {
            echo '<div class="timeline-item">';
            echo '<span class="timeline-dot"></span>';
            printf( '<a href="%s"><span class="timeline-name">%s</span> <span class="timeline-count">(%d)</span></a>',
                esc_url( get_term_link($p) ), esc_html($p->name), $p->count );
            echo '</div>';
        }
        echo '</div>';
        echo $args['after_widget'];
    }

    public function form( $instance ) {
        $title = isset( $instance['title'] ) ? $instance['title'] : '';
        echo '<p><label>العنوان: <input class="widefat" name="' . $this->get_field_name('title') . '" value="' . esc_attr($title) . '"></label></p>';
    }

    public function update( $n, $o ) { $n['title'] = sanitize_text_field( $n['title'] ); return $n; }
}

/* ============================================================
   WIDGET: RECENT DOCUMENTS
   ============================================================ */
class PA_Recent_Docs_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct( 'pa_recent_docs', __( 'أحدث الوثائق', 'palestinian-archive' ), [ 'description' => __( 'عرض أحدث الوثائق', 'palestinian-archive' ) ] );
    }

    public function widget( $args, $instance ) {
        $number = ! empty( $instance['number'] ) ? absint( $instance['number'] ) : 5;
        $type   = ! empty( $instance['post_type'] ) ? $instance['post_type'] : 'pa_document';

        $q = new WP_Query( [ 'post_type' => $type, 'posts_per_page' => $number, 'no_found_rows' => true ] );
        if ( ! $q->have_posts() ) return;

        echo $args['before_widget'];
        $title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'أحدث الوثائق', 'palestinian-archive' );
        echo $args['before_title'] . esc_html( $title ) . $args['after_title'];
        echo '<ul>';
        while ( $q->have_posts() ) { $q->the_post();
            echo '<li>';
            if ( has_post_thumbnail() ) echo '<a href="' . get_permalink() . '">' . get_the_post_thumbnail( null, 'pa-thumb', [ 'style' => 'width:50px;height:40px;object-fit:cover;border-radius:4px;float:' . ( is_rtl() ? 'left' : 'right' ) . ';margin-' . ( is_rtl() ? 'left' : 'right' ) . ':8px;' ] ) . '</a>';
            echo '<a href="' . get_permalink() . '" style="font-weight:600;font-size:.9rem;">' . get_the_title() . '</a>';
            echo '<span class="count" style="display:block;font-size:.75rem;color:#888;">' . get_the_date() . '</span>';
            echo '</li>';
        }
        wp_reset_postdata();
        echo '</ul>';
        echo $args['after_widget'];
    }

    public function form( $instance ) {
        $title  = isset( $instance['title'] )     ? $instance['title']     : '';
        $number = isset( $instance['number'] )    ? $instance['number']    : 5;
        $type   = isset( $instance['post_type'] ) ? $instance['post_type'] : 'pa_document';
        echo '<p><label>العنوان: <input class="widefat" name="' . $this->get_field_name('title') . '" value="' . esc_attr($title) . '"></label></p>';
        echo '<p><label>العدد: <input type="number" class="tiny-text" name="' . $this->get_field_name('number') . '" value="' . absint($number) . '" min="1" max="20" style="width:50px;"></label></p>';
    }

    public function update( $n, $o ) {
        $n['title']     = sanitize_text_field( $n['title'] );
        $n['number']    = absint( $n['number'] );
        $n['post_type'] = sanitize_key( $n['post_type'] );
        return $n;
    }
}

/* ============================================================
   REGISTER ALL
   ============================================================ */
add_action( 'widgets_init', function() {
    register_widget( 'PA_Search_Widget' );
    register_widget( 'PA_Stats_Widget' );
    register_widget( 'PA_Period_Widget' );
    register_widget( 'PA_Recent_Docs_Widget' );
} );
