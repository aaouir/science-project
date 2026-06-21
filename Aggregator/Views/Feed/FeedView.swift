import SwiftUI

struct FeedView: View {
    @EnvironmentObject private var viewModel: FeedViewModel
    @State private var selectedFeed = 0 // 0 = For You, 1 = Following
    @State private var currentPage = 0

    var body: some View {
        ZStack(alignment: .top) {
            Constants.Colors.background.ignoresSafeArea()

            if viewModel.reels.isEmpty && viewModel.isLoading {
                VStack {
                    Spacer()
                    LoadingSpinnerView()
                    Spacer()
                }
            } else {
                TabView(selection: $currentPage) {
                    ForEach(Array(viewModel.reels.enumerated()), id: \.element.id) { index, reel in
                        ReelPlayerView(
                            reel: reel,
                            isVisible: currentPage == index,
                            onLike: { viewModel.likeReel(id: reel.id) },
                            onSave: { viewModel.saveReel(id: reel.id) },
                            onFollow: {}
                        )
                        .tag(index)
                        .onAppear {
                            viewModel.checkAndLoadMore(index: index)
                        }
                        .ignoresSafeArea()
                    }

                    // Loading indicator page
                    if viewModel.isLoading {
                        ZStack {
                            Constants.Colors.background
                            LoadingSpinnerView()
                        }
                        .tag(viewModel.reels.count)
                        .ignoresSafeArea()
                    }
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .ignoresSafeArea()
            }

            // Top overlay: feed picker
            VStack {
                HStack(spacing: 24) {
                    ForEach(["For You", "Following"], id: \.self) { label in
                        let isSelected = (label == "For You") == (selectedFeed == 0)
                        Button {
                            withAnimation { selectedFeed = label == "For You" ? 0 : 1 }
                        } label: {
                            VStack(spacing: 4) {
                                Text(label)
                                    .font(.subheadline)
                                    .fontWeight(isSelected ? .bold : .regular)
                                    .foregroundStyle(isSelected ? .white : .white.opacity(0.6))
                                Rectangle()
                                    .fill(isSelected ? .white : .clear)
                                    .frame(height: 2)
                            }
                        }
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 56)
                Spacer()
            }
        }
        .task {
            await viewModel.loadInitial()
        }
    }
}
