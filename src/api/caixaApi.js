import { http } from "./http";

export const caixaApi = {
  getSummary: (month) =>
    http.get("/summary/balance", { params: { month } }).then((r) => r.data),

  listTransactions: (month) =>
    http.get("/api/transactions", { params: { month } }).then((r) => r.data),

  createTransaction: (payload) =>
    http.post("/api/transactions", payload).then((r) => r.data),

  updateTransaction: (id, payload) =>
    http.put(`/api/transactions/${id}`, payload).then((r) => r.data),

  deleteTransaction: (id) =>
    http.delete(`/api/transactions/${id}`).then((r) => r.data),

  listCategories: () =>
    http.get("/api/categories").then((r) => r.data),

  createCategory: (payload) =>
    http.post("/api/categories", payload).then((r) => r.data),

  updateCategory: (id, payload) =>
    http.put(`/api/categories/${id}`, payload).then((r) => r.data),

  deleteCategory: (id) =>
    http.delete(`/api/categories/${id}`).then((r) => r.data),

  listFixedBillsChecklist: (month) =>
    http.get(`/api/months/${month}/fixed-bills`).then((r) => r.data),

  payFixedBill: (month, billId, payload) =>
    http
      .post(`/api/months/${month}/fixed-bills/${billId}/pay`, payload)
      .then((r) => r.data),

  unpayFixedBill: (month, billId) =>
    http
      .post(`/api/months/${month}/fixed-bills/${billId}/unpay`)
      .then((r) => r.data),

  createFixedBill: (payload) =>
    http.post("/api/fixed-bills", payload).then((r) => r.data),

  updateFixedBill: (id, payload) =>
    http.put(`/api/fixed-bills/${id}`, payload).then((r) => r.data),

  deleteFixedBill: (id) =>
    http.delete(`/api/fixed-bills/${id}`).then((r) => r.data),

  getReportsOverview: ({ startDate, endDate, categoryId }) =>
    http
      .get("/reports/overview", {
        params: {
          startDate,
          endDate,
          ...(categoryId ? { categoryId } : {}),
        },
      })
      .then((r) => r.data),
};