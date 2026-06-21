// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Aggregator",
    platforms: [.iOS(.v17)],
    products: [.library(name: "Aggregator", targets: ["Aggregator"])],
    dependencies: [
        .package(url: "https://github.com/onevcat/Kingfisher.git", from: "7.0.0")
    ],
    targets: [
        .target(name: "Aggregator", dependencies: ["Kingfisher"])
    ]
)
