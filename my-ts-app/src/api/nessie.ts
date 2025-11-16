const BASE_URL = "https://api.nessieisreal.com";

export async function nessieFetch(path: string) {
  const API_KEY = process.env.REACT_APP_NESSIE_KEY;
  if (!API_KEY) throw new Error("Missing Nessie API key");

  const url = `${BASE_URL}${path}?key=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Nessie error: ${res.status}`);
  return res.json();
}

export function getCustomers() {
  return nessieFetch("/customers");
}

export function getAccounts(customerId: string) {
  return nessieFetch(`/customers/${customerId}/accounts`);
}

export function getPurchases(accountId: string) {
  return nessieFetch(`/accounts/${accountId}/purchases`);
}
