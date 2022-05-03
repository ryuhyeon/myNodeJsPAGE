

$(function(){
        
    var markup="<tr><td>${stationName}</td><td>${pm10Value}</td><td>${pm25Value}</td><td>${o3Value}</td></tr>";
    $.template("air_data",markup);

    $.ajax({
        url: "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=Lpf%2BUzX8pyGD2qc00I1isA7P7HwVmE93JfHZGvwlHu3kh2azXsKK%2FnNcsTOWKGNydN%2Bs26flhd5OWk0krPIH2Q%3D%3D&returnType=json&numOfRows=10&pageNo=1&sidoName=%EA%B2%BD%EA%B8%B0&ver=1.0",              //ajax로 ajax_xml.xml파일을 불러온다.
        //url: "/data/air_data.json",
        cache: false,                     //사용자캐시를 사용할 것인가.
        dataType: "json",                  //서버로부터 받을 것으로 예상되는 데이터 타입.
        success: function(data){          //ajax요청을 통해 반환되는 데이터 data.
            js_data=data.items;
            console.log(data.response.body.items);
            
            $.tmpl("air_data",data.response.body.items).appendTo("#air-data");
        }

    });

    /*
    
    $.getJSON('data/jquery_tmpl_dummy_data.json',function(data){
        js_data=data;
        
    });
    */
});