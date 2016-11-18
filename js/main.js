window.onload = function() {
	var key = getValFromCookie('ukey');
	if(0 == key){
		window.location = "/cloudpan/index.html";
		return;
	} else if (key.length == 0){
		window.location = "/cloudpan/index.html";
		return;
	}

	// 获取当前时间戳(以s为单位)
	//var timestamp = Date.parse(new Date());
	//timestamp = timestamp / 1000;
	$('#uploadDiv').uploadAdapter({
		auto: true,
		buttonText: 'SELECT FILE',
		fileObjName: 'ufile',
		fileTypeExts: '*.pdf;*cpp',
		method: "POST",
		multi: true,
		formData: {
			key: 'adgjl',
			key2: '156347'
		},
		swf:'../uploadAdapter/uploadify.swf',
		fileSizeLimit: 1024000,
		showUploadedPercent: true, //是否实时显示上传的百分比，如20%
		showUploadedSize: true,
		removeCompleted: true, //上传完成自动删除
		removeTimeout: 10, //上传完成到删除的间隔时间
		//checkExisting: '/cloudpan/act/check-exists.php',
		uploader: '/cloudpan/act/upload.php',
		onUploadSuccess:function(file, data, response){
			var list={};
			list['fname'] = file.name;
			var size = file.size / 1024;			
			list['fsize'] = size;
			var arr = new Array();
			arr[0] = list;
			addtofilelist(arr);
		}
	});
	
	var bgDiv = document.createElement('div');
	var popUp = document.getElementById("uploadDiv");
	showuploaddialog = function (){		
		popUp.style.top = "100px";
		var bwid = document.body.clientWidth;
		var vleft = (bwid - 620)/2;
		popUp.style.left = vleft + "px";
		popUp.style.width = "620px";
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
	loadDirsAndFiles();
}

function closepopup(){
	var popUp = document.getElementById("uploadDiv");
	popUp.style.visibility = "hidden";
	var bgdiv = document.getElementById('bgDiv');
	document.body.removeChild(bgdiv);
}

function addtofilelist(data){
	var len = data.length;
	var divObj = document.getElementById("listdiv");
	
	//check whether the file is directory or not
	var is_dir = false;
	if(len > 0 
		&& data[0]['fsize']==null)
		is_dir = true;
		
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
			anm.href = "javascript:loadDirsAndFiles("+data[0]['did']+");";
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
		var span3 = document.createElement("div");
		span3.className = 'span1';
		if(is_dir) {
			span3.innerHTML = '-';
		} else {
			var size = data[i]['fsize'];
			if(size > 1024){
				size = size/1024;
				size = '<small>' + size.toFixed(2) + 'MB</small>';
			}else{
				size = '<small>' + size + 'KB</small>';
			}
			span3.innerHTML = size;
		}
		row.appendChild(span9);
		row.appendChild(span3);
		divObj.appendChild(row);
	}
}

function loadDirsAndFiles(pid = 0){
	var url = '../act/loadDocuments.php';
	var list={};
	list['pid']=pid;
	list['uid']=getValFromCookie('ukey');
	//load directories
	list['code']=0;
	var param = 'param='+JSON.stringify(list);
	webAJAXquery(url, 'POST', param, onloadcallback);
	//load files
	list['code']=1;
	var param = 'param='+JSON.stringify(list);
	webAJAXquery(url, 'POST', param, onloadcallback);
}