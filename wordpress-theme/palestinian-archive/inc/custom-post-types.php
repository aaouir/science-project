<?php
/**
 * Custom Post Types & Taxonomies
 */
if ( ! defined( 'ABSPATH' ) ) exit;

function pa_register_post_types() {
    $archive_icon = 'dashicons-archive';

    // DOCUMENTS
    register_post_type( 'pa_document', [
        'labels'        => pa_labels( __( 'الوثيقة', 'palestinian-archive' ), __( 'الوثائق', 'palestinian-archive' ) ),
        'public'        => true,
        'show_in_rest'  => true,
        'menu_icon'     => 'dashicons-media-document',
        'supports'      => [ 'title', 'editor', 'thumbnail', 'excerpt', 'revisions' ],
        'rewrite'       => [ 'slug' => 'documents' ],
        'has_archive'   => true,
        'show_in_menu'  => true,
        'menu_position' => 5,
    ] );

    // PHOTOS
    register_post_type( 'pa_photo', [
        'labels'       => pa_labels( __( 'الصورة', 'palestinian-archive' ), __( 'الصور', 'palestinian-archive' ) ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-format-image',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'rewrite'      => [ 'slug' => 'photos' ],
        'has_archive'  => true,
    ] );

    // VIDEOS
    register_post_type( 'pa_video', [
        'labels'       => pa_labels( __( 'الفيديو', 'palestinian-archive' ), __( 'الفيديوهات', 'palestinian-archive' ) ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-video-alt3',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'rewrite'      => [ 'slug' => 'videos' ],
        'has_archive'  => true,
    ] );

    // TESTIMONIES
    register_post_type( 'pa_testimony', [
        'labels'       => pa_labels( __( 'الشهادة', 'palestinian-archive' ), __( 'الشهادات', 'palestinian-archive' ) ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-format-quote',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'rewrite'      => [ 'slug' => 'testimonies' ],
        'has_archive'  => true,
    ] );

    // PERSONS
    register_post_type( 'pa_person', [
        'labels'       => pa_labels( __( 'الشخصية', 'palestinian-archive' ), __( 'الشخصيات', 'palestinian-archive' ) ),
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-admin-users',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
        'rewrite'      => [ 'slug' => 'persons' ],
        'has_archive'  => true,
    ] );
}
add_action( 'init', 'pa_register_post_types' );

function pa_labels( $singular, $plural ) {
    return [
        'name'               => $plural,
        'singular_name'      => $singular,
        'add_new'            => __( 'إضافة جديد', 'palestinian-archive' ),
        'add_new_item'       => sprintf( __( 'إضافة %s جديد', 'palestinian-archive' ), $singular ),
        'edit_item'          => sprintf( __( 'تعديل %s', 'palestinian-archive' ), $singular ),
        'new_item'           => sprintf( __( '%s جديد', 'palestinian-archive' ), $singular ),
        'view_item'          => sprintf( __( 'عرض %s', 'palestinian-archive' ), $singular ),
        'search_items'       => sprintf( __( 'بحث في %s', 'palestinian-archive' ), $plural ),
        'not_found'          => sprintf( __( 'لا يوجد %s', 'palestinian-archive' ), $plural ),
        'not_found_in_trash' => sprintf( __( 'لا يوجد %s في المهملات', 'palestinian-archive' ), $plural ),
        'all_items'          => sprintf( __( 'كل %s', 'palestinian-archive' ), $plural ),
        'menu_name'          => $plural,
    ];
}

function pa_register_taxonomies() {
    $post_types = [ 'pa_document', 'pa_photo', 'pa_video', 'pa_testimony', 'pa_person' ];

    // PERIOD (Historical period)
    register_taxonomy( 'pa_period', $post_types, [
        'labels'       => pa_tax_labels( __( 'الحقبة التاريخية', 'palestinian-archive' ), __( 'الحقب التاريخية', 'palestinian-archive' ) ),
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite'      => [ 'slug' => 'period' ],
        'show_admin_column' => true,
    ] );

    // LOCATION
    register_taxonomy( 'pa_location_tax', $post_types, [
        'labels'       => pa_tax_labels( __( 'المنطقة الجغرافية', 'palestinian-archive' ), __( 'المناطق الجغرافية', 'palestinian-archive' ) ),
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite'      => [ 'slug' => 'location' ],
        'show_admin_column' => true,
    ] );

    // DOCUMENT TYPE
    register_taxonomy( 'pa_doc_type', $post_types, [
        'labels'       => pa_tax_labels( __( 'نوع الوثيقة', 'palestinian-archive' ), __( 'أنواع الوثائق', 'palestinian-archive' ) ),
        'hierarchical' => false,
        'show_in_rest' => true,
        'rewrite'      => [ 'slug' => 'doc-type' ],
        'show_admin_column' => true,
    ] );

    // TOPIC
    register_taxonomy( 'pa_topic', $post_types, [
        'labels'       => pa_tax_labels( __( 'الموضوع', 'palestinian-archive' ), __( 'المواضيع', 'palestinian-archive' ) ),
        'hierarchical' => false,
        'show_in_rest' => true,
        'rewrite'      => [ 'slug' => 'topic' ],
        'show_admin_column' => true,
    ] );
}
add_action( 'init', 'pa_register_taxonomies' );

function pa_tax_labels( $singular, $plural ) {
    return [
        'name'          => $plural,
        'singular_name' => $singular,
        'all_items'     => sprintf( __( 'كل %s', 'palestinian-archive' ), $plural ),
        'edit_item'     => sprintf( __( 'تعديل %s', 'palestinian-archive' ), $singular ),
        'add_new_item'  => sprintf( __( 'إضافة %s جديد', 'palestinian-archive' ), $singular ),
        'search_items'  => sprintf( __( 'بحث في %s', 'palestinian-archive' ), $plural ),
        'not_found'     => __( 'لا يوجد', 'palestinian-archive' ),
        'menu_name'     => $plural,
    ];
}

// Add default terms on first activation
function pa_add_default_terms() {
    $periods = [
        'pre-1948'     => 'ما قبل النكبة (قبل 1948)',
        'nakba-1948'   => 'النكبة (1948)',
        '1948-1967'    => 'ما بين النكبتين (1948–1967)',
        'naksa-1967'   => 'النكسة (1967)',
        '1967-1987'    => 'مرحلة الاحتلال (1967–1987)',
        'first-intifada'  => 'الانتفاضة الأولى (1987–1993)',
        'oslo-period'     => 'مرحلة أوسلو (1993–2000)',
        'second-intifada' => 'الانتفاضة الثانية (2000–2005)',
        'post-2005'       => 'ما بعد 2005',
        'contemporary'    => 'المرحلة المعاصرة',
    ];
    foreach ( $periods as $slug => $name ) {
        if ( ! term_exists( $slug, 'pa_period' ) ) wp_insert_term( $name, 'pa_period', [ 'slug' => $slug ] );
    }

    $doc_types = [ 'وثيقة رسمية', 'رسالة', 'صحيفة', 'تقرير', 'خريطة', 'مخطوطة', 'فوتوغرافية', 'تسجيل صوتي', 'فيديو', 'شهادة شفهية', 'كتاب', 'دورية' ];
    foreach ( $doc_types as $type ) {
        if ( ! term_exists( $type, 'pa_doc_type' ) ) wp_insert_term( $type, 'pa_doc_type' );
    }
}
register_activation_hook( __FILE__, 'pa_add_default_terms' );
