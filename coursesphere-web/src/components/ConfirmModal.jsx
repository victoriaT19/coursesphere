export default function ConfirmModal({message, onConfirm, onCancel}){
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50
        }}>
            <div style={{
                background: "#16162a",
                border: "0.5px solid #2a2a4a",
                borderRadius: "12px",
                padding: "1.5rem",
                maxWidth: "380px",
                width: "100%",
                margin: "0 1rem"
            }}>
                <p style={{ color: "white", textAlign: "center", fontSize: "14px", marginBottom: "1.5rem" }}>{message}</p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button onClick={onCancel} style={{
                        flex: 1,
                        background: "transparent",
                        border: "0.5px solid #3b2f6e",
                        borderRadius: "8px",
                        padding: "0.625rem",
                        color: "#a78bfa",
                        fontSize: "14px",
                        cursor: "pointer"
                    }}>Cancelar</button>
                    <button onClick={onConfirm} style={{
                        flex: 1,
                        background: "transparent",
                        border: "0.5px solid #7f1d1d",
                        borderRadius: "8px",
                        padding: "0.625rem",
                        color: "#f87171",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}>Confirmar</button>
                </div>
            </div>
        </div>
    );
}