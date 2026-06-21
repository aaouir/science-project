import Foundation

struct Channel: Identifiable, Hashable {
    let id: String
    let name: String
    let handle: String
    let platform: Platform
    let avatarURL: String
    let followerCount: Int
    let reelCount: Int
    var isActive: Bool
    var isFollowed: Bool

    static func == (lhs: Channel, rhs: Channel) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}
