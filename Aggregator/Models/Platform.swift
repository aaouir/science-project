import SwiftUI

enum Platform: String, CaseIterable, Codable, Identifiable {
    case instagram
    case youtube
    case tiktok

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .instagram: return "Instagram"
        case .youtube: return "YouTube"
        case .tiktok: return "TikTok"
        }
    }

    var icon: String {
        switch self {
        case .instagram: return "camera.fill"
        case .youtube: return "play.rectangle.fill"
        case .tiktok: return "music.note"
        }
    }

    var color: Color {
        switch self {
        case .instagram: return Color(hex: "#E1306C")
        case .youtube: return Color(hex: "#FF0000")
        case .tiktok: return Color(hex: "#69C9D0")
        }
    }

    var gradientColors: [Color] {
        switch self {
        case .instagram: return [Color(hex: "#833AB4"), Color(hex: "#FD1D1D"), Color(hex: "#FCB045")]
        case .youtube: return [Color(hex: "#FF0000"), Color(hex: "#CC0000")]
        case .tiktok: return [Color(hex: "#69C9D0"), Color(hex: "#EE1D52")]
        }
    }
}
