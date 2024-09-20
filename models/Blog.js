const mongoose=require('mongoose');
const blogSchema=mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    blogImage:{
        type: String,
        required:true,
        default: ''
    },
    createdAt:{
          type: Date,
          default: Date.now
    }
});

const Blog=mongoose.model('Blog',blogSchema);
module.exports=Blog;