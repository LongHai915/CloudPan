window.onload = function() {
	var key = getValFromCookie('ukey');
	if(0 == key){
		window.location = "/cloudpan/index.html";
		return;
	} else if (key.length == 0){
		window.location = "/cloudpan/index.html";
		return;
	}

	var bPub = 0;
	// 获取当前时间戳(以s为单位)
	//var timestamp = Date.parse(new Date());
	//timestamp = timestamp / 1000;
	$('#uploadDiv').uploadify({
		auto: true,
		buttonText: 'SELECT FILE',
		fileObjName: 'ufile',
		fileTypeExts: '*.pdf;*cpp',
		method: "POST",
		multi: true,
//		formData: {
//			key: bPub
//		},
		swf:'../uploadify/uploadify.swf',
		fileSizeLimit: 1024000,
		showUploadedPercent: true, //是否实时显示上传的百分比，如20%
		showUploadedSize: true,
		removeCompleted: true, //上传完成自动删除
		removeTimeout: 5, //上传完成到删除的间隔时间
		//checkExisting: '/cloudpan/act/check-exists.php',
		uploader: '/cloudpan/act/upload.php',
		onUploadStart:function(file){
			console.log("on upload start.");
			var param={};
			param['key'] = document.getElementById("bPublic").checked ? 1 : 0;
			$('#uploadDiv').uploadify("settings", "formData", param);
		},
		onUploadSuccess:function(file, data, response){
			console.log("on upload complete.");
			var list={};
			list['fname'] = file.name;
			var size = file.size / 1024;			
			list['fsize'] = size;
			var arr = new Array();
			arr[0] = list;
			arr['count'] = 1;
			data = eval('(' + data + ')');
			arr['type'] = data['msg'];
			addtofilelist(arr);
		},
		onUploadError(file, errorCode, errorMsg, errorString)	
		{
			console.log("on upload error: " + errorMsg);
		}
	});
	
	var bgDiv = document.createElement('div');
	var popUp = document.getElementById("showPub");
	showuploaddialog = function (){		
		popUp.style.top = "100px";
		var bwid = document.body.clientWidth;
		var vleft = (bwid - 620)/2;
		popUp.style.left = vleft + "px";
		popUp.style.width = "420px";
		popUp.style.minHeight = "50px";
		popUp.style.height = "auto";
		popUp.style.visibility = "visible";
		popUp.style.opacity = "0.9";
		popUp.style.filter = "Alpha(opacity=70)";
		popUp.style.zIndex = 101;
		//背景层加入页面
		var vHei = document.body.clientHeight;
		bgDiv.id = 'bgDiv';
		bgDiv.style.left = 0;
		bgDiv.style.top = 0;
		bgDiv.style.width="100%";
		bgDiv.style.height=vHei+"px";
		//bgDiv.style.height="100%";
		bgDiv.style.position="absolute"; 
		bgDiv.style.opacity = "0.6";
		//bgDiv.style.filter = "Alpha(opacity=70)";
		bgDiv.style.zIndex = 100;
		bgDiv.style.display="block";
		document.body.appendChild(bgDiv);
		document.body.style.overflow = "hidden"; //取消滚动条
		
		//默认存储为公共文件
	}
	
	onloadcallback = function(status, ret){
		if(ret == null)
			return;
		else if(status == 200) {
			if(ret['code'] == 0){
				alert(ret['msg']);
				return;
			}
			addtofilelist(ret);
		} else if(status==404){
			Alert("network problem, please try to refresh");
		}
	}
	document.getElementById('uploadBtn').addEventListener('click', showuploaddialog, false);
//	document.getElementById('bPublic').addEventListener('click', changefileflag, false);
	loadDirsAndFiles(0);
}

function closepopup(){
	var popUp = document.getElementById("showPub");
	popUp.style.visibility = "hidden";
	var bgdiv = document.getElementById('bgDiv');
	document.body.removeChild(bgdiv);
}

function addtofilelist(data){
	var len = data['count'];
	var divObj = document.getElementById("listdiv");
	
	//check whether the file is directory or not
	var is_dir = false;
	var is_private = false;
//	if(len > 0 
//		&& data[0]['fsize']==null)
//		is_dir = true;
	if(data['type']=='0'){
		is_dir = true;
		is_private = true;
	}
		
	if(data['type']=='1')
		is_private = true;
		
	for(var i=0; i<len; i++){
		var sp = document.createElement("span");
		if(is_dir){
			sp.className = "icon iconfont icon-iconfontcolor52";
		} else {
			sp.className = "icon iconfont icon-iconfontcolor50";
		}
		var anm = document.createElement("a");
		if(is_dir){
			anm.innerHTML = '&nbsp'+data[i]['dname'];
			anm.href = "javascript:loadPriFiles("+data[0]['did']+", 1);";
		} else {
			anm.innerHTML = '&nbsp'+data[i]['fname'];
			anm.href = "/cloudpan/files/"+data[i]['fname'];
			anm.target = '_blank';
		}
		var span9 = document.createElement("div");
		span9.className = 'span9';
		span9.appendChild(sp);
		span9.appendChild(anm);
		var row = document.createElement('div');
		row.className = 'row-fluid';
		row.style.borderTop = '1px solid white';
		var span1 = document.createElement("div");
		span1.className = 'span1';
		if(is_dir) {
			span1.innerHTML = '-';
		} else {
			var size = data[i]['fsize'];
			if(size > 1024){
				size = size/1024;
				size = '<small>' + size.toFixed(2) + 'MB</small>';
			}else{
				size = '<small>' + size + 'KB</small>';
			}
			span1.innerHTML = size;
		}
		var span2 = document.createElement("div");
		span2.className="span2";
		span2.innerHTML="<i>PUB</i>";
		if(is_private)
			span2.innerHTML="<b>PRI</b>";
		row.appendChild(span9);
		row.appendChild(span1);
		row.appendChild(span2);
		divObj.appendChild(row);
	}
}

function loadDirsAndFiles(pid){
	
	loadPubFiles(0);
	loadPriFiles(pid, 0);
}

function loadPriFiles(pid, type)
{
	if(type == 1){
		document.getElementById("listdiv").innerHTML = "";
	}
	var url = '../act/loadDocuments.php';
	var list={};
	list['pid']=pid;
	list['uid']=getValFromCookie('ukey');
	//directories
	list['code']=0;
	var param = 'param='+JSON.stringify(list);
	webAJAXquery(url, 'POST', param, onloadcallback);
	
	//private files
	list['code']=1;
	var param = 'param='+JSON.stringify(list);
	webAJAXquery(url, 'POST', param, onloadcallback);
}

function loadPubFiles (type) {
	if(type == 1){
		document.getElementById("listdiv").innerHTML = "";
	}
	var url = '../act/loadDocuments.php';
	var list={};
	list['pid']=0;
	list['uid']=getValFromCookie('ukey');
	// public files
	list['code']=2;
	var param = 'param='+JSON.stringify(list);
	webAJAXquery(url, 'POST', param, onloadcallback);
}
