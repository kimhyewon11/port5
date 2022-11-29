 //실제 db데이터가 아닌 js파일에 임시로 세팅한 데이터값을 가지고 태그 생성
        //시도 선택하는 셀렉트 태그
        const city1 = document.querySelector("#city1");
        const city2 = document.querySelector("#city2");

        //시도 관련 option태그 생성
        for(let i=0; i<hangjungdong.sido.length; i++){
            let city1Tag = document.createElement("option");
            let city1TagText = document.createTextNode(hangjungdong.sido[i].codeNm);
            city1Tag.append(city1TagText);//생성된 텍스트를 생성된 option태그에 넣는 작업
            city1Tag.setAttribute("value",hangjungdong.sido[i].codeNm);
            city1Tag.setAttribute("data-sido",hangjungdong.sido[i].sido);
            city1.append(city1Tag);
        }

        //city1 select태그에 change이벤트 
        city1.addEventListener("change",()=>{
            let city1Data = city1.options[city1.selectedIndex].getAttribute("data-sido");
            //구군 option생성작업 함수
            sigugun(city1Data); //시도 고른 data-sido 값을 함수에 전달
        });

        function sigugun(city1Data){
            //option태그들 다시 리셋
            city2.innerHTML = "<option value>구/군 선택</option>";
            for(let i=0; hangjungdong.sigugun.length; i++){
                //시/도에서 고른 data-sido값과 sigugun 프로퍼티에 있는 sido 값과 일치하면
                if(city1Data == hangjungdong.sigugun[i].sido){
                    let city2Tag = document.createElement("option");
                    let city2TagText = document.createTextNode(hangjungdong.sigugun[i].codeNm);
                    city2Tag.append(city2TagText);
                    city2Tag.setAttribute("value",hangjungdong.sigugun[i].codeNm);
                    city2.append(city2Tag);
                }
            }
        }