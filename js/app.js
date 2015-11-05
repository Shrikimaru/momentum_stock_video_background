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
    setTimeout(function() {
        $(".content__time").html(time.getCurrentTimeBeauty());
        $(".main").fadeIn(300, "linear");
    }, 200);

    setInterval(function() {
        $(".content__time").html(time.getCurrentTimeBeauty());
    }, 1000);
});