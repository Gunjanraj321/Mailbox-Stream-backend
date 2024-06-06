const { Sequelize } = require("sequelize");
const ChatRoom = require("../models/chatRoom");
const User = require("../models/user");
const UserChatRoom = require("../models/userChatRoom");

const createRoom = async (req, res) => {
  try {
    const { roomName, membersId } = req.body;
    // console.log(roomName, membersId);
    const userId = req.user.userId;
    // console.log(userId);
    const user = await User.findOne({ where: { userId: userId } });

    if (!user.isPrimeMember) {
      console.log(user.isPrimeMember);
      return res
        .status(403)
        .json({ message: "Only prime members can create chat rooms" });
    }

    const existingRoom = await ChatRoom.findOne({ where: { roomName } });
    if (existingRoom) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const room = await ChatRoom.create({
      roomName,
      adminId: userId,
      membersNo: membersId.length,
    });

    membersId.push(userId);

    await room.addUsers(
      membersId.map((ele) => Number(ele))
    );

    res.status(201).json({ message: "Chat room created successfully", room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getChatRoom = async (req, res) => {
  try {
    const allChatRoom = await ChatRoom.findAll();
    res.status(200).json(allChatRoom);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const joinRoom = async (req, res) => {
    const { roomId } = req.body;
    const userId = req.user.userId;
  
    try {
      const user = await User.findOne({ where: {userId: userId } });
      const chatRoom = await ChatRoom.findByPk(roomId);
  
      if (!chatRoom) {
        return res.status(404).json({ message: "Chat room not found" });
      }
  
      const userChatRoomsCount = await user.countChatRooms();
  
      if (user.isPrimeMember || userChatRoomsCount < 1) {
        await chatRoom.addUser(userId);
        return res.status(200).json({ message: "User added successfully" });
      } else {
        if (user.availCoins < 150) {
          return res.status(403).json({ message: "Not enough coins to join additional rooms" });
        }
        user.availCoins -= 150;
        await user.save();
        await chatRoom.addUser(userId);
        return res.status(200).json({ message: "User added successfully after deducting coins" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  

module.exports = { createRoom, getChatRoom, joinRoom };
