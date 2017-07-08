var casper  = require('casper').create({
    verbose: true,
    logLevel: 'warning'

});
var x = require('casper').selectXPath;
casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');


casper.start('https://www.instagram.com/', function(){
   this.click(x('//*[@id="react-root"]/section/main/article/div[2]/div[2]/p/a'));
   this.sendKeys(x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[1]/input'), "cdawgfratlord");
   this.sendKeys(x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[2]/input'), "Legendsofrock112");
   this.click(x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/span/button'))

   this.waitForSelector(x('//*[@id="react-root"]/section/nav/div[2]/div/div/div[2]/input'), function(){
     this.click(x('//*[@id="react-root"]/section/nav/div[2]/div/div/div[3]/div/div[3]/a'));
     this.waitForSelector(x('//*[@id="react-root"]/section/main/article/ul/li[2]/a'),function(){
       this.click(x('//*[@id="react-root"]/section/main/article/ul/li[2]/a'));
       this.wait(500,function(){
         this.scrollToBottom();
         this.capture("followers.png");
         var elements = this.getElementsInfo('a._5lote._pfo25._vbtk2');
         elements.forEach(function(element){
           casper.echo(element.attributes.href);
         });

       });

     });
   });


});

casper.run();
