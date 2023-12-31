const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const db = require('../models');
const { Op, fn, col } = require('sequelize');
const { post } = require('../routes/postRoutes');
const notificationController = require('../controllers/notificationController');
const Post = db.Post;
const User = db.User;
const Notification = db.Notification;

exports.statistics = catchAsync(async (req, res, next) => {
	const posts = await Post.findAll({
		attributes: [
			[fn('date_format', col('updatedAt'), '%Y-%m-%d'), 'date_col_formed'],
			[fn('COUNT', col('id')), 'count'],
		],
		where: {
			status: req.params.status,
			updatedAt: {
				[Op.between]: [new Date(req.params.dayStart), new Date(new Date(req.params.dayEnd).getTime() + 24 * 60 * 60 * 1000)]
			}
		},
		group: [fn('date_format', col('updatedAt'), '%Y-%m-%d'), 'date_col_formed'],
	})
	const violatedUsers = await Post.findAll({
		attributes: [
			[fn('COUNT', col('userPostData.id')), 'count'],
		],
		include: [{
			model: User,
			as: 'userPostData',
			attributes: ['id', 'email', 'username'],
			order: ['id', 'ASC']
		}],
		where: {
			status: req.params.status,
			updatedAt: {
				[Op.between]: [new Date(req.params.dayStart), new Date(new Date(req.params.dayEnd).getTime() + 24 * 60 * 60 * 1000)]
			}
		},
		group: ['userPostData.id'],
	})
	const allViolatedUsers = await Post.findAll({
		attributes: [
			[fn('COUNT', col('userPostData.id')), 'countAll'],
		],
		include: [{
			model: User,
			as: 'userPostData',
			attributes: ['id'],
			where: { id: { [Op.in]: violatedUsers.map(el => el.userPostData.id) } },
			order: ['id', 'ASC']

		}],
		where: {
			status: req.params.status,
		},
		group: ['userPostData.id'],
	})
	for (const violatedUser of violatedUsers) {
		const matchUser = allViolatedUsers.find(user => user.dataValues.userPostData.dataValues.id === violatedUser.dataValues.userPostData.dataValues.id)
		violatedUser.dataValues.countAll = matchUser.dataValues.countAll
	}
	res.status(200).json({
		status: 'success',
		data: {
			posts,
			violatedUsers
		}
	})
})

exports.setUserPost = (req, res, next) => {
	req.body.userPost = req.user.id;
	next();
};

exports.isUserBelongToPost = catchAsync(async (req, res, next) => {
	const post = await Post.findByPk(req.params.id);
	if (req.body.status) {
		return next(
			new AppError('This route do not use for update post\'s status!', 403)
		);
	}
	if (post.userPost !== req.user.id)
		return next(new AppError('You are not the poster!', 403));
	next();
});

exports.updateStatus = catchAsync(async (req, res, next) => {
	const post = await Post.findByPk(req.params.id);
	if (!post) return next(new AppError('No post found with that Id', 400));
	switch (req.body.status) {
		case 'Confirmed':
			if (post.userPost === req.user.id)
				return next(new AppError('You can\'t confirm your post!', 403));
			if (post.status !== 'Unconfirmed')
				return next(new AppError('You can only confirm when the post is unconfirmed', 400));
			req.body.userReceive = post.userPost
			notificationController.createNotification('Confirmed', req);
			req.body.userConfirm = req.user.id;
			break;
		case 'Unconfirmed':
			if (post.status !== 'Confirmed' && post.status !== 'Checking')
				return next(new AppError('You can only unconfirmed when the post is confirmed or checking', 400));
			if (post.userPost !== req.user.id && post.userConfirm !== req.user.id && req.user.role != 3) {
				return next(new AppError('You are not belong to this post!', 403));
			}
			if (post.status === 'Confirmed') {
				if (req.user.id === post.userConfirm)
					req.body.userReceive = post.userPost
				else
					req.body.userReceive = post.userConfirm
				notificationController.createNotification('Unconfirmed', req);
				req.body.userConfirm = null;
			} else {
				req.body.userReceive = post.userPost
				notificationController.createNotification('Clear', req);
			}
			break;
		case 'Delivered':
			if (post.userConfirm !== req.user.id)
				return next(new AppError('You are\'t user confirm!', 403));
			if (post.status !== 'Confirmed')
				return next(new AppError('You can only deliver when the post is confirmed', 400));
			break;
		case 'Checking':
			if (post.status !== 'Unconfirmed')
				return next(new AppError('You can only checking when the post is unconfirmed', 400));
			req.body.userReceive = post.userPost
			notificationController.createNotificationHasContent('Checking', req);
			break;
		case 'Violated':
			if (post.status !== 'Checking')
				return next(new AppError('You can only violated when the post is checking', 400));
			req.body.userReceive = post.userPost
			notificationController.createNotificationHasContent('Violated', req);
			break;
	}
	next();
});

exports.isNotDeliveryPost = catchAsync(async (req, res, next) => {
	const post = await Post.findByPk(req.params.id);
	if (post.userPost !== req.user.id && req.user.role != 3)
		return next(
			new AppError('You do not have permission to delete this post!', 403)
		);
	if (post.status === 'Delivered' || post.status === 'Confirmed') {
		return next(new AppError('You can not delete this post!', 403));
	}
	next();
});

const postOptions = { include: 'userPostData' };
exports.createPost = catchAsync(async (req, res, next) => {
	//create new id
	const currentDate =
		new Date().getDate().toString().padStart(2, '0')
		+ (new Date().getMonth() + 1).toString().padStart(2, '0')
		+ new Date().getFullYear().toString().slice(-2)
	const numPost = (await Post.findAll({ where: { id: { [Op.like]: `${currentDate}%` } } })).length
	req.body.id = currentDate + (numPost + 1).toString().padStart(4, '0');
	//create post
	let data = await Post.create(req.body);
	data = await Post.findByPk(data.id, { include: 'userPostData' })
	res.status(201).json({
		status: "success",
		data: {
			data,
		},
	});
})
exports.getAllPosts = factory.getAll(Post);
exports.updatePost = factory.updateOne(Post);
exports.getPost = factory.getOne(Post);
exports.deletePost = factory.deleteOne(Post);
