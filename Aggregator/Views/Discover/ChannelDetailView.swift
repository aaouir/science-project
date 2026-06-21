import SwiftUI

struct ChannelDetailView: View {
    @StateObject private var viewModel: ChannelDetailViewModel

    init(channel: Channel) {
        _viewModel = StateObject(wrappedValue: ChannelDetailViewModel(channel: channel))
    }

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 2), count: 3)

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Header
                VStack(spacing: 12) {
                    ChannelAvatarView(channel: viewModel.channel, size: 90)
                    Text(viewModel.channel.name)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundStyle(.white)
                    Text(viewModel.channel.handle)
                        .font(.subheadline)
                        .foregroundStyle(.gray)
                    PlatformBadge(platform: viewModel.channel.platform)

                    // Stats row
                    HStack(spacing: 32) {
                        statColumn(value: viewModel.channel.reelCount.abbreviated, label: "Reels")
                        statColumn(value: viewModel.channel.followerCount.abbreviated, label: "Followers")
                        statColumn(value: "4.8★", label: "Rating")
                    }
                    .padding(.top, 4)

                    Button(action: { viewModel.toggleFollow() }) {
                        Text(viewModel.channel.isFollowed ? "Following" : "Follow")
                            .font(.headline)
                            .foregroundStyle(.white)
                            .frame(width: 160)
                            .padding(.vertical, 12)
                            .background(
                                viewModel.channel.isFollowed
                                ? AnyShapeStyle(.ultraThinMaterial)
                                : AnyShapeStyle(
                                    LinearGradient(
                                        colors: [Constants.Colors.primary, Constants.Colors.accent],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                            )
                            .clipShape(Capsule())
                    }
                    .padding(.bottom, 8)
                }
                .padding(.vertical, 24)
                .frame(maxWidth: .infinity)

                Divider().background(.gray.opacity(0.3))

                // Reels grid
                LazyVGrid(columns: columns, spacing: 2) {
                    ForEach(viewModel.reels) { reel in
                        AsyncImage(url: URL(string: reel.thumbnailURL)) { phase in
                            if case .success(let img) = phase {
                                img.resizable().scaledToFill()
                            } else {
                                Rectangle().fill(Constants.Colors.card)
                            }
                        }
                        .frame(height: 120)
                        .clipped()
                        .onAppear {
                            if reel.id == viewModel.reels.last?.id {
                                Task { await viewModel.loadReels() }
                            }
                        }
                    }
                }

                if viewModel.isLoading {
                    LoadingSpinnerView()
                }
            }
        }
        .background(Constants.Colors.background)
        .navigationTitle(viewModel.channel.name)
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await viewModel.loadReels()
        }
    }

    @ViewBuilder
    private func statColumn(value: String, label: String) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.headline)
                .fontWeight(.bold)
                .foregroundStyle(.white)
            Text(label)
                .font(.caption)
                .foregroundStyle(.gray)
        }
    }
}
