import { getDigest } from "@/lib/getDigest";
import { BASE_URL } from "./base";
import type { INotification } from "@/types/type";
import { Bounce, toast } from "react-toastify";

export async function updateNotification(
  data: {
    Title: string;
    dont_show: string;
    Snooze?: string;
  },
  ID: number
) {
  const listName = "Notification";
  const itemType = "SP.Data.NotificationListItem";

  try {
    if (!ID || !data.Title) {
      throw new Error("شناسه یا عنوان اعلان نامعتبر است");
    }

    const digest = await getDigest();

    const response = await fetch(
      `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items(${ID})`,
      {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": digest,
          "X-HTTP-Method": "MERGE",
          "IF-MATCH": "*",
        },
        body: JSON.stringify({
          __metadata: { type: itemType },
          ...data,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `خطا در درخواست به‌روزرسانی: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "خطای ناشناس";
    console.error(`خطا در به‌روزرسانی اعلان با شناسه ${ID}:`, errorMessage);
    throw new Error(errorMessage);
  }
}

export const handleDontShow = async (notification: INotification) => {
  try {
    if (!notification?.ID || !notification?.Title) {
      throw new Error("اطلاعات اعلان نامعتبر است");
    }

    await updateNotification(
      {
        Title: notification.Title,
        dont_show: "1",
        Snooze: "",
      },
      notification.ID
    );

    toast.success(
      `آیتم با شناسه ${notification.ID} با موفقیت به‌روزرسانی شد.`,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "خطای ناشناس";
    console.error(
      `خطا در به‌روزرسانی آیتم با شناسه ${notification?.ID || "نامشخص"}:`,
      errorMessage
    );
    toast.error(`خطا در به‌روزرسانی آیتم: ${errorMessage}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
    throw new Error(errorMessage);
  }
};

export const handleSnooze = async (notification: INotification) => {
  try {
    if (!notification?.ID || !notification?.Title) {
      throw new Error("اطلاعات اعلان نامعتبر است");
    }

    const today = new Date();
    const formattedDate = `${
      today.getMonth() + 1
    }/${today.getDate()}/${today.getFullYear()}`;

    await updateNotification(
      {
        Title: notification.Title,
        Snooze: formattedDate,
        dont_show: "0",
      },
      notification.ID
    );

    toast.success(
      `آیتم با شناسه ${notification.ID} با موفقیت به تعویق افتاد.`,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "خطای ناشناس";
    console.error(
      `خطا در به تعویق انداختن آیتم با شناسه ${notification?.ID || "نامشخص"}:`,
      errorMessage
    );
    toast.error(`خطا در به تعویق انداختن آیتم: ${errorMessage}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
    throw new Error(errorMessage);
  }
};
