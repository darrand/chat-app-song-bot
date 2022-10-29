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
function options (jsonBody, uri) {
    return ({
        method: 'POST',
        uri: `http://127.0.0.1:6000/${uri}`,
        body: jsonBody,
        json: true,
    })
}
async function getBotAnswer(message) {
    try {
        var userPrompt = message.split(";")
        var ansMsg = 
        `Hey this is songbot!!\n
        to conjure commands refer to this template [title/artist/lyrics/artist-title/title-lyrics/artist-lyrics];[corresponding search];[corresponding search]\n
        e.g. \ntitle;One Step Closer \nartist-lyrics;Linkin Park;I tried so hard and got so far\n
        Do note that the order of the command matters`
        if (userPrompt.length == 2) {
            var uriBody = userPrompt[0]
            var jsonDict = {}
            jsonDict[userPrompt[0]] = userPrompt[1] 
        } else if (userPrompt.length == 3) {
            var uriBody = userPrompt[0]
            var uriSplit = uriBody.split('-')
            if (uriSplit.length == 1) throw "wrong template"
            var jsonDict = {}
            jsonDict[uriSplit[0]] = userPrompt[1]
            jsonDict[uriSplit[1]] = userPrompt[2]
        } else {
            return ansMsg
        }
        
        const sendRequest = await request(options(jsonDict, uriBody))
        var response = JSON.parse(sendRequest)
        console.log(response['track_name'])
        return sendRequest

    } catch (e) {
        console.log(e)
        return "Something went wrong please try again!"
    }
}

module.exports.autoReplyMessage = async (req, res, next) => {
    try {
        const {from, to, message} = req.body;
        
        const data = await messageModel.create({
            message: {text: message},
            users: [from, to],
            sender: from,
        })
        const getBotMessage = await getBotAnswer(message)
        const dataCallBack = await messageModel.create({
            message: {text: getBotMessage},
            users: [to, from],
            sender: to, 
        })

        if (data && dataCallBack) {
            return res.json({ msg_status: "Message added succesfully.", msg_return: getBotMessage})
        }
        return res.json({ msg: "Failed to add message to the database.", msg_return: "Failed"})
    } catch (e) {
        console.log(e)
        next(next);
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


