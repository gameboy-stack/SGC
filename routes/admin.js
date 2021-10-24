const express = require("express");
const router = express.Router();
const cryptojs = require('crypto-js');

const db = require("../model/db");
const mongoose = require('mongoose');

const Users = require("../model/users");
const Reports = require("../model/reports");
const Responses = require("../model/responses");
const ReportLike = require("../model/reportlike");


const dbURI = db("usersHackathon","pass","hackathon");

// const usercred = {username:"just",password:"pass"}; 

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })  //connecting to MongoDB
.then(console.log("database connected"))
.catch(err => console.log(err));

const issessionedUser1 = (req,res,next) => {
    
    if(req.session.user){
        console.log("sessioned user"+req.session.user);
        res.redirect("/admin/copform")
    }
    else{
        console.log(req.session.user + "unsesssioned user");
        next();
    }
} 
const issessionedUser2 = (req,res,next) => {
    
    if(req.session.user){
        console.log("sessioned user"+req.session.user);
        next();
    }
    else{
        console.log(req.session.user + "unsesssioned user");
        res.redirect("/admin")
    }
} 

const isValidUser = async (req,res,next) => { //  sha256 hash => combination of admn , pass and today date(yyyy-mm-dd)
    
    const date = new Date();
    const month = date.getMonth() + 1;
    const todaydate = date.getFullYear() + "-" + month + "-" + date.getDate();

    req.session.todaydate = todaydate;

    const comb = "admin" + "pass" + todaydate

    const secretphrase = (cryptojs.SHA256(comb)) +"";

    console.log(secretphrase);
        if(("admin" == req.body.adm) && ( "pass" == req.body.password) && ( secretphrase == req.body.pp)){
            req.session.user  = "admin";
            next();
        }
        else{
            res.redirect("/admin")
        }
}

router.route("/")       //  sha256 hash => combination of yyyyddmm and permanent secret key
.get(issessionedUser1, async (req,res) => { 
    res.render('admin/adminLForm')
})
.post(isValidUser,(req,res) => { // uid
    
    req.session.userpath = req.baseUrl+req.path+"";
    // res.redirect("/admin/dashboard");
    res.redirect("/admin/copform")
});



router.get("/copform",issessionedUser2,(req,res) => {
    res.render("admin/adminCOPForm")
})


const isValidSecretPassphrase = (req,res,next) => {

    const  todaydate = req.session.todaydate;

    const comb = "admin" + "pass" + todaydate;

    const passsha256 = (cryptojs.SHA256(comb)) +"";

    const secretpassphrase = (cryptojs.MD5(passsha256)) + "";

    const userinppp = req.body.passp + "";

    const userpassp =  (cryptojs.MD5(userinppp)) + "";

    if(secretpassphrase == userinppp){
        next();
    }
    else{
        res.redirect("/admin/copform")
    }

}


router.post("/copform",isValidSecretPassphrase,async (req,res) =>{

    const deptnme = (req.body.dept + "").toLowerCase();

    const temp = await Users.findOneAndUpdate({uid:req.body.uniqid+"",dept:deptnme},{ $set: { passw: req.body.newpassw + "" }});
    console.log(temp);
    console.log("submitted")
    res.render("admin/adminCOPForm")

});



router.get("/logout",(req,res) =>{
    req.session.destroy();
    res.redirect("/");
});




module.exports = router;




module.exports = router;