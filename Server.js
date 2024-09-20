const express=require('express');
const app=express();
const User=require('./models/User');
const Blog=require('./models/Blog');
const multer=require('multer');
const cors=require('cors');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
app.use(cors());
const bodyParser=require('body-parser');
app.use(bodyParser.json());
const PORT=7000;
const SECRET_KEY='233313131';
const DB=require('./Db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const uploads=multer({storage: storage});

  //signup
  app.post('/register',uploads.single('profileImage'),async(req,res)=>{
      const {email,password}=req.body;
      const profileImage=req.file? req.file.filename: ' ';

      if(!email || !password){
        console.log("Please fill the required fields"); 
      }
      const hashPassword=bcrypt.hash(password,10);
      const newUser=new User({
        email,
        password: hashPassword,
        profileImage
      });
      await newUser.save();
      return res.status(200).json({message: "User registered successfully"});
  });

  //login
  app.post('/login',async(req,res)=>{
     const {email,password}=req.body;
     const user=await User.findOne({email});
     if(!user){
         return res.status(404).json({message: "User not found"});
     }
     const hashPassword=await bcrypt.hash(password,10);
     const match=await bcrypt.compare(user.password,hashPassword);
     if(!match){
        return res.status(401).json({message: "Incorrect Password"});
     }
     const token=jwt.sign({id: user._id, email: user.email},SECRET_KEY,{expiresIn: '1h'});
     return res.status(201).json({message: "Login Successfully",token});
  });

 //verify-token
 const verifyToken=async(req,res,next)=>{
    const token=req.headers.authorization.split(' ')[1];
    jwt.verify(token,SECRET_KEY,(err,user)=>{
        if (err) {
            return res.sendStatus(403);
          }
        req.user=user;
        next();
    });
};

//dashboard
app.get('/dashboard',verifyToken,async(req,res)=>{
    const user=await User.findById(req.user.id);
    res.render('dashboard',{profileImage: user.profileImage});
});
  
//create-blog
app.post('/blog/create',uploads.single('blogImage'),async(req,res)=>{
   const {title,description}=req.body;
   const blogImage=req.file? req.file.filename : '';
   if(!title || !description){
    return res.status(400).json({message: "All fields are required"});
   }
   const newBlog=await new Blog({
        title,
        description,
        blogImage
   });
   await newBlog.save();
   return res.status(201).json({message: "Blog Created Successfully"});
});

//get all the blogs
app.get('/blogs',async(req,res)=>{
    const blogs=await Blog.find();
    res.render('blogList',{blogs});
});

//update-blog
app.put('/blog/edit/:id',uploads.single('blogImage'),async(req,res)=>{
     const{title,description}=req.body;
     const blogImage=req.file? req.file.filename : req.body.currentImage;

     const updateBlog=await Blog.findByIdAndUpdate(req.params.id,{title,description,blogImage});
     return res.status(201).json({message: "BLog Updated Successfully", updateBlog});
});

//deleteBlog
app.delete('/blog/:id',async(req,res)=>{
   await Blog.findByIdAndDelete(req.params.id);
   return res.status(201).json({message: "Blog Deleted Successfully"});
});

//comment
app.post('/comment/:blogId',verifyToken,async(req,res)=>{
    const {text}=req.body;
     const newComment= new Comment({blogId: req.params.blogId, userId: req.user.id, text: text});
     await newComment.save();
     return res.status(201).json({message: "Comment added successfully"});
});

app.listen(PORT,()=>{
    console.log("Server is conected to port:", PORT);
})
DB();