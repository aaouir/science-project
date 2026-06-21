import SwiftUI

struct ChannelCardView: View {
    let channel: Channel
    var onFollow: () -> Void

    var body: some View {
        VStack(spacing: 12) {
            ChannelAvatarView(channel: channel, size: 60)

            VStack(spacing: 4) {
                Text(channel.name)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .lineLimit(1)
                Text(channel.handle)
                    .font(.caption)
                    .foregroundStyle(.gray)
                    .lineLimit(1)
            }

            PlatformBadge(platform: channel.platform)

            HStack(spacing: 4) {
                Image(systemName: "play.fill")
                    .font(.caption2)
                    .foregroundStyle(.gray)
                Text("\(channel.reelCount) reels")
                    .font(.caption2)
                    .foregroundStyle(.gray)
            }

            Button(action: onFollow) {
                Text(channel.isFollowed ? "Following" : "Follow")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 7)
                    .background(
                        channel.isFollowed
                        ? AnyShapeStyle(.ultraThinMaterial)
                        : AnyShapeStyle(
                            LinearGradient(
                                colors: [Constants.Colors.primary, Constants.Colors.accent],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                    )
                    .clipShape(Capsule())
            }
        }
        .padding(14)
        .background(Constants.Colors.card)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}
