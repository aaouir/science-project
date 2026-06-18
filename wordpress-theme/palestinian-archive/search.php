<?php
/**
 * Search Results Template
 *
 * @package Palestinian_Archive
 */

get_header();

$search_query = get_search_query();
$found_posts  = $wp_query->found_posts;
?>

<!-- Search Header -->
<div class="search-header">
    <div class="container">
        <h1 class="search-title">
            <?php esc_html_e( 'نتائج البحث عن:', 'palestinian-archive' ); ?>
            <span class="search-query">&ldquo;<?php echo esc_html( $search_query ); ?>&rdquo;</span>
        </h1>
        <p class="search-count">
            <?php printf(
                esc_html( _n( 'تم العثور على نتيجة واحدة', 'تم العثور على %d نتيجة', $found_posts, 'palestinian-archive' ) ),
                esc_html( number_format_i18n( $found_posts ) )
            ); ?>
        </p>

        <!-- Refine Search -->
        <form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" style="margin-top:1rem;display:flex;gap:0.5rem;max-width:500px;">
            <input type="search" name="s" value="<?php echo esc_attr( $search_query ); ?>"
                   class="filter-select" style="flex:1;padding:0.6rem 1rem;"
                   placeholder="<?php esc_attr_e( 'بحث جديد...', 'palestinian-archive' ); ?>">
            <button type="submit" class="btn btn-primary"><?php esc_html_e( 'بحث', 'palestinian-archive' ); ?></button>
        </form>
    </div>
</div>

<div class="container" style="padding-top:2rem;">
    <div class="content-wrapper">

        <main id="site-main" role="main">
            <?php if ( have_posts() ) : ?>

                <?php pa_breadcrumb(); ?>

                <div class="search-results-list">
                    <?php while ( have_posts() ) : the_post(); ?>
                        <article id="post-<?php the_ID(); ?>" <?php post_class( 'search-result-item' ); ?>>

                            <?php if ( has_post_thumbnail() ) : ?>
                                <img src="<?php echo esc_url( get_the_post_thumbnail_url( null, 'thumbnail' ) ); ?>"
                                     alt="<?php echo esc_attr( get_the_title() ); ?>"
                                     class="search-result-thumb" loading="lazy">
                            <?php endif; ?>

                            <div class="search-result-body">
                                <h2>
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                </h2>

                                <?php
                                $pt_obj = get_post_type_object( get_post_type() );
                                if ( $pt_obj ) :
                                ?>
                                    <div class="document-meta" style="margin:0.5rem 0;">
                                        <span class="meta-item">
                                            📁 <?php echo esc_html( $pt_obj->labels->singular_name ); ?>
                                        </span>
                                        <span class="meta-item">
                                            📅 <?php echo esc_html( get_the_date() ); ?>
                                        </span>
                                    </div>
                                <?php endif; ?>

                                <p class="search-result-excerpt">
                                    <?php echo esc_html( wp_trim_words( get_the_excerpt(), 25, '...' ) ); ?>
                                </p>

                                <a href="<?php the_permalink(); ?>" class="btn btn-outline" style="margin-top:0.75rem;font-size:0.85rem;padding:0.4rem 1rem;">
                                    <?php esc_html_e( 'عرض', 'palestinian-archive' ); ?> &rarr;
                                </a>
                            </div>

                        </article>
                    <?php endwhile; ?>
                </div><!-- .search-results-list -->

                <!-- Pagination -->
                <div class="pagination" style="margin-top:2.5rem;">
                    <?php
                    the_posts_pagination( array(
                        'mid_size'  => 2,
                        'prev_text' => __( '&larr; السابق', 'palestinian-archive' ),
                        'next_text' => __( 'التالي &rarr;', 'palestinian-archive' ),
                    ) );
                    ?>
                </div>

            <?php else : ?>

                <div style="text-align:center;padding:4rem 0;">
                    <div style="font-size:4rem;margin-bottom:1rem;opacity:0.4;">🔍</div>
                    <h2 style="color:var(--color-brown);margin-bottom:1rem;">
                        <?php esc_html_e( 'لم يتم العثور على نتائج', 'palestinian-archive' ); ?>
                    </h2>
                    <p style="color:var(--color-text-light);margin-bottom:2rem;max-width:450px;margin-left:auto;margin-right:auto;">
                        <?php printf(
                            esc_html__( 'لم نجد أي نتائج تطابق "%s". جرب كلمات مختلفة أو تصفح الأرشيف مباشرة.', 'palestinian-archive' ),
                            esc_html( $search_query )
                        ); ?>
                    </p>
                    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
                        <a href="<?php echo esc_url( get_post_type_archive_link( 'pa_document' ) ); ?>" class="btn btn-primary">
                            <?php esc_html_e( 'تصفح الوثائق', 'palestinian-archive' ); ?>
                        </a>
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-outline">
                            <?php esc_html_e( 'العودة للرئيسية', 'palestinian-archive' ); ?>
                        </a>
                    </div>
                </div>

            <?php endif; ?>
        </main>

        <?php get_sidebar(); ?>

    </div>
</div>

<?php get_footer(); ?>
