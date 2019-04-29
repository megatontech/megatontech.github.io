function renderTip(template, context) {
    var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
    return template.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }
        var variables = token.replace(/\s/g, '').split('.');
        var currentObject = context;
        var i, length, variable;
        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) return '';
        }
        return currentObject;
    });
}

String.prototype.renderTip = function (context) {
    return renderTip(this, context);
};

var re = /x/;
console.log(re);
re.toString = function () {
    showMessage('里面～空荡荡的', 5000);
    return '';
};

$(document).on('copy', function () {
    showMessage('拿走拿走别客气……', 5000);
});

function initTips() {
    $.ajax({
        cache: true,
        url: `${message_Path}message.json`,
        dataType: "json",
        success: function (result) {
            $.each(result.mouseover, function (index, tips) {
                $(tips.selector).mouseover(function () {
                    var text = tips.text;
                    if (Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
                    text = text.renderTip({ text: $(this).text() });
                    showMessage(text, 3000);
                    readMessage(text);
                });
            });
            $.each(result.click, function (index, tips) {
                $(tips.selector).click(function () {
                    var text = tips.text;
                    if (Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
                    text = text.renderTip({ text: $(this).text() });
                    showMessage(text, 3000);
                    readMessage(text);
                });
            });
        }
    });
}
initTips();

(function () {
    var text;
    if (document.referrer !== '') {
        var referrer = document.createElement('a');
        referrer.href = document.referrer;
        text = '嗨！来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友！';
        var domain = referrer.hostname.split('.')[1];
        if (domain == 'baidu') {
            text = '嗨！ 来自 度娘 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        } else if (domain == 'so') {
            text = '嗨！ 来自 360全家桶 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        } else if (domain == 'google') {
            text = '嗨！ 来自 谷歌翻墙 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }
    } else {
        if (window.location.href == `${home_Path}`) { //主页URL判断，需要斜杠结尾
            var now = (new Date()).getHours();
            if (now > 23 || now <= 5) {
                text = '睡你麻痹？起来嗨！';
            } else if (now > 5 && now <= 7) {
                text = '早上好！美好的一天就要开始搬砖了！';
            } else if (now > 7 && now <= 11) {
                text = '上午好！打卡没？工头喊你干活呢！';
            } else if (now > 11 && now <= 14) {
                text = '中午了，中午不睡下午崩溃！';
            } else if (now > 14 && now <= 17) {
                text = '怼完产品，怼测试，然后再怼运维';
            } else if (now > 17 && now <= 19) {
                text = '傍晚了！上班没搞定的Bug，加班也搞不定';
            } else if (now > 19 && now <= 21) {
                text = '晚上好，这时候写的代码BUG翻倍～';
            } else if (now > 21 && now <= 23) {
                text = '已经这么晚了呀，回家已经没地铁了~~';
            } else {
                text = '嗨~ 你瞅啥，再瞅削你！';
            }
        } else {
            text = '看了也白看，真的～<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }
    }
    showMessage(text, 12000);
})();

window.setInterval(showHitokoto, 120000);

function showHitokoto() {
    $.getJSON('https://v1.hitokoto.cn/', function (result) {
        showMessage(result.hitokoto, 5000);
        readMessage(result.hitokoto);
    });
}
var synth = window.speechSynthesis;
var u = new SpeechSynthesisUtterance();
u.lang = 'zh-CN';
u.rate = 1;
u.volume = 1;
function readMessage(text){
    u.text = text;
    synth.speak(u)
}
function showMessage(text, timeout) {
    if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1) - 1];
    //console.log('showMessage', text);
    $('.message').stop();
    $('.message').html(text).fadeTo(200, 1);
    if (timeout === null) timeout = 5000;
    hideMessage(timeout);
}

function hideMessage(timeout) {
    $('.message').stop().css('opacity', 1);
    if (timeout === null) timeout = 5000;
    $('.message').delay(timeout).fadeTo(200, 0);
}

function initLive2d() {
    $('.hide-button').fadeOut(0).on('click', () => {
        $('#landlord').css('display', 'none')
    })
    $('#landlord').hover(() => {
        $('.hide-button').fadeIn(600)
    }, () => {
        $('.hide-button').fadeOut(600)
    })
}
initLive2d();
