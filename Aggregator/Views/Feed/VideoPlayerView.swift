import SwiftUI
import AVKit

struct VideoPlayerView: UIViewControllerRepresentable {
    let url: URL
    @Binding var isMuted: Bool

    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let player = AVPlayer(url: url)
        player.isMuted = isMuted
        player.play()

        // Loop
        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: player.currentItem,
            queue: .main
        ) { _ in
            player.seek(to: .zero)
            player.play()
        }

        let controller = AVPlayerViewController()
        controller.player = player
        controller.showsPlaybackControls = false
        controller.videoGravity = .resizeAspectFill
        context.coordinator.player = player
        return controller
    }

    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {
        context.coordinator.player?.isMuted = isMuted
    }

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    class Coordinator {
        var player: AVPlayer?

        deinit {
            player?.pause()
            NotificationCenter.default.removeObserver(self)
        }
    }
}
