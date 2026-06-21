import Foundation

struct AdminStats {
    var channelCount: Int
    var pendingCount: Int
    var userCount: Int
}

@MainActor
class AdminViewModel: ObservableObject {
    @Published var pendingSuggestions: [Suggestion] = []
    @Published var channels: [Channel] = []
    @Published var stats: AdminStats = AdminStats(channelCount: 0, pendingCount: 0, userCount: 2)
    @Published var isLoading: Bool = false

    func load() {
        isLoading = true
        let all = MockDataService.shared.generateSuggestions()
        pendingSuggestions = all.filter { $0.status == .pending }
        channels = MockDataService.shared.generateChannels()
        stats = AdminStats(
            channelCount: channels.count,
            pendingCount: pendingSuggestions.count,
            userCount: 2
        )
        isLoading = false
    }

    func approveSuggestion(id: String) {
        if let idx = pendingSuggestions.firstIndex(where: { $0.id == id }) {
            pendingSuggestions[idx].status = .approved
            pendingSuggestions.remove(at: idx)
            stats.pendingCount = pendingSuggestions.count
        }
    }

    func rejectSuggestion(id: String) {
        if let idx = pendingSuggestions.firstIndex(where: { $0.id == id }) {
            pendingSuggestions[idx].status = .rejected
            pendingSuggestions.remove(at: idx)
            stats.pendingCount = pendingSuggestions.count
        }
    }

    func toggleChannel(id: String) {
        if let idx = channels.firstIndex(where: { $0.id == id }) {
            channels[idx].isActive.toggle()
        }
    }

    func addChannel(handle: String, name: String, platform: Platform, category: String, syncFreq: String) {
        let newChannel = Channel(
            id: UUID().uuidString,
            name: name,
            handle: handle.hasPrefix("@") ? handle : "@\(handle)",
            platform: platform,
            avatarURL: "https://i.pravatar.cc/150?u=\(handle)",
            followerCount: 0,
            reelCount: 0,
            isActive: true,
            isFollowed: false
        )
        channels.insert(newChannel, at: 0)
        stats.channelCount = channels.count
    }
}
