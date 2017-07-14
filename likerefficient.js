var casper  = require('casper').create({
verbose: true,
logLevel: 'warning'

});
var x = require('casper').selectXPath;
casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');


var getUrl = 'uninitialized'

casper.start('https://www.instagram.com/', function(){
        //click on login
        this.waitForSelector(x('//*[@id="react-root"]/section/main/article/div[2]/div[2]/p/a'), function(){
            this.click(x('//*[@id="react-root"]/section/main/article/div[2]/div[2]/p/a'));
            //enter username and pass
            this.sendKeys(x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[1]/input'), casper.cli.args[0]);
            this.sendKeys(x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[2]/input'), casper.cli.args[1]);
            //hit login
            this.click(x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/span/button'))
            });


        //wait for homepage to load
        this.waitForSelector(x('//*[@id="react-root"]/section/nav/div[2]/div/div/div[2]/input'), function(){
          //click on profile
          this.click(x('//*[@id="react-root"]/section/nav/div[2]/div/div/div[3]/div/div[3]/a'));
          //wait for my page to load
          this.waitForSelector(x('//*[@id="react-root"]/section/main/article/ul/li[2]/a'),function(){
              //click on followers
              this.click(x('//*[@id="react-root"]/section/main/article/ul/li[2]/a'));


              //scrolls to bottom of div
              for (i = 0; i < 2; i ++){
                casper.options.onResourceRequested = function(requestData, networkRequest) {
                  if (networkRequest.url.indexOf("graphql") !== -1){
                    getUrl = JSON.stringify(networkRequest.url);
                    getUrl = getUrl.replace(getUrl.substring(getUrl.indexOf("first"), getUrl.indexOf("first") + 13),'first%22%3A5000');
                    getUrl = getUrl.substring(1,getUrl.length-1);
                  }
                };

                this.then(function(){
                  this.echo(i);
                  this.wait(250,function(){
                    this.scrollToBottom();
                  });
              });

                this.then(function(){

               if (getUrl != 'uninitialized'){
                var res = this.evaluate(function(getUrl){
                  return __utils__.sendAJAX(getUrl, 'GET', null, false);
                }, {getUrl: getUrl});

                  followersData = JSON.parse(res);

                  //casper.echo(JSON.stringify(followersData.data.user.edge_followed_by.edges));

                  var followerHandles = [];
                  followersData.data.user.edge_followed_by.edges.forEach(function(elem){
                    followerHandles.push(elem.node.username);
                  });
                  casper.echo(followerHandles);

                }
              });

            }


    });
  });
});



casper.run();
