import { http } from "./http";

export const caixaApi = {
  getSummary: (month) =>
    http.get("/summary/balance", { params: { month } }).then((r) => r.data),

  listTransactions: (month) =>
    http.get("/api/transactions", { params: { month } }).then((r) => r.data),

  createTransaction: (payload) =>
    http.post("/api/transactions", payload).then((r) => r.data),

  listFixedBillsChecklist: (month) =>
    http.get(`/api/months/${month}/fixed-bills`).then((r) => r.data),

  payFixedBill: (month, billId) =>
    http.post(`/api/months/${month}/fixed-bills/${billId}/pay`).then((r) => r.data),

  unpayFixedBill: (month, billId) =>
    http.post(`/api/months/${month}/fixed-bills/${billId}/unpay`).then((r) => r.data),
};
