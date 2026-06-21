import Foundation

@MainActor
class ChannelDetailViewModel: ObservableObject {
    @Published var channel: Channel
    @Published var reels: [Reel] = []
    @Published var isLoading: Bool = false
    @Published var hasMore: Bool = true

    private var currentPage = 0
    private let maxPages = 3

    init(channel: Channel) {
        self.channel = channel
    }

    func loadReels() async {
        guard !isLoading && hasMore else { return }
        isLoading = true
        try? await Task.sleep(nanoseconds: 600_000_000)
        let new = MockDataService.shared.generateReels(page: currentPage, pageSize: 9)
            .map { reel -> Reel in
                var r = reel
                // Override channel to this one
                return Reel(
                    id: reel.id + "_ch",
                    title: reel.title,
                    description: reel.description,
                    platform: channel.platform,
                    channel: channel,
                    videoURL: reel.videoURL,
                    thumbnailURL: "https://picsum.photos/seed/\(channel.id)\(currentPage)\(reel.id)/300/300",
                    likes: reel.likes,
                    comments: reel.comments,
                    isLiked: reel.isLiked,
                    isSaved: reel.isSaved,
                    createdAt: reel.createdAt
                )
            }
        reels.append(contentsOf: new)
        currentPage += 1
        hasMore = currentPage < maxPages
        isLoading = false
    }

    func toggleFollow() {
        channel.isFollowed.toggle()
    }
}
