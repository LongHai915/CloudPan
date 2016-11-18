window.onload = function() {
	var unamectl = document.getElementById('username');
	var uemailctl = document.getElementById('email');
	var rpwdctl = document.getElementById('rpwd');
	var pwdctl = document.getElementById("pwd");
	var errCtl = document.getElementById("errmsg");

	var url = 'act/register.php';
	var is_name_valid = false;
	var is_email_valid = false;
	var is_pwd_valid = false;
	var uname = unamectl.value.trim();
	var pname = unamectl.value.trim();
	var uemail = uemailctl.value.trim();
	var upwd = pwdctl.value.trim();
	var upwdr = rpwdctl.value.trim();

	oncallback = function(status, ret) {
		if(ret == null)
			return;
		else if(status == 200) {
			switch(ret['code']) {
				case 0:
					errCtl.innerText = ret['msg'];
					is_name_valid = false;
					break;
				case 1:
					errCtl.innerText = '';
					is_name_valid = true;
					pname = ret['msg'];
					break;
				case 2:
					errCtl.innerText = ret['msg'];
					is_email_valid = false;
					break;
				case 3:
					errCtl.innerText = '';
					is_email_valid = true;
					break;
				case 4:
					errCtl.innerText = ret['msg'];
					break;
				case 5:
					confirm("please sign in.");
					window.location = res['url'];
					break;
			}
		} else if(status == 404) {
			errCtl.innerText = 'login failed: network problem';
			islogin = false;
		}
	}

	onnamechk = function(event) {
		var name_pattern = /^[_A-Za-z]+[_A-Za-z0-9]{5,8}$/;
		uname = unamectl.value.trim();
		if(uname.length == 0) {
			return;
		}
		if(!name_pattern.test(uname)) {
			errCtl.innerHTML = "name must be more than 6, less than 8 characters and start with letters or underscore";
			is_name_valid = false;
			return;
		}

		var list = {};
		list['act'] = "cnm";
		list['kval'] = uname;
		var param = 'param=' + JSON.stringify(list);
		webAJAXquery(url, 'POST', param, oncallback);
	}

	onemailchk = function(event) {
		uemail = uemailctl.value.trim();
		var ret = email_check(uemail);
		if(uemail.length == 0)
			return;
		if(0 == ret['code']) {
			errCtl.innerText = ret['msg'];
			is_email_valid = false;
			return;
		}

		var list = {};
		list['act'] = "cem";
		list['kval'] = uemail;
		var param = 'param=' + JSON.stringify(list);
		webAJAXquery(url, 'POST', param, oncallback);
	}

	onpasswordchk = function(event) {
		upwd = pwdctl.value.trim();
		if(upwd.length == 0)
			return;
		var ret = password_check(upwd);
		if(0 == ret['code']) {
			errCtl.innerText = ret['msg'];
			is_pwd_valid = false;
		} else {
			is_pwd_valid = true;
			errmsg.innerText = '';
		}
	}

	var registerFunc = function(event) {
		upwdr = rpwdctl.value.trim();
		if(uname.length == 0) {
			errCtl.innerText = "please input name";
		} else if(!is_name_valid) {
			errmsg.innerText = 'the name you input is invalid';
		} else if(uemail.length == 0) {
			errCtl.innerText = "please input email";
		} else if(!is_email_valid) {
			errmsg.innerText = 'the email you input is invalid';
		} else if(upwd.length == 0) {
			errCtl.innerText = "please input password";
		} else if(!is_pwd_valid) {
			errmsg.innerText = 'the password you input is invalid';
		} else if(upwdr.length == 0){
			errmsg.innerText = 'please input the confirm password';
		} else if(upwd != upwdr){
			errmsg.innerText = 'Two password you entered must be same, please re-enter';
		} else {
			var list = {};
			list['act'] = 'reg';
			list['knm'] = uname;
			list['kem'] = uemail;
			list['kpw'] = upwd;
			var param = 'param=' + JSON.stringify(list);
			webAJAXquery(url, 'POST', param, oncallback);
		}
	}

	unamectl.addEventListener('blur', onnamechk, false);
	uemailctl.addEventListener('blur', onemailchk, false);
	pwdctl.addEventListener('blur', onpasswordchk, false);
	document.getElementById('registerBtn').addEventListener('click', registerFunc, false);
}