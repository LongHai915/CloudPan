window.onload = function(){
	
	var islogin=false;
	var errCtl = document.getElementById('errmsg');
	var nameCtl = document.getElementById('uName');
	var passwdCtl = document.getElementById('uPwd');
	
	var loginFun = function (event) {
		//登录验证未完成之前登录的第二次单击事件进行响应
		if(islogin){
			return;
		}
		
		var name = nameCtl.value.trim();
		var passwd = passwdCtl.value.trim();
		if(name.length == 0){
			errCtl.innerHTML = "please input your name";
			return;
		}
		if(passwd.length == 0){
			errCtl.innerHTML = 'please input your password';
			return;
		}
		islogin = true;
		
		var url = 'act/login.php';
		var list = {};
		list['act'] = 'login';
		list['kid'] = name;
		list['kval'] = passwd;
		var param = 'param='+JSON.stringify(list);
		webAJAXquery(url, 'POST', param, onlogincallback);
	}
	onlogincallback = function(status, ret){
		if(ret == null)
			return;
		else if(status == 200) {
			if(ret['code'] == 0){
				errCtl.innerText = ret['msg'];
				islogin = false;
			} else {
				document.cookie = "uname="+ escape(ret['uname']);
				document.cookie = "ukey=" + escape(ret['code']);
				window.location = ret['url'];
			}
		} else if(status==404){
			errCtl.innerText = 'login failed: network problem';
			islogin = false;
		}
	}
	var registerFun = function (event) {
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

