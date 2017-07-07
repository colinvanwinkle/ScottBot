var casper  = require('casper').create({
    verbose: true,
    logLevel: 'warning'

});
var x = require('casper').selectXPath;
casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');


casper.start('https://www.instagram.com/', function(){
   this.click(x('//*[@id="react-root"]/section/main/article/div[2]/div[2]/p/a'));
   this.sendKeys
});

casper.run();