import SwiftUI

struct SavedView: View {
    @StateObject private var viewModel = SavedViewModel()
    @EnvironmentObject var feedViewModel: FeedViewModel
    @State private var selectedReel: Reel?

    var body: some View {
        NavigationStack {
            ZStack {
                Constants.Colors.background.ignoresSafeArea()

                if viewModel.savedReels.isEmpty {
                    EmptyStateView(
                        icon: "bookmark.slash",
                        title: "No Saved Reels",
                        subtitle: "Tap the bookmark icon on any reel to save it here"
                    )
                } else {
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(viewModel.savedReels) { reel in
                                SavedReelCard(reel: reel) {
                                    selectedReel = reel
                                } onUnsave: {
                                    viewModel.unsave(id: reel.id)
                                    feedViewModel.saveReel(id: reel.id)
                                }
                            }
                        }
                        .padding(16)
                    }
                }
            }
            .navigationTitle("Saved")
            .navigationBarTitleDisplayMode(.large)
            .toolbarBackground(Constants.Colors.background, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .fullScreenCover(item: $selectedReel) { reel in
                SingleReelPlayerView(reel: reel)
            }
        }
        .onAppear {
            viewModel.sync(from: feedViewModel.reels)
        }
        .onChange(of: feedViewModel.reels) { _, new in
            viewModel.sync(from: new)
        }
    }
}

struct SavedReelCard: View {
    let reel: Reel
    var onTap: () -> Void
    var onUnsave: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                AsyncImage(url: URL(string: reel.thumbnailURL)) { phase in
                    if case .success(let img) = phase {
                        img.resizable().scaledToFill()
                    } else {
                        Rectangle().fill(Constants.Colors.card)
                            .overlay(Image(systemName: "play.fill").foregroundStyle(.gray))
                    }
                }
                .frame(width: 90, height: 130)
                .clipShape(RoundedRectangle(cornerRadius: 10))

                VStack(alignment: .leading, spacing: 8) {
                    PlatformBadge(platform: reel.platform)
                    Text(reel.title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                        .lineLimit(2)
                    Text(reel.channel.name)
                        .font(.caption)
                        .foregroundStyle(.gray)
                    HStack(spacing: 12) {
                        Label(reel.likes.abbreviated, systemImage: "heart.fill")
                            .font(.caption2)
                            .foregroundStyle(.gray)
                        Label(reel.comments.abbreviated, systemImage: "bubble.right")
                            .font(.caption2)
                            .foregroundStyle(.gray)
                    }
                    Text(reel.createdAt.timeAgo)
                        .font(.caption2)
                        .foregroundStyle(.gray.opacity(0.7))
                }

                Spacer()

                Button(action: onUnsave) {
                    Image(systemName: "bookmark.fill")
                        .font(.title3)
                        .foregroundStyle(Constants.Colors.accent)
                }
                .padding(.trailing, 4)
            }
            .padding(12)
            .background(Constants.Colors.card)
            .clipShape(RoundedRectangle(cornerRadius: 14))
        }
        .buttonStyle(.plain)
    }
}

struct SingleReelPlayerView: View {
    let reel: Reel
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack(alignment: .topLeading) {
            ReelPlayerView(
                reel: reel,
                isVisible: true,
                onLike: {},
                onSave: {},
                onFollow: {}
            )
            Button {
                dismiss()
            } label: {
                Image(systemName: "xmark.circle.fill")
                    .font(.title)
                    .foregroundStyle(.white)
                    .shadow(radius: 4)
            }
            .padding(.top, 56)
            .padding(.leading, 16)
        }
        .ignoresSafeArea()
    }
}
