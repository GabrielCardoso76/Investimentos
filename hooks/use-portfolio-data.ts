import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = "/api/portfolio";

const fetchData = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`A requisição para ${endpoint} falhou`);
  }
  return response.json();
};

export const useGetSummary = () => {
  return useQuery({
    queryKey: ["summary"],
    queryFn: () => fetchData("summary"),
  });
};

export const useGetAssets = () => {
  return useQuery({
    queryKey: ["assets"],
    queryFn: () => fetchData("assets"),
  });
};

export const useGetAllocation = () => {
  return useQuery({
    queryKey: ["allocation"],
    queryFn: () => fetchData("allocation"),
  });
};

export const useGetPerformance = () => {
  return useQuery({
    queryKey: ["performance"],
    queryFn: () => fetchData("performance"),
  });
};

export const useGetDividends = () => {
  return useQuery({
    queryKey: ["dividends"],
    queryFn: () => fetchData("dividends"),
  });
};
