const mongoose=require('mongoose');
const commentSchema=mongoose.Schema({
    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Blog',
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    text:{
        type:String,
        required:true,
    },
    replies:[{
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'USer',
        },
        text:{
            type: String,
            required: true
        },
        createdAt:{
            type: Date,
            default: Date.now
        }
}],
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Comment=mongoose.model('Comment',commentSchema);
module.exports=Comment;