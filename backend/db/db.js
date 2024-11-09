const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:KS7sU1wbBbWPTfdK@cluster0.vlpfr.mongodb.net/office-metaverse-app");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
});

const AvatarSchema = mongoose.Schema({
    avatarId: Number,
    avatarName: String,
    base64: String, 
});

const MapSchema = mongoose.Schema({
    mapId: String,
    mapName: String,
    mapBase64: String,
});

const User = mongoose.model('User', UserSchema);
const Avatar = mongoose.model('Avatar', AvatarSchema);
const Map = mongoose.model('Map', AvatarSchema);

module.exports = {
    User,
    Avatar,
    Map,
}