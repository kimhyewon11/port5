const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const moment = require("moment");
const port = process.env.PORT || 8000;
const multer  = require('multer') ; // 파일업로드 라이브러리 multer

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { render } = require("ejs");
const app = express();


app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(session({secret : 'secret', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


let db;

MongoClient.connect("mongodb+srv://admin:qwer1234@testdb.mopkvcj.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    db = result.db("port5");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });

});

//메인페이지
app.get("/",(req,res)=>{
    res.render("index",{userdata:req.user})
});

//prd 페이지
app.get("/shop",(req,res)=>{
    res.render("shop",{userdata:req.user})
});
//prd 상세 페이지
app.get("/shopdetail",(req,res)=>{
    res.render("shopdetail",{userdata:req.user})
});

//news 페이지
app.get("/news",(req,res)=>{
    res.render("news",{userdata:req.user})
});

// news 상세 페이지
app.get("/newsdetail",(req,res)=>{
    res.render("newsdetail",{userdata:req.user})
});

//공지 페이지
app.get("/notice",(req,res)=>{
    res.render("notice",{userdata:req.user})
});

//공지 디테일 페이지
app.get("/noticedt",(req,res)=>{
    res.render("noticedetail",{userdata:req.user})
});

//매장 페이지
app.get("/store",(req,res)=>{
    res.render("store",{userdata:req.user})
});

//게시판 페이지
app.get("/board",(req,res)=>{
    db.collection("board").find({}).toArray((err,result)=>{
        res.render("brdlist",{userdata:req.user,brddata:result})
    })
});

//게시판 입력페이지
app.get("/brdinsert",(req,res)=>{
    res.render("brdinsert",{userdata:req.user});
});

//게시판 디테일 페이지
app.get("/brddetail/:no",(req,res)=>{
    db.collection("board").findOne({brdno:Number(req.params.no)},(err,result)=>{
        res.render("brddetail",{userdata:req.user,brddata:result});
    });
});


//게시글 수정 페이지 
app.get("/brdupt/:no",(req,res)=> {
    db.collection("board").findOne({brdno:Number(req.params.no)},(err,result)=>{
        res.render("brdupt",{brddata:result,userdata:req.user});
    });
});

//수정 데이터 post요청으로 db 에 생성 
app.post("/update",function(req,res){
   
    db.collection("board").updateOne({brdno:Number(req.body.brdnum)},{$set:{        
        brdcategory:req.body.category,
        brdtitle:req.body.subject,
        brdname:req.body.writer,
        brdid:req.body.id,
        brdcontext:req.body.content
    }},function(err,result){
        res.redirect("/brddetail/"+req.body.brdnum);
    });
});



//게시글 삭제 페이지 
app.get("/delete/:no",(req,res)=>{
    db.collection("board").deleteOne({brdno:Number(req.params.no)},(err,result)=>{
        res.redirect("/board");
    })
});


//brd 입력 날짜 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'));// = 이후 --> 한글로 된 파일이름 그대로 인식하는 코드
}
  });
  const upload = multer({ storage: storage });


//brd db 에 데이터 전송 
app.post("/add/brd",(req,res)=>{
    let times = moment().format("YYYY.MM.DD");

    db.collection("count").findOne({name:"게시판"},(err,result)=>{
        db.collection("board").insertOne({
            brdno:result.brdCount+1,
            brdcategory:req.body.category,
            brdtitle:req.body.subject,
            brdname:req.body.writer,
            brdid:req.body.id,
            brddate:times,
            brdcontext:req.body.content
        },(err,result)=>{
            db.collection("count").updateOne({name:"게시판"},{$inc:{brdCount:1}},(err,result)=>{
                res.redirect("/board");
            });
        });
    });
});




//회원가입 페이지
app.get("/join",(req,res)=>{
    res.render("join",{userdata:req.user})
});

//회원가입 정보 db 보내기 
app.post("/memberjoin",(req,res)=>{
    db.collection("join").findOne({joinId:req.body.userid},(err,result)=>{
        if(result){
            res.send("<script>alert('이미 가입된 이메일 입니다.'); location.href='/join' </script>")
        }
        else {
            db.collection("count").findOne({name:"회원정보"},(err,result)=>{
                db.collection("join").insertOne({
                    joinno:result.joinCount+1,
                    joinname:req.body.username,
                    joinid:req.body.userid,
                    joinpass:req.body.userpass
                },(err,resut)=>{
                    db.collection("count").updateOne({name:"회원정보"},{$inc:{joinCount:1}},(err,result)=>{
                        res.send("<script>alert('회원가입 완료'); location.href='/login' </script>")
                    });
                });
            });
        }
    });
});

//로그인 페이지
app.get("/login",(req,res)=>{
    res.render("login",{userdata:req.user})
});
//로그인 회원 정보 db 와 매치
app.post("/memberlogin",passport.authenticate('local', {failureRedirect : '/fail'}),
function(req,res){
    res.redirect("/");
});

passport.use(new LocalStrategy({
    usernameField: 'userid',//login.ejs 에서 입력한 아이디의 name 값
    passwordField: 'userpass', //login.ejs 에서 입력한 비밀번호의 name 값
    session: true, //세션 이용할 것입니까 ?
    passReqToCallback: false, //아이디와 비번 말고도 다른항목들 더 검사할 것인지 여부 
  }, function (userid, userpass, done) { //userid userpass 는 입력한 input 값 담는 변수 (작명가능)
    db.collection('join').findOne({ joinid: userid }, function (err, result) {
      if (err) return done(err)
  
      if (!result) return done(null, false, { message: '존재하지않는 아이디' })
      if (userpass== result.joinpass) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비밀번호 틀림' })
      }
    })
  }));

  //데이터베이스에 있는 아이디와 비번이 일치하면 
  //세션을 생성하고 해당 아이디와 비번을 기록하여 저장하는 작업
  passport.serializeUser(function (user, done) {
    done(null, user.joinid) //데이터 베이스에 있는 아이디가 저장되어있는 프로퍼티 명 기술 
  });



  passport.deserializeUser(function (joinid, done) { 
    //데이터베이스에 있는 로그인 했을 때 아이디만 불러와서
    // 다른 페이지에서도 세션을 사용할 수 있도록 처리 
    // done(null, {}) -- 다른 페이지에도 사용할 수 있도록 만든 함수
    db.collection("join").findOne({joinid:joinid},function(err,result){
        done(null,result); //데이터베이스에서 가지고온 아이디를 세션에 넣어서 다른페이지들에 전달 
    })
  });

  //로그아웃 
  app.get("/logout",function(req,res){
    req.session.destroy(function(err){
        res.clearCookie("connect.sid");
        res.redirect("/");
    })
});





///////////////////
//관리자 관련 


// passport.use(new LocalStrategy({
//     usernameField: 'adminId', // 태그 네임값
//     passwordField: 'adminPass',
//     session: true,
//     passReqToCallback: false,
//   }, function (id, pass, done) {
//                                  //작명변수//태그 네임값
//     db.collection('admin').findOne({ adminId: id }, function (err, result) {
//       if (err) return done(err)
  
//       if (!result) return done(null, false, { message: '존재하지않는 아이디 입니다.' })
//       if (pass == result.adminPass) {
//         return done(null, result)
//       } else {
//         return done(null, false, { message: '비번이 틀렸습니다' })
//       }
//     })
//   }));

//     //처음 로그인 했을 시 해당 사용자의 아이디를 기반으로 세션을 생성함
//   //  req.user
//   passport.serializeUser(function (user, done) {
//     done(null, user.adminId) //서버에다가 세션만들어줘 -> 사용자 웹브라우저에서는 쿠키를 만들어줘
//   });
  
//   // 로그인을 한 후 다른 페이지들을 접근할 시 생성된 세션에 있는 회원정보 데이터를 보내주는 처리
//   // 그전에 데이터베이스 있는 아이디와 세션에 있는 회원정보중에 아이디랑 매칭되는지 찾아주는 작업
//   passport.deserializeUser(function (adminId, done) {
//       db.collection('admin').findOne({adminId:adminId }, function (err,result) {
//         done(null, result);
//       })
//   }); 



  
// 관리자 로그인 페이지 화면 
app.get("/admin",(req,res)=>{
    res.render("admin_login",{admindata:req.user}); //admin_login.ejs 파일로 응답
 
});


//관리자 화면 로그인
app.post("/login",passport.authenticate('local', {failureRedirect : '/fail'}),(req,res)=>{
    res.redirect("admin/prdlist");
    //로그인 성공시 관리자 상품등록 페이지로 이동 
});

//로그인 실패시 
app.get("/fail",(req,res)=>{
    res.send("로그인 실패")
});

//로그아웃
app.get("/logout",function(req,res){
    req.session.destroy(function(err){
        res.clearCookie("connect.sid");
        res.redirect("/");
    })
});

//관리자 상품 등록 페이지 열기
app.get("/admin/prdlist",function(req,res){
    db.collection("prdlist").find({}).toArray(function(err,result){
        res.render("admin_prdlist",{prdData:result,admindata:req.user});
    })
});

//상품을 db 에 넣기 
app.post("/add/prdlist",upload.array('thumbnail'),(req,res)=>{
    if(req.files){
        fileTest=req.files[0].originalname;
        fileTest1=req.files[1].originalname;
        fileTest2=req.files[2].originalname;
        fileTest3=req.files[3].originalname;
        fileTest4=req.files[4].originalname;
        fileTest5=req.files[5].originalname;
    }
    else { 
        fileTest=null;
        fileTest1=null;
        fileTest2=null;
        fileTest3=null;
        fileTest4=null;
        fileTest5=null;
    }
    db.collection("count").findOne({name:"상품등록"},(err,result)=>{
        db.collection("prdlist").insertOne({
            num:result.prdCount+1,
            name:req.body.name,
            thumbnail:fileTest,
            contImg1:fileTest1,
            contImg2:fileTest2,
            contImg3:fileTest3,
            contImg4:fileTest4,
            contImg5:fileTest5,
            category:req.body.category,
            price:req.body.price,
            address:req.body.address,
        },(err,result)=>{
            db.collection("count").updateOne({name:"상품등록"},{$inc:{prdCount:1}},(err,result)=>{
                res.redirect("/admin/prdlist");
            })
        })
    })
})

