import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

export default function NavProfile() {
  const { user, loaded } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // ✅ Track image load
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!loaded) return <div>Loading...</div>;
  //console.log("NavProfile user:", user);

  const userData = user?.user || user; // Support both nested and flat
  const userImage = userData?.user_image;
  const username = userData?.username || "Guest";

  const imageUrl = userImage
    ? `http://93.127.166.229:5000/image/${userImage}`
    : "http://93.127.166.229:5000/image/1x_bNUPuCgVtBA5GbbMW31iWiOoQsk708";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Avatar or skeleton */}
      {!imageLoaded && (
        <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse border-2 border-gray-300" />
      )}
      <img
        src={imageUrl}
        alt="Profile"
        onLoad={() => setImageLoaded(true)}
        onClick={() => setOpen(!open)}
        className={`w-10 h-10 rounded-full cursor-pointer object-cover border-2 border-gray-300 transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0 absolute"
          }`}
      />

      {/* Dropdown modal */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg z-50 p-4">
          <p className="mb-2 font-bold text-lg border-b border-gray-200 pb-2 select-none">
            {username}
          </p>
          <button
            onClick={() => {
              setOpen(false);
              navigate("/user");
            }}
            className="block w-full text-left py-2 px-0 text-sm hover:bg-gray-100 focus:outline-none"
          >
            Profile
          </button>
          <button
            onClick={() => {
              setOpen(false);
              navigate("/dashboard");
            }}
            className="block w-full text-left py-2 px-0 text-sm hover:bg-gray-100 focus:outline-none"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left py-2 px-0 text-sm text-red-600 hover:bg-red-100 focus:outline-none"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
