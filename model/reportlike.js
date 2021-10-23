const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportLikeSchema = new Schema({
    _id: {
        type:String,//maybe hashed of usrnme and dept and dob and doi
        required:true,
    },
    dept:{
        type:String,
        required:true,
    },
    userid:{
        type:String,
        required:true,
    }
});

const ReportLike = mongoose.model("reportlikes",reportLikeSchema);

module.exports = ReportLike;