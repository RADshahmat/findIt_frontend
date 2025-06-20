import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function NavProfile() {
  const { user, loaded } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!loaded) return <div>Loading...</div>;
console.log("NavProfile user:", user.user.user.user_image);
  return (
    <div className="nav-profile">
      <img src={user?.user_image || "https://drive.usercontent.google.com/download?id=1HUwgc8gOguma1xhlw_QrUtFnc0C2jc5a&authuser=0"} alt="Profile" />
      <span>{user?.user.user.username || "Guest"}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

//https://drive.google.com/uc?export=view&id=1x_bNUPuCgVtBA5GbbMW31iWiOoQsk708
//https://script.google.com/macros/s/AKfycbw7dpeWSAUhnkGiXXHYZ2sgHrzQPlxHxyT0lTcqoqKEcPyY3aRio6ZcOg-Qznq-DYbk-A/exec?id=1HUwgc8gOguma1xhlw_QrUtFnc0C2jc5a
//https://script.google.com/macros/s/AKfycbxrhNu7wYkEVNFqoCOLwfIw32nkPwzfh2b5x0UjQmLzrkY3cq1kvmffJAYfPRxtpsPN2Q/exec?id=1x_bNUPuCgVtBA5GbbMW31iWiOoQsk708