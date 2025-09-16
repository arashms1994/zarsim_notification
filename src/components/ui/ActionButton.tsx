export const ActionButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  isProcessing: boolean;
  defaultColor: string;
  hoverColor: string;
  icon: React.ReactNode;
  label: string;
}> = ({ onClick, disabled, isProcessing, defaultColor, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="action-button"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px",
      borderRadius: "9999px",
      backgroundColor: isProcessing ? "#d1d5db" : defaultColor,
      transition: "background-color 0.3s",
      cursor: isProcessing ? "not-allowed" : "pointer",
    }}
  >
    {isProcessing ? (
      <span style={{ fontSize: "12px" }}>در حال پردازش...</span>
    ) : (
      icon
    )}
  </button>
);
