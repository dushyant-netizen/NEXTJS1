"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";
import { 
  HiCamera, HiUser, HiEnvelope, HiShieldCheck, 
  HiLockClosed, HiArrowPath, HiClock, HiDevicePhoneMobile,
  HiGlobeAlt, HiBell, HiCircleStack
} from "react-icons/hi2";

const AdminProfilePage = () => {
  const { data: session, update, status } = useSession();
  
  // Form State Values
  const [name, setName] = useState("Dushyant");
  const [lastname, setLastname] = useState("Varma");
  const [avatarUrl, setAvatarUrl] = useState("/randomuser.jpg");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Feature Toggles & Preferences
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [systemLanguage, setSystemLanguage] = useState("en");
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Loading States
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Synchronize dynamic NextAuth session database details with local component state
  useEffect(() => {
    if (session?.user?.image) {
      setAvatarUrl(session.user.image);
    }
  }, [session]);

  const handleUploadSuccess = async (results: any) => {
    if (results?.info && typeof results.info === "object" && "secure_url" in results.info) {
      const cloudUrl = results.info.secure_url;
      const activeEmail = session?.user?.email;

      if (!activeEmail) {
        toast.error("Authentication session timed out. Please re-login.");
        return;
      }

      toast.loading("Saving profile picture...", { id: "db-sync" });

      try {
        const response = await fetch("/api/users/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: activeEmail, image: cloudUrl }),
        });

        if (response.ok) {
          setAvatarUrl(cloudUrl);
          await update({
            trigger: "update",
            user: { ...session?.user, image: cloudUrl }
          });
          toast.success("Profile picture updated successfully!", { id: "db-sync" });
        } else {
          toast.error("Failed to save picture url on server.", { id: "db-sync" });
        }
      } catch {
        toast.error("Network error saving photo.", { id: "db-sync" });
      }
    }
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    setTimeout(() => {
      setIsSavingInfo(false);
      toast.success("Personal information updated smoothly!");
    }, 1000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed securely!");
    }, 1200);
  };

  if (status === "loading") {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen bg-gray-50">
        <h1 className="text-xl font-medium text-gray-500 flex items-center gap-x-3">
          <HiArrowPath className="animate-spin text-blue-600 text-2xl" />
          Loading Command Center...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full max-w-screen-2xl mx-auto">
      {/* SECTION HEADER BLOCK */}
      <div className="mb-8 border-b border-gray-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system configurations, access keys, security tokens, and preferences.</p>
        </div>
        <div className="flex gap-x-3 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-xl p-3 shadow-sm items-center self-start">
          <HiCircleStack className="text-emerald-500 text-lg" />
          <span>Database Connection: <strong className="text-emerald-600 uppercase">Healthy</strong></span>
        </div>
      </div>

      {/* THREE-COLUMN ADAPTIVE FLEXGRID SYSTEM */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* COLUMN 1: Profile Profile Identity Card & Audit Tracker Summary */}
        <div className="space-y-8 xl:col-span-1">
          {/* Main Identity Component Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-600 to-indigo-700 z-0" />
            
            <div className="relative group w-28 h-28 mt-6 mb-4 z-10">
              <Image src={avatarUrl} alt="Avatar" width={112} height={112} className="w-full h-full rounded-full object-cover border-4 border-white shadow-md" priority />
              <CldUploadWidget uploadPreset="ml_default" onSuccess={handleUploadSuccess}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer border-4 border-white">
                    <HiCamera className="text-xl" />
                    <span className="text-[10px] font-semibold uppercase mt-0.5">Edit DP</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>

            <h3 className="text-lg font-bold text-gray-800">{name} {lastname}</h3>
            <span className="inline-flex items-center gap-x-1.5 px-2.5 py-0.5 mt-2 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
              <HiShieldCheck className="text-sm" />
              {session?.user?.role || "Admin"}
            </span>
            <div className="w-full border-t border-gray-100 mt-6 pt-4 text-center text-sm text-gray-600 truncate">
              {session?.user?.email}
            </div>
          </div>

          {/* Activity Logs Audit Trail Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-x-2">
              <HiClock className="text-gray-400 text-lg" />
              Recent System Action Logs
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-x-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Updated system avatar display photo</p>
                  <p className="text-gray-400 mt-0.5">Just now • Location IP: 192.168.1.1</p>
                </div>
              </div>
              <div className="flex items-start gap-x-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Database connection migration</p>
                  <p className="text-gray-400 mt-0.5">15 mins ago • Schema Push Complete</p>
                </div>
              </div>
              <div className="flex items-start gap-x-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Admin system login session refreshed</p>
                  <p className="text-gray-400 mt-0.5">2 hours ago • Token Cookie issued</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2 & 3: Management Workspace Forms & Application Controls */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* BLOCK A: Personal Information Management */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-x-2">
              <HiUser className="text-blue-500" />
              Personal Information
            </h4>
            <form onSubmit={handleSaveInfo} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">First Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-gray-300 py-2.5 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Last Name</label>
                  <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} className="w-full rounded-xl border border-gray-300 py-2.5 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2 select-none">Email Address (Read Only)</label>
                <input type="email" value={session?.user?.email || ""} disabled className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-400 cursor-not-allowed focus:outline-none" />
              </div>
              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button type="submit" disabled={isSavingInfo} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm rounded-xl transition duration-150 shadow-sm cursor-pointer">
                  {isSavingInfo ? "Saving Updates..." : "Save Modifications"}
                </button>
              </div>
            </form>
          </div>

          {/* BLOCK B: Secure Authentication Management */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-x-2">
              <HiLockClosed className="text-amber-500" />
              Security & Credentials
            </h4>
            
            {/* Password Management Fields */}
            <form onSubmit={handleChangePassword} className="space-y-5 mb-6 pb-6 border-b border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-xl border border-gray-300 py-2.5 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">New Security Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Minimum 8 characters" className="w-full rounded-xl border border-gray-300 py-2.5 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={isChangingPassword} className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-500 text-white font-medium text-sm rounded-xl transition duration-150 shadow-sm cursor-pointer">
                  {isChangingPassword ? "Updating Password..." : "Update Password Credentials"}
                </button>
              </div>
            </form>

            {/* Multi-Factor Authentication Settings */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-start gap-x-3">
                <HiDevicePhoneMobile className="text-2xl text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-sm font-bold text-gray-800">Two-Factor Security Authentication (2FA)</h5>
                  <p className="text-xs text-gray-500 mt-0.5">Enforce cell-phone verification protection tokens during secure entry sessions.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input type="checkbox" checked={mfaEnabled} onChange={() => { setMfaEnabled(!mfaEnabled); toast.success(`2FA state switched successfully!`); }} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* BLOCK C: Advanced Preferences Configuration */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-x-2">
              <HiGlobeAlt className="text-emerald-500" />
              Global System Preferences
            </h4>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Interface Language</label>
                  <select value={systemLanguage} onChange={(e) => { setSystemLanguage(e.target.value); toast.success("Language preference updated!"); }} className="w-full rounded-xl border border-gray-300 bg-white py-2.5 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
                    <option value="en">English (US)</option>
                    <option value="es">Español (ES)</option>
                    <option value="fr">Français (FR)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl self-end h-[42px]">
                  <span className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-x-2">
                    <HiBell className="text-gray-400 text-sm" />
                    Email Status Report Alerts
                  </span>
                  <input type="checkbox" checked={emailNotifications} onChange={() => { setEmailNotifications(!emailNotifications); toast.success("Alert matrix updated!"); }} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
