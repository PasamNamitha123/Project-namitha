
import { useQuery } from "@tanstack/react-query";
import { getApplications } from "../api/applications";

export default function useApplications(filters) {
  return useQuery({
    queryKey: ["applications", filters],
    queryFn: () => getApplications(filters),
    placeholderData: (previousData) => previousData,
  });
}
