$(document).ready(function(){
	var fileCtl = $("#file");
	$("#uploadBtn").click(function(){
		fileCtl.click();
		//创建formdata对象
		var data = new FormData();
		data.append("upfile", fileCtl[0].files[0]);
		//$.ajax({
        //   type : 'post',
        //   url : '#',
        //   data : formdata,
        //   cache : false,
        //   processData : false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
        //   contentType : false, // 不设置Content-type请求头
        //   success : function(){}
        //   error : function(){ }
       })
	})
})