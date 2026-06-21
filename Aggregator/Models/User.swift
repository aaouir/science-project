import Foundation

enum UserRole: String, Codable {
    case user
    case admin
}

struct User: Identifiable {
    let id: String
    let name: String
    let email: String
    let role: UserRole

    var isAdmin: Bool { role == .admin }
}
