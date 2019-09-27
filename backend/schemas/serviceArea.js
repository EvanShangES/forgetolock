const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceAreaSchema = new Schema({
    areaName:{
        type: String
    },
    address: {
        type: String
    },
    city:{
        type: String
    },
    areaShape:{
        type: String
    },
    circleCoords:{
        type: Object
    },
    circleRadius:{
        type: Number
    },
    polyPaths:{
        type: Array
    },
    polyCenter:{
        type: Object
    }
});

module.exports = mongoose.model('ServiceArea', serviceAreaSchema);

