var mongodb = require('./db'),
	crypto = require('crypto');

function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};

module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
	//要存入数据库的用户文档
	var md5 = crypto.createHash('md5'),
		email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
		head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=220",
		date = new Date(),
		time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
			date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
	//要存入数据库的用户信息文档
		user = {
			name: this.name,
			password: this.password,
			email: this.email,
			head: head,
			time: time,
			posts: 0
		};
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
		  return callback(err);//错误，返回 err 信息
		}
		//读取 users 集合
		db.collection('users', function (err, collection) {
			if (err) {
			  mongodb.close();
			  return callback(err);//错误，返回 err 信息
			}
			//将用户数据插入 users 集合
			collection.insert(user, {
			  safe: true
			}, function (err, user) {
				mongodb.close();
				if (err) {
				  return callback(err);//错误，返回 err 信息
				}
				callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
			});
		});
	});
};

//读取用户信息 通过用户名
User.get = function(name, callback) {
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
			mongodb.close();
			return callback(err);//错误，返回 err 信息
		}
	//读取 users 集合
		db.collection('users', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);//错误，返回 err 信息
			}
		//查找用户名（name键）值为 name 一个文档
			collection.findOne({
				name: name
			}, function (err, user) {
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回 err 信息
				}
				callback(null, user);//成功！返回查询的用户信息
			});
		});
	});
};
//读取用户信息 通过邮箱
User.getByEmail = function (email, callback) {
	mongodb.open(function (err, db) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		db.collection('users', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne(
				{
					email: email
				},
				function (err, user) {
					mongodb.close();
					if (err) {
						return callback(err);
					}
					callback(null, user);
				}
			)
		})
	})
}
User.CheckNameEmail = function (name, email, callback) {
	mongodb.open(function (err, db) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		db.collection('users', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne(
				{
					name: name
				},
				function (err, user) {
					if (user) {
						mongodb.close();
						return callback(null, 'name');
					}
				}
			);
			collection.findOne(
				{
					email: email
				},
				function (err, user) {
					mongodb.close();
					if (user) {
						return callback(null, 'email');
					} else {
						callback(err);
					}
				}
			)
		})
	})
}
//重置密码
User.resetPassword = function (name, password, callback) {
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);//错误，返回 err 信息
		}
	//读取 users 集合
		db.collection('users', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);//错误，返回 err 信息
			}
		//查找用户名（name键）值为 name 一个文档
			collection.update({
				'name': name
			},
			{
				$set: {
					password: password
				}
			}, function (err) {
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回 err 信息
				}
				callback(null);//成功！返回查询的用户信息
			});
		});
	});
};
