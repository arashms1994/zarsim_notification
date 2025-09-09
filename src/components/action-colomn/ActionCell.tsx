import { handleApprove, handleReject } from "@/api/addData";
import type { ICashListItem } from "@/types/type";
import { useQueryClient } from "@tanstack/react-query";
import { BellOff, BellPlus } from "lucide-react";
import { useState } from "react";

export const ActionsCell: React.FC<{ cashItem: ICashListItem }> = ({
  cashItem,
}) => {
  const [isDontShow, setDontShow] = useState(false);
  const [isSnooze, setSnooze] = useState(false);
  const queryClient = useQueryClient();

  const onDontShow = async () => {
    setDontShow(true);
    try {
      await handleApprove(cashItem);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (err) {
      console.error(err);
    } finally {
      setDontShow(false);
    }
  };

  const onSnooze = async () => {
    setSnooze(true);
    try {
      await handleReject(cashItem);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (err) {
      console.error(err);
    } finally {
      setSnooze(false);
    }
  };

  if (cashItem.status === "1") {
    return <div className="text-green-600 font-semibold">تأیید شده</div>;
  }

  if (cashItem.status === "2") {
    return <div className="text-red-600 font-semibold">رد شده</div>;
  }

  if (cashItem.status === "" || cashItem.status === "0") {
    return (
      <div className="space-x-2 flex items-center justify-center">
        <div
          onClick={onDontShow}
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
            isDontShow ? "bg-gray-400" : "bg-green-400 hover:bg-green-600"
          }`}
          title="خاموش"
        >
          {isDontShow ? (
            <span className="text-xs">در حال پردازش...</span>
          ) : (
            <BellOff color="black" />
          )}
        </div>

        <div
          onClick={onSnooze}
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
            isSnooze ? "bg-gray-400" : "bg-amber-400 hover:bg-amber-600"
          }`}
          title="تعویق"
        >
          {isSnooze ? (
            <span className="text-xs">در حال پردازش...</span>
          ) : (
            <BellPlus color="black" />
          )}
        </div>
      </div>
    );
  }

  return <div className="text-gray-500">وضعیت نامعتبر</div>;
};
