import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form AFTER authUser loads
  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  // Protect route
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedImg) {
        await updateProfile({ fullName: name, bio });
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);

        reader.onload = async () => {
          await updateProfile({
            profilePic: reader.result,
            fullName: name,
            bio,
          });
          navigate("/");
        };
        return;
      }

      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>

          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser.profilePic || assets.avatar_icon
              }
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            Upload profile image
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>

        <img
          src={authUser.profilePic || assets.logo_icon}
          alt=""
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
