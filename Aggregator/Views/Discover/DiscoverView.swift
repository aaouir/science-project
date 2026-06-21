import SwiftUI

struct DiscoverView: View {
    @StateObject private var viewModel = DiscoverViewModel()

    private let columns = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]

    var body: some View {
        NavigationStack {
            ZStack {
                Constants.Colors.background.ignoresSafeArea()

                VStack(spacing: 0) {
                    // Search bar
                    HStack(spacing: 10) {
                        Image(systemName: "magnifyingglass")
                            .foregroundStyle(.gray)
                        TextField("", text: $viewModel.searchText, prompt: Text("Search channels...").foregroundStyle(.gray))
                            .foregroundStyle(.white)
                            .autocorrectionDisabled()
                            .textInputAutocapitalization(.never)
                    }
                    .padding(12)
                    .background(Constants.Colors.card)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)

                    // Platform filter chips
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            platformChip(nil, label: "All")
                            ForEach(Platform.allCases) { platform in
                                platformChip(platform, label: platform.displayName)
                            }
                        }
                        .padding(.horizontal, 16)
                    }
                    .padding(.bottom, 12)

                    if viewModel.isLoading {
                        Spacer()
                        LoadingSpinnerView()
                        Spacer()
                    } else if viewModel.filteredChannels.isEmpty {
                        Spacer()
                        EmptyStateView(
                            icon: "antenna.radiowaves.left.and.right",
                            title: "No channels found",
                            subtitle: "Try adjusting your search or filter"
                        )
                        Spacer()
                    } else {
                        ScrollView {
                            LazyVGrid(columns: columns, spacing: 12) {
                                ForEach(viewModel.filteredChannels) { channel in
                                    NavigationLink(destination: ChannelDetailView(channel: channel)) {
                                        ChannelCardView(channel: channel) {
                                            viewModel.followChannel(id: channel.id)
                                        }
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.bottom, 20)
                        }
                    }
                }
            }
            .navigationTitle("Discover")
            .navigationBarTitleDisplayMode(.large)
            .toolbarBackground(Constants.Colors.background, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
        .onAppear { viewModel.load() }
    }

    @ViewBuilder
    private func platformChip(_ platform: Platform?, label: String) -> some View {
        let isSelected = viewModel.selectedPlatform == platform
        Button {
            withAnimation(.easeInOut(duration: 0.2)) {
                viewModel.selectedPlatform = platform
            }
        } label: {
            HStack(spacing: 5) {
                if let platform {
                    Circle().fill(platform.color).frame(width: 7, height: 7)
                }
                Text(label)
                    .font(.subheadline)
                    .fontWeight(isSelected ? .semibold : .regular)
                    .foregroundStyle(isSelected ? .white : .gray)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(isSelected ? Constants.Colors.primary : Constants.Colors.card)
            .clipShape(Capsule())
        }
    }
}
