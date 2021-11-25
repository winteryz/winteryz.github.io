    //写cookie
    function addCookie(objName,objValue,objDays){
        var str = objName + "=" + escape(objValue);
        if(objDays > 0){
            var date = new Date();
            var ms = objDays*24*3600*1000;
            date.setTime(date.getTime() + ms);
            str += "; expires=" + date.toGMTString();
        }
        if(objDays===Infinity){
            str += "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        }
        str += "; path=/";
        document.cookie = str;
    };
    //获取cookie
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

   //设置cookie
    function setCookie(objName,objValue,no)
    {
      var objValueStr="";
      var cookieOrgArray=getCookie(objName).split(",");
      cookieOrgArray.forEach(function(element,index){
        if(index == no)
        {
          if(index == 0){
            objValueStr+=objValue;
          }else{
            objValueStr+=","+objValue;
          }
        }else{
          if(index == 0){
            objValueStr+=element;
          }else{
            objValueStr+=","+element;
          }
        }
      });
      addCookie(objName,objValueStr,Infinity);
    }
    //获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    //遍历追剧未看的show
    function getHaveNotSeenShow(){
        var returnElement = null;
        var followShowsArray = getCookie("followShows").split(",");
        //element = followShowsArray[0];
        try{
            followShowsArray.forEach(function(element,index){
              var elementArray = getCookie(element).split(",");
              if(elementArray[2] != "" && elementArray[2]!=elementArray[4]){
                  if(confirm("找到已更新的追剧："+elementArray[0]+"("+elementArray[2]+"/"+elementArray[4]+")，是否前去追该剧？")){
                      returnElement = element;
                      throw new Error("找到已更新的追剧："+elementArray[0]);
                  }
              }else{
                if(elementArray[5]!=new Date().getFullYear()+"."+new Date().getMonth()+"."+new Date().getDate())
                {
                  var latestNo = null;
                  //$.get(elementArray[1].split("bf")[0],function(data){latestNo=data.match(/(<small class="newscore">.*<\/small>)/)[0].match(/\d+/)[0]});
                  $.get(elementArray[1].split("bf")[0],function(data){latestNo=data.match(/(target="_blank">.{1,15}<\/a><\/li><\/ul><\/div><\/div><div class=\"cl\"><\/div><\/div><div)/)[0].replace('target="_blank">','').replace('</a></li></ul></div></div><div class="cl"></div></div><div','').replace("��","第").replace("��","集")});
                  console.log("等待获取最新集数...")
                  setTimeout(function(){
                    //if(latestNo != null && parseInt(latestNo) > 0)
                    if(latestNo != null && latestNo != "")
                    {
                        setCookie(element,latestNo,4);
                        setCookie(element,new Date().getFullYear()+"."+new Date().getMonth()+"."+new Date().getDate(),5);
                        if(elementArray[2] != "" && elementArray[2]!=latestNo){//还没开始看的剧是""false不自己追剧
                            if(confirm("找到已更新的追剧："+elementArray[0]+"("+elementArray[2]+"/"+latestNo+")，是否前去追该剧？")){
                                returnElement = element;
                                throw new Error("找到已更新的追剧："+elementArray[0]);
                            }
                        }
                    }
                  },2000);

                }
              }
            });
        }catch(e){console.log(e);}
        return returnElement;
    }
    //点击追剧
    function zj(){
      var zjName=document.location.href.split("/")[document.location.href.split("/").length-2];
      if($("#zj")[0].innerText=="追剧"){
        $("#zj")[0].innerText="已追剧";
        if(getCookie("followShows")==null||getCookie("followShows")==""){addCookie("followShows",zjName,Infinity);}
        else{addCookie("followShows",getCookie("followShows")+","+zjName,Infinity);}
      }else{
        $("#zj")[0].innerText="追剧";
        if(getCookie("followShows").split(",").length==1){addCookie("followShows","",Infinity);}
          else if(getCookie("followShows").split(",")[0]==zjName){addCookie("followShows",getCookie("followShows").replace(zjName+",",""),Infinity);}
          else{addCookie("followShows",getCookie("followShows").replace(","+zjName,""),Infinity);}
      }
    }
    //点击取消追剧
    function qxzj(element) {
      if(getCookie("followShows").split(",").length==1){addCookie("followShows","",Infinity);}
        else if(getCookie("followShows").split(",")[0]==element){addCookie("followShows",getCookie("followShows").replace(element+",",""),Infinity);}
        else{addCookie("followShows",getCookie("followShows").replace(","+element,""),Infinity);}
    }
    //一键追剧
    function onekeyZJ(){
        addCookie("isFollowing",1,0);//仅浏览器进程
        var nextHaveNotSeenShow=getHaveNotSeenShow();
        if(nextHaveNotSeenShow)
        {
          //document.location.href=getCookie(nextHaveNotSeenShow).split(",")[1];
          var pagePath = getCookie(nextHaveNotSeenShow).split(",")[1];
          var pagePathDown = pagePath.split("-")[0]+"-"+pagePath.split("-")[1]+"-"+(parseInt(pagePath.split("-")[2].split(".")[0])+1)+"."+pagePath.split("-")[2].split(".")[1];
          document.location.href=pagePathDown;
        }
    }
    //tqyy主页显示追剧列表
    function reSumarry() {
        if(document.getElementById("sumarry")!=null) {document.getElementById("sumarry").innerHTML="";}
        if(getCookie("followShows") !=null && getCookie("followShows") != ""){
              innerHtmlStr="<div id=\"sumarry\"><font size=\"3\">";
              var followShowsArray = getCookie("followShows").split(",")
              followShowsArray.forEach(function(element){
                followShowsElementArray=getCookie(element).split(",");
                if(followShowsElementArray[2]==""){currentShowStr = "-1";}else{currentShowStr = followShowsElementArray[2];}//当前剧集
                latestShowStr ="<a onclick=\"getLastNo('"+element+"');reSumarry();\">"+followShowsElementArray[4];//最新剧集
                checkoutTimeStr ="<a onclick=\"getLastNo('"+element+"');reSumarry();\">"+followShowsElementArray[5];//更新时间
                showNameStr = "<a href=\""+followShowsElementArray[1] +"\">"+followShowsElementArray[0]+"</a>";//剧集中文名
                cancelZJStr = "<a onclick=\"if(confirm('确定取消追剧？')){qxzj('"+element+"')};reSumarry('"+element+"');\">[x]</a>";//
                innerHtmlStr+=cancelZJStr+"&nbsp;"+checkoutTimeStr+"，"+currentShowStr+"/"+latestShowStr+"，"+showNameStr+"</br>";
              });
              innerHtmlStr+="<a onclick=\"onekeyZJ()\">一键追剧</a></br>";
              innerHtmlStr+="</font></div>";
              document.getElementsByClassName("seek")[0].innerHTML=orgseekHTML+innerHtmlStr;
        }
    }
    //剧外离线ajax获取最新剧集jueshiwuhun
    function getLastNo(element){
      var lastNo;
      //最新集数
      //$.get(getCookie(element).split(",")[1].split("bf")[0],function(data){setCookie(element,data.match(/(<small class="newscore">.*<\/small>)/)[0].match(/\d+/)[0],4)});
      $.get(getCookie(element).split(",")[1].split("bf")[0],function(data){setCookie(element,data.match(/(target="_blank">.{1,15}<\/a><\/li><\/ul><\/div><\/div><div class=\"cl\"><\/div><\/div><div)/)[0].replace('target="_blank">','').replace('</a></li></ul></div></div><div class="cl"></div></div><div','').replace("��","第").replace("��","集"),4)});
      //今天
      setCookie(element,new Date().getFullYear()+"."+new Date().getMonth()+"."+new Date().getDate(),5);
    }
    //动态加载js文件，否则不能在页面上的点击操作使用js函数
    function initJsFunction()
    {
      var myScript= document.createElement("script");
      myScript.type = "text/javascript";
      myScript.src="https://winteryz.github.io/tqyy.js";
      document.body.appendChild(myScript);
      //如果马上使用会找不到，因为还没有加载进来
      //getCookie("followShows");
    }
    //四舍五入取整到10
    function fixNum(num){
      var fixn=Math.floor(num / 10) * 10;
      if(num-fixn>=5.0){fixn+=10}
      return fixn;
    }
