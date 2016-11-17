window.onload = function(){
	var xmlHttp;
	if(window.XMLHttpRequest){
		//code for IE7+, Firefox, Chrome, Safari, Opera
		xmlHttp = new XMLHttpRequest();
	}else{
		//code for IE6, IE5
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	var islogin=false;
	var loginFun = function (event) {
		var res = null;
		var errmsg = document.getElementById('errmsg');
		var name = document.getElementById('uName');
		var passwd = document.getElementById('uPwd');
		//var email_pattern = new RegExp('^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$');
		//var email_pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*\w{1,}$/;
		if(islogin){
			return;
		}
		if(name.value.trim().length == 0){
			errmsg.innerText = 'please input user name';
			return;
		}
		//else if(!email_pattern.test(email.value)){
		//	errmsg.innerText = 'please input valid email address';
		//	return;
		//}
		else if(passwd.value.trim().length == 0){
			errmsg.innerText = 'please input password';
			return;
		}
		islogin = true;
		var url = 'act/login.php';
		var list = {};
		list['act'] = 'login';
		list['kid'] = name.value.trim();
		list['kval'] = passwd.value.trim();
		var param = 'param='+JSON.stringify(list);
		xmlHttp.open('POST', url, true);
		//post请求时才需要下面的代码
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8"); 
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState==4 && xmlHttp.status==200){
				res = xmlHttp.responseText;
				//errmsg.innerText = xmlHttp.responseText;
				res = eval('('+res+')');
				if(res['code']===0){
					errmsg.innerText = res['msg'];
				}
				else{
					document.cookie = "uname="+ escape(name.value.trim());
					document.cookie = "ukey=" + escape(res['code']);
					window.location = res['url'];
					//var date = new Date();
					//date.setTime(date.getTime() +  10*60*1000);
					//document.cookie = "uname=" + escape(name.value.trim())+";expires="+date.toGMTString();	
				}
			}
			else if(xmlHttp.status==404){
				errmsg.innerText = 'login failed: network problem';
			}
		}
		xmlHttp.send(param);
	}
	var registerFun = function (event) {
		//alert("register function");
		window.location.href = "register.html";
	}	
	document.getElementById('loginBtn').addEventListener('click', loginFun, false);
	var alist = document.getElementsByTagName('a');
	var i=0;
	while(alist[i])
	{
		if('Register' == alist[i].innerText){
			alist[i].addEventListener('click', registerFun, false);
			break;
		}
		i++;
	}
}

