import Foundation
import Combine

@MainActor
class FeedViewModel: ObservableObject {
    @Published var reels: [Reel] = []
    @Published var isLoading: Bool = false
    @Published var hasMore: Bool = true
    @Published var currentIndex: Int = 0

    private let pageSize = Constants.pageSize
    private var currentPage = 0
    private let maxPages = 5

    func loadInitial() async {
        guard reels.isEmpty else { return }
        await loadMore()
    }

    func loadMore() async {
        guard !isLoading && hasMore else { return }
        isLoading = true
        try? await Task.sleep(nanoseconds: 800_000_000)
        let newReels = MockDataService.shared.generateReels(page: currentPage, pageSize: pageSize)
        reels.append(contentsOf: newReels)
        currentPage += 1
        hasMore = currentPage < maxPages
        isLoading = false
    }

    func likeReel(id: String) {
        guard let idx = reels.firstIndex(where: { $0.id == id }) else { return }
        reels[idx].isLiked.toggle()
        reels[idx].likes += reels[idx].isLiked ? 1 : -1
    }

    func saveReel(id: String) {
        guard let idx = reels.firstIndex(where: { $0.id == id }) else { return }
        reels[idx].isSaved.toggle()
    }

    func checkAndLoadMore(index: Int) {
        currentIndex = index
        let threshold = reels.count - 3
        if index >= threshold {
            Task { await loadMore() }
        }
    }
}
