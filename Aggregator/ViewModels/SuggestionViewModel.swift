import Foundation

@MainActor
class SuggestionViewModel: ObservableObject {
    @Published var platform: Platform = .youtube
    @Published var handle: String = ""
    @Published var name: String = ""
    @Published var reason: String = ""
    @Published var isSubmitting: Bool = false
    @Published var isSubmitted: Bool = false
    @Published var errorMessage: String?

    func submit(submittedBy: String) async -> Bool {
        guard validate() else { return false }
        isSubmitting = true
        try? await Task.sleep(nanoseconds: 700_000_000)
        // Mock submission — just mark as submitted
        isSubmitted = true
        isSubmitting = false
        return true
    }

    private func validate() -> Bool {
        if handle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            errorMessage = "Channel handle/URL is required."
            return false
        }
        if name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            errorMessage = "Display name is required."
            return false
        }
        if reason.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            errorMessage = "Please provide a reason for your suggestion."
            return false
        }
        errorMessage = nil
        return true
    }

    func reset() {
        platform = .youtube
        handle = ""
        name = ""
        reason = ""
        isSubmitted = false
        errorMessage = nil
    }
}
