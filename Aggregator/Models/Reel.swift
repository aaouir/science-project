import Foundation

struct Reel: Identifiable, Hashable {
    let id: String
    let title: String
    let description: String
    let platform: Platform
    let channel: Channel
    let videoURL: String
    let thumbnailURL: String
    var likes: Int
    var comments: Int
    var isLiked: Bool
    var isSaved: Bool
    let createdAt: Date

    static func == (lhs: Reel, rhs: Reel) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}
