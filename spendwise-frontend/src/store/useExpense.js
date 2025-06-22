import { create } from "zustand";
import API from "../config/axios";
import { toast } from "react-toastify";
import useStore from "./zustand";

const useExpense = create((set, get) => {
  return {
    expenses: [],
    total: 0,
    loading: false,

    setExpenses: (data) => set({ expenses: data }),

    fetchExpenses: async (show=false) => {
      try {
        set({ loading: true });
        const res = await API.get("/expenses?today=true");
        const { expenses, totalAmount } = res.data;
        set({ expenses, total: totalAmount });

        const { user, setBalance } = useStore.getState();
        if (show && user && totalAmount > user.dailyLimit) {
          toast.warning("You've exceeded your daily limit!");
        }
        if (user) {
          setBalance(user.dailyLimit - totalAmount);
        }

      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      } finally {
        set({ loading: false });
      }
    },

    addExpense: async (data) => {
      try {
        const res = await API.post("/expenses", data);
        if (res.data.success) {
          get().fetchExpenses(true);
        }
      } catch (err) {
        console.error("Add expense failed:", err);
      }
    },

    updateExpense: async (id, updatedData) => {
      try {
        const res = await API.put(`/expenses/${id}`, updatedData);
        if (res.data.success) {
          get().fetchExpenses(true);
        }
      } catch (err) {
        console.error("Update expense failed:", err);
      }
    },

    deleteExpense: async (id) => {
      try {
        const res = await API.delete(`/expenses/${id}`);
        if (res.data.success) {
          get().fetchExpenses();
        }
      } catch (err) {
        console.error("Delete expense failed:", err);
      }
    },

    filterExpense: async (
      query,
      setExpenses,
      setTotal,
      setGrouped,
      setIsLoading,
      setCategories
    ) => {
      try {
        const res = await API.get(`/expenses/filter?${query.toString()}`);
        setExpenses(res.data.expenses);
        setTotal(res.data.total);
        setGrouped(res.data.grouped || null);
        let flag = 0;
        const categories = res.data.expenses.map(item =>{
          item.category == "Other" && (flag = 1)
          return item.category
        })
        const uniqueCategories = new Set(categories);
        const addOther = [...uniqueCategories].filter(item => item !== "Other")
        flag && addOther.push("Other")
        setCategories(addOther);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch expenses.");
      } finally {
        setIsLoading(false);
      }
    },
  };
});

export default useExpense;
