// BrightSign Player JS Support utilities for JavaScriot - 20130403-1139

var enable_debug_logging=true;

var screenHeight=$(window).height();
var screenWidth=$(window).width();
debug_log("screenWidth: "+screenWidth+" screenHeight "+screenHeight);

var bsbrowser=isBrightSign();


window.onload = function() {
    getID(printObj);
    getUserVars(printObj);
    getUDPEvents(printObj);
};


function bspID(unitName,unitNamingMethod,unitDescription,serialNumber,functionality)
{
    this.unitName=unitName;
    this.unitNamingMethod=unitNamingMethod;
    this.unitDescription=unitDescription;
    this.serialNumber=serialNumber;
    this.functionality=functionality;
}


function getID(callback)
{
    if(bsbrowser=true)
    {
       $.get('http://localhost:8080/GetID',function(data,status,jqXHR)
       { 
            $xml = $( $.parseXML( jqXHR.responseText ));
            
            var n= $unitName = $xml.find( "unitName" ).text();
            var nM=$unitNamingMethod = $xml.find( "unitNamingMethod" ).text();
            var nD=$unitDescription = $xml.find( "unitDescription" ).text();
            var s =$serialNumber = $xml.find( "serialNumber" ).text();
            var f =$functionality = $xml.find( "functionality" ).text();

            var b=new bspID(n,nM,nD,s,f);
            callback(b);
        });
    }
}


function userVar(key,value)
{
    this.key=key;
    this.value=value;
}

function getUserVars(callback)
{
    var varlist=new Array();
    if(bsbrowser=true)
    {
       $.get('http://localhost:8080/GetUserVars',function(data,status,jqXHR)
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



function getUDPEvents(callback)
{
    if(bsbrowser=true)
    {
       $.get('http://localhost:8080/GetUDPEvents',function(data,status,jqXHR)
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
}


function printObj(obj)
{
    debug_log(JSON.stringify(obj));
}


function isBrightSign()
{
    var ua = navigator.userAgent;
    var ret=false;

    if(ua.indexOf("BrightSign") !=-1) {
        debug_log("isBrightSign: TRUE");
        return true;
    } else {
        debug_log("isBrightSign: FALSE");
        return false;
    }
}


function debug_log(logstr)
{
    if (enable_debug_logging=true) {
        console.log(logstr);
    }
}