import Foundation
import Combine

class AuthService: ObservableObject {
    @Published var currentUser: User?
    @Published var isLoggedIn: Bool = false
    @Published var errorMessage: String?

    var isAdmin: Bool { currentUser?.role == .admin }

    private let mockUsers: [String: (password: String, user: User)] = [
        Constants.MockCredentials.userEmail: (
            password: Constants.MockCredentials.userPassword,
            user: User(id: "u1", name: "Alex Johnson", email: Constants.MockCredentials.userEmail, role: .user)
        ),
        Constants.MockCredentials.adminEmail: (
            password: Constants.MockCredentials.adminPassword,
            user: User(id: "u2", name: "Admin User", email: Constants.MockCredentials.adminEmail, role: .admin)
        )
    ]

    func signIn(email: String, password: String) async -> Bool {
        // simulate network delay
        try? await Task.sleep(nanoseconds: 500_000_000)
        let lowered = email.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        guard let entry = mockUsers[lowered], entry.password == password else {
            await MainActor.run { errorMessage = "Invalid email or password." }
            return false
        }
        await MainActor.run {
            currentUser = entry.user
            isLoggedIn = true
            errorMessage = nil
        }
        return true
    }

    func signUp(name: String, email: String, password: String) async -> Bool {
        try? await Task.sleep(nanoseconds: 500_000_000)
        // In mock: just create a regular user session
        let user = User(id: UUID().uuidString, name: name, email: email.lowercased(), role: .user)
        await MainActor.run {
            currentUser = user
            isLoggedIn = true
            errorMessage = nil
        }
        return true
    }

    func signOut() {
        currentUser = nil
        isLoggedIn = false
    }
}
