import { useQuery } from "@tanstack/react-query";
import { getAnnouncements } from "./provider";
import { AnnouncementEntity } from "./entity";

export const announcementQueryKeys = {
	all: ["announcements"] as const,
};

export function useAnnouncements() {
	return useQuery<AnnouncementEntity[]>({
		queryKey: announcementQueryKeys.all,
		queryFn: getAnnouncements,
		refetchInterval: 60_000,
	});
}
