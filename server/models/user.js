const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String },
    userId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    location: { type: String },
    age: { type: Number },
    email: { type: String },
    linksSocial: { type: Object },
    linksProjects: { type: Object },
    userDescription: { type: String },
    userSwipes: { type: Object },
    imageProfile: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true },

});

module.exports = mongoose.model('Users', userSchema);