function createXMLHttpRequest(){
	var xmlHttp;
	if(window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else {
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	return xmlHttp;
}

function webAJAXquery(url, type, param, onreadystatechangeFunc){
	var xmlHttp = createXMLHttpRequest();
	xmlHttp.open(type, url, true);
	if('POST' == type)
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
	xmlHttp.onreadystatechange = function(){
		var ret;
		var status=xmlHttp.status;
		if(xmlHttp.readyState == 4 
			&& xmlHttp.status == 200){
			var res = xmlHttp.responseText;
			ret = eval('(' + res + ')');
			status = 200;
		}
		onreadystatechangeFunc(status, ret);
	};
//	xmlHttp.onreadystatechange = onreadystatechangeFunc(xmlHttp); xmlHttp cannot pass
	xmlHttp.send(param);
}

function getValFromCookie(key){
	var cookies = document.cookie;
	var arrays = cookies.split(';');
	for(var i=0; i<arrays.length; i++){
		var arr = arrays[i].split('=');
		if(key == arr[0].trim()){
			val = arr[1].trim();
			return val;
		}
	}
	return 0;
}

function email_check (email) {
	var email_pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*\w{1,}$/;
	var res={};
	res['code']=1;
	res['msg']='';
	if(email.trim().length == 0)
	{
		res['code'] = 0;
		res['msg'] = 'please input email address';
	}
	else if(!email_pattern.test(email)){
		res['code'] = 0;
		res['msg'] = 'please input valid email address';
	}
	return res;
}

function password_check(passwd){
	var pwd_pattern = /^[_A-Za-z0-9]{5,}$/;
	var res={};
	res['code']=1;
	res['msg']='';
	if(passwd.trim().length == 0){
		res['code'] = 0;
		res['msg'] = 'please input your password';
	} else if(!pwd_pattern.test(passwd)){
		res['code'] = 0;
		res['msg'] = 'password must be more than 6 charactes and only contains letters or underscore or number';
	}
	return res;
}

