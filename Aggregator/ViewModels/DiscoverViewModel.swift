import Foundation
import Combine

@MainActor
class DiscoverViewModel: ObservableObject {
    @Published var channels: [Channel] = []
    @Published var filteredChannels: [Channel] = []
    @Published var searchText: String = "" {
        didSet { applyFilters() }
    }
    @Published var selectedPlatform: Platform? = nil {
        didSet { applyFilters() }
    }
    @Published var isLoading: Bool = false

    func load() {
        guard channels.isEmpty else { return }
        isLoading = true
        channels = MockDataService.shared.generateChannels()
        filteredChannels = channels
        isLoading = false
    }

    func followChannel(id: String) {
        if let idx = channels.firstIndex(where: { $0.id == id }) {
            channels[idx].isFollowed.toggle()
        }
        if let idx = filteredChannels.firstIndex(where: { $0.id == id }) {
            filteredChannels[idx].isFollowed.toggle()
        }
    }

    private func applyFilters() {
        var result = channels
        if let platform = selectedPlatform {
            result = result.filter { $0.platform == platform }
        }
        if !searchText.isEmpty {
            let q = searchText.lowercased()
            result = result.filter {
                $0.name.lowercased().contains(q) || $0.handle.lowercased().contains(q)
            }
        }
        filteredChannels = result
    }
}
