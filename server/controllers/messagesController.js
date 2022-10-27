const messageModel = require("../model/messageModel");
const request = require("request-promise");

module.exports.addMessage = async (req, res, next) => {
    try {
        const {from, to, message} = req.body;
        const data = await messageModel.create({
            message: {text: message},
            users: [from, to],
            sender: from,
        });
        if (data) return res.json({ msg: "Message added successfully." });
        return res.json({ msg: "Failed to add message to the database."})
    } catch (e) {
        next(ex);
    }
};

module.exports.autoReplyMessage = async (req, res, next) => {
    try {
        const {from, to, message} = req.body;
        const data = await messageModel.create({
            message: {text: message},
            users: [from, to],
            sender: from,
        })
        console.log(data)
        var ansMsg = "Answer"
        const dataCallBack = await messageModel.create({
            message: {text: ansMsg},
            users: [to, from],
            sender: to, 
        })
        console.log(dataCallBack)
        if (data && dataCallBack) return ({ msg_status: "Message added succesfully.", msg_return: ansMsg})
        return res.json({ msg: "Failed to add message to the database.", msg_return: "Failed"})

    } catch (e) {
        next(ex);
    }
}

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const {from, to} = req.body;
        const messages = await messageModel.find({
            users: {
                $all: [from, to],
            },
        })
        .sort({ updatedAt: 1})
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            }
        })
        res.json(projectedMessages)
    } catch (e) {
        next(ex);
    }
};


