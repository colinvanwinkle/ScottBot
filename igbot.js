var casper  = require('casper').create({
    verbose: true,
    logLevel: 'warning'

});
var x = require('casper').selectXPath;
casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');


casper.start('https://www.instagram.com/', function(){
   //click on login
   this.click(x('//*[@id="react-root"]/section/main/article/div[2]/div[2]/p/a'));
   //enter username and pass
   this.sendKeys(x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[1]/input'), "cdawgfratlord");
   this.sendKeys(x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[2]/input'), "Legendsofrock112");
   //hit login
   this.click(x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/span/button'))

   //wait for homepage to load
   this.waitForSelector(x('//*[@id="react-root"]/section/nav/div[2]/div/div/div[2]/input'), function(){
     //click on profile
     this.click(x('//*[@id="react-root"]/section/nav/div[2]/div/div/div[3]/div/div[3]/a'));
     //wait for my page to load
     this.waitForSelector(x('//*[@id="react-root"]/section/main/article/ul/li[2]/a'),function(){
       //click on followers
       this.click(x('//*[@id="react-root"]/section/main/article/ul/li[2]/a'));

       //scrolls to bottom of div
       for (i = 0; i < 15; i ++){
       this.wait(100,function(){
         this.scrollToBottom();
        });
       }


         //waits for follower list to show up
         this.waitForSelector('a._5lote._pfo25._vbtk2', function(){
           //extracts all the links of the followers
           var followers = this.getElementsInfo('a._5lote._pfo25._vbtk2');
           var followerURLS = [];
           //puts all the urls into an array
           followers.forEach(function(element){
             //visits each followers page
             var handle = element.attributes.href
              casper.thenOpen('https://www.instagram.com' + handle);
              casper.wait(2000, function(){
                casper.capture(handle.substring(1, handle.length - 2) + ".png");
                casper.echo("Visiting: " + handle);
              });
           });



        });//end of block


  });
});
});

casper.run();
