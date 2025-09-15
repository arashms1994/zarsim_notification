import { getAllCRMNotifications, getAllPORTALNotifications } from "@/api/getData";
import type { INotification } from "@/types/type";
import { useQuery } from "@tanstack/react-query";

export const useCRMNotifications = () => {
  return useQuery<INotification[], Error>({
    queryKey: ["crm-notifications"],
    queryFn: () => getAllCRMNotifications(),
    staleTime: 1000,
  });
};

export const usePORTALNotifications = () => {
  return useQuery<INotification[], Error>({
    queryKey: ["portal-notifications"],
    queryFn: () => getAllPORTALNotifications(),
    staleTime: 1000,
  });
};
