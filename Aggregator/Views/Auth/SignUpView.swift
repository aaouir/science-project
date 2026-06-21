import SwiftUI

struct SignUpView: View {
    @EnvironmentObject var authService: AuthService
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false

    var body: some View {
        VStack(spacing: 12) {
            VStack(spacing: 12) {
                TextField("", text: $name, prompt: Text("Full Name").foregroundStyle(.gray))
                    .foregroundStyle(.white)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.words)
                    .padding(14)
                    .background(Constants.Colors.card)
                    .clipShape(RoundedRectangle(cornerRadius: 12))

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

            Button {
                Task {
                    isLoading = true
                    await authService.signUp(name: name, email: email, password: password)
                    isLoading = false
                }
            } label: {
                ZStack {
                    if isLoading {
                        ProgressView().tint(.white)
                    } else {
                        Text("Create Account")
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
            .disabled(isLoading || name.isEmpty || email.isEmpty || password.isEmpty)
        }
    }
}
