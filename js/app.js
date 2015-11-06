function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomVideoName() {
    return videoList[getRandomInt(0, videoList.length-1)];
}

var Time = function() {};

Time.prototype.getCurrentTimeBeauty = function() {
    var time = "";
    var date = new Date();

    var minutes = date.getMinutes();
    var hours = date.getHours();
    var seconds = date.getSeconds();

    minutes = (minutes < 10 ? "0" + minutes : minutes);
    hours = (hours < 10 ? "0" + hours : hours);
    seconds = (seconds < 10 ? "0" + seconds : seconds);

    time = hours + ":" + minutes + ":" + seconds;
    return time;
}

var time = new Time();

$(function() {

    $("#bgvid").attr("src", "backgrounds/" + getRandomVideoName());

    setTimeout(function() {
        $(".content__time").html(time.getCurrentTimeBeauty());
        $(".main").fadeIn(300, "linear");
    }, 200);

    setInterval(function() {
        $(".content__time").html(time.getCurrentTimeBeauty());
    }, 1000);
});