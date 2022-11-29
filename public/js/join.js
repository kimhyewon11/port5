const joinbtn = document.querySelector("#joinbtn");
const inputList = document.querySelectorAll(".inputList");

const pass = document.querySelector("#pass");
const passchk = document.querySelector("#passchk");


//정규표현식 코드 배열로 정리
let datalist =[
    {
        regexCheck : /^\w{8,10}$/,
        okMessage:"아이디 제대로 입력하였음",
        noMessage:"6자리부터 10자리까지 영문,숫자,_만 가능합니다." ,
        yesOrno : false
    },
    {
        regexCheck : /^[ㄱ-힣]{2,4}$/,
        okMessage:"이름 제대로 입력하였음",
        noMessage:"2자리부터 4자리까지 한글만 가능합니다." ,
        yesOrno : false
    },
    {
        regexCheck : /^[\w\#\$\^\*\&]{8,12}$/,
        okMessage:"비밀번호 제대로 입력하였음",
        noMessage:"8자리부터 12자리까지 영문,숫자,_,#$!*만 가능합니다." ,
        yesOrno : false
    },
    {
        regexCheck : /^(010)\-\d{4}\-+\d{4}$/,
        okMessage:"전화번호 제대로 입력하였음",
        noMessage:"전화번호 형식에 맞게 입력하세요" ,
        yesOrno : false
    },
];

let lastCheck = false;

//비밀번호 확인 
passchk.addEventListener("keyup",function(){
    let passVal = pass.value;
    let passchkVal = passchk.value;

    if(passVal == passchkVal){
        passchk.nextElementSibling.innerHTML = "비밀번호가 일치합니다";
        datalist[2].yesOrno = true;
    }
    else {
        passchk.nextElementSibling.innerHTML = "비밀번호가 일치하지 않습니다";
        datalist[2].yesOrno = false;
    }
})


inputList.forEach((item,index)=>{
    item.addEventListener("keyup",()=>{
        inputChk(item,datalist[index]);
    });
});


//정규표현식 맞는지 체크하는 함수 정의
function inputChk(tag,data){
    let values =tag.value;
    let checkComp = data.regexCheck.test(values);

    if(checkComp){
        tag.nextElementSibling.innerHTML = data.okMessage;
        data.yesOrno = true;
    }
    else{
        tag.nextElementSibling.innerHTML = data.noMessage;
        data.yesOrno = false;
    }
}


//가입버튼 눌렀을 때 모든 항목이 제대로 작성되면 화면 넘어감
joinbtn.addEventListener("click",()=>{
    lastCheck = datalist.every(el => el.yesOrno == true);
    if(lastCheck){
        alert("회원가입 완료")
    }
    else{
        alert("모든 형식에 맞게 작성하세요.")
    }
});
