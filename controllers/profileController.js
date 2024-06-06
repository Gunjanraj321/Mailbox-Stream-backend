const User = require("../models/user");

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const upgrade = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ where: { userId } });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.isPrimeMember) {
        return res.status(400).json({ message: "User is already a prime member" });
      }

      user.isPrimeMember = true;
      await user.save();

    res
      .status(200)
      .json({ message: "User upgraded to prime member successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getProfile,
  upgrade,
};
