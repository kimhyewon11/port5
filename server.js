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
    db.collection("prdlist").find({}).toArray((err,result)=>{
        res.render("index",{prdData:result,userdata:req.user});
    })
});




//news 페이지
app.get("/news",(req,res)=>{
    db.collection("newslist").find({}).toArray((err,result)=>{
        res.render("news",{newsData:result,userdata:req.user})
    })
});

// news 상세 페이지
app.get("/newsdetail/:no",(req,res)=>{
    db.collection("newslist").findOne({num:Number(req.params.no)},(err,result)=>{
        res.render("newsdetail",{newsData:result,userdata:req.user})
    })
});


//공지 페이지
app.get("/notice",async(req,res)=>{


     //사용자가 게시판에 접속시 몇번 페이징 번호로 접속했는지 체크 
    let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page) ;
    //한 페이지당 보여줄 데이터 갯수 
    let perPage = 5;
    //블록당 보여줄 페이지 번호 갯수
    let blockCount = 5;
    //현재 페이지 블록 구하기 
    let blockNum =Math.ceil(pageNumber / blockCount) ;
    //블록 안에 있는 페이징의 시작번호 값 알아내기
    let blockStart = ((blockNum - 1) * blockCount ) + 1 ;
    //블록 안에 있는 페이징의 끝번호 값 알아내기
    let blockEnd = blockStart + blockCount - 1 ;

    

    //데이터베이스 콜렉션에 있는 전체 객체의 갯수값 가져오는 명령어 
    let totalData = await db.collection("noticelist").countDocuments({});
    //전체 데이터 값을 통해서 ---> 몇개의 페이징 번호가 만들어져야 하는지 계산
    let paging =  Math.ceil(totalData / perPage) ;
    //블록에서 마지막 번호가 페이징의 끝번호보다 크ㅏ면 페이징의 끝번호를 강제로 부여
    if(blockEnd > paging){
        blockEnd = paging;
    }
    //블록의 총 갯수 구하기
    let totalBlock = Math.ceil(paging / blockCount);
    //데이터베이스에서 꺼내오는 데이터의 시작 순번값을 결정 
    let startFrom = (pageNumber -1 ) * perPage;


    console.log(totalData)

    db.collection("noticelist").find({}).sort({num:-1}).skip(startFrom).limit(perPage).toArray((err,result)=>{
        res.render("notice",{
            noticeData:result,
            userdata:req.user,
            paging:paging,
            pageNumber:pageNumber,
            blockStart:blockStart,
            blockEnd:blockEnd,
            blockNum:blockNum,
            totalBlock:totalBlock
        })

    })
});

//공지 디테일 페이지
app.get("/noticedt/:no",(req,res)=>{
    db.collection("noticelist").findOne({num:Number(req.params.no)},(err,result)=>{
        res.render("noticedetail",{noticeData:result,userdata:req.user})
    })
});

//매장 페이지
app.get("/store",(req,res)=>{
    db.collection("storelist").find({}).toArray((err,result)=>{
        res.render("store",{storeData:result,userdata:req.user})
    })
});

//게시판 페이지
app.get("/board",async(req,res)=>{
      //사용자가 게시판에 접속시 몇번 페이징 번호로 접속했는지 체크 
      let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page) ;
      //한 페이지당 보여줄 데이터 갯수 
      let perPage = 5;
      //블록당 보여줄 페이지 번호 갯수
      let blockCount = 3;
      //현재 페이지 블록 구하기 
      let blockNum =Math.ceil(pageNumber / blockCount) ;
      //블록 안에 있는 페이징의 시작번호 값 알아내기
      let blockStart = ((blockNum - 1) * blockCount ) + 1 ;
      //블록 안에 있는 페이징의 끝번호 값 알아내기
      let blockEnd = blockStart + blockCount - 1 ;
  
      
  
      //데이터베이스 콜렉션에 있는 전체 객체의 갯수값 가져오는 명령어 
      let totalData = await db.collection("board").countDocuments({});
      //전체 데이터 값을 통해서 ---> 몇개의 페이징 번호가 만들어져야 하는지 계산
      let paging =  Math.ceil(totalData / perPage) ;
      //블록에서 마지막 번호가 페이징의 끝번호보다 크ㅏ면 페이징의 끝번호를 강제로 부여
      if(blockEnd > paging){
          blockEnd = paging;
      }
      //블록의 총 갯수 구하기
      let totalBlock = Math.ceil(paging / blockCount);
      //데이터베이스에서 꺼내오는 데이터의 시작 순번값을 결정 
      let startFrom = (pageNumber -1 ) * perPage;


    db.collection("board").find({}).sort({brdno:-1}).skip(startFrom).limit(perPage).toArray((err,result)=>{
        res.render("brdlist",{
            userdata:req.user,
            brddata:result,
            paging:paging,
            pageNumber:pageNumber,
            blockStart:blockStart,
            blockEnd:blockEnd,
            blockNum:blockNum,
            totalBlock:totalBlock
        })
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


//brd 파일 첨부
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


//all 메뉴 페이지 
app.get("/shop/all",(req,res)=>{
    db.collection("prdlist").find().toArray((err,result)=>{
        res.render("shop",{prdData:result,userdata:req.user});
    })
});
app.get("/shop/sofatable",(req,res)=>{
    db.collection("prdlist").find({category:"sofa table"}).toArray((err,result)=>{
        res.render("shop",{prdData:result,userdata:req.user});
    })
});
app.get("/shop/chair",(req,res)=>{
    db.collection("prdlist").find({category:"chair"}).toArray((err,result)=>{
        res.render("shop",{prdData:result,userdata:req.user});
    })
});
app.get("/shop/barchair",(req,res)=>{
    db.collection("prdlist").find({category:"barchair"}).toArray((err,result)=>{
        res.render("shop",{prdData:result,userdata:req.user});
    })
});
app.get("/shop/sofa",(req,res)=>{
    db.collection("prdlist").find({category:"sofa"}).toArray((err,result)=>{
        res.render("shop",{prdData:result,userdata:req.user});
    })
});

//prd 상세 페이지
app.get("/shopdetail/:no",(req,res)=>{
    db.collection("prdlist").findOne({num:Number(req.params.no)},(err,result)=>{
        res.render("shopdetail",{prdData:result,userdata:req.user})
    })
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


//관리자 상품 등록 페이지 열기
app.get("/admin/prdlist",function(req,res){
    db.collection("prdlist").find({}).toArray(function(err,result){
        res.render("admin_prdlist",{prdData:result,userdata:req.user});
    })
});

//상품을 db 에 넣기 
app.post("/add/prdlist",upload.array('thumbnail'),(req,res)=>{

    let fileTest = [];

    if(req.files){
        for(let i=0; i<req.files.length; i++){
            fileTest[i] = req.files[i].originalname;
        }
    }
    else { 
        fileTest = null;
    }
    db.collection("count").findOne({name:"상품등록"},(err,result)=>{
        db.collection("prdlist").insertOne({
            num:result.prdCount+1,
            name:req.body.name,
            thumbnail:fileTest,
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


//관리자 매장 등록 페이지 열기 
app.get("/admin/storelist",function(req,res){
    db.collection("storelist").find({}).toArray(function(err,result){
        res.render("admin_storelist",{storeData:result,userdata:req.user});
    })
});

//매장등록페이지에서 전송한 값 데이터베이스에 삽입
app.post("/addstore",upload.single('thumbnail'),(req,res)=>{
    db.collection("count").findOne({name:"매장등록"},(err,result1)=>{
     
        db.collection("storelist").insertOne({
            num:result1.storeCount + 1,
            name:req.body.name,
            sido:req.body.city1,
            sigugun:req.body.city2,
            address:req.body.detail,
            phone:req.body.phone,
            time:req.body.time,
        },(err,result)=>{
            db.collection("count").updateOne({name:"매장등록"},{$inc:{storeCount:1}},(err,result)=>{
                res.redirect("/admin/storelist"); //매장등록 페이지로 이동
            });
        })
    });
});


//매장 지역 검색 결과 페이지
app.get("/search/storelocal",(req,res)=>{
    //시/도는 선택했고 군구는 선택을 안했을 때
    if(req.query.city1 !== "" && req.query.city2 === ""){
        db.collection("storelist").find({sido:req.query.city1}).toArray((err,result)=>{
            res.render("store",{storeData:result,userdata:req.user});
        });
    }
    //시도 선택 및 군구 선택 했을 때
    else if(req.query.city1 !== "" && req.query.city2 !== ""){
        db.collection("storelist").find({sido:req.query.city1,sigugun:req.query.city2}).toArray((err,result)=>{
            res.render("store",{storeData:result,userdata:req.user});
        });
    }
    //둘다 선택 안했을 경우
    else {
        res.redirect("/store");
    }
});

app.get("/search/storename",(req,res)=>{
    //atlas사이트에서 제공하는 검색기능 코드
    let search = [
        {
          $search: {
            index: "store_search",
            text: {
              query: req.query.name, //store에서 입력한 매장명 데이터
              path: "name"// storelist콜렉션에서 name 프로퍼티
            }
          }
        }
      ]

    //aggregate() 사용해서 storelist 콜렉션에서 데이터 꺼내옴
    //검색어 입력시
    if(req.query.name !== "") {
        db.collection("storelist").aggregate(search).toArray((err,result)=>{
            res.render("store",{storeData:result,userdata:req.user});
        })
    }
    //검색어 미입력시
    else{
        res.redirect("/store");
    }
})

// 관리자 뉴스 등록 페이지 
app.get("/admin/newslist",function(req,res){
    db.collection("newslist").find({}).toArray(function(err,result){
        res.render("admin_newslist",{newsData:result,userdata:req.user});
    })
});

//뉴스 데이터 db 전송 
//brd db 에 데이터 전송 
app.post("/add/newslist",upload.array('thumbnail'),(req,res)=>{
    let times = moment().format("YYYY.MM.DD");

    let fileTest = [];
    let address = [];

    console.log(req.body.address)

    // for(let j=0; j < req.body.address.length; j++){
    //     address[j] = req.body.address[j]
    // }

    if(req.files){
        for(let k=0; k<req.files.length; k++){
            fileTest[k] = req.files[k].originalname;
        }
    }
    else { 
        fileTest = null;
    }
    db.collection("count").findOne({name:"뉴스등록"},(err,result)=>{
        db.collection("newslist").insertOne({
            num:result.newsCount + 1,
            month:req.body.month,
            title:req.body.title,
            address:req.body.address,
            thumbnail:fileTest,
            date:times
        },(err,result)=>{
            db.collection("count").updateOne({name:"뉴스등록"},{$inc:{newsCount:1}},(err,result)=>{
                res.redirect("/admin/newslist");
            });
        });
    });
});

//관리자 공지리스트 페이지
app.get("/admin/noticelist",function(req,res){
    db.collection("noticelist").find({}).toArray(function(err,result){
        res.render("admin_noticelist",{noticeData:result,userdata:req.user});
    })
});
//공지 데이터베이스에 삽입
app.post("/add/noticelist",(req,res)=>{
    let times = moment().format("YYYY.MM.DD");

    db.collection("count").findOne({name:"공지등록"},(err,result)=>{
        db.collection("noticelist").insertOne({
            num:result.noticeCount + 1,
            title:req.body.title,
            content:req.body.content,
            date:times
        },(err,result)=>{
            db.collection("count").updateOne({name:"공지등록"},{$inc:{noticeCount:1}},(err,result)=>{
                res.redirect("/admin/noticelist");
            });
        });
    });
});

//공지 삭제
app.get("/noticedelete/:no",(req,res)=>{
    db.collection("notice").deleteOne({num:Number(req.params.no)},(err,result)=>{
        res.redirect("/notice");
    })
});