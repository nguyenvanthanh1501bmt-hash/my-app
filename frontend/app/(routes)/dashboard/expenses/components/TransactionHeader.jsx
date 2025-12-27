export default function TransactionHeader({ onAdd }) {
  return (
    // Header: title + add button
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-blue-700">Transaction</h2>

      {/* Button mở modal tạo transaction */}
      <button
        onClick={onAdd}
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 cursor-pointer"
      >
        + Add transaction
      </button>
    </div>
  );
}
