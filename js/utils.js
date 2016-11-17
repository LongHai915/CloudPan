function is_valid(){
	var cooklst = document.cookie;
	var cooks = cooklst.split(";");
	var res = false;
	for(var i=0; i<cooks.length; i++){
		var arr = cooks[i].split('=');
		if('uname' == arr[0] && arr[1].length!=0)
		{
			res = true;
			break;
		}
	}
	return res;
}

function getkey(){
	//document.cookie = "uname=test01; ukey=1;"
	//ukey 前面有个空格
	var cooklst = document.cookie;
	var cooks = cooklst.split(";");
	var res = false;
	for(var i=0; i<cooks.length; i++){
		var arr = cooks[i].split('=');
		if('ukey' == arr[0].trim())
		{
			return arr[1];
		}
	}
	return 0;
}

function createXMLHttpRequest(){

	var xmlHttp;
	if(window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else {
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	return xmlHttp;
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
