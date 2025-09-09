import { getAllNotifications } from "@/api/getData";
import type { INotification } from "@/types/type";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = () => {
  return useQuery<INotification[], Error>({
    queryKey: ["notifications"],
    queryFn: () => getAllNotifications(),
    staleTime: 1000,
  });
};
