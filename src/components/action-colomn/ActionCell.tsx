import { handleDontShow, handleSnooze } from "@/api/addData";
import type { INotification } from "@/types/type";
import { useQueryClient } from "@tanstack/react-query";
import { BellOff, BellPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export const ActionsCell: React.FC<{ notification: INotification }> = ({
  notification,
}) => {
  const [isProcessing, setIsProcessing] = useState<"dontShow" | "snooze" | null>(null);
  const queryClient = useQueryClient();

  const onDontShow = async () => {
    if (!notification?.ID || !notification?.Title) {
      toast.error("اطلاعات اعلان نامعتبر است", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    setIsProcessing("dontShow");
    try {
      await handleDontShow(notification);
      queryClient.invalidateQueries({ queryKey: ["crm-notifications"] });
    } catch (err) {
      console.error("خطا در خاموش کردن اعلان:", err);
      toast.error("خطا در خاموش کردن اعلان!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const onSnooze = async () => {
    if (!notification?.ID || !notification?.Title) {
      toast.error("اطلاعات اعلان نامعتبر است", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    setIsProcessing("snooze");
    try {
      await handleSnooze(notification);
      queryClient.invalidateQueries({ queryKey: ["crm-notifications"] });
    } catch (err) {
      console.error("خطا در تعویق اعلان:", err);
      toast.error("خطا در تعویق اعلان!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  if (notification.dont_show === "1") {
    return (
      <div style={{ color: "#16a34a", fontWeight: "600" }}>پایان اعلان</div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}>
      <button
        onClick={onDontShow}
        disabled={isProcessing === "dontShow"}
        aria-label="خاموش کردن اعلان"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          borderRadius: "9999px",
          backgroundColor: isProcessing === "dontShow" ? "#d1d5db" : "#4ade80",
          transition: "background-color 0.3s",
          cursor: isProcessing === "dontShow" ? "not-allowed" : "pointer",
        }}
        onMouseOver={(e) => {
          if (isProcessing !== "dontShow") e.currentTarget.style.backgroundColor = "#16a34a";
        }}
        onMouseOut={(e) => {
          if (isProcessing !== "dontShow") e.currentTarget.style.backgroundColor = "#4ade80";
        }}
      >
        {isProcessing === "dontShow" ? (
          <span style={{ fontSize: "12px" }}>در حال پردازش...</span>
        ) : (
          <BellOff color="black" />
        )}
      </button>

      <button
        onClick={onSnooze}
        disabled={isProcessing === "snooze"}
        aria-label="تعویق اعلان"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          borderRadius: "9999px",
          backgroundColor: isProcessing === "snooze" ? "#d1d5db" : "#fbbf24",
          transition: "background-color 0.3s",
          cursor: isProcessing === "snooze" ? "not-allowed" : "pointer",
        }}
        onMouseOver={(e) => {
          if (isProcessing !== "snooze") e.currentTarget.style.backgroundColor = "#d97706";
        }}
        onMouseOut={(e) => {
          if (isProcessing !== "snooze") e.currentTarget.style.backgroundColor = "#fbbf24";
        }}
      >
        {isProcessing === "snooze" ? (
          <span style={{ fontSize: "12px" }}>در حال پردازش...</span>
        ) : (
          <BellPlus color="black" />
        )}
      </button>
    </div>
  );
};