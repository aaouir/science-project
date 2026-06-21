import SwiftUI

enum Constants {
    static let appName = "Aggregator"
    static let pageSize = 10

    enum Colors {
        static let background = Color(hex: "#0D0D0D")
        static let card = Color(hex: "#1A1A1A")
        static let primary = Color(hex: "#FF5757")
        static let accent = Color(hex: "#FF9B57")
        static let instagram = Color(hex: "#E1306C")
        static let youtube = Color(hex: "#FF0000")
        static let tiktok = Color(hex: "#69C9D0")
    }

    enum MockCredentials {
        static let userEmail = "user@test.com"
        static let userPassword = "password123"
        static let adminEmail = "admin@test.com"
        static let adminPassword = "admin123"
    }

    static let sampleVideoURL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
}
