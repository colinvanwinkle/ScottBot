var casper  = require('casper').create({
pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false         // use these settings
    },

verbose: true,
logLevel: 'warning'

});

casper.options.waitTimeout = 60000;
var followerHandles = [];
var getUrl = 'uninitialized'


var x = require('casper').selectXPath;
casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

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

                for (i = 0; i < 2; i ++){
                  casper.options.onResourceRequested = function(requestData, networkRequest) {
                    if (networkRequest.url.indexOf("graphql") !== -1){
                      getUrl = JSON.stringify(networkRequest.url);
                      getUrl = getUrl.replace(getUrl.substring(getUrl.indexOf("first"), getUrl.indexOf("first") + 13),'first%22%3A3000');
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


                    followersData.data.user.edge_followed_by.edges.forEach(function(elem){
                      followerHandles.push(elem.node.username);
                    });
                    casper.echo(followerHandles);
                    //followersData = [];

                  }
                });

              }


                //waits for follower list to show up
                this.then(function(){
                    //extracts all the links of the followers
                    casper.echo(followerHandles.length + " found followers");
                    //puts all the urls into an array
                    followerHandles.forEach(function(element){

                            var handle = element;
                            casper.thenOpen('https://www.instagram.com/' + handle + '/');

                            //waits 2 seconds when opening another persons instagram
                            casper.waitForText(handle.substring(1, handle.length - 2), function(){

                                    //only try to open picures if we are following that user
                                    if (casper.exists(x('//*[@id="react-root"]/section/main/article/div[2]/h2'))){
                                    casper.echo("Visiting: " + handle.substring(1,handle.length-2) + " - account is PRIVATE!\n");
                                    }
                                    else{

                                    casper.echo("Visiting: " + handle.substring(1,handle.length-2));
                                    var photos = casper.getElementsInfo("a[href]");
                                    var photoURLS = [];

                                    //go thorugh first 3 photos
                                    photos.forEach(function(photo){
                                            photoURLS.push(photo.attributes.href);
                                            });

                                    //---------------------------------------
                                    var i = 0;
                                    var j = 0;

                                    //iterates over first three photos
                                    while(i<3){
                                        j++;
                                        if (photoURLS[j] === undefined) break;
                                        //makes sure link is a valid post
                                        if( photoURLS[j].substring(0,3) === "/p/"){
                                            i++;
                                            casper.thenOpen('https://www.instagram.com' + photoURLS[j]);

                                            //waits for comment button to click heart
                                            casper.waitForSelector(x('//*[@id="react-root"]/section/main/div/div/article/div[2]/section[1]/a[2]/span'), function(){
                                                    if (!casper.exists('span._soakw.coreSpriteHeartFull')){
                                                    casper.wait(34000,function(){
                                                            casper.click('span._soakw.coreSpriteHeartOpen');
                                                            //casper.capture(handle.substring(1, handle.length - 2) + i + ".png");
                                                            casper.echo("Liked a pic posted by " + handle.substring(1,handle.length-2) + "\n");
                                                            });
                                                    }
                                                    else{
                                                    casper.echo("Already liked this pic!\n")
                                                    }
                                                    });
                                        }
                                    }
                                    //-----end of block for if statement
                                    }
                            });
                    });
                });//end of block


});
});
});

casper.run();
