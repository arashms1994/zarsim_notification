import type { INotification } from "@/types/type";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { ActionButton } from "../ui/ActionButton";
import { handleDontShow, handleSnooze } from "@/api/addData";
import { BellOff, BellPlus } from "lucide-react";
import { toast } from "react-toastify";
import { debounce } from "lodash";

export const ActionsCell: React.FC<{ notification: INotification }> = ({
  notification,
}) => {
  const [loadingDontShow, setLoadingDontShow] = useState(false);
  const [loadingSnooze, setLoadingSnooze] = useState(false);
  const queryClient = useQueryClient();

  const runAction = useCallback(
    async (
      type: "dontShow" | "snooze",
      handler: (n: INotification) => Promise<any>
    ) => {
      if (loadingDontShow || loadingSnooze) {
        toast.info("لطفاً صبر کنید تا عملیات قبلی تکمیل شود");
        return;
      }

      try {
        if (type === "dontShow") setLoadingDontShow(true);
        if (type === "snooze") setLoadingSnooze(true);

        await handler(notification);

        queryClient.setQueryData<INotification[]>(
          ["crm-notifications"],
          (old) =>
            old
              ? old.map((n) =>
                  n.ID === notification.ID
                    ? {
                        ...n,
                        dont_show: type === "dontShow" ? "1" : "0",
                        Snooze:
                          type === "snooze"
                            ? new Date().toLocaleDateString("en-US")
                            : "",
                      }
                    : n
                )
              : old
        );
      } catch (err) {
        console.error(err);
        toast.error(
          `خطا در ${type === "dontShow" ? "خاموش کردن" : "تعویق"} اعلان`
        );
      } finally {
        if (type === "dontShow") setLoadingDontShow(false);
        if (type === "snooze") setLoadingSnooze(false);
      }
    },
    [notification, queryClient, loadingDontShow, loadingSnooze]
  );

  const debouncedRunAction = debounce(runAction, 300);

  if (notification.dont_show === "1") {
    return (
      <div style={{ color: "#16a34a", fontWeight: "600" }}>پایان اعلان</div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActionButton
        onClick={() => debouncedRunAction("dontShow", handleDontShow)}
        disabled={loadingDontShow || loadingSnooze}
        isProcessing={loadingDontShow}
        defaultColor="#4ade80"
        hoverColor="#16a34a"
        icon={<BellOff color="black" />}
        label="خاموش کردن اعلان"
      />

      <ActionButton
        onClick={() => debouncedRunAction("snooze", handleSnooze)}
        disabled={loadingDontShow || loadingSnooze}
        isProcessing={loadingSnooze}
        defaultColor="#fbbf24"
        hoverColor="#d97706"
        icon={<BellPlus color="black" />}
        label="تعویق اعلان"
      />
    </div>
  );
};
