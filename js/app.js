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

    chrome.bookmarks.getTree(function(res) {
        var bookmarks = res[0]["children"][0]["children"];
        var bookmark = {};
        for (var key in bookmarks) {
            bookmark = bookmarks[key];
            var $div = $("<div></div>");
            var $a = $("<a></a>");
            var $contentDiv = $("<div></div>");

            $a.attr("href", bookmark['url']);
            $a.addClass("bookmark__link");
            
            $div.addClass("bookmarks-list__bookmark");

            $contentDiv.addClass("bookmark__content");
            $contentDiv.html(bookmark['title'].slice(0,2));

            $div.append($contentDiv);
            $a.append($div);
            $(".bookmarks__bookmarks-list").append($a);
        }
    });

    $("#bgvid").attr("src", "backgrounds/" + getRandomVideoName());

    setTimeout(function() {
        $(".content__time").html(time.getCurrentTimeBeauty());
        $(".main").fadeIn(300, "linear");
    }, 200);

    setInterval(function() {
        $(".content__time").html(time.getCurrentTimeBeauty());
    }, 1000);
});