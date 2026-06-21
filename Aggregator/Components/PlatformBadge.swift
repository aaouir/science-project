import SwiftUI

struct PlatformBadge: View {
    let platform: Platform
    var compact: Bool = false

    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(platform.color)
                .frame(width: 6, height: 6)
            if !compact {
                Text(platform.displayName)
                    .font(.caption2)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
            }
        }
        .padding(.horizontal, compact ? 6 : 8)
        .padding(.vertical, 4)
        .background(.ultraThinMaterial, in: Capsule())
        .overlay(
            Capsule().strokeBorder(platform.color.opacity(0.4), lineWidth: 1)
        )
    }
}

#Preview {
    HStack {
        PlatformBadge(platform: .instagram)
        PlatformBadge(platform: .youtube)
        PlatformBadge(platform: .tiktok)
    }
    .padding()
    .background(Color.black)
}
