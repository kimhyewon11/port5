        //헤더 스크롤 시 , 스타일 변경
        const header = document.querySelector("#header");

            window.addEventListener("scroll",()=>{
                let scTop = window.scrollY;

                if(scTop > 0){
                    header.classList.add("on");
                }
                else{
                    header.classList.remove("on");
                }
            })