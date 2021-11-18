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
        var followShowsArray = getCookie("followShows").split(",");
        followShowsArray.forEach(function(element,index){
          var elementArray = getCookie(element).split(",");
          if(elementArray[2]<elementArray[4]){
            return elementArray[0];
          }else{
            if(elementArray[5]!=new Date().getFullYear()+"."+new Date().getMonth()+"."+new Date().getDate())
            {
              var latestNo;
              $.get(elementArray[0].split("bf")[0],function(data){latestNo=data.match(/(<small class="newscore">.*<\/small>)/)[0].match(/\d+/)[0]});
              setCookie(element,4,latestNo);
              setCookie(element,5,new Date().getFullYear()+"."+new Date().getMonth()+"."+new Date().getDate());
              if(elementArray[2]<latestNo){
                return elementArray[0];
              }
            }
          }
        });
        return null;
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
    function reSumarry() {
        if(document.getElementById("sumarry")!=null) {document.getElementById("sumarry").innerHTML="";}
        if(getCookie("followShows") !=null && getCookie("followShows") != ""){
              innerHtmlStr="<div id=\"sumarry\"><font size=\"3\">";
              var followShowsArray = getCookie("followShows").split(",")
              followShowsArray.forEach(function(element){
                followShowsElementArray=getCookie(element).split(",");
                if(followShowsElementArray[2]==""){currentShowStr = "0";}else{currentShowStr = followShowsElementArray[2];}//当前剧集
                latestShowStr ="<a onclick=\"getLastNo('"+element+"');reSumarry();\">"+followShowsElementArray[4];//最新剧集
                checkoutTimeStr ="<a onclick=\"getLastNo('"+element+"');reSumarry();\">"+followShowsElementArray[5];//更新时间
                showNameStr = "<a href=\""+followShowsElementArray[1] +"\">"+followShowsElementArray[0]+"</a>";//剧集中文名
                cancelZJStr = "<a onclick=\"if(confirm('确定取消追剧？')){qxzj('"+element+"')};reSumarry('"+element+"');\">[x]</a>";//
                innerHtmlStr+=cancelZJStr+"&nbsp;"+checkoutTimeStr+"，"+currentShowStr+"/"+latestShowStr+"，"+showNameStr+"</br>";
              });
              innerHtmlStr+="</font></div>";
              document.getElementsByClassName("seek")[0].innerHTML=orgseekHTML+innerHtmlStr;
        }
    }
    //剧外离线ajax获取最新剧集jueshiwuhun
    function getLastNo(element){
      var lastNo;
      //最新集数
      $.get(getCookie(element).split(",")[1].split("bf")[0],function(data){setCookie(element,data.match(/(<small class="newscore">.*<\/small>)/)[0].match(/\d+/)[0],4)});
      //今天
      setCookie(element,new Date().getFullYear()+"."+new Date().getMonth()+"."+new Date().getDate(),5);
    }
    //动态加载js文件，否则不能在页面上的点击操作使用js函数
    function initJsFunction()
    {
      var myScript= document.createElement("script");
      myScript.type = "text/javascript";
      myScript.src="http://winteryz.top/tqyy.js";
      document.body.appendChild(myScript);
      //如果马上使用会找不到，因为还没有加载进来
      //getCookie("followShows");
    }