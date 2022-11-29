


        //메인 cont1 슬라이더 기능 구현
        const s_box = document.querySelectorAll(".box");
        console.log(s_box)
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

            if(count == s_box.length -1){
                count = 0;
            }
            else {
                count++
            }
            s_box.forEach((item,index)=>{
                item.style.opacity = "0";
            })
            s_box[count].style.opacity ="1";        
        }

        function prevSlides (){
            if(count == 0){
                count = s_box.length -1;
            }
            else {
                count--;
            }
            s_box.forEach((item,index)=>{
                item.style.opacity = "0";
            })
            s_box[count].style.opacity ="1";         }



        
