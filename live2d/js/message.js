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
var synth = window.speechSynthesis;
var u = new SpeechSynthesisUtterance();
u.lang = 'zh-CN';
u.rate = 1;
u.volume = 1;
var re = /x/;
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

function readMessage(text) {
    u.text = text;
    synth.speak(u)
}
function showMessage(text, timeout) {
    if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1) - 1];
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

/* =====================================================
 *  俏皮交互 & 连击隐藏特效  —— 连续戳看板娘有惊喜
 * ===================================================== */
(function () {
    var $landlord = $('#landlord');
    if (!$landlord.length) return;

    var COMBO_WINDOW = 3000;   // 连击判定时间窗
    var IDLE_SLEEP_MS = 90000; // 挂机多久打瞌睡

    var combo = 0, lastPoke = 0, comboTimer = null;
    var sleeping = false, lastTease = 0, lastActive = Date.now();
    var total = parseInt(localStorage.getItem('tia_total_pokes') || '0', 10);
    var unlocked = {};
    try { unlocked = JSON.parse(localStorage.getItem('tia_achievements') || '{}'); } catch (e) { unlocked = {}; }

    /* ---- 动作接口（live2d.js 已暴露 __L2D_MODEL）---- */
    var MOTION_ID = { Fail: 9, Sleeping: 10, Success: 11, Sukebei1: 12, Sukebei2: 13, Sukebei3: 14, WakeUp: 27 };
    function motion(name) {
        var m = window.__L2D_MODEL;
        if (!m || !m.modelSetting) return;
        try {
            if (name === 'rand') return m.startRandomMotion('', 4);
            if (MOTION_ID.hasOwnProperty(name)) return m.startMotion('', MOTION_ID[name], 4);
            m.startRandomMotion(name, 4); // idle / sleepy / flick_head / tap_body
        } catch (e) {}
    }
    window.tiaMotion = motion;

    /* ---- 文案 ---- */
    var TIERS = {
        3:  ['连击 ×3！手感不错吧～', '三连击！你根本停不下来', '×3！这是在撸猫吗？'],
        5:  ['×5！人家、人家才不会害羞呢！', '别戳了别戳了……好啦再戳两下', '×5 隐藏害羞模式已加载 blush.exe'],
        8:  ['×8 头都晕了啦～×_×', '星星……我眼前全是星星', '×8！再戳就报错给你看哦']
    };
    var SECRET_12 = ['🏆 ×12 隐藏特效解锁！你是有多闲！', '×12 连击达成！烟花送给你！', '恭喜！×12 触发全场庆祝特效！'];
    var MAX_20 = ['×20？！你是把这当触屏游戏玩了吗！', '×20 MAX 连击！宝箱密码: 0721', '传说中 ×20 的大佬就是你本人'];
    var TEASES = ['看什么看，说得就是你～', '离我远点，化不来妆', '再靠近一步要收费的哦', '鼠标也是手，请不要乱摸'];
    var WAKE = ['哇！吓死我了！', '干嘛！人家做梦正香呢', '醒了醒了，摸鱼失败的锅我不背'];

    /* ---- 徽章 / 吐司 / 表情粒子 ---- */
    var $badge = $('<div id="combo-badge"></div>').appendTo($landlord).hide();
    function tierClass(n) { return n >= 20 ? 'tier-max' : n >= 12 ? 'tier-secret' : n >= 8 ? 'tier-3' : n >= 5 ? 'tier-2' : 'tier-1'; }
    function showBadge(n) {
        $badge.removeClass('tier-1 tier-2 tier-3 tier-secret tier-max').addClass(tierClass(n));
        $badge.text('×' + n).show().stop();
        $badge[0].style.animation = 'none'; void $badge[0].offsetWidth; $badge[0].style.animation = 'badge-pop .3s ease';
    }
    function hideBadge() { $badge.stop(true).fadeOut(400); }

    function toast(html) {
        var $t = $('<div class="l2d-toast"></div>').html(html).appendTo('body');
        setTimeout(function () { $t.addClass('show'); }, 30);
        setTimeout(function () { $t.removeClass('show'); setTimeout(function () { $t.remove(); }, 500); }, 3200);
    }
    function emojiRain(chars, x, y, count, spread) {
        for (var i = 0; i < count; i++) {
            var s = document.createElement('span');
            s.className = 'l2d-emoji';
            s.textContent = chars[Math.floor(Math.random() * chars.length)];
            var dx = (Math.random() - 0.5) * (spread || 120);
            s.style.left = x + 'px'; s.style.top = y + 'px';
            s.style.setProperty('--dx', dx + 'px');
            s.style.fontSize = (14 + Math.random() * 14) + 'px';
            s.style.animationDuration = (1 + Math.random() * 0.8) + 's';
            document.body.appendChild(s);
            (function (el) { setTimeout(function () { el.remove(); }, 1900); })(s);
        }
    }
    function fireworks(duration) {
        var cv = document.createElement('canvas');
        cv.className = 'l2d-fx';
        document.body.appendChild(cv);
        cv.width = innerWidth; cv.height = innerHeight;
        var ctx = cv.getContext('2d'), parts = [], end = Date.now() + duration;
        (function burst() {
            if (Date.now() > end) return;
            var x = Math.random() * cv.width, y = Math.random() * cv.height * 0.55 + 40,
                hue = Math.floor(Math.random() * 360);
            for (var i = 0; i < 70; i++) {
                var a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 4.5;
                parts.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, hue: hue + Math.random() * 40 });
            }
            if (Date.now() < end - 500) setTimeout(burst, 250 + Math.random() * 350);
        })();
        (function loop() {
            ctx.clearRect(0, 0, cv.width, cv.height);
            ctx.globalCompositeOperation = 'lighter';
            parts = parts.filter(function (p) {
                p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vx *= 0.985; p.vy *= 0.985; p.life -= 0.012;
                if (p.life <= 0) return false;
                ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'hsla(' + p.hue + ',100%,' + (50 + 25 * p.life) + '%,' + p.life + ')';
                ctx.fill(); return true;
            });
            if (parts.length || Date.now() < end) requestAnimationFrame(loop); else cv.remove();
        })();
    }
    function screenFlash() {
        var d = document.createElement('div'); d.className = 'l2d-flash';
        document.body.appendChild(d); setTimeout(function () { d.remove(); }, 700);
    }
    function unlock(key, title) {
        if (unlocked[key]) return;
        unlocked[key] = true;
        localStorage.setItem('tia_achievements', JSON.stringify(unlocked));
        toast('🏆 隐藏成就达成：<b>' + title + '</b>');
        motion('Success');
    }

    /* ---- 连击核心 ---- */
    $landlord.on('click', function (ev) {
        lastActive = Date.now();
        if (sleeping) {
            sleeping = false;
            motion('WakeUp');
            showMessage(WAKE[Math.floor(Math.random() * WAKE.length)], 4000);
            return;
        }
        var now = Date.now();
        if (now - lastPoke <= COMBO_WINDOW) combo++; else combo = 1;
        lastPoke = now;
        clearTimeout(comboTimer);
        comboTimer = setTimeout(function () { combo = 0; hideBadge(); }, COMBO_WINDOW + 200);

        total++;
        localStorage.setItem('tia_total_pokes', total);
        if (total === 50) unlock('poke_50', '初次见面，请多指教');
        if (total === 100) unlock('poke_100', '百摸不厌');
        if (total === 500) unlock('poke_500', '千锤百炼');
        if (now.getHours() >= 1 && now.getHours() <= 5) unlock('night_owl', '熬夜冠军');

        var x = ev.clientX || 100, y = ev.clientY || innerHeight - 150;
        showBadge(combo);
        emojiRain(combo >= 8 ? ['💫', '⭐', '✨'] : ['💕', '💗', '✨'], x, y, Math.min(4 + combo, 16));

        if (combo === 3) {
            motion('flick_head');
            showMessage(TIERS[3][Math.floor(Math.random() * TIERS[3].length)], 3500);
        } else if (combo === 5) {
            motion('Sukebei1');
            $landlord.addClass('blushing');
            setTimeout(function () { $landlord.removeClass('blushing'); }, 3500);
            showMessage(TIERS[5][Math.floor(Math.random() * TIERS[5].length)], 3500);
            unlock('blush', '害羞的看板娘');
        } else if (combo === 8) {
            motion('Fail');
            $landlord.addClass('wobble');
            setTimeout(function () { $landlord.removeClass('wobble'); }, 2500);
            showMessage(TIERS[8][Math.floor(Math.random() * TIERS[8].length)], 3500);
        } else if (combo === 12) {
            motion('Success');
            fireworks(2600);
            screenFlash();
            showMessage(SECRET_12[Math.floor(Math.random() * SECRET_12.length)], 5000);
            unlock('secret_12', '摸头杀大师');
        } else if (combo === 20) {
            motion('Sukebei3');
            fireworks(4000);
            screenFlash();
            $landlord.addClass('rainbow');
            setTimeout(function () { $landlord.removeClass('rainbow'); }, 6000);
            showMessage(MAX_20[Math.floor(Math.random() * MAX_20.length)], 6000);
            unlock('max_20', '连击之神');
            console.log('%c👑 ×20 连击彩蛋：你居然真的戳了 20 下……宝藏密码藏在徽章里。', 'font-size:16px;color:#e91e63');
        } else if (combo > 12 && combo % 4 === 0) {
            motion('rand');
            fireworks(1200);
        }
    });

    /* ---- 靠近调侃 ---- */
    $landlord.on('mouseenter', function () {
        lastActive = Date.now();
        var now = Date.now();
        if (now - lastTease < 20000 || Math.random() > 0.35) return;
        lastTease = now;
        showMessage(TEASES[Math.floor(Math.random() * TEASES.length)], 3000);
    });

    /* ---- 挂机打瞌睡 ---- */
    setInterval(function () {
        if (!sleeping && Date.now() - lastActive > IDLE_SLEEP_MS) {
            sleeping = true;
            motion('Sleeping');
            showMessage('Zzz…… 睡着了（戳一下叫我起来）', 6000);
        }
    }, 20000);
})();