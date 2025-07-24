import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import User from "../../models/entities/User";
import AdminCard from "../../components/AdminCard/AdminCard";

const Home: React.FC = () => {
  const user: User = JSON.parse(localStorage.getItem('User')!);

  return (
    <div className="Home">
      <Navbar />
      <AdminCard admin={user} />
      <AdminCard admin={user} />
      <AdminCard admin={user} />
      <AdminCard admin={user} />
      <AdminCard admin={user} />

    </div>
  );
}

export default Home;
