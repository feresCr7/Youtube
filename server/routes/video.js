const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const multer = require('multer');
var ffmpeg = require ('fluent-ffmpeg');
const { auth } = require("../uploads");


var storage = multer.diskStorage({
    destination:  (req, file, cb)=> {
      cb(null, 'uploads/')
    },
    filename:  (req, file, cb)=> {
        cb(null, `${Date.now()}_${file.originalname}`)
        
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
  })
   
  var upload = multer({ storage: storage }).single('file')
//=================================
//             User
//=================================



router.post("/uploadfiles", (req, res) => {


upload(req,res,err=>{
    if(err){
        return res.json({success:false , err})
    }
    return res.json({success:true , filepath:res.req.filepath , filename:res.req.filename})
}) 

router.post("/thumbnail", (req, res) => {
    let thumbsFilePath ="";
    let fileDuration ="";

    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    })
    ffprobe(req.body.filePath)
    .on('filenames', function(filenames) {
      console.log('Will generate ' + filenames.join(', '))
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', function() {
      console.log('Screenshots taken');
      return res.json({success:true, thumbFilePath:thumbsFilePath , fileDuration:fileDuration})
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 4,
      folder: 'uploads/thumbnails',
      size:'320x240',
    });
    }) ; 
    
    
    router.get("/getVideos", (req, res) => {
        Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })
   
   
});

    router.post("/uploadVideo", (req, res) => {
        const video=new Video(req.body)
        video.save((err,video)=>{
            if(err) return res.status(400).json({success:'false',err})
            return res.status(200).json({success:'true'})
        


        })
    })

});


router.post("/getVideo", (req, res) => {

    Video.findOne({'_id':req.body.videoId})
    .populate('writer')
    .exec((err, video) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, video })
    })
   
}) ;



module.exports = router;