import API from "../config/axios";

const Public_Key =
  "BOUbdwZthI965v6EUxsB3f6G3GQl3VTSIzNKQx8GTwU4A3-tT4TPR_JENX-8ONECKFOMQF1mHMt5KJegQBrJ-qk";

export const subscribeUserToPush = async (userId) => {
  console.log(userId);
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: Public_Key,
  });

  const res = await API.post("/subscribe", { userId, subscription });
  console.log(res.data.message);
};
