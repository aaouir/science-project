import SwiftUI

struct MainTabView: View {
    @StateObject private var feedViewModel = FeedViewModel()
    @State private var selectedTab = 0

    var body: some View {
        ZStack(alignment: .bottom) {
            TabView(selection: $selectedTab) {
                FeedView()
                    .tag(0)

                DiscoverView()
                    .tag(1)

                SuggestChannelView()
                    .tag(2)

                SavedView()
                    .tag(3)

                ProfileView()
                    .tag(4)
            }
            .environmentObject(feedViewModel)
            .tabViewStyle(.page(indexDisplayMode: .never))
            .ignoresSafeArea()

            // Custom tab bar
            customTabBar
        }
        .preferredColorScheme(.dark)
    }

    private var tabItems: [(icon: String, activeIcon: String, label: String)] = [
        ("house", "house.fill", "Home"),
        ("magnifyingglass", "magnifyingglass", "Discover"),
        ("plus.circle", "plus.circle.fill", "Suggest"),
        ("bookmark", "bookmark.fill", "Saved"),
        ("person", "person.fill", "Profile")
    ]

    private var customTabBar: some View {
        HStack(spacing: 0) {
            ForEach(Array(tabItems.enumerated()), id: \.offset) { index, item in
                Button {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        selectedTab = index
                    }
                } label: {
                    VStack(spacing: 4) {
                        Image(systemName: selectedTab == index ? item.activeIcon : item.icon)
                            .font(index == 2 ? .title2 : .system(size: 22))
                            .foregroundStyle(
                                selectedTab == index
                                ? (index == 2 ? Constants.Colors.primary : .white)
                                : .gray.opacity(0.7)
                            )
                        Text(item.label)
                            .font(.system(size: 10))
                            .foregroundStyle(selectedTab == index ? .white : .gray.opacity(0.7))
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 10)
        .padding(.bottom, 20)
        .background(.ultraThinMaterial)
        .overlay(
            Rectangle()
                .fill(.white.opacity(0.08))
                .frame(height: 0.5),
            alignment: .top
        )
    }
}
