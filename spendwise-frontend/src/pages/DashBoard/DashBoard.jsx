import { useEffect, useState } from "react";
import AddExpense from "../../component/AddExpense/AddExpense";
import ExpenseList from "../../component/ExpenseList/ExpenseList";
import Header from "../../component/Header/Header";
import API from "../../config/axios";
import useStore from "../../store/zustand";
import "./dashBoard.css";
import { subscribeUserToPush } from "../../utilities/subscribeUser";

const DashBoard = () => {

  const { setUser, fetchFriendsData, friends } = useStore();
  const [userId, setUserId] = useState(null);
  const [fetch, setFetch] = useState(false)

  useEffect(()=>{
    fetchUserData();
    !friends && fetchFriendsData();
    userId && fetch && subscribeUserToPush(userId)
  },[fetch])

  const fetchUserData = async () => {
    await API.get("/user").then((res)=>{
      setUser(res.data.user)
      setUserId(res.data?.user?._id)
      setFetch(true);
    }).catch(err => console.error(`error: ${err.message}`))
  } 
  return (
    <div className="dashboard">
      <Header />
      <div className="setion_1">
        <AddExpense />
      </div>
      <div className="section_2">
        <ExpenseList />
      </div>
    </div>
  );
};

export default DashBoard;
