var express = require('express');
var router = express.Router();

function md5(v){
	return require('crypto').createHash('md5').update(v).digest('hex');
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/reg', function (req, res) {
  res.render('user/reg', {title: '注册'});
});
// 注册处理
router.post('/reg', function(req, res, next) {
	var user = req.body;
	if(user.password!=user.repassword){
		req.flash('error','密码不一致');
		return res.redirect('users/reg');
	}
	delete user.repassword;
	user.password=md5(user.password);//密码加密
	user.avatar="https://secure.gravatar.com/avatar/"+md5(user.email)+"?s=48";
	new Model("User")(user).save(function(err,user){
		if(err){
			req.flash('error',err);
			return res.redirect('/users/reg');
		}
		req.session.user=user;
		res.redirect('/');
	}) 
});
// 登录页面
router.get('/login', function(req, res, next) {
  res.render('user/login',{title:'登录'});
});
// 登录处理
router.post('/login', function(req, res, next) {
	var user = req.body;
	user.password=md5(user.password);
	Model('User').findOne(user,function(err,user){
		if(err){
			req.flash('error',err);
			return res.redirect('/users/login');
		}else{
			req.session.user=user;
			res.redirect('/');
		}
		
	})
});
// 退出处理
router.get('/logout', function(req, res, next) {
	req.session.user=null;
	res.redirect('/');
});


module.exports = router;
