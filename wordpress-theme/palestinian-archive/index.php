<?php
/**
 * Main Index / Homepage Template
 *
 * @package Palestinian_Archive
 */

get_header();
?>

<!-- Hero Section -->
<section class="hero-section" aria-label="<?php esc_attr_e( 'الصفحة الرئيسية', 'palestinian-archive' ); ?>">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="hero-overlay" aria-hidden="true"></div>
    <div class="hero-pattern" aria-hidden="true"></div>
    <div class="container">
        <div class="hero-content">
            <span class="hero-eyebrow"><?php esc_html_e( 'الأرشيف الرقمي الفلسطيني', 'palestinian-archive' ); ?></span>
            <h1 class="hero-title">
                <?php echo esc_html( get_theme_mod( 'pa_hero_title', __( 'أرشيف الذاكرة الفلسطينية', 'palestinian-archive' ) ) ); ?>
            </h1>
            <p class="hero-subtitle">
                <?php echo esc_html( get_theme_mod( 'pa_hero_subtitle', __( 'حفظ التراث والتاريخ الفلسطيني للأجيال القادمة — نسعى إلى توثيق كل وثيقة، صورة، وشهادة تروي قصة شعبنا', 'palestinian-archive' ) ) ); ?>
            </p>
            <div class="hero-actions">
                <a href="<?php echo esc_url( get_post_type_archive_link( 'pa_document' ) ); ?>" class="btn btn-gold">
                    <?php esc_html_e( 'تصفح الأرشيف', 'palestinian-archive' ); ?>
                </a>
                <a href="<?php echo esc_url( home_url( '/about' ) ); ?>" class="btn btn-outline" style="border-color:#fff;color:#fff;">
                    <?php esc_html_e( 'تعرف علينا', 'palestinian-archive' ); ?>
                </a>
            </div>
            <div class="hero-stats">
                <?php
                $stats = array(
                    'pa_document'  => array( 'label' => __( 'وثيقة', 'palestinian-archive' ) ),
                    'pa_photo'     => array( 'label' => __( 'صورة', 'palestinian-archive' ) ),
                    'pa_testimony' => array( 'label' => __( 'شهادة', 'palestinian-archive' ) ),
                );
                foreach ( $stats as $cpt => $data ) :
                    $count = wp_count_posts( $cpt );
                    $pub   = isset( $count->publish ) ? intval( $count->publish ) : 0;
                ?>
                <div class="hero-stat-item">
                    <span class="hero-stat-number"><?php echo esc_html( number_format_i18n( $pub ) ); ?></span>
                    <span class="hero-stat-label"><?php echo esc_html( $data['label'] ); ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>

<!-- Main Content -->
<main id="site-main" role="main">

    <!-- Recent Documents Section -->
    <section class="section-recent-documents" style="padding: 4rem 0; background: var(--color-cream);">
        <div class="container">
            <h2 class="section-title"><?php esc_html_e( 'أحدث الوثائق', 'palestinian-archive' ); ?></h2>
            <p class="section-subtitle"><?php esc_html_e( 'آخر ما تمت إضافته إلى الأرشيف', 'palestinian-archive' ); ?></p>

            <?php
            $recent_docs = new WP_Query( array(
                'post_type'      => 'pa_document',
                'posts_per_page' => 6,
                'post_status'    => 'publish',
                'orderby'        => 'date',
                'order'          => 'DESC',
            ) );

            if ( $recent_docs->have_posts() ) :
            ?>
            <div class="documents-grid" id="recent-docs-grid">
                <?php while ( $recent_docs->have_posts() ) : $recent_docs->the_post(); ?>
                    <article class="document-card" itemscope itemtype="https://schema.org/ArchiveComponent">
                        <?php if ( has_post_thumbnail() ) : ?>
                        <div class="card-thumbnail">
                            <a href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
                                <?php the_post_thumbnail( 'medium', array( 'loading' => 'lazy', 'itemprop' => 'image' ) ); ?>
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
                            <h3 class="card-title" itemprop="name">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h3>
                            <?php pa_display_document_meta(); ?>
                            <p class="card-excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 18, '...' ) ); ?></p>
                            <div class="card-footer">
                                <span class="card-date"><?php echo esc_html( get_the_date() ); ?></span>
                                <a href="<?php the_permalink(); ?>" class="card-link"><?php esc_html_e( 'قراءة المزيد', 'palestinian-archive' ); ?> &rarr;</a>
                            </div>
                        </div>
                    </article>
                <?php endwhile; wp_reset_postdata(); ?>
            </div>
            <?php else : ?>
                <p class="no-results"><?php esc_html_e( 'لا توجد وثائق حتى الآن.', 'palestinian-archive' ); ?></p>
            <?php endif; ?>

            <div style="text-align:center;margin-top:2.5rem;">
                <a href="<?php echo esc_url( get_post_type_archive_link( 'pa_document' ) ); ?>" class="btn btn-primary">
                    <?php esc_html_e( 'تصفح جميع الوثائق', 'palestinian-archive' ); ?>
                </a>
            </div>
        </div>
    </section>

    <!-- Recent Photos Section -->
    <section class="section-recent-photos" style="padding: 4rem 0; background: var(--color-dark-cream);">
        <div class="container">
            <h2 class="section-title"><?php esc_html_e( 'من الأرشيف الفوتوغرافي', 'palestinian-archive' ); ?></h2>
            <p class="section-subtitle"><?php esc_html_e( 'صور تحكي قصة الشعب الفلسطيني', 'palestinian-archive' ); ?></p>
            <?php
            $recent_photos = new WP_Query( array(
                'post_type'      => 'pa_photo',
                'posts_per_page' => 4,
                'post_status'    => 'publish',
            ) );
            if ( $recent_photos->have_posts() ) :
            ?>
            <div class="documents-grid">
                <?php while ( $recent_photos->have_posts() ) : $recent_photos->the_post(); ?>
                    <article class="document-card">
                        <?php if ( has_post_thumbnail() ) : ?>
                        <div class="card-thumbnail">
                            <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( 'medium', array( 'loading' => 'lazy' ) ); ?></a>
                            <span class="card-type-badge"><?php esc_html_e( 'صورة', 'palestinian-archive' ); ?></span>
                        </div>
                        <?php endif; ?>
                        <div class="card-body">
                            <h3 class="card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                            <?php pa_display_document_meta(); ?>
                            <div class="card-footer">
                                <span class="card-date"><?php echo esc_html( get_the_date() ); ?></span>
                                <a href="<?php the_permalink(); ?>" class="card-link"><?php esc_html_e( 'عرض الصورة', 'palestinian-archive' ); ?></a>
                            </div>
                        </div>
                    </article>
                <?php endwhile; wp_reset_postdata(); ?>
            </div>
            <?php endif; ?>
            <div style="text-align:center;margin-top:2rem;">
                <a href="<?php echo esc_url( get_post_type_archive_link( 'pa_photo' ) ); ?>" class="btn btn-outline">
                    <?php esc_html_e( 'تصفح جميع الصور', 'palestinian-archive' ); ?>
                </a>
            </div>
        </div>
    </section>

    <!-- Recent Testimonies -->
    <section class="section-testimonies" style="padding: 4rem 0; background: var(--color-cream);">
        <div class="container">
            <h2 class="section-title"><?php esc_html_e( 'الشهادات الشفهية', 'palestinian-archive' ); ?></h2>
            <p class="section-subtitle"><?php esc_html_e( 'أصوات تاريخية لا تُنسى', 'palestinian-archive' ); ?></p>
            <?php
            $testimonies = new WP_Query( array(
                'post_type'      => 'pa_testimony',
                'posts_per_page' => 3,
                'post_status'    => 'publish',
            ) );
            if ( $testimonies->have_posts() ) :
            ?>
            <div class="documents-grid">
                <?php while ( $testimonies->have_posts() ) : $testimonies->the_post();
                    $speaker = get_post_meta( get_the_ID(), '_pa_speaker_name', true );
                    $village = get_post_meta( get_the_ID(), '_pa_speaker_village', true );
                ?>
                    <article class="document-card">
                        <?php if ( has_post_thumbnail() ) : ?>
                        <div class="card-thumbnail">
                            <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( 'medium', array( 'loading' => 'lazy' ) ); ?></a>
                            <span class="card-type-badge"><?php esc_html_e( 'شهادة', 'palestinian-archive' ); ?></span>
                        </div>
                        <?php endif; ?>
                        <div class="card-body">
                            <h3 class="card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                            <?php if ( $speaker ) : ?>
                                <div class="document-meta">
                                    <span class="meta-item">🎙 <?php echo esc_html( $speaker ); ?><?php echo $village ? ' — ' . esc_html( $village ) : ''; ?></span>
                                </div>
                            <?php endif; ?>
                            <p class="card-excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20, '...' ) ); ?></p>
                            <div class="card-footer">
                                <span class="card-date"><?php echo esc_html( get_the_date() ); ?></span>
                                <a href="<?php the_permalink(); ?>" class="card-link"><?php esc_html_e( 'استمع', 'palestinian-archive' ); ?></a>
                            </div>
                        </div>
                    </article>
                <?php endwhile; wp_reset_postdata(); ?>
            </div>
            <?php endif; ?>
        </div>
    </section>

</main><!-- #site-main -->

<?php get_footer(); ?>
