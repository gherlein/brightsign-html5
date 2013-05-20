function isBrightSign()
{
    var ua = navigator.userAgent;
    if(ua.indexOf("BrightSign") !=-1) {
        debug_log("isBrightSign: TRUE");
        return true;
    } else {
        debug_log("isBrightSign: FALSE");
        return false;
    }
}


function getPlayerID(callback)
{
  sUrl="http://localhost:8080/GetID";
   $.get(sUrl,function(data,status,jqXHR)
   { 
        $xml = $( $.parseXML( jqXHR.responseText ));
        
        var n= $unitName = $xml.find( "unitName" ).text();
        var nM=$unitNamingMethod = $xml.find( "unitNamingMethod" ).text();
        var nD=$unitDescription = $xml.find( "unitDescription" ).text();
        var s =$serialNumber = $xml.find( "serialNumber" ).text();
        var f =$functionality = $xml.find( "functionality" ).text();

        var b=new bspIDConstructor(n,nM,nD,s,f);
        callback(b);
    });
   return true;
}


function bspIDConstructor(unitName,unitNamingMethod,unitDescription,serialNumber,functionality)
{
    this.unitName=unitName;
    this.unitNamingMethod=unitNamingMethod;
    this.unitDescription=unitDescription;
    this.serialNumber=serialNumber;
    this.functionality=functionality;
}

function getUserVars(callback)
{
   if(verifyBSP()==false) { return false;}
   if(bsputils_env.playerurl==null) {
        sUrl="http://localhost:8080/GetUserVars";
   } else {
        sUrl=bsputils_env.playerurl+"/GetUserVars";
   }

   var varlist=new Array();
   $.get(sUrl,function(data,status,jqXHR)
   { 
        un=jqXHR.responseText;

        xmlDoc = $.parseXML( un );
        $xml = $( xmlDoc );

        $xml.find('BrightSignUserVariables').each(function(){
            $(this).children().each(function(){
                var tagName=this.tagName;
                var val=$(this).text();
                uv=new userVar(tagName,val);
                varlist.push(uv);
            })
        });
        callback(varlist);
    });
}

function userVar(key,value)
{
    this.key=key;
    this.value=value;
}



function getUDPEvents(callback)
{
   sUrl="http://localhost:8080/GetUDPEvents";
   $.get(sUrl,function(data,status,jqXHR)
   { 
        un=jqXHR.responseText;

        xmlDoc = $.parseXML( un );
        $xml = $( xmlDoc );

        var recvPort=$xml.find( "receivePort").text();
        var sendPort=$xml.find( "destinationPort" ).text();
        var evlist= new Array();

        $xml.find('udpEvents').each(function(){
            $(this).children().each(function(){
                var label =$(this).find("label").text();
                var action=$(this).find("action").text();
                var ev=new udpevent(label,action);
                evlist.push(ev);
            });
        });

        b=new bspUDPEventList(sendPort,recvPort,evlist);
        callback(b);
    });
}


function bspUDPEventList(sendPort,recvPort,evList)
{
    this.sendPort=sendPort;
    this.recvPort=recvPort;
    this.events=evList;
}


function udpevent(label,action)
{
    this.label=label;
    this.action=action;
}



function printObj(obj)
{
    debug_log(JSON.stringify(obj));
}




function debug_log(logstr)
{
    if (bsp_utils_enable_debug_logging=true) {
        console.log(logstr);
    }
}



function mrssContentObject(url,fileSize,type,medium,duration)
{
    this.url=url;
    this.fileSize=fileSize;
    this.type=type;
    this.medium=medium;
    this.duration=duration;
}


function mrssItem(title,pubDate,link,description,guid,url,fileSize,type,medium,duration,thumbnail)
{
    this.title=title;
    this.pubDate=pubDate;
    this.link=link;
    this.description=description;
    this.guid=guid;
    this.thumbnail=thumbnail;
    this.content=new mrssContentObject(url,fileSize,type,medium,duration);
    this.thumbnail=thumbnail;
}


function mrssPlaylist(url)
{
    this.url=url;
    this.dateFetched=new Date();
    this.items=new Array();
}



function getBSNPlaylist(url,callback)
{
    var qString = 'select * from rss where url=\"'+url+'\"';
    var query = qString;
    var urlBase = 'http://query.yahooapis.com/v1/public/yql?q=';
    var returnFormat = '&format=json';

    var bsnPlaylist=new mrssPlaylist(url);

    jQuery.getJSON(urlBase + encodeURIComponent(query) + returnFormat, function (data) {
    data.query.results.item.forEach(function (item) {
       
        var title=item.title;
        var pubDate=item.pubDate;
        var description=item.description;
        var guid=item.guid;
        var link=item.link;
        var url=item.content.url;
        var fileSize=item.content.fileSize;
        var type=item.content.type;
        var medium=item.content.medium;
        var duration=item.content.duration;
        var thumbnail=item.thumbnail.url;        

        o=new mrssItem(title,pubDate,link,description,guid,url,fileSize,type,medium,duration,thumbnail);
        bsnPlaylist.items.push(o);
      });

      callback(bsnPlaylist);
    });
};







