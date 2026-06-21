import Foundation

enum SuggestionStatus: String, CaseIterable {
    case pending
    case approved
    case rejected

    var displayName: String { rawValue.capitalized }
}

struct Suggestion: Identifiable {
    let id: String
    let channelHandle: String
    let channelName: String
    let platform: Platform
    let reason: String
    let submittedBy: String
    var status: SuggestionStatus
    let createdAt: Date
}
