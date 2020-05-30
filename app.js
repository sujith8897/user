const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
// const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const methodOverride = require('method-override');

 

const app = express();

// Middleware

// app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// // Mongo URI //using MLabs
const url='mongodb+srv://sujith4488:sujith1234@@cluster0-b4qca.mongodb.net/Hostel';
const tempUrl='mongodb://localhost:27017/Hostel';

mongoose.connect(tempUrl,{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);



const HostelSchema=new mongoose.Schema({
	blockName:String,
	roomNo:Number,
	roll:{
		type:String,
		unique:true
	},
	name:String,
	gender:String,
	guardian:String

});


const AttdSchema=new mongoose.Schema({
	date:{
		type:String,
		unique:true
	},
	present:[] 
});


const IssueSchema=new mongoose.Schema({
	roll:String,
	blockName:String,
	room:Number,
	issue:String
});

const Hostel=mongoose.model("Hostel",HostelSchema);

const Attd=mongoose.model("Attd",AttdSchema);

const Issue=mongoose.model("issue",IssueSchema);



var roll="";

app.post("/addissue",function(req,res){

	Hostel.find({roll:roll},function(err,data){

		if(err){
			console.log(err);
			res.render("result",{success:false,msg:"Server error please try after some time"});
		} else{

		const issue=new Issue({
			roll: data[0].roll,
			blockName:data[0].blockName,
			room:data[0].roomNo,
			issue:req.body.issue
		});		

		issue.save(function(err){
			if(err){
				res.render("result",{success:false,msg:"Coudnt file the issue"});
			} else{
				res.render("result",{success:true,msg:"Successfully submitted the issue"});
			}
		});


	  }
	});

});

app.get("/addissue",function(req,res){
	res.render("addissue");
});

app.post("/profile",function(req,res){
	res.render("profile");
});



app.get("/logout",function(req,res){


});


app.post("/login",function(req,res){

	Hostel.find({roll:req.body.username},function(err,data){
		if(err){
				res.render("result",{success:false,msg:"Server error please try after some time"});
		} else{
			if(data.length){
				roll+=data[0].roll;
				res.render("profile");
			} else{
				res.send("You are not allowed to login");	
			}
		}
	});

});

app.get("/",function(req,res){


	res.render("login");
});


let port=process.env.PORT;
if(port==null || port==""){
  port=5000;
}

app.listen(port, () => console.log(`Server started on port ${port}`));