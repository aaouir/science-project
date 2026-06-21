import SwiftUI

struct ChannelManageRowView: View {
    let channel: Channel
    var onToggle: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            ChannelAvatarView(channel: channel, size: 44)

            VStack(alignment: .leading, spacing: 4) {
                Text(channel.name)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                HStack(spacing: 6) {
                    PlatformBadge(platform: channel.platform, compact: true)
                    Text(channel.handle)
                        .font(.caption)
                        .foregroundStyle(.gray)
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                Button { onToggle() } label: {
                    Image(systemName: channel.isActive ? "toggle.power.on.fill" : "power")
                        .font(.title2)
                        .foregroundStyle(channel.isActive ? .green : .gray)
                }
                Text(channel.isActive ? "Active" : "Paused")
                    .font(.caption2)
                    .foregroundStyle(channel.isActive ? .green : .gray)
            }
        }
        .padding(12)
        .background(Constants.Colors.card)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
