window.onload = function () {
	var xmlHttp;
	if(window.XMLHttpRequest){
		xmlHttp = new XMLHttpRequest();
	}
	else{
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	var filectl = document.getElementById("file");
	var condiv = $(".list-row");
	
	//支持ie，firefox google不支持
	browserfolder = function () {
		try {  
        var Message = "\u8bf7\u9009\u62e9\u6587\u4ef6\u5939";  //选择框提示信息  
        var Shell = new ActiveXObject("Shell.Application");  
        //var Folder = Shell.BrowseForFolder(0, Message, 64, 17);//起始目录为：我的电脑  
        var Folder = Shell.BrowseForFolder(0,Message,0); //起始目录为：桌面  
        if (Folder != null) {  
            Folder = Folder.items();  // 返回 FolderItems 对象  
            Folder = Folder.item();  // 返回 Folderitem 对象  
            Folder = Folder.Path;   // 返回路径  
            if (Folder.charAt(Folder.length - 1) != "\\") {  
                Folder = Folder + "\\";  
            }  
            document.getElementById(path).value = Folder;  
            return Folder;  
        }  
    }  
    catch (e) {  
        alert(e.message);  
    }  
	}
	
	function GetFiles (param) {
		$.ajax({
			type:"post",
			url:"",
			async:true,
			dataType:"JSON",
			success:function(data){
				//loaddata(data);
			},
			error:function(){
				condiv.innerHTML = "<div class='row-fluid'><small>load file list failed.</small></div>";
			}
			
		});
	}
 
	onuploadfile = function(event){
		filectl.click();
		var data = new FormData();
		data.append('ufile', filectl.files[0]);
		data.append("acttime",new Date().toString());    //本人喜欢在参数中添加时间戳，防止缓存（--、）
		var url = 'act/upload.php';
		xmlHttp.open('POST', '../act/upload.php', true);
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState==4 || xmlHttp.status==200){
				var result = xmlHttp.responseText;
				alert(result);
				result = eval('('+result+')');
				if(result['code'] == 1){
					//上传成功之后，添加到文件列表最下端
				}
				else{
					//弹出错误消息
				}
			}
		}
		
		xmlHttp.upload.onprogress = function(event){
			if (event.lengthComputable) {
                    var percentComplete = Math.round(event.loaded * 100 / event.total);
                    document.getElementById('progress').value = percentComplete;
                    //document.getElementById('progressNumber').style.width = percentComplete + "%";
                }
		}
		
		xmlHttp.send(data);
	}
	
	
	document.getElementById('uploadBtn').addEventListener('click', browserfolder, false);
}