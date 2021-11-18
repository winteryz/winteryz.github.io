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
      myScript.src="https://winteryz.github.io/tqyy.js";
      document.body.appendChild(myScript);
      //如果马上使用会找不到，因为还没有加载进来
      //getCookie("followShows");
    }
    
    
    //初始化
    //if(getCookie("followShows")==null)
    
    //延时启动
    setTimeout(function(){
        initJsFunction();
        //当在tqyy首页时，
        if(document.location.href == "https://www.tqyy.cc/")
        {
           orgseekHTML=document.getElementsByClassName("seek")[0].innerHTML;
          //弹窗询问是否跳转继续播放，如果不继续播放，就显示追剧一览表
          //if(getCookie("lastVideo") != null && getCookie("lastVideo").split("bf").length == 2){
          if (getCookie("lastVideo") != null && confirm("是否继续播放\n"+getCookie("lastVideo"))) 
          {
              window.location.href=getCookie("lastVideo");
          }else{
              reSumarry();
          }
        }
        
        //当在剧集首页时
        if(document.getElementsByClassName("update").length>0)
        {
          //剧集英文名
          var showEnglishName = document.location.href.split("/")[document.location.href.split("/").length-2];
          //把当前页面相关内容写到cookie
          if(getCookie(showEnglishName) == null)
          {
            addCookie(showEnglishName,document.getElementsByTagName("h2")[document.getElementsByTagName("h2").length-1].innerText+","+document.location.href+",,,"
              +document.getElementsByClassName("update")[document.getElementsByClassName("update").length-1].innerText.match(/[0-9]+/)[0]+","
              +new Date().getFullYear()+"."+new Date().getMonth()+"."+new Date().getDate()+",120,60",Infinity);
          }else{
            //最新集数
            setCookie(showEnglishName,document.getElementsByClassName("update")[document.getElementsByClassName("update").length-1].innerText.match(/[0-9]+/)[0],4);
            //今天
            setCookie(showEnglishName,new Date().getFullYear()+"."+new Date().getMonth()+"."+new Date().getDate(),5);
          }//显示追剧按键
          if(getCookie(showEnglishName)!=null && getCookie("followShows")!=null && getCookie("followShows").match(new RegExp("("+showEnglishName+")"))){
            document.getElementsByClassName("pdetail")[0].innerHTML="<a id='zj' onclick=\"zj()\">已追剧</a>"+document.getElementsByClassName("pdetail")[0].innerHTML;
          }else{
            document.getElementsByClassName("pdetail")[0].innerHTML="<a id='zj' onclick=\"zj()\">追剧</a>"+document.getElementsByClassName("pdetail")[0].innerHTML;
          }
          //显示片头片尾设置
          document.getElementsByClassName("pdetail")[0].innerHTML='跳过片尾<select id="skipbackward" onchange="setCookie(document.location.href.split(\'/\')[document.location.href.split(\'/\').length-2],document.getElementById(\'skipbackward\').value,7)"><option>30</option><option>45</option><option selected="selected">60</option><option>75</option><option>90</option><option>120</option><option>150</option></select></br>'+document.getElementsByClassName("pdetail")[0].innerHTML;
          document.getElementsByClassName("pdetail")[0].innerHTML='跳过片头<select id="skipforward" onchange="setCookie(document.location.href.split(\'/\')[document.location.href.split(\'/\').length-2],document.getElementById(\'skipforward\').value,6)"><option>30</option><option>60</option><option>90</option><option selected="selected">120</option><option>150</option><option>180</option></select>'+document.getElementsByClassName("pdetail")[0].innerHTML;
          //如果有当前剧集数与当前剧集时间戳，且当前剧集与当前页面获取到的最新集不一样，就弹窗提示是否继续观看。
          if(getCookie(showEnglishName)!=null && getCookie(showEnglishName).split(",")[2] != "")
          {
            if (confirm("是否继续播放第"+getCookie(showEnglishName).split(",")[2]+"集")) {window.location.href=getCookie(showEnglishName).split(",")[1];}
          }
        }
        
        //当在tqyy播放界面时，记录cookie
        if(document.domain == "www.tqyy.cc" && document.location.href.split("bf").length == 2){
            var showEnglishName = document.location.href.split("/")[document.location.href.split("/").length-2];
            //把当前页面相关内容写到cookie
            if(getCookie(showEnglishName) == null)
            {
              addCookie(showEnglishName,xTitle+","+document.location.href+","+document.location.href.split("-")[2].split(".")[0]+",,"
                +document.getElementsByClassName("m_r_10")[document.getElementsByClassName("m_r_10").length-1].innerText.match(/[0-9]+/)[document.getElementsByClassName("m_r_10")[document.getElementsByClassName("m_r_10").length-1].innerText.match(/[0-9]+/).length-1]+","
                +new Date().getFullYear()+"."+new Date().getMonth()+"."+new Date().getDate()+",120,60,Infinity");
            }else{
              //中文名
              setCookie(showEnglishName,xTitle,0);
              //当前剧集数地址
              setCookie(showEnglishName,document.location.href,1);
              //当前剧集数
              setCookie(showEnglishName,document.location.href.split("-")[2].split(".")[0],2);
              //最新集数
              setCookie(showEnglishName,document.getElementsByClassName("m_r_10")[document.getElementsByClassName("m_r_10").length-1].innerText.match(/[0-9]+/)[document.getElementsByClassName("m_r_10")[document.getElementsByClassName("m_r_10").length-1].innerText.match(/[0-9]+/).length-1],4);
              //今天
              setCookie(showEnglishName,new Date().getFullYear()+"."+new Date().getMonth()+"."+new Date().getDate(),5);
            }
            //记录当前剧集地址到lastVideo,cookie
            addCookie("lastVideo",document.location.href,Infinity);
        }
        
        //当在tqyy播放界面时，跳转到纯播放器界面
        if(document.domain == "www.tqyy.cc" && document.location.href.split("bf").length == 2){
          setTimeout(function(){
            document.location.href=document.getElementById("xplayer").contentWindow.document.getElementById("viframe").contentWindow.document.getElementById("ifr").contentWindow.document.getElementsByTagName("iframe")[0].src+"&skipTimeStart="+getCookie(showEnglishName).split(",")[6]+"&skipTimeEnd="+getCookie(showEnglishName).split(",")[7]+"&continuePlayTime="+getCookie(showEnglishName).split(",")[2];
          },1000);
        }
        
        //当在yousmart纯播放器界面时
        if(document.domain == "tl.yousmart.com.cn"){
          //获取播放器对象
          var videoElement = document.getElementsByClassName("dplayer-video dplayer-video-current")[0];
          //监听事件，如果播放完成就跳转到下一集(从上一页过来的，作为依据)
          videoElement.addEventListener("ended",function(){document.location.href=document.referrer.split("-")[0]+"-"+document.referrer.split("-")[1]+"-"+(parseInt(document.referrer.split("-")[2].split(".")[0])+1)+"."+document.referrer.split("-")[2].split(".")[1];})
          //在循环前定义好continuePLay和startPlay
          var continuePLay = null;
          if(getCookie("lastYousmartVideo") ==null || getCookie("lastYousmartVideo")!=document.location.href){continuePLay=0;}//如果不符合就不要继续播放
          var startPlay = null;
          //监听，跳过片尾
          setInterval(function(){
            if(getQueryString("skipTimeEnd")!=null){
              if(videoElement.currentTime > videoElement.duration - getQueryString("skipTimeEnd")) {
                console.log("跳过片尾");
                videoElement.currentTime = videoElement.duration;
              }
            }
          //videoElement.play();
          //当回到上次播放页且时间在中间时，询问是否继续播放
          if(continuePLay==null && getCookie("lastYousmartVideo")==document.location.href && getCookie("lastPlayTimeStamp") != null && getCookie("lastPlayTimeStamp") > 60 && getCookie("lastPlayTimeStamp") < videoElement.duration-30){
            continuePLay = confirm("是否继续播放\n"+getCookie("lastPlayTimeStamp"));
            if (continuePLay) {videoElement.currentTime = getCookie("lastPlayTimeStamp");}
          }else{continuePLay=0;}
          //跳过片头
          if(getQueryString("skipTimeStart")!=null && startPlay == null){
            if(videoElement.currentTime < getQueryString("skipTimeStart")) {
              console.log("跳过片头");
              videoElement.currentTime = getQueryString("skipTimeStart");
              startPlay=true;
            }
          } 
          //每5秒记录一次时间
          addCookie("lastPlayTimeStamp",videoElement.currentTime,Infinity);
          },5000)
          //记录当前视频为最后观看的视频
          addCookie("lastYousmartVideo",document.location.href,Infinity);
        }
        
        //当yousmart纯播放器跳到404时表示已经播放完了
        if(document.title == "没有找到您想访问的页面 404错误" && getCookie("isFollowing") == 1)
        {
          //遍历下一个
          var nextHaveNotSeenShow=getHaveNotSeenShow();
          if(nextHaveNotSeenShow)
          {
            document.location.href=getCookie(nextHaveNotSeenShow).split(",")[1];
          }
        }
        
        
      },2000);



