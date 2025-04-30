/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useProfile } from "@/contexts/ProfileContext";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function ProfileSelection() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [selectedProfileType, setSelectedProfileType] = useState("adult"); // adult, kids
  const [editMode, setEditMode] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });
  const router = useRouter();
  const { setSelectedProfile } = useProfile();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        // First check if we have a session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!sessionData.session) {
          console.log("No active session found, redirecting to login");
          router.push("/");
          return;
        }

        // If we have a session, get the user
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!userData.user) {
          console.log("No user found despite session, redirecting to login");
          router.push("/");
          return;
        }

        // Set user first, then fetch profiles
        setUser(userData.user);
        fetchProfiles(userData.user);
      } catch (err) {
        console.error("Authentication error:", err);
        showToast(
          `Authentication error: ${err.message || "Unknown error"}`,
          "error"
        );
        setLoading(false);

        // If there's an auth error, redirect to login after a short delay
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    };

    checkAuth();
  }, [router]);

  // Show toast message
  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 5000);
  };

  const fetchProfiles = async (currentUser) => {
    if (!currentUser || !currentUser.id) {
      showToast(
        "User information is not available. Please try logging in again."
      );
      setLoading(false);
      return;
    }

    try {
      // Check if the profiles table exists
      const { error: tableCheckError } = await supabase
        .from("profiles")
        .select("count")
        .limit(1)
        .single();

      if (tableCheckError && tableCheckError.code === "42P01") {
        // Table doesn't exist error
        showToast(
          "The profiles table doesn't exist. Please run the SQL setup script in Supabase."
        );
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", currentUser.id);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setProfiles(data);
        setLoading(false);
      } else {
        // Create a default profile if none exists
        try {
          // Safely access user metadata
          const userMeta = currentUser.user_metadata || {};
          const defaultName =
            userMeta.full_name ||
            userMeta.username ||
            (currentUser.email ? currentUser.email.split("@")[0] : "User");

          const newProfile = await createProfile(
            defaultName,
            "adult",
            currentUser
          );

          if (newProfile) {
            setProfiles([newProfile[0]]);
          } else {
            throw new Error("Failed to create default profile");
          }
        } catch (createError) {
          console.error("Error creating default profile:", createError);
          showToast(
            `Could not create default profile: ${
              createError.message || JSON.stringify(createError)
            }`
          );
        } finally {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
      showToast(
        `Error fetching profiles: ${err.message || JSON.stringify(err)}`
      );
      setLoading(false);
    }
  };

  const createProfile = async (name, type = "adult", currentUser = null) => {
    try {
      // Use the passed user or fall back to state
      const userToUse = currentUser || user;

      if (!userToUse || !userToUse.id) {
        showToast(
          "User information is not available. Please try logging in again."
        );
        return null;
      }

      if (!name.trim()) {
        showToast("Profile name cannot be empty");
        return null;
      }

      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            user_id: userToUse.id,
            name,
            type,
            avatar_color: getRandomColor(),
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned after profile creation");
      }

      if (!currentUser) {
        // Only update state if this is a manual profile creation (not default)
        setProfiles((prevProfiles) => [...prevProfiles, ...data]);
        setNewProfileName("");
        setShowAddProfile(false);
        setSelectedProfileType("adult");
        showToast("Profile created successfully!", "success");
      }

      return data;
    } catch (err) {
      console.error("Error creating profile:", err);
      showToast(
        `Error creating profile: ${err.message || JSON.stringify(err)}`
      );
      return null;
    }
  };

  const updateProfile = async (profileId, updates) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profileId)
        .select();

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned after profile update");
      }

      // Update the profiles state with the updated profile
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === profileId ? data[0] : profile
        )
      );

      showToast("Profile updated successfully!", "success");
      return data[0];
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast(
        `Error updating profile: ${err.message || JSON.stringify(err)}`
      );
      return null;
    }
  };

  // Save profile name when it changes (with debounce)
  useEffect(() => {
    if (!profileToEdit || !newProfileName.trim()) return;

    // Create a 800ms debounce to avoid too many saves while typing
    const debounceTimeout = setTimeout(async () => {
      if (
        profileToEdit.name !== newProfileName ||
        profileToEdit.type !== selectedProfileType
      ) {
        await updateProfile(profileToEdit.id, {
          name: newProfileName,
          type: selectedProfileType,
        });
      }
    }, 800);

    return () => clearTimeout(debounceTimeout);
  }, [newProfileName, selectedProfileType, profileToEdit]);

  const deleteProfile = async (profileId) => {
    try {
      if (profiles.length <= 1) {
        showToast("You must have at least one profile");
        return false;
      }

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileId);

      if (error) {
        throw error;
      }

      // Update the profiles state by removing the deleted profile
      setProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.id !== profileId)
      );

      showToast("Profile deleted successfully!", "success");
      return true;
    } catch (err) {
      console.error("Error deleting profile:", err);
      showToast(
        `Error deleting profile: ${err.message || JSON.stringify(err)}`
      );
      return false;
    }
  };

  const selectProfile = (profile) => {
    if (editMode) {
      setProfileToEdit(profile);
      setNewProfileName(profile.name);
      setSelectedProfileType(profile.type);
      setShowAddProfile(true);
    } else {
      try {
        setSelectedProfile(profile); // ✅ Save globally
        router.push("/home");
      } catch (err) {
        console.error("Error selecting profile:", err);
        showToast(`Error selecting profile: ${err.message || "Unknown error"}`);
      }
    }
  };

  const getRandomColor = () => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-purple-500",
      "bg-gradient-to-br from-green-400 to-blue-500",
      "bg-gradient-to-br from-purple-400 to-pink-500",
      "bg-gradient-to-br from-red-400 to-yellow-500",
      "bg-gradient-to-br from-yellow-400 to-orange-500",
      "bg-gradient-to-br from-teal-400 to-green-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("selectedProfile");
      router.push("/");
    } catch (err) {
      console.error("Error signing out:", err);
      showToast(`Error signing out: ${err.message || "Unknown error"}`);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    window.location.reload();
  };

  const handleSaveProfile = async () => {
    if (!newProfileName.trim()) {
      showToast("Profile name cannot be empty");
      return;
    }

    if (profileToEdit) {
      // Update existing profile - this is a manual save
      const updated = await updateProfile(profileToEdit.id, {
        name: newProfileName,
        type: selectedProfileType,
      });

      if (updated) {
        setShowAddProfile(false);
        setProfileToEdit(null);
      }
    } else {
      // Create new profile
      await createProfile(newProfileName, selectedProfileType);
    }
  };

  const handleDeleteProfile = async () => {
    if (profileToEdit) {
      const deleted = await deleteProfile(profileToEdit.id);
      if (deleted) {
        setShowAddProfile(false);
        setProfileToEdit(null);
      }
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    // Reset any open forms when toggling edit mode
    setShowAddProfile(false);
    setProfileToEdit(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Toast notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg max-w-md ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          } text-white flex items-center justify-between`}
        >
          <div className="flex items-center">
            {toast.type === "error" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="ml-4 text-white hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Done button that appears when in edit mode */}
      {editMode && (
        <button
          onClick={toggleEditMode}
          className="fixed bottom-8 right-8 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="ml-2">Done</span>
        </button>
      )}

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <Link href="/home" aria-label="go home">
            <div className="relative w-40 h-10">
              <Image
                src="/logo.svg"
                alt="BingeIt Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            {!editMode && (
              <button
                onClick={toggleEditMode}
                className="px-4 py-2 text-sm bg-transparent hover:bg-gray-800 rounded flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm bg-transparent hover:bg-gray-800 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>

        {showAddProfile ? (
          <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              {profileToEdit ? "Edit Profile" : "Add Profile"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm mb-2">Profile Name</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded text-white"
                placeholder="Enter a name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm mb-2">Profile Type</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedProfileType("adult")}
                  className={`px-4 py-2 rounded ${
                    selectedProfileType === "adult"
                      ? "bg-blue-600"
                      : "bg-gray-700"
                  }`}
                >
                  Adult
                </button>
                <button
                  onClick={() => setSelectedProfileType("kids")}
                  className={`px-4 py-2 rounded ${
                    selectedProfileType === "kids"
                      ? "bg-purple-600"
                      : "bg-gray-700"
                  }`}
                >
                  Kids
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowAddProfile(false);
                  setProfileToEdit(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded"
              >
                Cancel
              </button>
              {profileToEdit ? (
                <button
                  onClick={handleDeleteProfile}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-12">
              {editMode ? "Edit Profiles" : "Who's watching?"}
            </h2>
            <BlurFade
              delay={0.15} // stagger effect (each 0.15s later)
              duration={0.8} // smooth and elegant duration
            >
              <div className="flex flex-wrap justify-center gap-8">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => selectProfile(profile)}
                  >
                    <div className="relative">
                      <div
                        className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold mb-4 ${
                          profile.type === "kids"
                            ? "bg-gradient-to-br from-purple-500 to-pink-500"
                            : profile.avatar_color ||
                              "bg-gradient-to-br from-blue-400 to-purple-500"
                        } group-hover:ring-4 ring-white`}
                      >
                        {profile.type === "kids" ? (
                          <span className="text-2xl font-bold uppercase">
                            KIDS
                          </span>
                        ) : (
                          profile.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      {/* Edit pencil icon that appears on hover */}
                      {editMode && (
                        <div className="absolute top-0 left-0 w-32 h-32 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-gray-300 group-hover:text-white">
                      {profile.name.split(" ").slice(0, 3).join(" ")}
                    </span>
                  </div>
                ))}

                {profiles.length < 5 && !editMode && (
                  <div
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => {
                      setProfileToEdit(null);
                      setNewProfileName("");
                      setSelectedProfileType("adult");
                      setShowAddProfile(true);
                    }}
                  >
                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-6xl bg-gray-800 mb-4 group-hover:bg-gray-700 group-hover:ring-4 ring-white">
                      +
                    </div>
                    <span className="text-gray-300 group-hover:text-white">
                      Add Profile
                    </span>
                  </div>
                )}
              </div>
            </BlurFade>
          </>
        )}
      </div>
    </div>
  );
}
