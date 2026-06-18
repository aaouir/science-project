<?php
/**
 * Archive Template
 *
 * @package Palestinian_Archive
 */

get_header();

$post_type_obj  = get_queried_object();
$current_pt     = get_query_var( 'post_type' ) ?: 'post';
$archive_title  = get_the_archive_title();
$archive_desc   = get_the_archive_description();

// Build filter options
$periods   = get_terms( array( 'taxonomy' => 'pa_period',   'hide_empty' => true ) );
$locations = get_terms( array( 'taxonomy' => 'pa_location', 'hide_empty' => true ) );
$topics    = get_terms( array( 'taxonomy' => 'pa_topic',    'hide_empty' => true ) );

$active_period   = sanitize_text_field( $_GET['period'] ?? '' );
$active_location = sanitize_text_field( $_GET['location'] ?? '' );
$active_topic    = sanitize_text_field( $_GET['topic'] ?? '' );
?>

<!-- Archive Header -->
<div class="single-header" style="min-height:auto;padding:2.5rem 0;">
    <div class="container">
        <?php pa_breadcrumb(); ?>
        <h1 class="single-title"><?php echo esc_html( $archive_title ); ?></h1>
        <?php if ( $archive_desc ) : ?>
            <div class="archive-description" style="color:rgba(255,255,255,0.85);max-width:600px;margin-top:0.5rem;"><?php echo wp_kses_post( $archive_desc ); ?></div>
        <?php endif; ?>
    </div>
</div>

<!-- Filter Bar -->
<div class="archive-filter-bar" id="archiveFilterBar">
    <div class="container">
        <div class="filter-bar-inner">
            <span class="filter-label"><?php esc_html_e( 'تصفية:', 'palestinian-archive' ); ?></span>

            <?php if ( ! empty( $periods ) && ! is_wp_error( $periods ) ) : ?>
            <select class="filter-select" id="filterPeriod" name="period" aria-label="<?php esc_attr_e( 'الحقبة التاريخية', 'palestinian-archive' ); ?>">
                <option value=""><?php esc_html_e( '— الحقبة التاريخية —', 'palestinian-archive' ); ?></option>
                <?php foreach ( $periods as $p ) : ?>
                    <option value="<?php echo esc_attr( $p->slug ); ?>" <?php selected( $active_period, $p->slug ); ?>><?php echo esc_html( $p->name ); ?> (<?php echo esc_html( $p->count ); ?>)</option>
                <?php endforeach; ?>
            </select>
            <?php endif; ?>

            <?php if ( ! empty( $locations ) && ! is_wp_error( $locations ) ) : ?>
            <select class="filter-select" id="filterLocation" name="location" aria-label="<?php esc_attr_e( 'الموقع الجغرافي', 'palestinian-archive' ); ?>">
                <option value=""><?php esc_html_e( '— الموقع —', 'palestinian-archive' ); ?></option>
                <?php foreach ( $locations as $l ) : ?>
                    <option value="<?php echo esc_attr( $l->slug ); ?>" <?php selected( $active_location, $l->slug ); ?>><?php echo esc_html( $l->name ); ?> (<?php echo esc_html( $l->count ); ?>)</option>
                <?php endforeach; ?>
            </select>
            <?php endif; ?>

            <?php if ( ! empty( $topics ) && ! is_wp_error( $topics ) ) : ?>
            <select class="filter-select" id="filterTopic" name="topic" aria-label="<?php esc_attr_e( 'الموضوع', 'palestinian-archive' ); ?>">
                <option value=""><?php esc_html_e( '— الموضوع —', 'palestinian-archive' ); ?></option>
                <?php foreach ( $topics as $t ) : ?>
                    <option value="<?php echo esc_attr( $t->slug ); ?>" <?php selected( $active_topic, $t->slug ); ?>><?php echo esc_html( $t->name ); ?> (<?php echo esc_html( $t->count ); ?>)</option>
                <?php endforeach; ?>
            </select>
            <?php endif; ?>

            <button class="filter-reset" id="filterReset"><?php esc_html_e( 'إعادة ضبط الفلتر', 'palestinian-archive' ); ?></button>

            <span class="filter-results-count" id="filterCount">
                <?php printf( esc_html__( '%d نتيجة', 'palestinian-archive' ), $wp_query->found_posts ); ?>
            </span>
        </div>
    </div>
</div>

<!-- Archive Content -->
<div class="container" style="padding-top:0;">
    <div class="content-wrapper">

        <main id="site-main" role="main">
            <div class="documents-grid" id="archiveGrid" data-post-type="<?php echo esc_attr( $current_pt ); ?>">
                <?php if ( have_posts() ) : ?>
                    <?php while ( have_posts() ) : the_post(); ?>
                        <article id="post-<?php the_ID(); ?>" <?php post_class( 'document-card' ); ?> itemscope itemtype="https://schema.org/ArchiveComponent">
                            <?php if ( has_post_thumbnail() ) : ?>
                            <div class="card-thumbnail">
                                <a href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
                                    <?php the_post_thumbnail( 'medium', array( 'loading' => 'lazy' ) ); ?>
                                </a>
                                <?php
                                $doc_types = get_the_terms( get_the_ID(), 'pa_doc_type' );
                                if ( $doc_types && ! is_wp_error( $doc_types ) ) :
                                ?>
                                    <span class="card-type-badge"><?php echo esc_html( $doc_types[0]->name ); ?></span>
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
                    <?php endwhile; ?>
                <?php else : ?>
                    <div class="no-results" style="grid-column:1/-1;text-align:center;padding:3rem;">
                        <p><?php esc_html_e( 'لا توجد نتائج تطابق معايير البحث.', 'palestinian-archive' ); ?></p>
                        <a href="<?php echo esc_url( remove_query_arg( array( 'period', 'location', 'topic' ) ) ); ?>" class="btn btn-outline" style="margin-top:1rem;"><?php esc_html_e( 'عرض الكل', 'palestinian-archive' ); ?></a>
                    </div>
                <?php endif; ?>
            </div><!-- #archiveGrid -->

            <!-- Archive Loading Spinner (shown during AJAX) -->
            <div class="archive-loading" id="archiveLoading" style="display:none;">
                <div class="loading-spinner"></div>
            </div>

            <!-- Pagination -->
            <div class="pagination">
                <?php
                the_posts_pagination( array(
                    'mid_size'  => 2,
                    'prev_text' => is_rtl() ? '&rarr; ' . __( 'السابق', 'palestinian-archive' ) : '&larr; ' . __( 'Previous', 'palestinian-archive' ),
                    'next_text' => is_rtl() ? __( 'التالي', 'palestinian-archive' ) . ' &larr;' : __( 'Next', 'palestinian-archive' ) . ' &rarr;',
                ) );
                ?>
            </div>

        </main><!-- #site-main -->

        <?php get_sidebar( 'archive' ); ?>

    </div><!-- .content-wrapper -->
</div><!-- .container -->

<?php get_footer(); ?>
