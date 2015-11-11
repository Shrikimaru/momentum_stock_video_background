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

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    hours = (hours < 10) ? "0" + hours : hours;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    time = hours + ":" + minutes + ":" + seconds;
    return time;
}

Time.prototype.getCurrentDatebeauty = function() {
    var dateStr = "";
    var date = new Date;

    var weekDay = date.getDay();

    switch (weekDay) {
        case 0 : weekDay = "Sunday"; break;
        case 1 : weekDay = "Monday"; break;
        case 2 : weekDay = "Tuesday"; break;
        case 3 : weekDay = "Wednesday"; break;
        case 4 : weekDay = "Thursday"; break;
        case 5 : weekDay = "Friday"; break;
        case 6 : weekDay = "Saturday"; break;
    }

    var day = date.getDate();
    day = (day < 10) ? "0" + day : day;

    var month = date.getMonth();
    month = (month < 10) ? "0" + month : month;

    var year = date.getFullYear();

    date = weekDay + ", " + day + "." + month + "." + year;
    return date;
}

var time = new Time();

var ContextMenu = function(params) {
    this.params = {
        isOpened : false
    };

    this.$menu;

    this.template = Handlebars.compile(params['tmpl'], params['params']);
};

ContextMenu.prototype.getParam = function(name) {
    return this.params[name];
};

ContextMenu.prototype.isOpened = function() {
    return this.getParam("isOpened");
};

ContextMenu.prototype.setParam = function(name, value) {
    this.params[name] = value;
    return this;
};

ContextMenu.prototype.render = function(params) {
    var actions = params['actions'];

    if (this.$menu) {
        for (var key in actions) {
            $("." + actions[key]['actionClass']).unbind("click");
        }
        this.$menu.remove();
    }

    this.$menu = $(this.template(params));
    var self = this;

    for (var key in actions) {
        $("body").append(this.$menu);
        $("." + actions[key]['actionClass']).click(function(e) {
            actions[key]['callback'].call(self, params);
        });
    }
};

ContextMenu.prototype.close = function() {
    this.$menu.hide();
    this.params['isOpened'] = false;
};

ContextMenu.prototype.open = function(params) {
    if (params['offset']) {

        var positionParams = {
            "position": "absolute"
        };

        if (params['offset']['left']) {
            positionParams['left'] = params['offset']['left'];
        }

        if (params['offset']['top']) {
            positionParams['top'] = params['offset']['top'];
        }

        this.$menu.css(positionParams);

    } else {
        this.$menu.css({
            "position" : 'relative',
            "top" : "",
            "left" : ""
        });
    }

    this.$menu.show();
    this.params['isOpened'] = true;
};

var bookmarkContextMenuActions = [
    {"name" : "Удалить", "actionClass" : "action__delete", "callback" : function(params) {
        chrome.bookmarks.remove(params['bookmarkId'], function() {
            $(".bookmarks-list__bookmark[data-id="+params['bookmarkId']+"]").remove();
        });
        this.close();
    }}
];

$(function() {

    var bookmarkContextMenu = new ContextMenu({
        "tmpl" : $("#context-menu-tmpl").html(),
        "params" : {
            "actions" : bookmarkContextMenuActions
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents('.context_menu').length) {
            return true;
        }
        if (bookmarkContextMenu.isOpened()) {
            bookmarkContextMenu.close();
        }
    });

    chrome.bookmarks.getTree(function(res) {
        var bookmarks = res[0]["children"][0]["children"];
        console.log(bookmarks);
        var bookmark = {};
        for (var key in bookmarks) {
            bookmark = bookmarks[key];
            var $div = $("<div></div>");
            var $a = $("<a></a>");
            var $contentDiv = $("<div></div>");

            $a.attr("href", bookmark['url']);
            $a.addClass("bookmark__link");
            
            $div.addClass("bookmarks-list__bookmark");
            $div.attr("data-id", bookmark['id']);

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
        $(".content__date").html(time.getCurrentDatebeauty());
        $(".main").fadeIn(300, "linear");
    }, 200);

    setInterval(function() {
        $(".content__time").html(time.getCurrentTimeBeauty());
        $(".content__date").html(time.getCurrentDatebeauty());
    }, 1000);

    $(document).contextmenu(function(e) {
        $target = $(e.target);

        if ($target.parent().hasClass("bookmarks-list__bookmark")) {
            $target = $target.parent();
        }

        if ($target.hasClass("bookmarks-list__bookmark")) {
            e.preventDefault();
            e.stopPropagation();

            var bookmarkId = $target.attr("data-id");

            var renderParams = {
                "bookmarkId" : bookmarkId,
                "actions" : bookmarkContextMenuActions
            };

            bookmarkContextMenu.render(renderParams);
            bookmarkContextMenu.open({
                "offset" : {
                    "top" : e.clientY,
                    "left" : e.clientX
                }
            });
        }
    });
});