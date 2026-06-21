import SwiftUI

struct SignInView: View {
    @EnvironmentObject var authService: AuthService
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false

    var body: some View {
        VStack(spacing: 16) {
            // Credentials hint
            VStack(spacing: 4) {
                Text("Mock credentials")
                    .font(.caption)
                    .foregroundStyle(.gray)
                HStack(spacing: 16) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("User: user@test.com / password123")
                        Text("Admin: admin@test.com / admin123")
                    }
                    .font(.caption2)
                    .foregroundStyle(Constants.Colors.accent)
                }
            }
            .padding(12)
            .background(Constants.Colors.card)
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .padding(.horizontal, 24)

            VStack(spacing: 12) {
                TextField("", text: $email, prompt: Text("Email").foregroundStyle(.gray))
                    .foregroundStyle(.white)
                    .keyboardType(.emailAddress)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.never)
                    .padding(14)
                    .background(Constants.Colors.card)
                    .clipShape(RoundedRectangle(cornerRadius: 12))

                SecureField("", text: $password, prompt: Text("Password").foregroundStyle(.gray))
                    .foregroundStyle(.white)
                    .padding(14)
                    .background(Constants.Colors.card)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .padding(.horizontal, 24)

            if let error = authService.errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundStyle(Constants.Colors.primary)
                    .padding(.horizontal, 24)
            }

            Button {
                Task {
                    isLoading = true
                    await authService.signIn(email: email, password: password)
                    isLoading = false
                }
            } label: {
                ZStack {
                    if isLoading {
                        ProgressView().tint(.white)
                    } else {
                        Text("Sign In")
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
            .disabled(isLoading)
        }
    }
}
