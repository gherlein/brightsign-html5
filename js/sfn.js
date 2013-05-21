
function getAutoPlay(bsp,callback)
{
    //console.log("getAutoPlayURL");
    bsp.callback=callback;
    readCurrentSyncFileList(bsp.syncfile,getAutoPlayFile,bsp);
}


function readCurrentSyncFileList(sUrl,callnext,bsp)
{
    //console.log("doCurrentSyncFileList");
   $.get(sUrl,function(data,status,jqXHR)
   { 
        un=jqXHR.responseText;

        xmlDoc = $.parseXML( un );
        $xml = $( xmlDoc );

        var syncFileList= new Array();

        $xml.find('files').each(function(){
            $(this).children().each(function(){
                var name =$(this).find("name").text();
                var size =$(this).find("size").text();
                var hash =$(this).find("hash").text();
                var link =$(this).find("link").text();
                var fileobj= new syncFileObj(name,size,hash,link);
                syncFileList.push(fileobj);
            });
        });
        bsp.syncFileList=syncFileList;

        //printObj(bsp.syncFileList);
        callnext(bsp);
    });
}

function syncFileObj(name,size,hash,link)
{
    this.name=name;
    this.size=size;
    this.hash=hash;
    this.link=link;
}


function findAutoplayFile(bsp)
{
    console.log("findAutoplayFile");
    for(var x=0;x<bsp.syncFileList.length;x++)
    {
        nRet=bsp.syncFileList[x].name.indexOf("autoplay");
        if(nRet>=0)
        {
            bsp.autoplayURL=bsp.syncFileList[x].link;
        }
    }
}


function getAutoPlayFile(bsp,callnext)
{

   findAutoplayFile(bsp);
   printObj(bsp.autoplayURL);
   $.get(bsp.autoplayURL,function(data,status,jqXHR)
   { 
        un=jqXHR.responseText;
        bsp.autoplayXML=un;

        xmlDoc = $.parseXML( un );
        $xml = $( xmlDoc );

        var zoneList= new Array();

        $xml.find('zones').each(function(){
            $(this).children(":first").each(function(){

                console.log("{"+$(this).text()+"}");

                var name =$(this).find("name").text();
                var s="["+name+"]";
                console.log(s);
                var x =$(this).find("x").text();
                var y =$(this).find("hash").text();
                var width=$(this).find("link").text();
                var height=$(this).find("link").text();
                var type=$(this).find("link").text();
                var id=$(this).find("link").text();
                var zone= new zoneObj(name,x,y,width,height,type,id);
                zoneList.push(zoneObj);
            });
        });
        bsp.zones=zoneList;
//        printObj(bsp.autoplayXML);
        printObj(bsp.zones);
    });

}


function zoneObj(name,x,y,width,height,type,id)
{
    this.name=name;
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.type=type;
    this.id=id;
}



