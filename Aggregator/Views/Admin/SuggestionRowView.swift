import SwiftUI

struct SuggestionRowView: View {
    let suggestion: Suggestion
    var onApprove: () -> Void
    var onReject: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 10) {
                Image(systemName: suggestion.platform.icon)
                    .foregroundStyle(.white)
                    .frame(width: 36, height: 36)
                    .background(suggestion.platform.color)
                    .clipShape(Circle())

                VStack(alignment: .leading, spacing: 3) {
                    Text(suggestion.channelName)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                    Text(suggestion.channelHandle)
                        .font(.caption)
                        .foregroundStyle(.gray)
                }

                Spacer()

                Text(suggestion.createdAt.timeAgo)
                    .font(.caption2)
                    .foregroundStyle(.gray)
            }

            Text(suggestion.reason)
                .font(.caption)
                .foregroundStyle(.gray)
                .lineLimit(2)

            HStack(spacing: 4) {
                Image(systemName: "person.fill")
                    .font(.caption2)
                    .foregroundStyle(.gray)
                Text(suggestion.submittedBy)
                    .font(.caption2)
                    .foregroundStyle(.gray)
            }

            HStack(spacing: 10) {
                Button(action: onApprove) {
                    Label("Approve", systemImage: "checkmark")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(.green)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }

                Button(action: onReject) {
                    Label("Reject", systemImage: "xmark")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(.red)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }
        }
        .padding(14)
        .background(Constants.Colors.card)
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}
