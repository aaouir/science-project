import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authService: AuthService
    @AppStorage("autoplay") private var autoplay = true
    @AppStorage("notifications") private var notifications = true
    @AppStorage("darkMode") private var darkMode = true

    var body: some View {
        NavigationStack {
            ZStack {
                Constants.Colors.background.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 0) {
                        // Header
                        VStack(spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            colors: [Constants.Colors.primary, Constants.Colors.accent],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                                    .frame(width: 90, height: 90)
                                Text(String(authService.currentUser?.name.prefix(1) ?? "U").uppercased())
                                    .font(.system(size: 36, weight: .bold))
                                    .foregroundStyle(.white)
                            }

                            Text(authService.currentUser?.name ?? "")
                                .font(.title3)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)

                            Text(authService.currentUser?.email ?? "")
                                .font(.subheadline)
                                .foregroundStyle(.gray)

                            // Role badge
                            Text(authService.currentUser?.role.rawValue.uppercased() ?? "USER")
                                .font(.caption2)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 4)
                                .background(
                                    authService.isAdmin
                                    ? Color.purple
                                    : Constants.Colors.primary
                                )
                                .clipShape(Capsule())
                        }
                        .padding(.vertical, 28)

                        // Preferences
                        settingsSection("Preferences") {
                            Toggle(isOn: $autoplay) {
                                settingsLabel("Autoplay Videos", icon: "play.circle.fill", color: Constants.Colors.primary)
                            }
                            .tint(Constants.Colors.primary)

                            Divider().background(.gray.opacity(0.2))

                            Toggle(isOn: $notifications) {
                                settingsLabel("Notifications", icon: "bell.fill", color: .orange)
                            }
                            .tint(Constants.Colors.primary)

                            Divider().background(.gray.opacity(0.2))

                            Toggle(isOn: $darkMode) {
                                settingsLabel("Dark Mode", icon: "moon.fill", color: .indigo)
                            }
                            .tint(Constants.Colors.primary)
                        }

                        // Account
                        settingsSection("Account") {
                            NavigationLink(destination: MySuggestionsView()) {
                                settingsLabel("My Suggestions", icon: "star.fill", color: Constants.Colors.accent)
                                Spacer()
                                Image(systemName: "chevron.right").foregroundStyle(.gray.opacity(0.5))
                            }

                            Divider().background(.gray.opacity(0.2))

                            NavigationLink(destination: Text("Saved Reels").foregroundStyle(.white)) {
                                settingsLabel("Saved Reels", icon: "bookmark.fill", color: .teal)
                                Spacer()
                                Image(systemName: "chevron.right").foregroundStyle(.gray.opacity(0.5))
                            }
                        }

                        // Admin panel
                        if authService.isAdmin {
                            settingsSection("Admin") {
                                NavigationLink(destination: AdminDashboardView()) {
                                    HStack {
                                        Image(systemName: "shield.fill")
                                            .foregroundStyle(.white)
                                            .frame(width: 30, height: 30)
                                            .background(.purple)
                                            .clipShape(RoundedRectangle(cornerRadius: 7))
                                        Text("Admin Panel")
                                            .foregroundStyle(.white)
                                            .fontWeight(.medium)
                                        Spacer()
                                        Image(systemName: "chevron.right").foregroundStyle(.gray.opacity(0.5))
                                    }
                                }
                            }
                        }

                        // Sign Out
                        Button {
                            authService.signOut()
                        } label: {
                            Text("Sign Out")
                                .font(.headline)
                                .foregroundStyle(Constants.Colors.primary)
                                .frame(maxWidth: .infinity)
                                .padding(16)
                                .background(Constants.Colors.primary.opacity(0.12))
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 24)
                        .padding(.bottom, 40)
                    }
                }
            }
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.large)
            .toolbarBackground(Constants.Colors.background, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
    }

    @ViewBuilder
    private func settingsSection<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(title)
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundStyle(.gray)
                .textCase(.uppercase)
                .tracking(0.5)
                .padding(.horizontal, 16)
                .padding(.bottom, 8)

            VStack(spacing: 0) {
                content()
            }
            .padding(16)
            .background(Constants.Colors.card)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .padding(.horizontal, 16)
        }
        .padding(.bottom, 20)
    }

    @ViewBuilder
    private func settingsLabel(_ label: String, icon: String, color: Color) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundStyle(.white)
                .frame(width: 30, height: 30)
                .background(color)
                .clipShape(RoundedRectangle(cornerRadius: 7))
            Text(label)
                .foregroundStyle(.white)
                .fontWeight(.medium)
        }
    }
}

struct MySuggestionsView: View {
    @EnvironmentObject var authService: AuthService
    private var suggestions: [Suggestion] {
        MockDataService.shared.generateSuggestions()
            .filter { $0.submittedBy == authService.currentUser?.email }
    }

    var body: some View {
        ZStack {
            Constants.Colors.background.ignoresSafeArea()
            if suggestions.isEmpty {
                EmptyStateView(
                    icon: "star.slash",
                    title: "No Suggestions Yet",
                    subtitle: "Use the Suggest tab to recommend channels"
                )
            } else {
                List(suggestions) { suggestion in
                    HStack(spacing: 12) {
                        Image(systemName: suggestion.platform.icon)
                            .foregroundStyle(suggestion.platform.color)
                            .frame(width: 36, height: 36)
                            .background(suggestion.platform.color.opacity(0.15))
                            .clipShape(Circle())
                        VStack(alignment: .leading, spacing: 3) {
                            Text(suggestion.channelName)
                                .foregroundStyle(.white)
                                .fontWeight(.medium)
                            Text(suggestion.channelHandle)
                                .font(.caption)
                                .foregroundStyle(.gray)
                        }
                        Spacer()
                        statusBadge(suggestion.status)
                    }
                    .listRowBackground(Constants.Colors.card)
                }
                .listStyle(.insetGrouped)
                .scrollContentBackground(.hidden)
            }
        }
        .navigationTitle("My Suggestions")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(Constants.Colors.background, for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
    }

    @ViewBuilder
    private func statusBadge(_ status: SuggestionStatus) -> some View {
        let color: Color = switch status {
        case .pending: .orange
        case .approved: .green
        case .rejected: .red
        }
        Text(status.displayName)
            .font(.caption2)
            .fontWeight(.semibold)
            .foregroundStyle(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.15))
            .clipShape(Capsule())
    }
}
