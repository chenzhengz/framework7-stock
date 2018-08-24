routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/catalog/',
    componentUrl: './pages/catalog.html',
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  {
    path: '/about/:name',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      var name = routeTo.params.name;
      var count = 0;
      setTimeout(function () {
        var infix = '';
        app.request.get(inFixedassetsURL, { name: name}, function (data) {
          var obj = new Function("return" + data)();
          if (obj.code == '0') {
            if (obj.page.list.length > 0) {
              infix = obj.page.list[0];
              //console.log(infix);
            }
          }
          count++;
          handle();
        });
        var outtemp = '';
        app.request.get(outTempURL, { name: name}, function (data) {
          var obj = new Function("return" + data)();
          if (obj.code == '0') {
            if (obj.page.list.length > 0) {
              outtemp = obj.page.list[0];
              //console.log(outtemp);
            }
          }
          count++;
          handle();
        });
        var outtask = '';
        app.request.get(outTaskURL, { name: name}, function (data) {
          var obj = new Function("return" + data)();
          if (obj.code == '0') {
            if (obj.page.list.length > 0) {
              outtask = obj.page.list[0];
              //console.log(outtask);
            }
          }
          count++;
          handle();
        });
        var outsecular = '';
        app.request.get(outSecularURL, { name: name}, function (data) {
          var obj = new Function("return" + data)();
          if (obj.code == '0') {
            if (obj.page.list.length > 0) {
              outsecular = obj.page.list[0];
              //console.log(outsecular);
            }
          }
          count++;
          handle();
        });
        function handle() {
          if (count === 4) {
            app.preloader.hide();
            resolve(
              {
                componentUrl: './pages/about.html',
              },
              {
                context: {
                  infix: infix,
                  outtemp: outtemp,
                  outtask: outtask,
                  outsecular: outsecular,
                }
              }
            );
          }
        }
      }, 1000);
    },
  },
  {
    path: '/consumables/:name',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      var app = router.app;
      app.preloader.show();
      var name = routeTo.params.name;
      setTimeout(function () {
        var count = 0;
        var incon = '';
        var a = app.request.get(inConsumablesURL, { name: name}, function (data) {
          var obj = new Function("return" + data)();
          if (obj.code == '0') {
            if (obj.page.list.length > 0) {
              incon = obj.page.list[0];
              //console.log(incon);
            }
          }
          count++;
          handle();
        });
        var outcon = '';
        var b = app.request.get(outConsumablesURL, { name: name}, function (data) {
          var obj = new Function("return" + data)();
          if (obj.code == '0') {
            if (obj.page.list.length > 0) {
              outcon = obj.page.list[0];
              //console.log(outcon);
            }
          }
          count++;
          handle();
        });
        function handle() {
          if (count === 2) {
            app.preloader.hide();
            resolve(
              {
                componentUrl: './pages/consumables.html',
              },
              {
                context: {
                  indata: incon,
                  outdata: outcon,
                }
              }
            );
          }
        }
      }, 1000);
    },
  },
  {
    path: '/approval/:id/:name',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;
      // App instance
      var app = router.app;
      // Show Preloader
      app.preloader.show();
      // User ID from request
      var name = routeTo.params.name;
      var id = routeTo.params.id;
      // Simulate Ajax Request
      setTimeout(function () {
        var data = '';
        app.request.get(approvalURL+'/'+id, function (data) {
          var obj = new Function("return" + data)();
          if (obj.code == '0') {
            data = obj.data;
          }
          // Hide Preloader
          app.preloader.hide();
          // Resolve route to load page
          resolve(
            {
              componentUrl: './pages/approval.html',
            },
            {
              context: {
                data: data,
              }
            }
          );
        });
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
