import { useEffect } from "react";
import AddExpense from "../../component/AddExpense/AddExpense";
import ExpenseList from "../../component/ExpenseList/ExpenseList";
import Header from "../../component/Header/Header";
import API from "../../config/axios";
import useStore from "../../store/zustand";
import "./dashBoard.css";

const DashBoard = () => {

  const { setUser, fetchFriendsData, friends } = useStore()

  useEffect(()=>{
    fetchUserData();
    !friends && fetchFriendsData();
  },[])

  const fetchUserData = async () => {
    await API.get("/user").then((res)=>{
      setUser(res.data.user)
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
