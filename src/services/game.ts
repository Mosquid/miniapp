import serviceFetch, { get } from "@/lib/service";

export const saveGameResult = async (userId: string, tokens: number) => {
  const response = await serviceFetch("/api/game", {
    method: "POST",
    headers: {
      "x-username": userId,
    },
    body: JSON.stringify({ tokens }),
  });

  const data = await response.json();

  return data;
};
