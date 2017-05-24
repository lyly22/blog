var express = require('express');
var router = express.Router();

// 发布文章页面
router.get('/add', function(req, res, next) {
  res.render('article/add',{title:'发文章'});
});
// 发布文章处理
router.post('/add', function(req, res, next) {
	req.body.user = req.session.user._id;
	new Model('Article')(req.body).save(function(err,article){
		if(err){
			req.flash('error','发布失败');
			return res.redirect('/articles/add');
		}
		req.flash('success','发表成功');
		res.redirect('/');
	})
});

module.exports = router;
