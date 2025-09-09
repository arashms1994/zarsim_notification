export async function loadList<T>(
  listTitle: string,
  filter?: string
): Promise<T[]> {
  let url = `/api/web/lists/getbytitle('${listTitle}')/items`;
  if (filter) {
    url += `?$filter=${encodeURIComponent(filter)}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json;odata=verbose" },
      credentials: "include",
    });

    const text = await response.text();
    const json = JSON.parse(text);

    if (json.value) {
      return json.value;
    } else if (json.d?.results) {
      return json.d.results;
    } else {
      return [];
    }
  } catch (err) {
    console.error("خطا در loadList:", err);
    return [];
  }
}
export async function loadCurrentUser<T>(): Promise<T> {
  const url = `/api/web/currentuser?$select=LoginName,Title,Email`;
  const res = await fetch(url, {
    headers: { Accept: "application/json;odata=verbose" },
    credentials: "include",
  });
  return res.json();
}
export async function loadListAll<T>(listTitle: string): Promise<T[]> {
  const items: T[] = [];
  let nextUrl = `/api/web/lists/getbytitle('${listTitle}')/items?$top=5000`;

  try {
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        credentials: "include",
      });

      const text = await response.text();
      const json = JSON.parse(text);

      if (json.d?.results) {
        items.push(...json.d.results);
        nextUrl = json.d.__next || "";
      } else if (json.value) {
        items.push(...json.value);
        nextUrl = "";
      } else {
        nextUrl = "";
      }
    }

    return items;
  } catch (err) {
    console.error(`خطا در loadListAll(${listTitle}):`, err);
    return [];
  }
}

export async function loadListLC<T>(
  listTitle: string,
  options?: { filter?: string; orderby?: string; top?: number }
): Promise<T[]> {
  let url = `/api/web/lists/getbytitle('${listTitle}')/items`;
  const params: string[] = [];

  if (options?.filter) params.push(`$filter=${options.filter}`);
  if (options?.orderby) params.push(`$orderby=${options.orderby}`);
  if (options?.top) params.push(`$top=${options.top}`);

  if (params.length) url += "?" + params.join("&");

  const res = await fetch(url, {
    headers: { Accept: "application/json;odata=verbose" },
    credentials: "include",
  });
  const json = await res.json();
  return json.d?.results ?? json.value ?? [];
}