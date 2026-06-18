<?php
/**
 * Palestinian Archive — functions.php
 */
if ( ! defined( 'ABSPATH' ) ) exit;

define( 'PA_VERSION', '1.0.0' );
define( 'PA_DIR',     get_template_directory() );
define( 'PA_URI',     get_template_directory_uri() );

function pa_setup() {
    load_theme_textdomain( 'palestinian-archive', PA_DIR . '/languages' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', [ 'height' => 100, 'width' => 100, 'flex-height' => true, 'flex-width' => true ] );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'script', 'style' ] );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'customize-selective-refresh-widgets' );
    add_theme_support( 'wp-block-styles' );
    add_theme_support( 'responsive-embeds' );
    add_image_size( 'pa-card',  600, 450, true );
    add_image_size( 'pa-hero', 1400, 600, true );
    add_image_size( 'pa-thumb', 200, 150, true );
    register_nav_menus( [
        'primary'  => __( 'القائمة الرئيسية', 'palestinian-archive' ),
        'footer-1' => __( 'تذييل ١', 'palestinian-archive' ),
        'footer-2' => __( 'تذييل ٢', 'palestinian-archive' ),
        'footer-3' => __( 'تذييل ٣', 'palestinian-archive' ),
    ] );
}
add_action( 'after_setup_theme', 'pa_setup' );

function pa_enqueue() {
    wp_enqueue_style( 'pa-fonts', 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Arabic:wght@400;600;700&display=swap', [], null );
    wp_enqueue_style( 'pa-style', get_stylesheet_uri(), [ 'pa-fonts' ], PA_VERSION );
    wp_enqueue_script( 'pa-main', PA_URI . '/js/main.js', [], PA_VERSION, true );
    wp_localize_script( 'pa-main', 'PA_DATA', [
        'ajaxurl' => admin_url( 'admin-ajax.php' ),
        'nonce'   => wp_create_nonce( 'pa_nonce' ),
        'lang'    => get_locale(),
        'i18n'    => [ 'noResults' => __( 'لا توجد نتائج', 'palestinian-archive' ), 'loading' => __( 'جار التحميل...', 'palestinian-archive' ) ],
    ] );
    if ( is_singular() ) wp_enqueue_script( 'comment-reply' );
}
add_action( 'wp_enqueue_scripts', 'pa_enqueue' );

require_once PA_DIR . '/inc/custom-post-types.php';
require_once PA_DIR . '/inc/widgets.php';

function pa_register_sidebars() {
    $d = [ 'before_widget' => '<div id="%1$s" class="widget %2$s">', 'after_widget' => '</div>', 'before_title' => '<h3 class="widget-title">', 'after_title' => '</h3>' ];
    register_sidebar( $d + [ 'name' => __( 'الشريط الجانبي', 'palestinian-archive' ), 'id' => 'sidebar-primary' ] );
    register_sidebar( $d + [ 'name' => __( 'شريط الأرشيف', 'palestinian-archive' ),   'id' => 'sidebar-archive' ] );
    for ( $i = 1; $i <= 4; $i++ ) {
        register_sidebar( $d + [ 'name' => sprintf( __( 'تذييل — عمود %d', 'palestinian-archive' ), $i ), 'id' => "footer-{$i}" ] );
    }
}
add_action( 'widgets_init', 'pa_register_sidebars' );

add_filter( 'body_class', function( $c ) { if ( is_rtl() ) $c[] = 'rtl'; return $c; } );
add_filter( 'excerpt_length', fn() => 28 );
add_filter( 'excerpt_more', fn() => '...' );
add_filter( 'document_title_separator', fn() => '|' );

function pa_breadcrumb() {
    if ( is_front_page() ) return;
    $sep = '<span class="breadcrumb-sep"> / </span>';
    $crumbs = [ '<a href="' . home_url('/') . '">' . __( 'الرئيسية', 'palestinian-archive' ) . '</a>' ];
    if ( is_singular() ) {
        $obj = get_post_type_object( get_post_type() );
        if ( $obj && get_post_type_archive_link( get_post_type() ) )
            $crumbs[] = '<a href="' . get_post_type_archive_link( get_post_type() ) . '">' . $obj->labels->name . '</a>';
        $crumbs[] = '<span class="current">' . get_the_title() . '</span>';
    } elseif ( is_archive() ) {
        $crumbs[] = '<span class="current">' . get_the_archive_title() . '</span>';
    } elseif ( is_search() ) {
        $crumbs[] = '<span class="current">' . sprintf( __( 'بحث: %s', 'palestinian-archive' ), get_search_query() ) . '</span>';
    } elseif ( is_404() ) {
        $crumbs[] = '<span class="current">404</span>';
    }
    echo '<nav class="breadcrumb">' . implode( $sep, $crumbs ) . '</nav>';
}

function pa_add_meta_boxes() {
    add_meta_box( 'pa_doc_details', __( 'تفاصيل الوثيقة', 'palestinian-archive' ), 'pa_render_meta_box', [ 'pa_document', 'pa_photo', 'pa_video', 'pa_testimony', 'pa_person' ], 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'pa_add_meta_boxes' );

function pa_render_meta_box( $post ) {
    wp_nonce_field( 'pa_save_meta', 'pa_meta_nonce' );
    $fields = [
        'pa_date_original'  => __( 'تاريخ الوثيقة', 'palestinian-archive' ),
        'pa_location_text'  => __( 'الموقع الجغرافي', 'palestinian-archive' ),
        'pa_source'         => __( 'المصدر', 'palestinian-archive' ),
        'pa_archive_number' => __( 'رقم الأرشيف', 'palestinian-archive' ),
        'pa_language'       => __( 'لغة الوثيقة', 'palestinian-archive' ),
        'pa_digitized_by'   => __( 'رُقِّم بواسطة', 'palestinian-archive' ),
        'pa_rights'         => __( 'حقوق الملكية', 'palestinian-archive' ),
    ];
    echo '<table class="form-table"><tbody>';
    foreach ( $fields as $key => $label ) {
        $val = esc_attr( get_post_meta( $post->ID, $key, true ) );
        echo "<tr><th><label for=\"{$key}\">{$label}</label></th><td><input type=\"text\" id=\"{$key}\" name=\"{$key}\" value=\"{$val}\" class=\"regular-text\"></td></tr>";
    }
    echo '</tbody></table>';
}

function pa_save_meta( $post_id ) {
    if ( ! isset( $_POST['pa_meta_nonce'] ) || ! wp_verify_nonce( $_POST['pa_meta_nonce'], 'pa_save_meta' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;
    foreach ( [ 'pa_date_original', 'pa_location_text', 'pa_source', 'pa_archive_number', 'pa_language', 'pa_digitized_by', 'pa_rights' ] as $k ) {
        if ( isset( $_POST[ $k ] ) ) update_post_meta( $post_id, $k, sanitize_text_field( $_POST[ $k ] ) );
    }
}
add_action( 'save_post', 'pa_save_meta' );

function pa_get_meta( $post_id = null ) {
    $id = $post_id ?: get_the_ID();
    return [
        'date'     => get_post_meta( $id, 'pa_date_original', true ),
        'location' => get_post_meta( $id, 'pa_location_text', true ),
        'source'   => get_post_meta( $id, 'pa_source', true ),
        'number'   => get_post_meta( $id, 'pa_archive_number', true ),
        'language' => get_post_meta( $id, 'pa_language', true ),
        'rights'   => get_post_meta( $id, 'pa_rights', true ),
    ];
}

function pa_ajax_filter() {
    check_ajax_referer( 'pa_nonce', 'nonce' );
    $args = [
        'post_type'      => sanitize_text_field( $_POST['post_type'] ?? 'pa_document' ),
        'posts_per_page' => 12,
        'paged'          => absint( $_POST['paged'] ?? 1 ),
        'tax_query'      => [],
    ];
    foreach ( [ 'pa_period', 'pa_location_tax', 'pa_doc_type', 'pa_topic' ] as $tax ) {
        $val = sanitize_text_field( $_POST[ $tax ] ?? '' );
        if ( $val ) $args['tax_query'][] = [ 'taxonomy' => $tax, 'field' => 'slug', 'terms' => $val ];
    }
    $s = sanitize_text_field( $_POST['s'] ?? '' );
    if ( $s ) $args['s'] = $s;
    $q = new WP_Query( $args );
    ob_start();
    if ( $q->have_posts() ) {
        while ( $q->have_posts() ) { $q->the_post(); get_template_part( 'template-parts/card', get_post_type() ); }
    } else {
        echo '<p class="no-results">' . esc_html__( 'لا توجد نتائج.', 'palestinian-archive' ) . '</p>';
    }
    wp_reset_postdata();
    wp_send_json_success( [ 'html' => ob_get_clean(), 'total' => $q->found_posts, 'maxPages' => $q->max_num_pages ] );
}
add_action( 'wp_ajax_pa_filter',        'pa_ajax_filter' );
add_action( 'wp_ajax_nopriv_pa_filter', 'pa_ajax_filter' );

add_action( 'wp_dashboard_setup', function() {
    wp_add_dashboard_widget( 'pa_stats', __( 'إحصائيات الأرشيف', 'palestinian-archive' ), function() {
        $types = [ 'pa_document' => 'الوثائق', 'pa_photo' => 'الصور', 'pa_video' => 'الفيديوهات', 'pa_testimony' => 'الشهادات', 'pa_person' => 'الأشخاص' ];
        echo '<ul>';
        foreach ( $types as $type => $label ) { $c = wp_count_posts( $type ); echo "<li><strong>{$label}:</strong> {$c->publish}</li>"; }
        echo '</ul>';
    } );
} );
