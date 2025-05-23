const User = require("../models/User");

exports.editUser = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log(req.user);

    const { fullName, location, qualification, skills } = req.body;

    const skillsArray =
      typeof skills === "string"
        ? skills.split(",").map((skill) => skill.trim())
        : skills;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(fullName && { name: fullName }),
        ...(location && { location }),
        ...(qualification && { qualification }),
        ...(skills && { skills: skillsArray }),
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};
