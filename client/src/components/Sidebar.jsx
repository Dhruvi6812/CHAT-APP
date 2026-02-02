import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  /* ========================
     FETCH USERS
  ======================== */
  useEffect(() => {
    getUsers();
  }, [onlineUsers.length]);

  /* ========================
     FILTER USERS
  ======================== */
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  return (
    <div
      className={`h-full bg-[#8185B2]/10 p-5 overflow-y-auto text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* ---------- HEADER ---------- */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="w-40" />

          <div className="relative group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="w-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-3 rounded-md bg-[#282142] border border-gray-600 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-gray-500" />
              <p onClick={logout} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* ---------- SEARCH ---------- */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="" className="w-3" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search User..."
            className="bg-transparent outline-none text-white text-xs flex-1 placeholder-gray-400"
          />
        </div>
      </div>

      {/* ---------- USER LIST ---------- */}
      <div className="flex flex-col gap-1">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({
                ...prev,
                [user._id]: 0,
              }));
            }}
            className={`relative flex items-center gap-3 p-2 pl-4 rounded cursor-pointer ${
              selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
            }`}
          >
            <img
              src={user.profilePic || assets.avatar_icon}
              alt=""
              className="w-9 rounded-full"
            />

            <div className="flex-1">
              <p className="text-sm">{user.fullName}</p>
              <span
                className={`text-xs ${
                  onlineUsers.includes(user._id)
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </span>
            </div>

            {unseenMessages?.[user._id] > 0 && (
              <span className="text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/60">
                {unseenMessages[user._id]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
