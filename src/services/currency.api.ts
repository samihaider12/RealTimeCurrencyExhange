// currencyApi.ts

const API_KEY = "0a454fd9a7df7070b76ff1f3"; // apni key
const BASE_URL = "https://v6.exchangerate-api.com/v6";

export const getRates = async (base: string) => {
  const res = await fetch(`${BASE_URL}/${API_KEY}/latest/${base}`);
  const data = await res.json();
  return data.conversion_rates;
};
 
