import SwiftUI

struct AuthView: View {
    @State private var selectedTab = 0

    var body: some View {
        ZStack {
            Constants.Colors.background.ignoresSafeArea()

            VStack(spacing: 0) {
                // Logo
                VStack(spacing: 8) {
                    HStack(spacing: 2) {
                        ForEach([Platform.instagram, .youtube, .tiktok], id: \.self) { platform in
                            Circle()
                                .fill(platform.color)
                                .frame(width: 12, height: 12)
                        }
                    }
                    Text(Constants.appName)
                        .font(.system(size: 36, weight: .black))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Constants.Colors.primary, Constants.Colors.accent],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                    Text("Your short-form video hub")
                        .font(.subheadline)
                        .foregroundStyle(.gray)
                }
                .padding(.top, 60)
                .padding(.bottom, 40)

                // Tab picker
                Picker("", selection: $selectedTab) {
                    Text("Sign In").tag(0)
                    Text("Sign Up").tag(1)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, 24)
                .padding(.bottom, 24)

                if selectedTab == 0 {
                    SignInView()
                        .transition(.opacity)
                } else {
                    SignUpView()
                        .transition(.opacity)
                }

                Spacer()
            }
        }
        .animation(.easeInOut(duration: 0.2), value: selectedTab)
    }
}
