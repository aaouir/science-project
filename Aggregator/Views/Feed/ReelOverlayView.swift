import SwiftUI

struct ReelOverlayView: View {
    let reel: Reel
    var onLike: () -> Void
    var onSave: () -> Void
    var onFollow: () -> Void
    @Binding var isMuted: Bool

    @State private var likeAnimating = false

    var body: some View {
        ZStack(alignment: .bottom) {
            // Bottom gradient
            LinearGradient(
                colors: [.clear, .black.opacity(0.85)],
                startPoint: .center,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            HStack(alignment: .bottom, spacing: 0) {
                // Left side info
                VStack(alignment: .leading, spacing: 8) {
                    Spacer()
                    PlatformBadge(platform: reel.platform)

                    HStack(spacing: 10) {
                        ChannelAvatarView(channel: reel.channel, size: 44)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(reel.channel.name)
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundStyle(.white)
                            Text(reel.channel.handle)
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.75))
                        }
                        Button(action: onFollow) {
                            Text(reel.channel.isFollowed ? "Following" : "Follow")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundStyle(.white)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 5)
                                .background(
                                    reel.channel.isFollowed
                                    ? AnyShapeStyle(.ultraThinMaterial)
                                    : AnyShapeStyle(Constants.Colors.primary)
                                )
                                .clipShape(Capsule())
                        }
                    }

                    Text(reel.description)
                        .font(.footnote)
                        .foregroundStyle(.white.opacity(0.9))
                        .lineLimit(2)
                }
                .padding(.leading, 16)
                .padding(.bottom, 30)

                Spacer()

                // Right side actions
                VStack(spacing: 22) {
                    Spacer()

                    // Mute
                    Button {
                        isMuted.toggle()
                    } label: {
                        Image(systemName: isMuted ? "speaker.slash.fill" : "speaker.wave.2.fill")
                            .font(.title2)
                            .foregroundStyle(.white)
                            .shadow(radius: 4)
                    }

                    // Like
                    VStack(spacing: 4) {
                        Button {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
                                likeAnimating = true
                            }
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                                likeAnimating = false
                            }
                            onLike()
                        } label: {
                            Image(systemName: reel.isLiked ? "heart.fill" : "heart")
                                .font(.title2)
                                .foregroundStyle(reel.isLiked ? Constants.Colors.primary : .white)
                                .scaleEffect(likeAnimating ? 1.4 : 1.0)
                                .shadow(radius: 4)
                        }
                        Text(reel.likes.abbreviated)
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundStyle(.white)
                    }

                    // Comment
                    VStack(spacing: 4) {
                        Image(systemName: "bubble.right")
                            .font(.title2)
                            .foregroundStyle(.white)
                            .shadow(radius: 4)
                        Text(reel.comments.abbreviated)
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundStyle(.white)
                    }

                    // Save
                    Button(action: onSave) {
                        Image(systemName: reel.isSaved ? "bookmark.fill" : "bookmark")
                            .font(.title2)
                            .foregroundStyle(reel.isSaved ? Constants.Colors.accent : .white)
                            .shadow(radius: 4)
                    }

                    // Share
                    Button {} label: {
                        Image(systemName: "arrowshape.turn.up.right")
                            .font(.title2)
                            .foregroundStyle(.white)
                            .shadow(radius: 4)
                    }

                    // More
                    Button {} label: {
                        Image(systemName: "ellipsis")
                            .font(.title2)
                            .foregroundStyle(.white)
                            .shadow(radius: 4)
                    }
                }
                .padding(.trailing, 16)
                .padding(.bottom, 36)
            }
        }
    }
}
