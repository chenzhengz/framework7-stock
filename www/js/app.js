// Dom7
var $$ = Dom7;

var ip = '192.168.0.106';
var port = '8080';
var prifixURL = 'http://' + ip + ':' + port + '/common-backend';
var homeURL = prifixURL + '/query/fixedassets/list';
var catalogURL = prifixURL + '/query/consumables/list';
var settingsURL = prifixURL + '/query/approval/list';
var approvalURL = prifixURL + '/query/approval/info';
var inConsumablesURL = prifixURL + '/inbound/consumables/list';
var outConsumablesURL = prifixURL + '/outbound/consumables/list';
var inFixedassetsURL = prifixURL + '/inbound/fixedassets/list';
var outTempURL = prifixURL + '/outbound/fixedassetstemp/list';
var outSecularURL = prifixURL + '/outbound/fixedassetssecular/list';
var outTaskURL = prifixURL + '/outbound/fixedassetstask/list';

// Framework7 App main instance
var app = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  pushState: true,
  pushStateSeparator: '＃page /',
  // App routes
  routes: routes,
});

//function show (data){
  var headers = app.request.setup({
    headers: {
      'token': 'a66c962c6f7fdc58c355bf9ceb7df682'//data
    },
    contentType: 'application/json; charset=UTF-8'
  });
  
  //fixGetRequest();
  //conGetRequest();
  //approvalGetRequest();
//}

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var catalogView = app.views.create('#view-catalog', {
  url: '/catalog/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});

//默认首页
var url = homeURL;
//各类型总页数
var fixTotalPage = 0;
var conTotalPage = 0;
var setTotalPage = 0;
//一级菜单点击事件绑定状态值
var ptrConStatus = 0;
var ptrSetStatus = 0;

var pageSize = 10;
// Loading flag
var fixAllowInfinite = true;
// Last loaded index
var fixLastItemIndex = 0;
// Max items to load
var fixMaxItems = 0;
var fixCurrPage = 1;

// Pull to refresh content
var $ptrFix = $$('#fixptr');
// Add 'refresh' listener on it
$ptrFix.on('ptr:refresh', function (e) {
  // Emulate 2s loading
  setTimeout(function () {
    fixGetRequest();
    // When loading done, we need to reset it
    app.ptr.done(); // or e.detail();
  }, 2000);
});
// Attach 'infinite' event handler
$ptrFix.on('infinite', function () {
  scrollFixGetQuest();
});

$$('.tab-link').on('click', function () {
  if ($$('#view-home').hasClass('tab-active')) {
    //url = homeURL;
    $ptrContent = $$('#fixptr');
  }
  if ($$('#view-catalog').hasClass('tab-active')) {
    //url = catalogURL;
    if (ptrConStatus == 0) {
      var $ptrCon = $$('#conptr');
      ptrConStatus = 1;
      $ptrCon.on('ptr:refresh', function (e) {
        setTimeout(function () {
          conGetRequest();
          e.detail();
        }, 2000);
      });
      $ptrCon.on('infinite', function () {
        scrollConGetQuest();
      });
    }
  }
  if ($$('#view-settings').hasClass('tab-active')) {
    //url = settingsURL;
    if (ptrSetStatus == 0) {
      var $ptrSet = $$('#setptr');
      ptrSetStatus = 1;
      $ptrSet.on('ptr:refresh', function (e) {
        setTimeout(function () {
          approvalGetRequest();
          e.detail();
        }, 2000);
      });
      $ptrSet.on('infinite', function () {
        scrollSetGetQuest();
      });
    }
  }
});

// Create center toast
var toastFailed = app.toast.create({
  text: '数据加载失败',
  position: 'center',
  closeTimeout: 2000,
});

// Create center toast
var toastNoData = app.toast.create({
  text: '暂无数据显示',
  position: 'center',
  closeTimeout: 2000,
});

// Create center toast
var toastAppSuccess = app.toast.create({
  text: '审核成功',
  position: 'center',
  closeTimeout: 2000,
});

//get view
var getCurrentView = function () {
  if ($$('#view-home').hasClass('tab-active')) {
    return homeView;
  }
  if ($$('#view-catalog').hasClass('tab-active')) {
    return catalogView;
  }
  if ($$('#view-settings').hasClass('tab-active')) {
    return settingView;
  }
}

//--------------------下拉刷新开始
var fixGetRequest = function () {
  app.request.get(homeURL, { page: 1, limit: 10 }, function (data) {
    var obj = new Function("return" + data)();
    //console.log(obj);
    if (obj.code == '0') {
      if (obj.page.list.length > 0) {
        var products = obj.page.list;
        fixTotalPage = obj.page.totalPage;
        $$('#fixul').empty();
        for (var i = 0; i < products.length; i++) {
          var fixedassets = products[i];
          var itemHTML =
            '<li><a href="/about/' + fixedassets.name + '" class="item-link item-content">' +
            '<div class="item-media"><img src="images/device.png" width="80"/></div>' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title">' + fixedassets.name + '</div>' +
            '<div class="item-after">' + fixedassets.code + '</div>' +
            '</div>' +
            '<div class="item-subtitle">' + fixedassets.collect + '</div>' +
            '<div class="item-text">' + fixedassets.status + '</div>' +
            '</div>' +
            '</a></li>';
          // Prepend new list element
          $$('#fixul').prepend(itemHTML);
        }
      } else {
        $$('#fixul').empty();
        $$('#fixul').prepend('<li class="button button-raised open-with-button">暂无数据显示</li>');
      }
    } else {
      toastFailed.open();
      console.log(obj.msg);
    }
    if (fixTotalPage <= 1) {
      $$('#fixpre').remove();
    }
  });
}

var conGetRequest = function () {
  app.request.get(catalogURL, { page: 1, limit: 10 }, function (data) {
    var obj = new Function("return" + data)();
    //console.log(obj);
    if (obj.code == '0') {
      if (obj.page.list.length > 0) {
        var products = obj.page.list;
        conTotalPage = obj.page.totalPage;
        $$('#conul').empty();
        for (var i = 0; i < products.length; i++) {
          var consumables = products[i];
          var itemHTML =
            '<li><a href="/consumables/' + consumables.name + '" class="item-link item-content">' +
            '<div class="item-media"><img src="images/device.png" width="80"/></div>' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title">' + consumables.name + '</div>' +
            '<div class="item-after">' + consumables.code + '</div>' +
            '</div>' +
            '<div class="item-subtitle">' + consumables.collect + '</div>' +
            '<div class="item-text">' + consumables.status + '</div>' +
            '</div>' +
            '</a></li>';
          // Prepend new list element
          $$('#conul').prepend(itemHTML);
        }
      } else {
        $$('#conul').empty();
        $$('#conul').prepend('<li class="button button-raised open-with-button">暂无数据显示</li>');
      }
    } else {
      toastFailed.open();
      console.log(obj.msg);
    }
    if (conTotalPage <= 1) {
      $$('#conpre').remove();
    }
  });
}

var approvalGetRequest = function () {
  app.request.get(settingsURL, { page: 1, limit: 10 }, function (data) {
    var obj = new Function("return" + data)();
    //console.log(obj);
    if (obj.code == '0') {
      if (obj.page.list.length > 0) {
        var products = obj.page.list;
        setTotalPage = obj.page.totalPage;
        $$('#setul').empty();
        for (var i = 0; i < products.length; i++) {
          var approval = products[i];
          var itemHTML =
            '<li><a href="/approval/' + approval.id + '/' + approval.name + '" class="item-link item-content">' +
            '<div class="item-media"><img src="images/device.png" width="80"/></div>' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title">' + approval.name + '</div>' +
            '<div class="item-after">' + approval.code + '</div>' +
            '</div>' +
            '<div class="item-subtitle">' + approval.quantity + '</div>' +
            '<div class="item-text">' + approval.outTime + '</div>' +
            '</div>' +
            '</a></li>';
          // Prepend new list element
          $$('#setul').prepend(itemHTML);
        }
      } else {
        $$('#setul').empty();
        $$('#setul').prepend('<li id="setli" class="button button-raised open-with-button">暂无数据显示</li>');
      }
    } else {
      toastFailed.open();
      console.log(obj.msg);
    }
    if (setTotalPage <= 1) {
      $$('#setpre').remove();
    }
  });
}
//--------------------下拉刷新结束

//审核通过操作
var pass = function (id, tab) {
  if (tab == 'consum') {
    app.request.post(prifixURL + '/outbound/consumables/pass', JSON.stringify([id]), function (data) {
      var obj = new Function("return" + data)();
      if (obj.code == '0') {
        toastAppSuccess.open();
      }
    });
  }
  if (tab == 'temp') {
    app.request.post(prifixURL + '/outbound/fixedassetstemp/pass', JSON.stringify([id]), function (data) {
      var obj = new Function("return" + data)();
      if (obj.code == '0') {
        toastAppSuccess.open();
      }
    });
  }
  if (tab == 'secular') {
    app.request.post(prifixURL + '/outbound/fixedassetssecular/pass', JSON.stringify([id]), function (data) {
      var obj = new Function("return" + data)();
      if (obj.code == '0') {
        toastAppSuccess.open();
      }
    });
  }
  if (tab == 'task') {
    app.request.post(prifixURL + '/outbound/fixedassetstask/pass', JSON.stringify([id]), function (data) {
      var obj = new Function("return" + data)();
      if (obj.code == '0') {
        toastAppSuccess.open();
      }
    });
  }
}
//审核不通过操作
var nopass = function (id, tab) {
  if (tab == 'consum') {
    app.request.post(prifixURL + '/outbound/consumables/nopass', JSON.stringify([id]), function (data) {
      var obj = new Function("return" + data)();
      if (obj.code == '0') {
        toastAppSuccess.open();
      }
    });
  }
  if (tab == 'temp') {
    app.request.post(prifixURL + '/outbound/fixedassetstemp/nopass', JSON.stringify([id]), function (data) {
      var obj = new Function("return" + data)();
      if (obj.code == '0') {
        toastAppSuccess.open();
      }
    });
  }
  if (tab == 'secular') {
    app.request.post(prifixURL + '/outbound/fixedassetssecular/nopass', JSON.stringify([id]), function (data) {
      var obj = new Function("return" + data)();
      if (obj.code == '0') {
        toastAppSuccess.open();
      }
    });
  }
  if (tab == 'task') {
    app.request.post(prifixURL + '/outbound/fixedassetstask/nopass', JSON.stringify([id]), function (data) {
      var obj = new Function("return" + data)();
      if (obj.code == '0') {
        toastAppSuccess.open();
      }
    });
  }
}

//--------------加载更多开始
var scrollFixGetQuest = function () {
  // Exit, if loading in progress
  if (!fixAllowInfinite) return;
  // Set loading flag
  fixAllowInfinite = false;
  // Emulate 1s loading
  setTimeout(function () {
    // Reset loading flag
    fixAllowInfinite = true;
    app.request.get(homeURL, { page: fixCurrPage + 1, limit: pageSize }, function (data) {
      var obj = new Function("return" + data)();
      if (obj.code == '0') {
        fixMaxItems = obj.page.totalCount;
        fixCurrPage = obj.page.currPage;
        var products = obj.page.list;
        for (var i = 0; i < products.length; i++) {
          var fixedassets = products[i];
          // Generate new items HTML
          var itemHTML =
            '<li><a href="/about/' + fixedassets.name + '" class="item-link item-content">' +
            '<div class="item-media"><img src="images/device.png" width="80"/></div>' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title">' + fixedassets.name + '</div>' +
            '<div class="item-after">' + fixedassets.code + '</div>' +
            '</div>' +
            '<div class="item-subtitle">' + fixedassets.collect + '</div>' +
            '<div class="item-text">' + fixedassets.status + '</div>' +
            '</div>' +
            '</a></li>';
          // Append new items
          $$('#fixul').append(itemHTML);
        }
      } else {
        toastFailed.open();
        //console.log(obj.msg);
      }
      if (fixLastItemIndex >= fixMaxItems) {
        // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
        app.infiniteScroll.destroy('#fixptr');
        // Remove preloader
        $$('#fixpre').remove();
        return;
      }
      // Update last loaded index
      fixLastItemIndex = $$('#fixul li').length;
    });
  }, 1000);
}

var conAllowInfinite = true;
var conLastItemIndex = 0;
var conMaxItems = 0;
var conCurrPage = 1;
var scrollConGetQuest = function () {
  if (!conAllowInfinite) return;
  conAllowInfinite = false;
  setTimeout(function () {
    conAllowInfinite = true;
    app.request.get(catalogURL, { page: conCurrPage + 1, limit: pageSize }, function (data) {
      var obj = new Function("return" + data)();
      if (obj.code == '0') {
        conMaxItems = obj.page.totalCount;
        conCurrPage = obj.page.currPage;
        var products = obj.page.list;
        for (var i = 0; i < products.length; i++) {
          //console.log(products[i]);
          var consumables = products[i];
          var itemHTML =
            '<li><a href="/consumables/' + consumables.name + '" class="item-link item-content">' +
            '<div class="item-media"><img src="images/device.png" width="80"/></div>' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title">' + consumables.name + '</div>' +
            '<div class="item-after">' + consumables.code + '</div>' +
            '</div>' +
            '<div class="item-subtitle">' + consumables.collect + '</div>' +
            '<div class="item-text">' + consumables.status + '</div>' +
            '</div>' +
            '</a></li>';
          $$('#conul').append(itemHTML);
        }
      } else {
        toastFailed.open();
        //console.log(obj.msg);
      }
      if (conLastItemIndex >= conMaxItems) {
        app.infiniteScroll.destroy('#conptr');
        $$('#conpre').remove();
        return;
      }
      conLastItemIndex = $$('#conul li').length;
    });
  }, 1000);
}

var setAllowInfinite = true;
var setLastItemIndex = 0;
var setMaxItems = 0;
var setCurrPage = 1;
var scrollSetGetQuest = function () {
  if (!setAllowInfinite) return;
  setAllowInfinite = false;
  setTimeout(function () {
    setAllowInfinite = true;
    app.request.get(settingsURL, { page: setCurrPage + 1, limit: pageSize }, function (data) {
      var obj = new Function("return" + data)();
      if (obj.code == '0') {
        setMaxItems = obj.page.totalCount;
        setCurrPage = obj.page.currPage;
        var products = obj.page.list;
        for (var i = 0; i < products.length; i++) {
          var approval = products[i];
          var itemHTML =
            '<li><a href="/approval/' + approval.id + '/' + approval.name + '" class="item-link item-content">' +
            '<div class="item-media"><img src="images/device.png" width="80"/></div>' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title">' + approval.name + '</div>' +
            '<div class="item-after">' + approval.code + '</div>' +
            '</div>' +
            '<div class="item-subtitle">' + approval.quantity + '</div>' +
            '<div class="item-text">' + approval.outTime + '</div>' +
            '</div>' +
            '</a></li>';
          $$('#setul').append(itemHTML);
        }
      } else {
        toastFailed.open();
        //console.log(obj.msg);
      }
      if (setLastItemIndex >= setMaxItems) {
        app.infiniteScroll.destroy('#setptr');
        $$('#setpre').remove();
        return;
      }
      setLastItemIndex = $$('#setul li').length;
    });
  }, 1000);
}
//--------------加载更多结束