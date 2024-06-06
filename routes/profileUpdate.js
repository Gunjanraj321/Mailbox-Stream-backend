const express = require('express');
const router = express.Router();
const { upgrade, getProfile } = require('../controllers/profileController');
const { createRoom, getChatRoom, joinRoom } = require('../controllers/chatController.js');
const { getAllUsers, sendFriendRequest, getNotification, getNotifications, respondToFriendRequest } = require('../controllers/friendReqController');
const { getMessages } = require('../controllers/messageController.js');


router.patch('/upgrade', upgrade);
router.get('/profile/:userId', getProfile);
router.post('/chatrooms', createRoom);
router.get('/chatrooms',getChatRoom);
router.post('/joinroom',joinRoom);
router.get('/users', getAllUsers);

router.get('/users', getAllUsers);
router.post('/friend-requests', sendFriendRequest);
router.get('/notifications', getNotifications);
router.patch('/friend-requests/respond', respondToFriendRequest);

router.get('/messages/:roomId', getMessages);


module.exports = router;
