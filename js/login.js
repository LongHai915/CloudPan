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
		url = url +'?act=login';
		url = url + '&kid=' + name.value.trim() + '&kval=' + passwd.value.trim();
		xmlHttp.open('GET', url, true);
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState==4 && xmlHttp.status==200){
				res = xmlHttp.responseText;
				res = eval('('+res+')');
				if(res['code']==1){
					window.location = res['url'];
				}
				else{
					errmsg.innerText = res['msg'];
				}
			}
			else if(xmlHttp.status==404){
				errmsg.innerText = 'login failed: network problem';
			}
		}
		xmlHttp.send();
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

