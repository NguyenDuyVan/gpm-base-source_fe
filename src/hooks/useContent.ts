import { useQuery } from "@tanstack/react-query";
import { getContent } from "@/api/contentApi";

export function useContent() {
  return useQuery({
    queryKey: ["content"],
    queryFn: getContent,
  });
}
