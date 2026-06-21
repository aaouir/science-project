import SwiftUI

struct LoadingSpinnerView: View {
    var body: some View {
        HStack {
            Spacer()
            ProgressView()
                .progressViewStyle(.circular)
                .tint(.white)
                .scaleEffect(1.2)
            Spacer()
        }
        .padding(.vertical, 20)
    }
}
