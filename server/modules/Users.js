const mongoose = require('mongoose');
const keys = require('../config/keys');
// //NEEDS IT BC I INSTALLED IT AS DEPENDECY IN THIS FOLDER
// mongoose.connect(keys.MONGO_URI, { useNewUrlParser:true })
//     .then(() => console.log("MongoDB connected"))
//     .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
    googleID: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;