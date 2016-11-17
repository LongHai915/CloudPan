window.onload = function(){
	var cooklst = document.cookie;
	var cooks = cooklst.split(";");
	for(var i=0; i<cooks.length; i++){
		var arr = cooks[i].split('=');
		if('uname' == arr[0] 
			&& arr[1].length!=0){
			window.location = "html/main.html";
			break;
		}
	}
	
	var xmlHttp;
	if(window.XMLHttpRequest){
		//code for IE7+, Firefox, Chrome, Safari, Opera
		xmlHttp = new XMLHttpRequest();
	}else{
		//code for IE6, IE5
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	var unamectl=document.getElementById('username');	
	var uemailctl=document.getElementById('email');
	var rpwdctl=document.getElementById('rpwd');
	var pwdctl = document.getElementById("pwd");
	var registerctl=document.getElementById('registerBtn');
	
	var url= 'act/register.php';
	var uname = null;
	var pname = null;
	var uemail = null;
	var upwd = null;
	var upwdr = null;
	var isNmExists = false;
	var isNmChk = false;
	var emailChk = function (event){
		if(isNmExists){
			unamectl.focus();
			return false;
		}
		uemail = uemailctl.value.trim();
		var email_pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*\w{1,}$/;
		if(uemail.length == 0){
			errmsg.innerText = 'please input email address';
			uemailctl.focus();
			return false;
		}
		else if(!email_pattern.test(uemail)){
			errmsg.innerText = 'please input valid email address';
			uemailctl.focus();
			return false;
		}
		errmsg.innerText="";
		return true;
	}
	
	var pwdChk = function (event) {
		if(isNmExists){
			unamectl.focus();
			return false;
		}
		upwd = pwdctl.value.trim();
		upwdr = rpwdctl.value.trim();
		
		if(upwd.length == 0){
			errmsg.innerText = 'please input password';
			passwdctl.focus();
			return false;
		}
		else if(upwdr.length == 0){
			errmsg.innerText = 'please input password again';
			rpasswd.focus();
			return false;
		}
		else if(upwd!=upwdr){
			errmsg.innerText = 'Two password you entered must be same, please re-enter';
			passwdctl.focus();
			return false;
		}
		errmsg.innerText="";
		return true;
	}
	
	var registerFunc = function (event) {
		uname = unamectl.value.trim();
		var res=""; 
		if(uname.length == 0){
			errmsg.innerText = "please input user name";
			unamectl.focus();
			return;
		}
		else if(!isNmChk || isNmExists){
			chkExistsFunc();
			if(isNmExists){
				errmsg.innerText = "";
				unamectl.focus();
				return;
			}	
		}
		else if(!emailChk())
			return;
		else if(!pwdChk())
			return;
		
		xmlHttp.open('POST', url, true);
		//post请求时才需要下面的代码
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8"); 
		var list={};
		list['act'] = 'reg';
		list['knm'] = uname;
		list['kem'] = uemail;
		list['kpw'] = upwd;
		var param ='param='+JSON.stringify(list);
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState==4 && xmlHttp.status==200){
				res = xmlHttp.responseText;
				res = eval('('+res+')');
				
				if(res['code']===1){
					confirm("please sign in.");
					window.location = res['url'];
				}
				else{
					errmsg.innerText = res['msg'];
				}
			}
			else if(xmlHttp.status==404){
				errmsg.innerText = 'register failed: network problem';
			}
		}
		xmlHttp.send(param);
	}
	
	var chkExistsFunc = function (event) {
		var uname = unamectl.value.trim();
		var res="";
		isNmChk = true;
		if(uname.length == 0)
			return;
		else if(uname == pname)//no modify, no check
			return;
	
		xmlHttp.open('POST', url, true);
		var list = {};
		list['act'] = "chkun";
		list['kval'] = uname;
		var param = 'param='+JSON.stringify(list);
		//post请求时才需要下面的代码
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8"); 
		xmlHttp.onreadystatechange = function () {
			if(xmlHttp.readyState==4 && xmlHttp.status==200){
				res = xmlHttp.responseText;
				res = eval('('+res+')');
				if(res['code']==0){
					errmsg.innerText = res['msg'];
					isNmExists = true;
					//unamectl.focus();
					pname = unamectl.value.trim(); //exists then save the input
				}
				else if(isNmExists && res['code']!=0){
					errmsg.innerText = "";
					isNmExists = false;
				}
			}
		}
		xmlHttp.send(param);
	}
	
	registerctl.addEventListener('click', registerFunc, false);
	unamectl.addEventListener('blur', chkExistsFunc, false);
	uemailctl.addEventListener('blur', emailChk, false)
	rpwdctl.addEventListener('blur', pwdChk, false)
}