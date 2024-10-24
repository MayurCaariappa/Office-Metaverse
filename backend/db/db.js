const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:KS7sU1wbBbWPTfdK@cluster0.vlpfr.mongodb.net/office-metaverse-app");

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const AvatarSchema = mongoose.Schema({
    username: String,
    avatarUrl: String,
    online: Boolean,
    position: {
        x: Number,
        y: Number
    }
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Avatar = mongoose.model('Avatar', AvatarSchema);

module.exports = {
    Admin,
    User,
    Avatar
}