const express = require("express");
const router = express.Router();
const cryptojs = require('crypto-js');

const db = require("../model/db");
const mongoose = require('mongoose');
const Members = require("../model/members");
const Reports = require("../model/reports");
const Responses = require("../model/responses");

// const dbURI = db("usersHackathon","pass","hackathon");

// // const membercred = {membername:"just",password:"pass"}; 

// mongoose.createConnection(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }); //connecting to MongoDB
    // .then(console.log("database connected - member"))
    // .catch(err => console.log(err));

const issessionedmember1 = (req,res,next) => {

    if(req.session.memid){
        console.log("sessioned member"+req.session.memid);
        res.redirect("/member/dashboard")
    }
    else{
        console.log(req.session.memid + "unsesssioned member");
        next();
    }
} 
const issessionedmember2 = (req,res,next) => {

    if(req.session.memid){
        console.log("sessioned member"+req.session.memid);
        next();
    }
    else{
        console.log(req.session.memid + "unsesssioned member");
        res.redirect("/member")
    }
} 

const isValidmember = async (req,res,next) => { //memityyyy 19itxxx - 2 -3 - 3 -4
    const memidv = req.body.memid + ""
    const deptnme = memidv.slice(3,-4);
    const isValid = await Members.findOne({memid:memidv.toLowerCase(),dept:deptnme});

    console.log(req.body.memid+req.body.password+req.body.dob);
    console.log(isValid)

    if(isValid){    //3,--4

        if((isValid.memid == req.body.memid) && ( isValid.passw == req.body.password) && (isValid.dob == req.body.dob)){
            console.log(isValid);
            req.session.memid  = isValid.memid;
            req.session.dept  = isValid.dept;
            req.session.dob  = isValid.dob;
            next();
        }
        else{
            res.redirect("/member")
        }
    }
    else{
        console.log(isValid);
        res.redirect("/member")
    }
}

router.route("/")
.get(issessionedmember1, async (req,res) => { 

    res.render("member/memberLForm",{sid:req.sessionID})
})
.post(isValidmember,(req,res) => { // uid - memityyy

        req.session.memberpath = req.baseUrl+req.path+"";
        res.redirect("/member/dashboard");
});



router.get("/dashboard",issessionedmember2,async (req,res) => {
    
    console.log("sessioned member " + req.session.memid);
    console.log(req.baseUrl+req.path)
    const boreports = await Reports.find({dept:req.session.dept});
    console.log(req.query);

    if((!Object.keys(req.query).length) || ((req.query.gtype=="") && (req.query.gstatus==""))){
        res.render("member/memberDashboard",{
            array:boreports})
    }
    else{
            if((req.query.gtype!="") && (req.query.gstatus!="")){

                const sortedreports = await boreports.filter((ele) =>{
                return (ele.gtype==req.query.gtype)&&(ele.gstatus==req.query.gstatus);
            });
            console.log(sortedreports);
            res.render("member/memberDashboard",{
                array:sortedreports})
        }        
            else if((req.query.gtype!="") && (req.query.gstatus=="")){

                const sortedreports = await boreports.filter((ele) =>{
                return (ele.gtype==req.query.gtype);
                    
            });
            console.log(sortedreports);
            res.render("member/memberDashboard",{
                array:sortedreports})
        }
            else{
                const sortedreports = await boreports.filter((ele) =>{
                return (ele.gstatus==req.query.gstatus);
                });
                console.log(sortedreports);
            res.render("member/memberDashboard",{
                array:sortedreports})
            }
    }
});


router.get("/dashboard/report/:id",issessionedmember2,async (req,res) => {
        const repid = req.params.id;
        const selectedreport = await Reports.findOne({_id:repid,dept:req.session.dept});
        console.log(selectedreport);
        res.render("member/memberSingleReport",{
            array:selectedreport
        })

});


router.route("/reports")
.get(issessionedmember2, async (req,res) =>{
    
    const allrep = await Reports.find({dept:req.session.dept});
    
    res.render("member/memberGReports",{
        array:JSON.stringify(allrep),
    })
    
    
})
.post(async (req,res) => {
    
    
});

router.route("/status")
.get(issessionedmember2, async (req,res) =>{
    res.render("member/memberGStatusForm")
})
.post(async (req,res) => {

    const temp = await Reports.updateOne({ _id: req.body.formid + "",dept:req.session.dept}, { $set: { gstatus: req.body.gstatus + "" }});
    console.log(temp)
    res.redirect("/member/dashboard")
});

// ########################################################################################################

router.route("/response")
.get(issessionedmember2, async (req,res) =>{
    const date = new Date();
    const month = date.getMonth() + 1;
    const todaydate = date.getFullYear() + "-" + month + "-" + date.getDate();

    req.session.date = todaydate;
    
    const combination = req.session.memid + req.session.dept + date + ""// usrnme and dept and dob and doi
    const resid = (cryptojs.MD5(combination)) +"";
    
    req.session.resid = resid;
    
    res.render("member/memberResponseForm",{
        memid:req.session.memid,
        dept:req.session.dept,
        resid:resid
    }) 
    
})
.post(async (req,res) => {
    console.log("this is uid" + "   " + req.session.fuid)
    const temp = new Responses({
        _id: req.session.resid,
        fuid:req.body.fuid,
        dor:req.session.date,
        dept:req.session.dept,
        subj:req.body.subj,
        detres:req.body.detrep
    });
    const result = await temp.save();
    console.log(result);
    res.redirect("/member/dashboard"); 
})




router.get("/logout",(req,res) =>{
    req.session.destroy();
    res.redirect("/");
});




module.exports = router;

