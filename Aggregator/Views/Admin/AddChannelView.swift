import SwiftUI

struct AddChannelView: View {
    @ObservedObject var adminViewModel: AdminViewModel
    @Environment(\.dismiss) private var dismiss

    @State private var platform: Platform = .youtube
    @State private var handle = ""
    @State private var displayName = ""
    @State private var category = ""
    @State private var syncFrequency = "Every 6 hours"

    private let syncOptions = ["Every hour", "Every 6 hours", "Every 12 hours", "Daily"]
    private let categories = ["Tech", "Entertainment", "Science", "Food", "Sports", "Travel", "Music", "Comedy", "Education", "Fashion"]

    var body: some View {
        NavigationStack {
            ZStack {
                Constants.Colors.background.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 20) {
                        // Platform picker
                        VStack(alignment: .leading, spacing: 10) {
                            formLabel("Platform")
                            HStack(spacing: 10) {
                                ForEach(Platform.allCases) { p in
                                    Button {
                                        platform = p
                                    } label: {
                                        VStack(spacing: 4) {
                                            Image(systemName: p.icon)
                                                .font(.title3)
                                            Text(p.displayName)
                                                .font(.caption)
                                                .fontWeight(.medium)
                                        }
                                        .foregroundStyle(platform == p ? .white : .gray)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(platform == p ? p.color : Constants.Colors.card)
                                        .clipShape(RoundedRectangle(cornerRadius: 10))
                                    }
                                }
                            }
                        }

                        formField("Channel Handle", placeholder: "@username", text: $handle)
                        formField("Display Name", placeholder: "e.g. National Geographic", text: $displayName)

                        VStack(alignment: .leading, spacing: 8) {
                            formLabel("Category")
                            Picker("Category", selection: $category) {
                                ForEach(categories, id: \.self) { cat in
                                    Text(cat).tag(cat)
                                }
                            }
                            .pickerStyle(.menu)
                            .padding(12)
                            .background(Constants.Colors.card)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .accentColor(.white)
                        }

                        VStack(alignment: .leading, spacing: 8) {
                            formLabel("Sync Frequency")
                            Picker("Sync Frequency", selection: $syncFrequency) {
                                ForEach(syncOptions, id: \.self) { opt in
                                    Text(opt).tag(opt)
                                }
                            }
                            .pickerStyle(.segmented)
                        }

                        Button {
                            adminViewModel.addChannel(
                                handle: handle,
                                name: displayName,
                                platform: platform,
                                category: category.isEmpty ? categories[0] : category,
                                syncFreq: syncFrequency
                            )
                            dismiss()
                        } label: {
                            Text("Add Channel")
                                .font(.headline)
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .padding(16)
                                .background(
                                    LinearGradient(
                                        colors: [.purple, Constants.Colors.primary],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                        .disabled(handle.isEmpty || displayName.isEmpty)
                        .padding(.top, 8)
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Add Channel")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(.gray)
                }
            }
            .toolbarBackground(Constants.Colors.background, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .onAppear {
                category = categories[0]
            }
        }
    }

    @ViewBuilder
    private func formLabel(_ text: String) -> some View {
        Text(text)
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundStyle(.gray)
            .textCase(.uppercase)
            .tracking(0.5)
    }

    @ViewBuilder
    private func formField(_ label: String, placeholder: String, text: Binding<String>) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            formLabel(label)
            TextField(
                "",
                text: text,
                prompt: Text(placeholder).foregroundStyle(.gray)
            )
            .foregroundStyle(.white)
            .autocorrectionDisabled()
            .textInputAutocapitalization(.never)
            .padding(14)
            .background(Constants.Colors.card)
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }
}
