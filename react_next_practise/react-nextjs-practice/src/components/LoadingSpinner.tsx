// ==========================================
// LOADING SPINNER COMPONENT
// Shows: Simple reusable UI component
// ==========================================

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
