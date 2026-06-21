import SwiftUI

struct ChannelAvatarView: View {
    let channel: Channel
    var size: CGFloat = 40

    var body: some View {
        AsyncImage(url: URL(string: channel.avatarURL)) { phase in
            switch phase {
            case .success(let image):
                image
                    .resizable()
                    .scaledToFill()
            default:
                ZStack {
                    LinearGradient(
                        colors: channel.platform.gradientColors,
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    Text(String(channel.name.prefix(1)).uppercased())
                        .font(.system(size: size * 0.4, weight: .bold))
                        .foregroundStyle(.white)
                }
            }
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
        .overlay(Circle().strokeBorder(.white.opacity(0.3), lineWidth: 1))
    }
}
