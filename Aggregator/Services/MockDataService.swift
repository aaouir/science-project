import Foundation

class MockDataService {
    static let shared = MockDataService()
    private init() {}

    // MARK: - Channels
    private lazy var allChannels: [Channel] = {
        let data: [(name: String, handle: String, platform: Platform, followers: Int, reels: Int)] = [
            ("National Geographic", "natgeo", .instagram, 19_500_000, 412),
            ("MrBeast", "mrbeast", .youtube, 223_000_000, 741),
            ("Charli D'Amelio", "charlidamelio", .tiktok, 151_000_000, 2341),
            ("MKBHD", "mkbhd", .youtube, 18_400_000, 1530),
            ("Gordon Ramsay", "gordonramsay", .tiktok, 44_000_000, 899),
            ("NASA", "nasa", .instagram, 97_000_000, 632),
            ("Kylie Jenner", "kyliejenner", .instagram, 399_000_000, 1210),
            ("PewDiePie", "pewdiepie", .youtube, 111_000_000, 4521),
            ("Addison Rae", "addisonre", .tiktok, 88_000_000, 1654),
            ("Unbox Therapy", "unboxtherapy", .youtube, 22_000_000, 890),
            ("Zach King", "zachking", .tiktok, 68_000_000, 430),
            ("Kevin Hart", "kevinhart4real", .instagram, 35_000_000, 765),
            ("Marques Brownlee", "mkbhd2", .instagram, 2_400_000, 310),
            ("Linus Tech Tips", "linustechtips", .youtube, 15_300_000, 2100),
            ("Bella Poarch", "bellapoarch", .tiktok, 92_000_000, 543),
            ("Dude Perfect", "dudeperfect", .youtube, 59_000_000, 312),
            ("Kim Kardashian", "kimkardashian", .instagram, 364_000_000, 980),
            ("Pewds", "pewds_clips", .tiktok, 14_000_000, 221),
            ("SpaceX", "spacex", .youtube, 8_200_000, 145),
            ("Jamie Oliver", "jamieoliver", .instagram, 9_100_000, 1340)
        ]
        return data.enumerated().map { idx, d in
            Channel(
                id: "ch\(idx)",
                name: d.name,
                handle: "@\(d.handle)",
                platform: d.platform,
                avatarURL: "https://i.pravatar.cc/150?u=\(d.handle)",
                followerCount: d.followers,
                reelCount: d.reels,
                isActive: true,
                isFollowed: idx % 3 == 0
            )
        }
    }()

    func generateChannels() -> [Channel] { allChannels }

    // MARK: - Reels
    private let titles: [String] = [
        "You won't believe this nature shot 🌿",
        "Teaching my dog a new trick 🐕",
        "$1 vs $10,000 meal challenge!",
        "Unboxing the latest flagship phone",
        "Chef reacts to the worst cooking fails",
        "Astronaut life in zero gravity",
        "How this magic trick actually works",
        "Morning routine that changed my life",
        "5 life hacks you need RIGHT NOW",
        "Wild animal encounter caught on camera",
        "Building a PC under $500",
        "The most satisfying ASMR compilation",
        "Testing viral TikTok food hacks",
        "Street magic reactions compilation",
        "Epic fails of the week 😂",
        "Space debris: the growing problem",
        "Gordon's 10-minute pasta recipe",
        "How to edit videos like a pro",
        "The best travel spots in 2024",
        "Science experiments you can try at home"
    ]

    private let descriptions: [String] = [
        "Follow for more amazing content every day! 🔥",
        "Drop a ❤️ if this made you smile",
        "Tag someone who needs to see this!",
        "This took us 3 weeks to film 🎬",
        "The internet went crazy over this one",
        "Part 2 coming soon — make sure you follow!",
        "Can you believe this is real? 😮",
        "We tried so you don't have to",
        "Save this for later! 📌",
        "Comment your thoughts below 👇"
    ]

    func generateReels(page: Int, pageSize: Int) -> [Reel] {
        let channels = allChannels
        var reels: [Reel] = []
        let start = page * pageSize
        for i in start..<(start + pageSize) {
            let channel = channels[i % channels.count]
            let reel = Reel(
                id: "reel_p\(page)_i\(i)",
                title: titles[i % titles.count],
                description: descriptions[i % descriptions.count],
                platform: channel.platform,
                channel: channel,
                videoURL: Constants.sampleVideoURL,
                thumbnailURL: "https://picsum.photos/seed/reel\(i)/400/700",
                likes: Int.random(in: 1000...2_000_000),
                comments: Int.random(in: 50...50_000),
                isLiked: i % 5 == 0,
                isSaved: i % 7 == 0,
                createdAt: Date().addingTimeInterval(-Double(i * 3600))
            )
            reels.append(reel)
        }
        return reels
    }

    // MARK: - Suggestions
    func generateSuggestions() -> [Suggestion] {
        let items: [(handle: String, name: String, platform: Platform, reason: String, by: String, status: SuggestionStatus, daysAgo: Int)] = [
            ("@veritasium", "Veritasium", .youtube, "Amazing science explainers, huge educational value", "user@test.com", .pending, 1),
            ("@kurzgesagt", "Kurzgesagt", .youtube, "Animated science videos that simplify complex topics", "alex@example.com", .pending, 2),
            ("@nileblue", "Nile Blue", .youtube, "Chemistry experiments that are both fun and educational", "bob@example.com", .approved, 5),
            ("@markrober", "Mark Rober", .youtube, "Engineering challenges and science experiments", "carol@example.com", .pending, 3),
            ("@vsauce", "Vsauce", .youtube, "Mind-bending questions about the universe", "dave@example.com", .rejected, 10),
            ("@itsjoeyswanson", "Joey Swanson", .tiktok, "Science TikToks with millions of views", "eve@example.com", .pending, 0),
            ("@physicsgirl", "Physics Girl", .youtube, "Physics made accessible and fun", "user@test.com", .approved, 15),
        ]
        return items.enumerated().map { idx, item in
            Suggestion(
                id: "sug\(idx)",
                channelHandle: item.handle,
                channelName: item.name,
                platform: item.platform,
                reason: item.reason,
                submittedBy: item.by,
                status: item.status,
                createdAt: Date().addingTimeInterval(-Double(item.daysAgo * 86400))
            )
        }
    }
}
