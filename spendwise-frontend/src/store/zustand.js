import { create } from "zustand";
import API from "../config/axios";
import { toast } from "react-toastify";

const useStore = create((set, get) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const balanceAmount = localStorage.getItem("balance");
  const userToken = JSON.parse(localStorage.getItem("token"));
  return {
    user: storedUser || null,
    balance: balanceAmount || null,
    friends: null,
    pendingRequests: null,
    token: userToken,
    inbox: null,

    setInbox: async () => {
      try {
        const res = await API.get(`/friend/inbox/get`);
        set({ inbox: res.data.inbox });
      } catch (err) {
        console.log(err.message);
      }
    },

    setToken: (token) => {
      set({ token: token });
      localStorage.setItem("token", JSON.stringify(token));
    },

    setUser: (userData) => {
      set({ user: userData });
      localStorage.setItem("user", JSON.stringify(userData));
    },

    setBalance: (data) => {
      set({ balance: data });
      localStorage.setItem("balance", Number(data));
    },
    fetchFriendsData: async () => {
      try {
        const res = await API.get("/friend/me");
        set({ pendingRequests: res.data.friendRequests });
        set({ friends: res.data.friends });
      } catch (err) {
        toast.error("Failed to load friend data");
      }
    },

    logoutUser: (msg) => {
      API.post("/auth/logout")
        .then((res) => {
          toast.success(msg || res.data.message);
          localStorage.clear();
          set({ user: null });
        })
        .catch((err) => toast.error(err));
    },

    updateUser: async (data) => {
      try {
        await API.post("/user", data).then((res) => {
          const { setUser } = get();
          setUser(res.data.user);
          toast.success(res.data.message || "Profile updated successfully.");
        });
      } catch (err) {
        toast.error(err.message);
      }
    },
  };
});

export default useStore;

export const store = useStore;
