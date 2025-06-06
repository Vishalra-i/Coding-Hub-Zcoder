const User = require("../model/User.model");

async function handleUser(req, res) {
  try {
    const profileData = req.body;
    const { email, userName } = profileData;

    // Basic validations
    if (!email || !userName) {
      return res.status(400).json({ msg: "Email and userName are required." });
    }

    // Safely parse JSON fields
    const languages = Array.isArray(profileData.languages)
      ? profileData.languages
      : JSON.parse(profileData.languages || "[]");

    const selectedSkills = Array.isArray(profileData.selectedSkills)
      ? profileData.selectedSkills
      : JSON.parse(profileData.selectedSkills || "[]");

    // Handle file upload
    const profilePicturePath = req.file?.path || null;

    // Prepare the data to be saved/updated
    const updatedData = {
      firstName: profileData.firstName || "",
      lastName: profileData.lastName || "",
      userName,
      email,
      institute: profileData.institute || "",
      gender: profileData.gender || "",
      about: profileData.about || "",
      linkedin: profileData.linkedin || "",
      github: profileData.github || "",
      codeforcesId: profileData.codeforcesId || "",
      leetcodeId: profileData.leetcodeId || "",
      codechefId: profileData.codechefId || "",
      geeksforgeeksId: profileData.geeksforgeeksId || "",
      codeforcesRating: profileData.codeforcesRating || "",
      leetcodeRating: profileData.leetcodeRating || "",
      codechefRating: profileData.codechefRating || "",
      geeksforgeeksRating: profileData.geeksforgeeksRating || "",
      languages,
      selectedSkills,
      ...(profilePicturePath && { profilePicture: profilePicturePath }), // only add if present
    };

    // Update or create logic
    const existingProfile = await User.findOne({ email });

    if (existingProfile) {
      const updatedProfile = await User.findOneAndUpdate(
        { email },
        { $set: updatedData },
        { new: true }
      );
      return res.status(200).json({ msg: "Profile updated", profile: updatedProfile });
    } else {
      const newProfile = new User(updatedData);
      await newProfile.save();
      return res.status(201).json({ msg: "Profile created", profile: newProfile });
    }
  } catch (err) {
    console.error("❌ Error in handleUser:", err);
    return res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
}

module.exports = {
  handleUser,
};
