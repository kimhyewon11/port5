
//store  slide
const imgs = document.querySelectorAll(".slider > img");
console.log(imgs)
const prevbtn = document.querySelector(".prev_btn");
const nextbtn = document.querySelector(".next_btn");

let count=0;

nextbtn.addEventListener("click",()=>{
    nextSlides();
})
prevbtn.addEventListener("click",()=>{
    prevSlides();
})

function nextSlides (){

    if(count == imgs.length -1){
        count = 0;
    }
    else {
        count++
    }
    imgs.forEach((item,index)=>{
        item.style.opacity = "0";
    })
    imgs[count].style.opacity ="1";        
}

function prevSlides (){
    if(count == 0){
        count = imgs.length -1;
    }
    else {
        count--;
    }
    imgs.forEach((item,index)=>{
        item.style.opacity = "0";
    })
    imgs[count].style.opacity ="1";         }
