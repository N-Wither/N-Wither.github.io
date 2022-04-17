function startTime(){
    var today=new Date();
    var D=today.getDate();
    var Y=today.getFullYear();
    var Mo=today.getMonth()+1;
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    m=checkTime(m);
    s=checkTime(s);
    document.getElementById('clock').innerHTML=Y+"/"+ Mo +"/"+D+" "+h+":"+m+":"+s;
    t=setTimeout(function(){startTime()},500);
}
function checkTime(i){
    if (i<10){
        i="0" + i;
    }
    return i;
}