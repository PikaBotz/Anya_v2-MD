const Config = require('../../../config');
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    warns: { type: Number, default: 0 },    
    /**
     * 0: Null
     * 1: Private Chat
     * 2: Group Chat
     */
    chat: { type: Number, default: 0 },
    date: { type: Number, default: 0 },
    reason: { type: String, default: "unavailable" }
})

const Warn = mongoose.model('warns', Schema);

//༺─────────────────────────────────────༻

const currentDate = new Date();
const timestamp = currentDate.getTime();

async function addWarn(jid, { chat, reason }) {
    const isWarned = await Warn.findOne({ id: jid });
    const warningLimit = Config.warns;
    const userWarnCount = isWarned ? isWarned.warns : 0;
    if (!isWarned) {
        await new Warn({ id: jid, warns: 1, chat: chat || 0, date: timestamp, reason: reason || "unavailable" }).save();
        return {
            status: 201,
            message: "successfully added warn",
            warn: 1
        };
    } else {
        if (warningLimit < userWarnCount) {
            await Warn.findOneAndDelete({ id: jid });
            return {
                status: 429,
                message: "already warn limit exceeded",
                warn: isWarned.warns
            };
        } else if (warningLimit < userWarnCount + 1) {
            await Warn.findOneAndDelete({ id: jid });
            return {
                status: 429,
                message: "warn limit reached after this warn",
                warn: isWarned.warns
            };
        } else {
            await Warn.findOneAndUpdate(
                { id: jid },
                { $set: { warns: userWarnCount + 1, chat: chat || 0, date: timestamp, reason: reason || "unavailable" } },
                { new: true }
            );
            return {
                status: 200,
                message: "successfully updated warn",
                warn: isWarned.warns + 1
            };
        }
    }
}

//༺─────────────────────────────────────༻

async function delWarn(jid, { chat, reason }) {
    const isWarned = await Warn.findOne({ id: jid });
    if (!isWarned) {
        return {
            status: 404,
            message: "user not found",
            warn: 0
        };
    } else {
        const userWarnCount = isWarned.warns;
        if (userWarnCount === 0) {
            return {
                status: 200,
                message: "user's warn count already at zero",
                warn: 0
            };
        } else {
            const updatedWarnCount = userWarnCount - 1;
            if (updatedWarnCount === 0) {
                await Warn.findOneAndDelete({ id: jid });
                return {
                    status: 200,
                    message: "user's warn count became zero, user deleted",
                    warn: 0
                };
            } else {
//                const timestamp = currentDate.getTime();
                await Warn.findOneAndUpdate(
                    { id: jid },
                    { $set: { warns: updatedWarnCount, chat: chat || 0, date: timestamp, reason: reason || "unavailable" } },
                    { new: true }
                );
                return {
                    status: 200,
                    message: "successfully decreased warn count",
                    warn: isWarned.warns - 1
                };
            }
        }
    }
}

//༺─────────────────────────────────────༻
    
async function clearWarn(jid) {
    const isWarned = await Warn.findOne({ id: jid });
    if (!isWarned) {
        return {
            status: 404,
            message: "user not found"
        };
    } else {
        await Warn.findOneAndDelete({ id: jid });
        return {
            status: 200,
            message: "user deleted from the database"
        };
    }
}

//༺─────────────────────────────────────༻

module.exports = {
    Warn,
    addWarn,
    delWarn,
    clearWarn
};