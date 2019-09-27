const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
    profile: {
        email: {
            type: String,
            lowercase: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: false
        },
    },
    serviceAreas:{
        type: Array
    },
});

// generating a hash for the password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if user login-password is valid
userSchema.methods.validPassword = function(password) {
    if(this.profile.password === null){
        return false;
    }else{
        return bcrypt.compareSync(password, this.profile.password);
    }
};

module.exports = mongoose.model('User', userSchema);
