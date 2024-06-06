const User = require("../models/user");
const FriendRequest = require("../models/FriendReq");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["userId", "name", "phone"],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

const sendFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;
  if (!userId || !friendId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingRequest = await FriendRequest.findOne({
      where: { userId, friendId },
    });

    if (existingRequest) {
      return res.status(409).json({ error: "Friend request already sent" });
    }

    const friendRequest = await FriendRequest.create({ userId, friendId });
    res
      .status(201)
      .json({ message: "Friend request sent successfully", friendRequest });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "An error occurred while sending friend request." });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const friendRequests = await FriendRequest.findAll({
      where: { friendId: userId, status: false },
    });
    res.json(friendRequests);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "An error occurred while fetching notifications." });
  }
};

const respondToFriendRequest = async (req, res) => {
  const { requestId, action } = req.body;
  const userId = req.user.userId;

  try {
    const friendRequest = await FriendRequest.findOne({
      where: { id: requestId, friendId: userId, status: false },
    });

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (action === 'accept') {
      await friendRequest.update({ status: true });
      res.json({ message: "Friend request accepted" });
    } else if (action === 'deny') {
      await friendRequest.destroy();
      res.json({ message: "Friend request denied" });
    } else {
      res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Error responding to friend request:", error);
    res.status(500).json({ error: "An error occurred while responding to friend request." });
  }
};

module.exports = { getAllUsers, sendFriendRequest, getNotifications, respondToFriendRequest };
