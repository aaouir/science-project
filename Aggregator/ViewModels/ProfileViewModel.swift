import Foundation
import Combine

@MainActor
class ProfileViewModel: ObservableObject {
    @Published var mySuggestions: [Suggestion] = []

    private var authService: AuthService

    init(authService: AuthService) {
        self.authService = authService
    }

    var currentUser: User? { authService.currentUser }
    var isAdmin: Bool { authService.isAdmin }

    func loadMySuggestions() {
        guard let email = authService.currentUser?.email else { return }
        mySuggestions = MockDataService.shared.generateSuggestions()
            .filter { $0.submittedBy == email }
    }

    func signOut() {
        authService.signOut()
    }
}
