export default function ConfirmModal({message, onConfirm, onCancel}){
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full mx-4">
                <p className="text-white text-center mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}