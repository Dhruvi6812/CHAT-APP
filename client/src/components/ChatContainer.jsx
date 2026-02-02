import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineUsers = [] } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const scrollEndRef = useRef(null);

  /* ========================
     FETCH MESSAGES
  ======================== */
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  /* ========================
     AUTO SCROLL
  ======================== */
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ========================
     SEND MESSAGE
  ======================== */
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  /* ========================
     SEND IMAGE
  ======================== */
  const handleSendImage = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  /* ========================
     EMPTY STATE
  ======================== */
  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-400 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} className="w-16" alt="" />
        <p className="text-lg font-medium text-white">
          Chat anytime, anywhere
        </p>
      </div>
    );
  }

  /* ========================
     MAIN UI
  ======================== */
  return (
    <div className="h-full min-h-0 flex flex-col backdrop-blur-lg">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500 shrink-0">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-8 rounded-full"
          alt=""
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden w-6 cursor-pointer"
          alt=""
        />
      </div>

      {/* ---------- MESSAGES ---------- */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => {
          const senderId =
            typeof msg.senderId === "object"
              ? msg.senderId._id
              : msg.senderId;

          const isMine = senderId === authUser?._id;

          return (
            <div
              key={msg._id}
              className={`flex w-full ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-end gap-3 ${
                  isMine ? "" : "flex-row-reverse"
                }`}
              >
                {msg.image ? (
                  <img
                    src={msg.image}
                    className="max-w-[230px] max-h-[300px] rounded-lg border border-gray-700"
                    alt=""
                  />
                ) : (
                  <p
                    className={`px-4 py-2 text-sm rounded-2xl max-w-[260px] break-words ${
                      isMine
                        ? "bg-violet-600 text-white rounded-br-sm"
                        : "bg-gray-700 text-white rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}

                <div className="flex flex-col items-center text-xs text-gray-400">
                  <img
                    src={
                      isMine
                        ? authUser?.profilePic || assets.avatar_icon
                        : selectedUser?.profilePic || assets.avatar_icon
                    }
                    className="w-7 h-7 rounded-full"
                    alt=""
                  />
                  <span>{formatMessageTime(msg.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollEndRef} />
      </div>

      {/* ---------- INPUT ---------- */}
      <div className="shrink-0 flex items-center gap-3 p-3 border-t border-stone-500 bg-black/30 backdrop-blur">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            placeholder="Send a message"
            className="flex-1 text-sm p-3 bg-transparent outline-none text-white"
          />

          <input
            type="file"
            hidden
            id="image"
            accept="image/png, image/jpeg"
            onChange={handleSendImage}
          />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              className="w-5 mr-2 cursor-pointer"
              alt=""
            />
          </label>
        </div>

        <img
          src={assets.send_button}
          className="w-7 cursor-pointer"
          onClick={handleSendMessage}
          alt=""
        />
      </div>
    </div>
  );
};

export default ChatContainer;
