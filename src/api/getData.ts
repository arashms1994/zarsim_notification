import { BASE_URL } from "./base";
import { useQuery } from "@tanstack/react-query";
import type {
  ICashListItem,
  IFile,
  IFileDownloadLinkProps,
  INotification,
} from "@/types/type";

export async function getAllCashListItems(): Promise<ICashListItem[]> {
  const listTitle = "Cash_List";
  let items: ICashListItem[] = [];

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
          `خطا در گرفتن آیتم‌های Cash_List: ${err} (Status: ${res.status})`
        );
      }

      const json: { d: { results: ICashListItem[]; __next?: string } } =
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

async function fetchFiles({
  customerGuid,
  itemGuid,
}: IFileDownloadLinkProps): Promise<IFile[]> {
  if (!customerGuid || !itemGuid) {
    throw new Error("شناسه مشتری یا آیتم نامعتبر است");
  }

  const folderPath = `/Cash_AttachFiles/${customerGuid}/${itemGuid}`;
  const encodedFolderPath = encodeURIComponent(folderPath);

  const url = `${BASE_URL}/_api/web/GetFolderByServerRelativeUrl('${encodedFolderPath}')/Files?$select=Name,ServerRelativeUrl`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose",
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("لطفاً وارد حساب کاربری خود شوید");
    }
    throw new Error(`خطای HTTP! وضعیت: ${response.status}`);
  }

  const data = await response.json();

  if (data.d && data.d.results && data.d.results.length > 0) {
    return data.d.results.map((file: IFile) => ({
      Name: file.Name,
      ServerRelativeUrl: file.ServerRelativeUrl,
    }));
  }

  return [];
}

export const useCashListItems = () => {
  return useQuery<ICashListItem[], Error>({
    queryKey: ["cashListItems"],
    queryFn: () => getAllCashListItems(),
    staleTime: 2000,
  });
};

export const useFiles = ({
  customerGuid,
  itemGuid,
}: IFileDownloadLinkProps) => {
  return useQuery<IFile[], Error>({
    queryKey: ["files", customerGuid, itemGuid],
    queryFn: () => fetchFiles({ customerGuid, itemGuid }),
    enabled: !!customerGuid && !!itemGuid,
    staleTime: 60 * 1000,
    retry: 2,
  });
};

export async function getAllNotifications(): Promise<INotification[]> {
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
          `خطا در گرفتن آیتم‌های Cash_List: ${err} (Status: ${res.status})`
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
