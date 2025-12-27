export default function Modal({ open, onClose, title, children }) {
  // Không render modal nếu open = false
  if (!open) return null;

  return (
    // Root modal: fixed full screen + center content
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay tối + blur: click để đóng */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Khung modal chính */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header: title + nút close */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>

          {/* Nút đóng modal */}
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-xl hover:bg-gray-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body: nội dung truyền vào */}
        {children}
      </div>
    </div>
  );
}
