import SwiftUI

struct SuggestChannelView: View {
    @EnvironmentObject var authService: AuthService
    @StateObject private var viewModel = SuggestionViewModel()

    var body: some View {
        NavigationStack {
            ZStack {
                Constants.Colors.background.ignoresSafeArea()

                if viewModel.isSubmitted {
                    successView
                } else {
                    formView
                }
            }
            .navigationTitle("Suggest a Channel")
            .navigationBarTitleDisplayMode(.large)
            .toolbarBackground(Constants.Colors.background, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
    }

    private var formView: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Know a great short-form creator? Suggest their channel to be added to Aggregator.")
                    .font(.subheadline)
                    .foregroundStyle(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 24)
                    .padding(.top, 8)

                // Platform picker
                VStack(alignment: .leading, spacing: 10) {
                    sectionLabel("Platform")
                    HStack(spacing: 10) {
                        ForEach(Platform.allCases) { platform in
                            Button {
                                viewModel.platform = platform
                            } label: {
                                HStack(spacing: 6) {
                                    Image(systemName: platform.icon)
                                        .font(.caption)
                                    Text(platform.displayName)
                                        .font(.subheadline)
                                        .fontWeight(.medium)
                                }
                                .foregroundStyle(viewModel.platform == platform ? .white : .gray)
                                .padding(.horizontal, 14)
                                .padding(.vertical, 10)
                                .background(
                                    viewModel.platform == platform
                                    ? AnyShapeStyle(platform.color)
                                    : AnyShapeStyle(Constants.Colors.card)
                                )
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                            }
                        }
                    }
                }
                .padding(.horizontal, 24)

                VStack(spacing: 14) {
                    VStack(alignment: .leading, spacing: 8) {
                        sectionLabel("Channel Handle / URL")
                        TextField(
                            "",
                            text: $viewModel.handle,
                            prompt: Text("@username or URL").foregroundStyle(.gray)
                        )
                        .foregroundStyle(.white)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                        .padding(14)
                        .background(Constants.Colors.card)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                    }

                    VStack(alignment: .leading, spacing: 8) {
                        sectionLabel("Display Name")
                        TextField(
                            "",
                            text: $viewModel.name,
                            prompt: Text("Channel display name").foregroundStyle(.gray)
                        )
                        .foregroundStyle(.white)
                        .padding(14)
                        .background(Constants.Colors.card)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                    }

                    VStack(alignment: .leading, spacing: 8) {
                        sectionLabel("Why should we add this channel?")
                        TextEditor(text: $viewModel.reason)
                            .foregroundStyle(.white)
                            .scrollContentBackground(.hidden)
                            .padding(10)
                            .frame(minHeight: 100)
                            .background(Constants.Colors.card)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                }
                .padding(.horizontal, 24)

                if let error = viewModel.errorMessage {
                    Text(error)
                        .font(.caption)
                        .foregroundStyle(Constants.Colors.primary)
                        .padding(.horizontal, 24)
                }

                Button {
                    Task {
                        await viewModel.submit(submittedBy: authService.currentUser?.email ?? "")
                    }
                } label: {
                    ZStack {
                        if viewModel.isSubmitting {
                            ProgressView().tint(.white)
                        } else {
                            Text("Submit Suggestion")
                                .font(.headline)
                                .foregroundStyle(.white)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(16)
                    .background(
                        LinearGradient(
                            colors: [Constants.Colors.primary, Constants.Colors.accent],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .padding(.horizontal, 24)
                .disabled(viewModel.isSubmitting)
            }
            .padding(.vertical, 16)
        }
    }

    private var successView: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 72))
                .foregroundStyle(Constants.Colors.primary)

            Text("Suggestion Submitted!")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundStyle(.white)

            Text("We'll review your suggestion and add the channel if it meets our guidelines. You can track the status in your Profile.")
                .font(.subheadline)
                .foregroundStyle(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)

            VStack(alignment: .leading, spacing: 4) {
                Text("Platform: \(viewModel.platform.displayName)")
                Text("Handle: \(viewModel.handle)")
                Text("Status: Pending Review")
            }
            .font(.subheadline)
            .foregroundStyle(.white.opacity(0.8))
            .padding(16)
            .background(Constants.Colors.card)
            .clipShape(RoundedRectangle(cornerRadius: 12))

            Button {
                viewModel.reset()
            } label: {
                Text("Submit Another")
                    .font(.headline)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 32)
                    .padding(.vertical, 12)
                    .background(Constants.Colors.primary)
                    .clipShape(Capsule())
            }
            .padding(.top, 8)
        }
        .padding()
    }

    @ViewBuilder
    private func sectionLabel(_ text: String) -> some View {
        Text(text)
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundStyle(.gray)
            .textCase(.uppercase)
            .tracking(0.5)
    }
}
