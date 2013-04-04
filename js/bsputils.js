// BrightSign Player JS Support utilities for JavaScriot - 20130403-1139

var enable_debug_logging=true;

var screenHeight=$(window).height();
var screenWidth=$(window).width();
debug_log("screenWidth: "+screenWidth+" screenHeight "+screenHeight);

var bsbrowser=isBrightSign();

var bsp={ 
    status:               "UNKNOWN",
    unitName:             "none",
    unitNamingMethod:     "none",
    unitDescription:      "none",
    serialNumber:         "none",
    functionality:        "none"
};

var bspUserVars={
    status:               "UNKNOWN"
}


window.onload = function() {
    //getID();
    getUserVars();
};


function getID()
{
    if(bsbrowser=true)
    {
       $.get('http://localhost:8080/GetID',function(data,status,jqXHR)
       { 
            //console.log(status); 
            un=jqXHR.responseText;
            //console.log(un);

            xmlDoc = $.parseXML( un );
            $xml = $( xmlDoc );
            $unitName = $xml.find( "unitName" );
           // console.log($unitName.text());

            $unitNamingMethod = $xml.find( "unitNamingMethod" );
            //console.log($unitNamingMethod.text());

            $unitDescription = $xml.find( "unitDescription" );
            //console.log($unitDescription.text());

            $serialNumber = $xml.find( "serialNumber" );
            //console.log($serialNumber.text());

            $functionality = $xml.find( "functionality" );
            //console.log($functionality.text());

            bsp={ 
                status:               "OK",
                unitName:             $unitName.text(),
                unitNamingMethod:     $unitNamingMethod.text(),
                unitDescription:      $unitDescription.text(),
                serialNumber:         $serialNumber.text(),
                functionality:        $functionality.text()
            };
            debug_log(JSON.stringify(bsp));
        });
    }
}

function getUserVars()
{
    if(bsbrowser=true)
    {
       $.get('http://localhost:8080/GetUserVars',function(data,status,jqXHR)
       { 
            un=jqXHR.responseText;

            xmlDoc = $.parseXML( un );
            $xml = $( xmlDoc );

            bspUserVars={ 
                status:               "OK",
            };

            $xml.find('BrightSignUserVariables').each(function(){
                $(this).children().each(function(){
                    var tagName=this.tagName;
                    var val=$(this).text();
                    bspUserVars[tagName]=val;
                })
            });
            debug_log(JSON.stringify(bspUserVars));
        });
    }
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