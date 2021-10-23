const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
    _id: {
        type:String,//maybe hashed of usrnme and dept and dob and doi
        required:true,
    },
    gtype:{
            type:String,
            required:true,
        },
    doi:{
            type:String,
            required:true,
        },
    dept:{
        type:String,
        required:true,
    },
    subj:{
        type:String,
        required:true,
    },
    detrep:{
        type:String,
        required:true,
    },
    gstatus:{
            type:String,
            default : "Pending",
        },
    likes:{
            type:String,
            default : 0,
        },

});

const Reports = mongoose.model("reports",reportSchema);

module.exports = Reports;