import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CurrentUserContext } from "../App";
import "./EditDetails.css";


const languageOptions = [
  { value: "JavaScript", label: "JavaScript" },
  { value: "Python", label: "Python" },
  { value: "C++", label: "C++" },
];

const skillOptions = [
  { value: "Web Development", label: "Web Development" },
  { value: "DSA", label: "DSA" },
  { value: "AI/ML", label: "AI/ML" },
];

const EditDetails = () => {
  const { currentUsername } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const [editUser, setEditUser] = useState({
    firstName: "",
    lastName: "",
    institute: "",
    gender: "",
    about: "",
    linkedin: "",
    github: "",
    codeforcesId: "",
    leetcodeId: "",
    codechefId: "",
    geeksforgeeksId: "",
    codeforcesRating: "",
    leetcodeRating: "",
    codechefRating: "",
    geeksforgeeksRating: "",
    languages: [],
    selectedSkills: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = (selected, name) => {
    setEditUser((prev) => ({ ...prev, [name]: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editUser.firstName || !editUser.lastName || !editUser.institute) {
      toast.error("First name, last name, and institute are required.");
      return;
    }

    const formData = new FormData();
    formData.append("currentUsername", currentUsername);
    formData.append("firstName", editUser.firstName);
    formData.append("lastName", editUser.lastName);
    formData.append("institute", editUser.institute);
    formData.append("gender", editUser.gender);
    formData.append("about", editUser.about);
    formData.append("linkedin", editUser.linkedin);
    formData.append("github", editUser.github);
    formData.append("codeforcesId", editUser.codeforcesId);
    formData.append("leetcodeId", editUser.leetcodeId);
    formData.append("codechefId", editUser.codechefId);
    formData.append("geeksforgeeksId", editUser.geeksforgeeksId);
    formData.append("codeforcesRating", editUser.codeforcesRating);
    formData.append("leetcodeRating", editUser.leetcodeRating);
    formData.append("codechefRating", editUser.codechefRating);
    formData.append("geeksforgeeksRating", editUser.geeksforgeeksRating);

    const languages = editUser.languages.map((lang) => lang.value);
    const selectedSkills = editUser.selectedSkills.map((skill) => skill.value);

    formData.append("languages", JSON.stringify(languages));
    formData.append("selectedSkills", JSON.stringify(selectedSkills));

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:8000/${currentUsername}/edit-profile`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully!");
      navigate(`/${currentUsername}/home`);
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="firstName" placeholder="First Name" value={editUser.firstName} onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" value={editUser.lastName} onChange={handleChange} />
        <input name="institute" placeholder="Institute" value={editUser.institute} onChange={handleChange} />
        <input name="gender" placeholder="Gender" value={editUser.gender} onChange={handleChange} />
        <textarea name="about" placeholder="About" value={editUser.about} onChange={handleChange} />
        <input name="linkedin" placeholder="LinkedIn" value={editUser.linkedin} onChange={handleChange} />
        <input name="github" placeholder="GitHub" value={editUser.github} onChange={handleChange} />

        <Select
          isMulti
          name="languages"
          options={languageOptions}
          value={editUser.languages}
          onChange={(selected) => handleMultiChange(selected, "languages")}
          placeholder="Select Languages"
        />

        <Select
          isMulti
          name="selectedSkills"
          options={skillOptions}
          value={editUser.selectedSkills}
          onChange={(selected) => handleMultiChange(selected, "selectedSkills")}
          placeholder="Select Skills"
        />

        <input name="codeforcesId" placeholder="Codeforces ID" value={editUser.codeforcesId} onChange={handleChange} />
        <input name="leetcodeId" placeholder="LeetCode ID" value={editUser.leetcodeId} onChange={handleChange} />
        <input name="codechefId" placeholder="CodeChef ID" value={editUser.codechefId} onChange={handleChange} />
        <input name="geeksforgeeksId" placeholder="GFG ID" value={editUser.geeksforgeeksId} onChange={handleChange} />

        <input type="number" name="codeforcesRating" placeholder="CF Rating" value={editUser.codeforcesRating} onChange={handleChange} />
        <input type="number" name="leetcodeRating" placeholder="LC Rating" value={editUser.leetcodeRating} onChange={handleChange} />
        <input type="number" name="codechefRating" placeholder="CC Rating" value={editUser.codechefRating} onChange={handleChange} />
        <input type="number" name="geeksforgeeksRating" placeholder="GFG Rating" value={editUser.geeksforgeeksRating} onChange={handleChange} />

        <input type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditDetails;
