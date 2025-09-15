import { BASE_URL, BASE_URL2 } from "./base";
import type { INotification } from "@/types/type";

export async function getAllPORTALNotifications(): Promise<INotification[]> {
  const listTitle = "Notification";
  let items: INotification[] = [];

  let nextUrl:
    | string
    | null = `${BASE_URL2}/_api/web/lists/getbytitle('${listTitle}')/items?$orderby=ID desc`;

  try {
    while (nextUrl) {
      const res = await fetch(nextUrl, {
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(
          `خطا در گرفتن آیتم‌های Notification: ${err} (Status: ${res.status})`
        );
      }

      const json: { d: { results: INotification[]; __next?: string } } =
        await res.json();

      const results = json.d?.results;
      if (!Array.isArray(results)) {
        throw new Error(
          "ساختار داده‌ی برگشتی نامعتبر است: results یک آرایه نیست"
        );
      }

      items = [...items, ...results];
      nextUrl = json.d.__next ?? null;
    }

    return items;
  } catch (err) {
    console.error("خطا در دریافت آیتم‌های Cash_List:", err);
    throw err;
  }
}

export async function getAllCRMNotifications(): Promise<INotification[]> {
  const listTitle = "Notification";
  let items: INotification[] = [];

  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items?$orderby=ID desc`;

  try {
    while (nextUrl) {
      const res = await fetch(nextUrl, {
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(
          `خطا در گرفتن آیتم‌های Notification: ${err} (Status: ${res.status})`
        );
      }

      const json: { d: { results: INotification[]; __next?: string } } =
        await res.json();

      const results = json.d?.results;
      if (!Array.isArray(results)) {
        throw new Error(
          "ساختار داده‌ی برگشتی نامعتبر است: results یک آرایه نیست"
        );
      }

      items = [...items, ...results];
      nextUrl = json.d.__next ?? null;
    }

    return items;
  } catch (err) {
    console.error("خطا در دریافت آیتم‌های Cash_List:", err);
    throw err;
  }
}
