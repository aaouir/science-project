import SwiftUI

struct ReelPlayerView: View {
    let reel: Reel
    var isVisible: Bool
    var onLike: () -> Void
    var onSave: () -> Void
    var onFollow: () -> Void

    @State private var isMuted: Bool = true
    @State private var isPlaying: Bool = false

    var body: some View {
        GeometryReader { geo in
            ZStack {
                Color.black

                // Thumbnail fallback background
                AsyncImage(url: URL(string: reel.thumbnailURL)) { phase in
                    if case .success(let img) = phase {
                        img
                            .resizable()
                            .scaledToFill()
                            .frame(width: geo.size.width, height: geo.size.height)
                            .clipped()
                    } else {
                        Rectangle().fill(Constants.Colors.card)
                    }
                }

                // Video player (only when visible)
                if isVisible, let url = URL(string: reel.videoURL), !reel.videoURL.isEmpty {
                    VideoPlayerView(url: url, isMuted: $isMuted)
                        .frame(width: geo.size.width, height: geo.size.height)
                        .clipped()
                }

                // Overlay
                ReelOverlayView(
                    reel: reel,
                    onLike: onLike,
                    onSave: onSave,
                    onFollow: onFollow,
                    isMuted: $isMuted
                )
            }
            .frame(width: geo.size.width, height: geo.size.height)
            .clipped()
        }
        .ignoresSafeArea()
    }
}
