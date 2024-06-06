const {sendMail} = require('../controllers/chatController.js');

const socketHandler = (io) => {
    const clients = new Map();

    io.on('connection',(socket)=>{
        console.log('Client connected');

        socket.on('disconnect',()=>{
            console.log('Client disconnected');
             clients.forEach((clientWs,clientId)=>{
                if(clientWs === socket){
                    clients.delete(clientId);
                }
             })
        })
        
        socket.on("send mail",(data)=>{
            console.log(`from socket 19 ${data}`);
            const newMail = sendMail(data);
            // console.log("line21",newMail);

            if(newMail){
                const recipientId = newMail.recipientId;
                recipientSocket = clients.get(recipientId);
                if(recipientSocket){
                    recipientSocket.emit("inbox",newMail);
                }
            }
        })

        socket.on("register", async (userId) =>{
            clients.set(userId,socket);
            console.log(`User ${userId} registered with socket ${socket.id}`);
        })
    })
}

module.exports = socketHandler;