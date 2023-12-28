var nox = {};
var countdown = 60;
var nox_interValObj = null;

var nox_isautologin = 0;// 不自动登录
var nox_username = getCookie('username');
var nox_password = getCookie('password');
if(nox_username && nox_password) {
    nox_isautologin = 1;
}

var nox_isMicroClient = (function () {
    var name = "microclient";
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]) === "1";
    return false;
})();

var nox_isPc = (function () {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
})();

nox.createWrap = function () {
    if ($('#message-dialog').length <= 0) {
        var dialogPanel = '<div class="message-dialog" id="message-dialog"></div>';
        $('body').append(dialogPanel);
    }
};

nox.removeWrap = function (forbidAnim) {
    if ($('#message-dialog').length > 0) {
        if(forbidAnim) {
            $('#message-dialog').remove();
            return;
        }
        $('#message-dialog').fadeOut(function(){
            $('#message-dialog').remove();
        });
    }
};

/**
 * 存在activityTask中的elements
 * 它们的className不能相同
 * 它们各自必须有独自的className
 * @type {Array}
 */
var activityTask = [];

nox.startActivity = function(elementHtml, className) {
    nox.createWrap();
    $('#message-dialog').append(elementHtml);
    $('.'+className).animate({
        top: "50%"
    });
    var elements = document.getElementById("message-dialog");
    for(var i = 0 ; i < elements.childNodes.length; i++) {
        var child = elements.childNodes[i];
        if(child.className.indexOf(className) > 0) {
            activityTask.push(child);
            child.tag = className;
        }else {
            $('.'+child.tag).fadeOut();
        }
    }
};

nox.finishActivity = function (className, callback) {
    var curIndex = 0;// 当前显示页面
    for(var i = 0; i < activityTask.length; i++) {
        if(activityTask[i].className.indexOf(className) > 0) {
            $('.'+className).animate({
                top: "150%"
            }, function () {
                $('.' + className).remove();
                callback && callback();
            });
            curIndex = i;
            activityTask.splice(i, 1);
            break;
        }
    }
    if(curIndex > 0) {
        $('.'+activityTask[curIndex - 1].tag).fadeIn();
    }
    if(activityTask.length === 0) {
        nox.removeWrap();
    }
};

nox.gotoMainActivity = function() {
    for(var i = 1; i < activityTask.length; i++) {
        activityTask[i].remove();
    }
    activityTask.splice(1, activityTask.length - 1);
    $('.'+activityTask[0].tag).fadeIn();
};

nox.clearActivitys = function() {
    activityTask = [];
};

nox.switchAccount = function() {
    var nox_doindex_html =
        '<div class="message-dialog-box message-dialog-switch-box">'
        +   '<div class="switch-title-container">'
        // +       '<div><h2>诺克斯通行证</h2></div>'
        +   '</div>'
        +   '<div class="nox-w600">'
        +       '<div class="nox-startgame-btn" onclick="nox.fastReg()">一键试玩游戏</div>'
        +       '<div class="nox-haveuser-btn" onclick="nox.loginhtml();">有账号，登录游戏</div>'
        +       '<div class="nox-reg-tit">'
        +           '<div class="nox-com-line"></div>'
        +           '<div class="nox-red-txt">注册账号</div>'
        +       '</div>'
        +       '<div class="nox-w100 nox-bot-nav nox-cli-2">'
        +           '<ul>'
        +               '<li class="nox-reg-icon" onclick="nox.doRegPhone()"><a href="javascript:;"><span></span><p>通过手机号</p></a></li>'
        +               '<li onclick="nox.doUserRegh()" class="nox-user-icon"><a href="javascript:;"><span></span><p>通过用户名</p></a></li>'
        +           '</ul>'
        +       '</div>'
        +   '</div>'
        + '</div>';

    // nox.createWrap();
    // $('.message-dialog').html(nox_doindex_html);
    // $('.message-dialog-switch-box').animate({
    //     top: "50%"
    // });
    nox.startActivity(nox_doindex_html, 'message-dialog-switch-box');
};

nox.loginhtml = function() {
    var uPlaceholder = getCookie('username');
    var pPlaceholder = getCookie('password');
    nox.createWrap();
    var dialogPanel =
        '<div class="message-dialog-box message-dialog-login-box">'
        +           '<div class="title_container">账号登录'
        +               '<span class="return"></span>'
        +           '</div>'
        +           '<form>'
        +               '<ul class="nox-login-form">'
        +                   '<li class="username-txt"><input type="text" id="usernameval" name="username" placeholder="手机号/用户名" value=' + uPlaceholder + '></li>'
        +                   '<li class="password-txt"><input type="password" id="passwordval" name="password" placeholder="密码" value=' + pPlaceholder + '></li>'
        +                   '<input type="button" value="登录" class="nox-sure-btn nox-login-btn">'
        +               '</ul>'
        +            '</form>'
        // +            '<div class="nox-login-ways">'
        // +               '<div style="float: left">第三方登录无需注册:</div>'
        // +               '<div style="float: left; text-align: center; height: 100%; line-height: 40px" class="clearfix"><a href="javascript:;"><span></span></a></div>'
        // +            '</div>'
        +            '<div class="nox-com-line2"></div>'
        +            '<div class="nox-w100 nox-bot-nav">'
        +               '<ul>'
        +                   '<li class="nox-reg-icon" onclick="nox.doRegPhone()"><a href="javascript:;"><span></span><p>手机号注册</p></a></li>'
        +                   '<li class="nox-user-icon" onclick="nox.doUserRegh()"><a href="javascript:;"><span></span><p>用户名注册</p></a></li>'
        +                   '<li class="nox-password-icon" onclick="nox.doFindWord()"><a href="javascript:;"><span></span><p>找回密码</p></a></li>'
        +               '</ul>'
        +            '</div>'
        +       '</div>';

    // $('#message-dialog').append(dialogPanel);
    nox.startActivity(dialogPanel, 'message-dialog-login-box');

    $('.nox-login-btn').bind('click', function() {
        var username = $('#usernameval').val();
        var password = $('#passwordval').val();
        if (username === '' || password === '') {
            nox.alert('<font color="black">账号或密码不能为空。</font>');
            return;
        }
        nox.nox_http('http://ly2.noxgo.com:28181/NOWL', {account:username,password:password}, function (dataStr) {
            var data = dataStr;
            if(data.result === "0") {
                setCookie('username',username);
                setCookie('password',password);

                nox_username = username;
                nox_password = password;

                nox.welcomeBack(data.bind === "true", function () {
                    nox.loginCallback && nox.loginCallback(data.uid);
                });

            }else {
                nox.alert('<font color="black">用户名或密码错误。</font>');
            }
        });
    });

    $('.return').bind('click', function () {
        // $('.message-dialog-login-box').remove();
        nox.finishActivity('message-dialog-login-box');
    })
};

/**
 * 登录
 * @param callback
 */
nox.doLogin = function() {
    if(!nox_isautologin) {
        // 不自动登录
        nox.switchAccount();
        return;
    }
    // 自动登录
    nox.nox_http('http://ly2.noxgo.com:28181/NOWL', {account:nox_username,password:nox_password}, function (dataStr) {
        var data = dataStr;
        if(data.result === "0") {

            nox.welcomeBack(data.bind === "true", function () {
                nox.loginCallback && nox.loginCallback(data.uid);
            });

        }else {
            nox.alert('<font color="black">用户名或密码错误。</font>', function() {
                nox.switchAccount();
            });

        }
    });


};

/**
 * 支付
 * @param element
 * @param price
 * @param callback
 */
nox.doPay = function(data) {
    if(nox_isMicroClient) {
        // 微端
        $('#message-dialog').remove();
        var cmd = "pay";
        var params = JSON.stringify({
            price:data.price,
            // price:data.price/100, //测试参数
            notifyUrl:data.notifyUrl,
            goodsName:data.goodsName,
            ext:data.ext
        });
        window.prompt("invokeNative:" + cmd, params);
        return;
    }
    nox.pay_html(data);
};

nox.pay_html = function(data) {
    nox.createWrap();
    var dialogPanel =
        '<div class="message-dialog-box message-pay-dialog-box">'
        +     '<div class="title_container">游戏充值'
        // +       '<h3>游戏充值</h3>'
        +     '</div>'

        +     '<div class="moneyTipsContainer clearfix">'
        +           '<div class="leftArea">支付金额:</div>'
        +           '<div class="rightArea">¥ ' + parseInt(data.price/100) + '</div>'
        +     '</div>'
        +     '<div class="payTypeTipsContainer">'
        +           '<div>请选择支付方式</div>'
        +     '</div>'
        +     '<div class="nox-w100 nox-bot-nav">'
        +           '<ul id="nox_pay_method">'
        +           '</ul>'
        +     '</div>'
        +     '<div class="btnContainer">'
        +        '<button id="dialogCancelBtn">取 消</button>'
        +     '</div>'

        +   '</div>';

    // $('#message-dialog').append(dialogPanel);
    nox.startActivity(dialogPanel, 'message-pay-dialog-box');

    for(var i = 0; i < nox.getPayTypes().length; i++) {
        var payType = nox.getPayTypes()[i];
        $('#nox_pay_method').append('<li class="nox-'+payType+'-icon"><a href="javascript:;"><span></span><p>'+nox.getPayTypeName(payType)+'</p></a></li>');
    }

    $('#dialogCancelBtn').bind('click', function() {
        nox.finishActivity('message-pay-dialog-box');
        // $('#message-dialog').remove();
    });
    $('.nox-zhifubao-icon').bind('click', function() {
        nox.doPay_zfb(data);
        // $('#message-dialog').remove();
    });
    $('.nox-weixin-icon').bind('click', function() {
        nox.doPay_wx(data);
        // $('#message-dialog').remove();
    });
};

nox.doPay_zfb = function (data) {
    var payData = null;

    if(nox_isPc) {
        // pc端扫码支付  测试失败(配置错误)
        payData = {
            funcode:"WP001",
            version:"1.0.0",
            mhtOrderType:"01",
            mhtCurrencyType:"156",
            // mhtOrderAmt:parseInt(data.price),正式参数
            mhtOrderAmt:parseInt(data.price) / 100,//测试参数
            mhtOrderDetail:data.orderDetail,
            mhtCharset:"UTF-8",
            deviceType:"08",
            mhtSignType:"MD5",
            notifyUrl:data.notifyUrl,
            frontNotifyUrl:data.frontNotifyUrl,
            mhtOrderName:data.goodsName,
            mhtReserved:data.ext,

            outputType : "0",//2.redirect支付页面,0.返回支付跳转链接
            payChannelType : "12",
            // appId : /*ENCRYPT*/"147245449905115"/*ENCRYPT*/ //测试参数
            appId : /*ENCRYPT*/"150822806690127"/*ENCRYPT*/
        };
    }else {
        // 手机网页 测试成功
        payData = {
            funcode:"WP001",
            version:"1.0.0",
            mhtOrderType:"01",
            mhtCurrencyType:"156",
            // mhtOrderAmt:parseInt(data.price),正式参数
            mhtOrderAmt:parseInt(data.price) / 100,//测试参数
            mhtOrderDetail:data.orderDetail,
            mhtCharset:"UTF-8",
            deviceType:"0601",
            mhtSignType:"MD5",
            notifyUrl:data.notifyUrl,
            frontNotifyUrl:data.frontNotifyUrl,
            mhtOrderName:data.goodsName,
            mhtReserved:data.ext,

            outputType : "0",
            payChannelType : "12",
            // appId : /*ENCRYPT*/"147868777472129"/*ENCRYPT*/ //测试参数
            appId : /*ENCRYPT*/"150814741587556"/*ENCRYPT*/
        };
    }

    nox.nox_http(nowPay_purchase_url, payData, function(data) {
        data = JSON.parse(data);
        cc.log(data);
        if(nox_isPc) {
            // 扫码
            nox.jumptopay(data, "支付宝扫码支付");
        }else {
            // 手机h5
            window.location.href = "" + data.content;
        }
    });
};

nox.doPay_wx = function (data) {
    var payData = null;

    if(nox_isPc) {
        // pc端扫码    测试成功
        payData = {
            funcode:"WP001",
            version:"1.0.0",
            mhtOrderType:"01",
            mhtCurrencyType:"156",
            // mhtOrderAmt:parseInt(data.price),// 正式参数
            mhtOrderAmt:parseInt(data.price) / 100,// 测试参数
            mhtOrderDetail:data.orderDetail,
            mhtCharset:"UTF-8",
            deviceType:"08",
            mhtSignType:"MD5",
            notifyUrl:data.notifyUrl,
            frontNotifyUrl:data.frontNotifyUrl,
            mhtOrderName:data.goodsName,
            mhtReserved:data.ext,

            outputType : "0",   // 0返回二维码串
            payChannelType : "13",
            // appId : /*ENCRYPT*/"147245449905115"/*ENCRYPT*/  // 测试参数
            appId : /*ENCRYPT*/"150822806690127"/*ENCRYPT*/
        };
    }else if(nox.isInWeiXin()) {
        // 微信浏览器公众号支付 (系统异常)
        payData = {
            funcode:"WP001",
            version:"1.0.0",
            mhtOrderType:"01",
            mhtCurrencyType:"156",
            // mhtOrderAmt:parseInt(data.price),//正式参数
            mhtOrderAmt:parseInt(data.price) / 100,// 测试参数
            mhtOrderDetail:data.orderDetail,
            mhtCharset:"UTF-8",
            deviceType:"0600",
            mhtSignType:"MD5",
            notifyUrl:data.notifyUrl,
            frontNotifyUrl:data.frontNotifyUrl,
            mhtOrderName:data.goodsName,
            mhtReserved:data.ext,

            outputType : "0",   //outputType=0模式测试参数    outputType=1模式，需要走正式配置，配置流程请联系负责商务同学，谢谢
            // outputType : "1",
            payChannelType : "13",

            // outputType为1时候，以下参数必填
            // mhtSubAppId : "111",
            // consumerId : "456123",


            // appId : /*ENCRYPT*/"1451547013172082"/*ENCRYPT*/  // 测试参数
            appOd : /*ENCRYPT*/"150814786078875"/*ENCRYPT*/
        };
    }else {
        // 手机网页 测试失败(配置错误)
        payData = {
            funcode:"WP001",
            version:"1.0.0",
            mhtOrderType:"01",
            mhtCurrencyType:"156",
            // mhtOrderAmt:parseInt(data.price),//正式参数
            mhtOrderAmt:parseInt(data.price)/100,//测试参数
            mhtOrderDetail:data.orderDetail,
            mhtCharset:"UTF-8",
            deviceType:"0601",
            mhtSignType:"MD5",
            notifyUrl:data.notifyUrl,
            frontNotifyUrl:data.frontNotifyUrl,
            mhtOrderName:data.goodsName,
            mhtReserved:data.ext,

            outputType : "2",
            payChannelType : "13",
            // appId : /*ENCRYPT*/"148999970238152"/*ENCRYPT*/  // 测试参数
            appId : /*ENCRYPT*/"150814741587556"/*ENCRYPT*/
        };
    }

    nox.nox_http(nowPay_purchase_url, payData, function(data) {
        data = JSON.parse(data);
        if(payData.deviceType === "08" && nox_isPc) {   // pc扫码
            nox.jumptopay(data, "微信扫码支付");
        }else if(payData.deviceType === "0600" && nox.isInWeiXin()) {   // 公众号支付
            cc.log(data);
            nox.createWrap();
            $('#message-dialog').append('<form id="toPayForm" method="post" action="https://pay.ipaynow.cn/" style="display: none"></form>');
            var pams = [];
            pams.push($('<input>', {name: 'funcode', value: data.funcode}));
            pams.push($('<input>', {name: 'appId', value: data.appId}));
            pams.push($('<input>', {name: 'mhtOrderNo', value: data.mhtOrderNo}));
            pams.push($('<input>', {name: 'mhtOrderName', value: data.mhtOrderName}));
            pams.push($('<input>', {name: 'version', value: data.version}));
            pams.push($('<input>', {name: 'mhtCurrencyType', value: data.mhtCurrencyType}));
            pams.push($('<input>', {name: 'mhtOrderAmt', value: data.mhtOrderAmt}));
            pams.push($('<input>', {name: 'mhtOrderDetail', value: data.mhtOrderDetail}));
            pams.push($('<input>', {name: 'mhtOrderType', value: data.mhtOrderType}));
            pams.push($('<input>', {name: 'mhtOrderStartTime', value: data.mhtOrderStartTime}));
            pams.push($('<input>', {name: 'notifyUrl', value: data.notifyUrl}));
            pams.push($('<input>', {name: 'frontNotifyUrl', value: data.frontNotifyUrl}));
            pams.push($('<input>', {name: 'mhtCharset', value: data.mhtCharset}));
            pams.push($('<input>', {name: 'deviceType', value: data.deviceType}));
            pams.push($('<input>', {name: 'outputType', value: data.outputType}));
            pams.push($('<input>', {name: 'mhtReserved', value: data.mhtReserved}));
            pams.push($('<input>', {name: 'payChannelType', value: data.payChannelType}));
            pams.push($('<input>', {name: 'mhtSignType', value: data.mhtSignType}));
            pams.push($('<input>', {name: 'mhtSignature', value: data.mhtSignature}));
            $('#toPayForm').append(pams);
            $('#toPayForm').submit();
        }else {
            // 手机h5
            window.location.href = data.content;
            nox.removeWrap();
        }
    });
};

nox.jumptopay = function (data, titleStr) {
    $('.message-pay-dialog-box').remove();
    for(var i = 0; i < activityTask.length; i++) {
        if(activityTask[i].className.indexOf('message-pay-dialog-box') > 0) {
            activityTask.splice(i, 1);
            break;
        }
    }
    nox.createWrap();

    var queryOrderInterval = window.setInterval(function() {
        nox.nox_http("http://ly2.noxgo.com:28181/NOWQ", data, function (response) {
            response = response;
            if(response.transStatus === "A001" || response.transStatus === "A002" || response.transStatus === "A003" || response.transStatus === "A006") {
                window.clearInterval(queryOrderInterval);
                nox.finishActivity('message-dialog-paycode-box', function() {
                    nox.removeWrap(true);
                });
            }
        }, null, true);
    }, 2000);

    var dialogPanel =
        '<div class="message-dialog-box message-dialog-paycode-box">'
        +     '<div class="title_container">' + titleStr
        // +       '<h3>'+titleStr+'</h3>'
        +       '<span class="return"></span>'
        +     '</div>'
        +     '<br/><center><img src="' + data.content + '" style="width:190px;height:190px"><br/></center>'
        +   '</div>';
    // $('#message-dialog').append(dialogPanel);
    nox.startActivity(dialogPanel, 'message-dialog-paycode-box');
    $('.return').bind('click', function () {
        window.clearInterval(queryOrderInterval);
        nox.finishActivity('message-dialog-paycode-box', function() {
            nox.removeWrap(true);
        });
    });
};


/**
 * 手机号注册
 */
nox.doRegPhone = function() {
    nox.createWrap();

    var dialogPanel =
        '<div class="message-dialog-box message-dialog-phonereg-box">'
        +           '<div class="title_container">通过手机号注册'
        // +               '<h3>通过手机号注册</h3>'
        +               '<span class="return"></span>'
        +           '</div>'
        +           '<form>'
        +               '<ul class="nox-login-form">'
        +                   '<li class="nox-regphone-txt"><input type="text" id="phoneusername" name="username" placeholder="请输入手机号"></li>'
        +                   '<li class="nox-phoneword-txt clearfix"><input type="text" id="phoneyzmval" name="captcha" placeholder="请输入验证码"><a href="javascript:;"><div class="nox-yzmbtn nox-yzmbtn1">获取验证码</div></a></li>'
        +                   '<li class="nox-phoneword-txt"><input type="password" id="phonepasswordval" name="password" placeholder="密码"></li>'
        +                   '<input type="button" value="确定" class="nox-sure-btn nox-phonezc-btn">'
        +               '</ul>'
        +            '</form>'
        +       '</div>';

    // $('#message-dialog').append(dialogPanel);
    nox.startActivity(dialogPanel, "message-dialog-phonereg-box");
    $('.return').bind('click', function () {
        // $('.message-dialog-phonereg-box').remove();
        nox.finishActivity("message-dialog-phonereg-box");
        nox_clearInterval();
    });
    $('.nox-yzmbtn1').bind('click', function () {
        var usernamephone = $('#phoneusername').val();
        var usernameReg = /^[0-9]{11}$/;
        var r1 = usernameReg.test(usernamephone);
        if(!r1) {
            nox.alert('<font color="black">手机号不合法。</font>');
            return;
        }
        if(countdown >= 60) {
            nox.nox_http('http://ly2.noxgo.com:28181/NOWSMS', {mobile:usernamephone,type:'1'}, function (data) {
                var jsonObj = data;
                if(jsonObj.result === "0") {
                    nox_interValObj = window.setInterval(nox_SetRemainTime, 1000);
                    nox.alert('<font color="black">验证码发送成功,请注意查收。</font>');
                }else if(jsonObj.result === "-1"){
                    nox.alert('<font color="black">该手机号已经验证。</font>');
                }else {
                    nox.alert('<font color="black">验证码获取失败。</font>');
                }
            });
        } else {
            nox.alert('<font color="black">操作频繁,请稍后再试。</font>');
        }
    });
    $('.nox-phonezc-btn').bind('click', function () {
        var usernamephone = $('#phoneusername').val();
        var passwordphone = $('#phonepasswordval').val();
        var codephone = $('#phoneyzmval').val();

        var usernameReg = /^[0-9]{11}$/;
        var r1 = usernameReg.test(usernamephone);
        if(!r1) {
            nox.alert('<font color="black">手机号不合法。</font>');
            return;
        }

        if(codephone.length === 0) {
            nox.alert('<font color="black">请输入验证码。</font>');
            return;
        }

        var passReg = /^\S{6,}$/;
        var r2 = passReg.test(passwordphone);
        if(!r2) {
            nox.alert('<font color="black">密码不合法。</font>');
            return;
        }

        var subChannel = nox.getQueryString("subChannel") || "";
        nox.nox_http('http://ly2.noxgo.com:28181/NOWREG', {account:usernamephone, password: passwordphone, authcode: codephone, pub:subChannel}, function (data) {
            var jsonObj = data;

            if(jsonObj.result === "0") {

                nox.nox_http('http://ly2.noxgo.com:28181/NOWL', {account:usernamephone,password:passwordphone}, function (dataStr) {
                    var data = dataStr;
                    if(data.result === "0") {
                        setCookie('username',usernamephone);
                        setCookie('password',passwordphone);

                        nox_username = usernamephone;
                        nox_password = passwordphone;

                        nox.welcomeBack(data.bind === "true", function () {
                            nox.loginCallback && nox.loginCallback(data.uid);
                        });

                    }else {
                        nox.alert('<font color="black">用户名或密码错误。</font>');
                    }
                });

            }else if(jsonObj.result === "-1") {
                nox.alert('<font color="black">用户名重复。</font>');
            }else if(jsonObj.result === "-2") {
                nox.alert('<font color="black">验证码错误。</font>');
            }
        });
    });

};

/**
 * 用户名注册
 */
nox.doUserRegh = function () {
    nox.createWrap();

    var dialogPanel =
        '<div class="message-dialog-box message-dialog-yhmreg-box">'
        +           '<div class="title_container">通过用户名注册'
        // +               '<h3>通过用户名注册</h3>'
        +               '<span class="return"></span>'
        +           '</div>'
        +           '<form>'
        +               '<ul class="nox-login-form">'
        +                   '<li class="nox-regphone-txt"><input type="text" id="usernameyhm" name="username" placeholder="请输入用户名(6位以上数字字母)"></li>'
        +                   '<li class="nox-phoneword-txt"><input type="password" id="passwordyhm" name="password" placeholder="请输入密码(至少6位)"></li>'
        +                   '<input type="button" value="注册" class="nox-sure-btn nox-yhmzc-btn">'
        +               '</ul>'
        +            '</form>'
        +            '<div class="nox-com-line2"></div>'
        +            '<div class="nox-w100 nox-bot-nav">'
        +               '<ul>'
        +                   '<li class="nox-reg-icon" onclick="nox.doRegPhone()"><a href="javascript:;"><span></span><p>手机号注册</p></a></li>'
        +                   '<li class="nox-backlogin-icon" onclick="nox.backMain()"><a href="javascript:;"><span></span><p>返回登录</p></a></li>'
        +               '</ul>'
        +            '</div>'
        +       '</div>';

    // $('#message-dialog').append(dialogPanel);
    nox.startActivity(dialogPanel, "message-dialog-yhmreg-box");

    $('.return').bind('click', function () {
        // $('.message-dialog-yhmreg-box').remove();
        nox.finishActivity("message-dialog-yhmreg-box");
    });

    $('.nox-yhmzc-btn').bind('click', function () {
        var usernameyhm = $('#usernameyhm').val();
        var passwordyhm = $('#passwordyhm').val();
        var reg1 = /^[0-9A-Za-z]{6,}$/;
        var r1 = reg1.test(usernameyhm);
        var reg2 = /^\S{6,}$/;
        var r2 = reg2.test(passwordyhm);
        if (r1 && r2) {
            var subChannel = nox.getQueryString("subChannel") || "";
            nox.nox_http("http://ly2.noxgo.com:28181/NOWREG", {account:usernameyhm,password:passwordyhm,pub:subChannel}, function (data) {
                cc.log('=========success=========');
                var jsonObj = data;
                if(jsonObj.result === "0") {
                    nox.nox_http('http://ly2.noxgo.com:28181/NOWL', {account:usernameyhm,password:passwordyhm}, function (dataStr) {
                        var data = dataStr;
                        if(data.result === "0") {
                            setCookie('username',usernameyhm);
                            setCookie('password',passwordyhm);

                            nox_username = usernameyhm;
                            nox_password = passwordyhm;

                            nox.welcomeBack(data.bind === "true", function () {
                                nox.loginCallback && nox.loginCallback(data.uid);
                            });

                        }else {
                            nox.alert('<font color="black">用户名或密码错误。</font>');
                        }
                    });
                }else if(jsonObj.result === "-1") {
                    nox.alert('<font color="black">用户名重复。</font>');
                }else {
                    nox.alert('<font color="black">未知错误。</font>');
                }
            });
        }else {
            nox.alert('<font color="black">用户名或密码不合法。</font>');
        }
    });

};

nox.backMain = function () {
    nox.gotoMainActivity();
};

/**
 * 找回密码
 */
nox.doFindWord = function () {
    nox.createWrap();
    var nox_findword_html = '<div class="message-dialog-box message-dialog-findword-box">'
        +   '<div class="title_container">找回密码'
        // +       '<h3>找回密码</h3>'
        +           '<span class="return"></span>'
        +   '</div>'
        +   '<form>'
        +       '<ul class="nox-login-form">'
        +           '<li class="nox-regphone-txt">'
        +               '<input type="text" id="findusername" name="username" placeholder="请输入手机号">'
        +           '</li>'
        +           '<li class="nox-phoneword-txt">'
        +               '<input type="texy" id="findyzmval" name="captcha" placeholder="请输入验证码">'
        +               '<div class="nox-yzmbtn nox-yzmbtn2">获取验证码</div>'
        +           '</li>'
        +           '<li class="nox-regphone-txt">'
        +               '<input type="password" id="newpasswordval" name="username" placeholder="请输入新密码(至少6位)">'
        +           '</li>'
        +           '<input type="button" value="重置密码" class="nox-sure-btn mt60 nox-respassword-btn">'
        +       '</ul>'
        +   '</form>'
        + '</div>';

    // $('.message-dialog').append(nox_findword_html);
    nox.startActivity(nox_findword_html, "message-dialog-findword-box");

    $('.return').bind('click', function () {
        // $('.message-dialog-findword-box').remove();
        nox.finishActivity("message-dialog-findword-box");
        nox_clearInterval();
    });

    $('.nox-yzmbtn2').click(function() {
        var account = $('#findusername').val();
        var usernameReg = /^[0-9]{11}$/;
        var r1 = usernameReg.test(account);
        if(!r1) {
            nox.alert('<font color="black">手机号不合法。</font>');
            return;
        }
        if(countdown >= 60) {
            var findusername = $('#findusername').val();
            nox.nox_http('http://ly2.noxgo.com:28181/NOWSMS', {mobile:findusername,type:'2'}, function (data) {
                var jsonObj = data;
                if(jsonObj.result === "0") {
                    nox_interValObj = window.setInterval(nox_SetRemainTime, 1000);
                    nox.alert('<font color="black">验证码发送成功,请注意查收。</font>');
                }else if(jsonObj.result === "-2"){
                    nox.alert('<font color="black">该手机号未经过验证。</font>');
                }else {
                    nox.alert('<font color="black">验证码获取失败。</font>');
                }
            });
        } else {
            nox.alert('<font color="black">操作频繁,请稍后再试。</font>');
        }
    });

    $('.nox-respassword-btn').click(function() {
        var account = $('#findusername').val(),
            password = $('#newpasswordval').val(),
            authCode = $('#findyzmval').val();

        var usernameReg = /^[0-9]{11}$/;
        var r1 = usernameReg.test(account);
        if(!r1) {
            nox.alert('<font color="black">手机号不合法。</font>');
            return;
        }

        var passReg = /^\S{6,}$/;
        var r2 = passReg.test(password);
        if(!r2) {
            nox.alert('<font color="black">密码不合法。</font>');
            return;
        }

        if(authCode.length === 0) {
            nox.alert('<font color="black">请输入验证码。</font>');
            return;
        }

        var params = {
            account: account,
            password: password,
            authcode: authCode,
            type:'2'
        };
        nox.nox_http("http://ly2.noxgo.com:28181/NOWRESETPWD", params,
            function (data) {
                data = data;

                if(data.result === "0") {

                    nox.nox_http('http://ly2.noxgo.com:28181/NOWL', {account:account,password:password}, function (dataStr) {
                        var data = dataStr;
                        if(data.result === "0") {
                            setCookie('username',account);
                            setCookie('password',password);

                            nox_username = account;
                            nox_password = password;

                            nox.welcomeBack(data.bind === "true", function () {
                                nox.loginCallback && nox.loginCallback(data.uid);
                            });

                        }else {
                            nox.alert('<font color="black">用户名或密码错误。</font>');
                        }
                    });

                }else if(data.result === "-1") {
                    nox.alert('<font color="black">手机号未经过验证。</font>');
                }else {
                    nox.alert('<font color="black">验证码错误。</font>');
                }
            });
    });
};

nox.fastReg = function() {
    var username = randomStr(6, true);
    var password = randomStr(6, false);
    var subChannel = nox.getQueryString("subChannel") || "";
    nox.nox_http("http://ly2.noxgo.com:28181/NOWREG", {account:username,password:password,pub:subChannel}, function (data) {
        cc.log('=========success=========');
        var jsonObj = data;
        if(jsonObj.result === "0") {
            nox.confirm('<font color="black">用户名：'+ username +'。</font>' + '<font color="black">密码：'+ password +'</font>', {btns:["确定"]}, function () {
                nox.nox_http('http://ly2.noxgo.com:28181/NOWL', {account:username,password:password}, function (dataStr) {
                    var data = dataStr;
                    if(data.result === "0") {
                        setCookie('username',username);
                        setCookie('password',password);

                        nox_username = username;
                        nox_password = password;

                        nox.welcomeBack(data.bind === "true", function () {
                            nox.loginCallback && nox.loginCallback(data.uid);
                        });

                    }else {
                        nox.alert('<font color="black">用户名或密码错误。</font>');
                    }
                });
            });
        }else if(jsonObj.result === "-1") {
            nox.alert('<font color="black">用户名重复，请重试。</font>');
        }else {
            nox.alert('<font color="black">未知错误。</font>');
        }
    });
};

nox.doBindPhone = function (callback) {
    nox.createWrap();
    var nox_bindphone_html = '<div class="message-dialog-box message-dialog-bindphone-box">'
        +   '<div class="title_container">绑定手机号'
        // +       '<h3>绑定手机号</h3>'
        +       '<span class="return"></span>'
        +   '</div>'
        +   '<form>'
        +       '<ul class="nox-login-form">'
        +           '<li class="nox-regphone-txt">'
        +               '<input type="text" id="bindusername" name="username" placeholder="请输入手机号">'
        +           '</li>'
        +           '<li class="nox-phoneword-txt">'
        +               '<input type="texy" id="bindyzmval" name="captcha" placeholder="请输入验证码">'
        +               '<div class="nox-yzmbtn nox-yzmbtn3">获取验证码</div>'
        +           '</li>'
        +           '<input type="button" value="绑定手机号" class="nox-sure-btn mt60 nox-bindphone-btn">'
        +       '</ul>'
        +   '</form>'
        +   '<div class="nox-reg-tit"><div class="nox-com-line"></div><div class="nox-red-txt">温馨提示</div></div>'
        +   '<p class="nox-pstyle" style="padding-left: 15px;">绑定手机号后，您可用手机号或用户名登录。</p>'
        + '</div>';

    // $('.message-dialog').append(nox_bindphone_html);
    nox.startActivity(nox_bindphone_html, "message-dialog-bindphone-box");

    $('.return').bind('click', function () {
        nox.finishActivity("message-dialog-bindphone-box", function () {
            nox.removeWrap();
            callback && callback();
            nox_clearInterval();
        });
    });

    $('.nox-yzmbtn3').click(function() {
        var phonenumber = $('#bindusername').val();
        var usernameReg = /^[0-9]{11}$/;
        var r1 = usernameReg.test(phonenumber);
        if(!r1) {
            nox.alert('<font color="black">手机号不合法。</font>');
            return;
        }
        if(countdown >= 60) {
            var bindusername = $('#bindusername').val();
            nox.nox_http('http://ly2.noxgo.com:28181/NOWSMS', {mobile:bindusername,type:'1'}, function (data) {
                var jsonObj = data;
                if(jsonObj.result === "0") {
                    nox_interValObj = window.setInterval(nox_SetRemainTime, 1000);
                    nox.alert('<font color="black">验证码发送成功,请注意查收。</font>');
                }else if(jsonObj.result === "-1"){
                    nox.alert('<font color="black">该手机号已经验证。</font>');
                }else {
                    nox.alert('<font color="black">验证码获取失败。</font>');
                }
            });
        } else {
            nox.alert('<font color="black">操作频繁,请稍后再试。</font>');
        }
    });

    $('.nox-bindphone-btn').click(function(){
        var phonenumber = $('#bindusername').val();
        var authcode = $('#bindyzmval').val();
        var usernameReg = /^[0-9]{11}$/;
        var r1 = usernameReg.test(phonenumber);
        if(!r1) {
            nox.alert('<font color="black">手机号不合法。</font>');
            return;
        }
        if(authcode.length === 0) {
            nox.alert('<font color="black">请输入验证码。</font>');
            return;
        }
        var account = getCookie("username");
        nox.nox_http('http://ly2.noxgo.com:28181/NOWBD', {account:account,phone:phonenumber,authcode:authcode}, function (data) {
            var jsonObj = data;
            if(jsonObj.result === "0") {

                nox.alert('<font color="black">手机号绑定成功。</font>');

                nox.finishActivity("message-dialog-bindphone-box", function () {
                    nox.removeWrap();
                    callback && callback();
                });

            }else if(jsonObj.result === "-1"){
                nox.alert('<font color="black">账号不存在。</font>');
            }else if(jsonObj.result === "-2"){
                nox.alert('<font color="black">该手机号已经验证。</font>');
            }else {
                nox.alert('<font color="black">验证码错误。</font>');
            }
        });
    });
};

nox.registerLoginCallback = function (callback) {
    nox.loginCallback = callback;
};

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;

            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return "";
}

function setCookie(name, value) {
    var expdate = new Date();
    expdate.setTime(expdate.getTime() + 60 * 60 * 1000 * 24000000000);
    document.cookie = name + "=" + value + ";expires=" + expdate.toGMTString() + ";path=/";
    // ios微端
    if(nox.getQueryString("mctype") === "ios") {
        window.webkit.messageHandlers.moby_updateCookies.postMessage(document.cookie);
    }
}

nox.nox_http = function(url, params, success, error, hideLoading) {
    $.ajax({
        url: url,
        // dataType: "jsonp",
        type: "POST",
        data: $.param(params),
        beforeSend: function() {
            if(hideLoading) {
                return;
            }
            nox.createWrap();
            $('.message-dialog').append('<div class="nox-wrap-loading"><div class="nox-loading"></div></div>')
        },
        success: function(data) {
            if ($.isFunction(success)) {
                success(data);
            }
        },
        error: function(data) {
            nox.alert('<font color="black">未知错误。</font>');
            if ($.isFunction(error)) {
                error(data);
            }
        },
        complete: function() {
            $('.nox-wrap-loading').remove();
        }
    });
};

nox.alert = function (elememt, confirmCallback) {
    var dialogPanel =
        '<div class="dialog-wrap">'
        +       '<div class="dialog-box">'
        +           '<div class="dialog_title_container">'
        +               '信 息'
        +           '</div>'
        +           '<div class="dialog-content">' + elememt + '</div>'
        +           '<div class="dialog_btn_container"><a class="btn0">确定</a></div>'
        +       '</div>'
        +   '</div>';
    $('body').append(dialogPanel);
    $('.dialog_btn_container').bind('click', function () {
        $('.dialog-wrap').remove();
        confirmCallback && confirmCallback();
    });
};

nox.confirm = function (elememt, param, confirmCallback, cancelCallback, title) {
    var btns = '';
    for(var i = 0; i < param.btns.length; i++) {
        btns += '<a class="btn' + i + '">'+param.btns[i]+'</a>';
    }
    title = title ? title : '信 息';
    var dialogPanel =
        '<div class="dialog-wrap">'
        +       '<div class="dialog-box">'
        +           '<div class="dialog_title_container">'
        +               title
        +           '</div>'
        +           '<div class="dialog-content">' + elememt + '</div>'
        +           '<div class="dialog_btn_container">' + btns + '</div>'
        +       '</div>'
        +   '</div>';
    $('body').append(dialogPanel);
    $('.btn0').bind('click', function () {
        $('.dialog-wrap').remove();
        confirmCallback && confirmCallback();
    });
    $('.btn1').bind('click', function () {
        $('.dialog-wrap').remove();
        cancelCallback && cancelCallback();
    });
};

nox.welcomeBack = function (isBindPhone, callback) {
    nox.clearActivitys();
    nox.removeWrap(true);

    var nox_loginsucess_html =
        '<div class="nox-loginsuccbox" style="margin-top: -60px;">'
        +       '<div class="nox-logo-text"><h2>欢迎回来 <font>' + nox_username + '</font></h2><p style="color: #776d6d;text-align: center;font-size: 14px;">(点击这里切换账号)</p></div>'
        +   '</div>';

    nox.createWrap();
    $('.message-dialog').append(nox_loginsucess_html);

    $('.nox-loginsuccbox').animate({
        "margin-top": "10px"
    });

    var xmw_timeout = setTimeout(function() {
        nox.removeWrap();
        nox.checkAccount(isBindPhone, callback);
    },2000);

    $('.nox-loginsuccbox').click(function(){
        clearTimeout(xmw_timeout);
        $('.nox-loginsuccbox').remove();
        nox.switchAccount();
    });
};

nox.checkAccount = function (isBindPhone, callback) {
    if(!isBindPhone) {
        nox.confirm('<font color="black">您还未绑定手机号，是否立即绑定？</font>', {btns:["确定", "取消"]}, function () {
            nox.doBindPhone(callback);
        }, function () {
            callback && callback();
        });
    }else {
        callback && callback();
    }
};

nox.getPayTypes = function () {
    if(nox.isInWeiXin()) {
        return ['weixin'];
    }else {
        return ['weixin', 'zhifubao'];
    }
};

nox.getPayTypeName = function (key) {
    var nameObj = {'weixin': '微信支付', 'zhifubao': '支付宝'};
    return nameObj[key];
};

nox.isInWeiXin = function () {
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
};

nox.getQueryString = function (name) {
    if(!lc.MobyUri) {
        lc.MobyUri = new MobyUri(document.URL);
    }
    return lc.MobyUri.query_get(name);
};

function nox_SetRemainTime () {
    if (countdown === 0) {
        $('.nox-yzmbtn').html("获取验证码");
        nox_clearInterval();
    } else {
        $('.nox-yzmbtn').html(countdown + "s后再试");
        countdown--;
    }
}

function nox_clearInterval () {
    window.clearInterval(nox_interValObj);
    countdown = 60;
}

function randomStr(len, isUseSeed) {
    var order = '';
    var values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
        "t", "u", "v", "w", "x", "y", "z"];
    var seed = new Date().getTime();
    var seededRandom = function (max, min) {
        max = max || 1;
        min = min || 0;
        seed = (seed * 9301 + 49297) % 233280;
        var rnd = seed / 233280.0;
        return min + rnd * (max - min);
    };
    var length = len-order.length;
    for (var i = 0; i < length; i++) {
        if(isUseSeed) {
            order+=values[Math.ceil(seededRandom(values.length-1,0))];
        }else {
            order+=values[lc.random(0, values.length-1)];
        }
    }
    return order;
}

// $(document).ready(function(){
// nox.doPay('body', '6');
// nox.doLogin('body');
// });
// $('#btn').click(function(){
//     dialog_msg('#btn', '我是点击出来的弹窗');
// });
