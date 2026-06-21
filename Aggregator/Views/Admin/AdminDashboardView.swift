import SwiftUI

struct AdminDashboardView: View {
    @StateObject private var viewModel = AdminViewModel()
    @State private var showAddChannel = false

    var body: some View {
        ZStack {
            Constants.Colors.background.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 20) {
                    // Stats cards
                    HStack(spacing: 12) {
                        statCard(
                            value: "\(viewModel.stats.channelCount)",
                            label: "Channels",
                            icon: "antenna.radiowaves.left.and.right",
                            color: .purple
                        )
                        statCard(
                            value: "\(viewModel.stats.pendingCount)",
                            label: "Pending",
                            icon: "clock.fill",
                            color: .orange
                        )
                        statCard(
                            value: "\(viewModel.stats.userCount)",
                            label: "Users",
                            icon: "person.2.fill",
                            color: Constants.Colors.primary
                        )
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 8)

                    // Pending Suggestions
                    sectionHeader("Pending Suggestions (\(viewModel.pendingSuggestions.count))")

                    if viewModel.pendingSuggestions.isEmpty {
                        HStack {
                            Spacer()
                            VStack(spacing: 8) {
                                Image(systemName: "checkmark.circle.fill")
                                    .font(.largeTitle)
                                    .foregroundStyle(.green)
                                Text("All caught up!")
                                    .font(.subheadline)
                                    .foregroundStyle(.gray)
                            }
                            .padding(24)
                            Spacer()
                        }
                        .background(Constants.Colors.card)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .padding(.horizontal, 16)
                    } else {
                        VStack(spacing: 10) {
                            ForEach(viewModel.pendingSuggestions) { suggestion in
                                SuggestionRowView(
                                    suggestion: suggestion,
                                    onApprove: { viewModel.approveSuggestion(id: suggestion.id) },
                                    onReject: { viewModel.rejectSuggestion(id: suggestion.id) }
                                )
                            }
                        }
                        .padding(.horizontal, 16)
                    }

                    // Active Channels
                    sectionHeader("Active Channels")

                    VStack(spacing: 8) {
                        ForEach(viewModel.channels) { channel in
                            ChannelManageRowView(channel: channel) {
                                viewModel.toggleChannel(id: channel.id)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 40)
                }
            }

            // FAB
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    Button {
                        showAddChannel = true
                    } label: {
                        Image(systemName: "plus")
                            .font(.title2)
                            .fontWeight(.semibold)
                            .foregroundStyle(.white)
                            .frame(width: 56, height: 56)
                            .background(
                                LinearGradient(
                                    colors: [.purple, Constants.Colors.primary],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .clipShape(Circle())
                            .shadow(color: .purple.opacity(0.5), radius: 8, y: 4)
                    }
                    .padding(20)
                }
            }
        }
        .navigationTitle("Admin Dashboard")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(Constants.Colors.background, for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
        .sheet(isPresented: $showAddChannel) {
            AddChannelView(adminViewModel: viewModel)
        }
        .onAppear { viewModel.load() }
    }

    @ViewBuilder
    private func statCard(value: String, label: String, icon: String, color: Color) -> some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(color)
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundStyle(.white)
            Text(label)
                .font(.caption)
                .foregroundStyle(.gray)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(Constants.Colors.card)
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }

    @ViewBuilder
    private func sectionHeader(_ text: String) -> some View {
        HStack {
            Text(text)
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundStyle(.white)
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.top, 4)
    }
}
