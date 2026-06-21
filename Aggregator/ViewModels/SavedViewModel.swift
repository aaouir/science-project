import Foundation

@MainActor
class SavedViewModel: ObservableObject {
    @Published var savedReels: [Reel] = []

    func sync(from reels: [Reel]) {
        savedReels = reels.filter { $0.isSaved }
    }

    func unsave(id: String) {
        savedReels.removeAll { $0.id == id }
    }
}
