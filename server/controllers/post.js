const Post = require('../models/PostModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const cloudinary = require('cloudinary');
const Notification = require("../models/NotificationModel.js");

exports.createPost = catchAsyncErrors(async (req, res, next) => {
    try {
        const { image, replies: originalReplies } = req.body;

        let myCloud;
        if (image) {
            myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: 'posts'
            });
        }

        const replies = await Promise.all(originalReplies.map(async (item) => {
            if (item.image) {
                const replyImage = await cloudinary.v2.uploader.upload(item.image, {
                    folder: 'posts'
                });
                item.image = {
                    public_id: replyImage.public_id,
                    url: replyImage.secure_url
                };
            }

            return item;
        }));

        const post = new Post({
            title: req.body.title,
            image: image ? {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            } : null,
            user: req.body.user,
            replies
        });

        await post.save();
        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//get all post

exports.getAllPosts = catchAsyncErrors(async (req, res, next) => {
    try {
        const posts = await Post.find().sort({
            createdAt: -1,
        });
        res.status(201).json({ success: true, posts })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
})

//add ỏ remove Like
exports.updateLikes = catchAsyncErrors(async (req, res, next) => {
    try {
        const postId = req.body.postId;
        const post = await Post.findById(postId);
        const isLikeBefore = post.likes.find((item) => item.userId === req.user.id);
        if (isLikeBefore) {
            await Post.findByIdAndUpdate(postId, {
                $pull: {
                    likes: {
                        userId: req.user.id,
                    },
                },
            });
            if (req.user.id !== post.user._id) {
                await Notification.deleteOne({
                    'creator._id': req.user.id,
                    userId: post.user._id,
                    type: 'Like',


                })
            }
            res.status(201).json({
                success: true,
                message: 'Like remove successfully!'
            })
        } else {
            await Post.updateOne({
                _id: postId,
            }, {
                $push: {
                    likes: {
                        name: req.user.name,
                        userName: req.user.userName,
                        userId: req.user.id,
                        userAvatar: req.user.avatar.url,
                        postId,
                    }
                }
            })
            if (req.user.id !== post.user._id) {
                await Notification.create({
                    'creator': req.user,
                    userId: post.user._id,
                    type: 'Like',
                    title: post.title ? post.title : 'Like your photo',
                    postId: postId
                })
            }
            res.status(201).json({
                success: true,
                message: 'Like added successfully!'
            })
        }
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 400));

    }
})

//add replies in post
exports.addReplies = catchAsyncErrors(async (req, res, netx) => {
    try {
        const postId = req.body.postId;
        let myCloud = {};
        if (req.body.image) {
            myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
                folder: 'posts',
            })
        }

        const replyData = {
            user: req.user,
            title: req.body.title,
            image: req.body.image
                ? {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                }
                : null,
            likes: [],
        };
        // Find the post by its ID
        let post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        post.replies.push(replyData);

        await post.save();

        res.status(201).json({
            success: true,
            post,
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 400));
    }
})

//add or remove likes on replies
exports.updateReplyLikes = catchAsyncErrors(async (req, res, next) => {
    try {
        const postId = req.body.postId;
        const replyId = req.body.replyId;
        const replyTitle = req.body.replyTitle;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not Found'
            })
        }
        //find the reply in the 'replies' array based on the given replyId
        const reply = post.replies.find((reply) => reply._id.toString() === replyId);

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: 'Reply not found'
            })
        }

        //Check if user liked before
        const isLikeBefore = reply?.likes.find((item) => item.userId === req.user.id);

        if (isLikeBefore) {
            //remove liike
            reply.likes = reply.likes.filter((like) => like.userId !== req.user.id);

            if (req.user.id !== post.user._id) {
                await Notification.deleteOne({
                    'creator._id': req.user.id,
                    userId: post.user._id,
                    type: 'Reply',
                    postId: postId
                });

                await post.save();

                return res.status(200).json({
                    success: true,
                    message: "Like removed from reply successfully",
                });
            }
        }
        //if not likeed before, add the like to the reply
        const newLike = {
            name: req.user.name,
            userName: req.user.userName,
            userId: req.user.id,
            userAvatar: req.user.avatar.url
        };

        reply.likes.push(newLike);
        if (req.user.id !== post.user._id) {
            await Notification.create({
                creator: req.user,
                type: "Like",
                title: replyTitle ? replyTitle : "Liked your Reply",
                userId: post.user._id,
                postId: postId,
            });
        }
        await post.save();
        return res.status(200).json({
            success: true,
            message: "Like added to reply successfully",
        });


    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 400));
    }
})

//add reply in replies
exports.addReply = catchAsyncErrors(async (req, res, netx) => {
    try {
        const replyId = req.body.replyId;
        const postId = req.body.postId;
        let myCloud = {};
        if (req.body.image) {
            myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
                folder: 'posts',
            })
        }

        const replyData = {
            user: req.user,
            title: req.body.title,
            image: req.body.image
                ? {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                }
                : null,
            likes: [],
        };
        // Find the post by its ID
        let post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        //find the reply by it's ID
        let data = post.replies.find((reply) => reply._id.toString() === replyId)
        if (!data) {
            return next(new ErrorHandler('Reply not found', 401))
        }

        data.reply.push(replyData);

        await post.save();

        res.status(201).json({
            success: true,
            post,
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 400));
    }
})

//add or remove likes on replies reply
exports.updateRepliesReplyLike = catchAsyncErrors(async (req, res, next) => {
    try {
        const { postId, replyId, singleReplyId, replyTitle } = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        //find replies in the post
        const replyObj = post.replies.find((reply) => reply._id.toString() === replyId);
        if (!replyObj) {
            return res.status(404).json({
                success: false,
                message: "Repiles not found",
            });
        }

        //find reply in replies
        const reply = replyObj.reply.find((reply) => reply._id.toString() === singleReplyId);


        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }

        //ckeck islIkesbefore
        const isLikeBefore = reply.likes.find((like) => like.userId === req.user.id);

        if (isLikeBefore) {
            console.log(reply.user._id);
            //remove like
            reply.likes = reply.likes.filter((like) => like.userId !== req.user.id);
            if (req.user.id !== reply.user._id) {
                const a = await Notification.deleteOne({
                    'creator._id': req.user.id,
                    userId: reply.user._id.toString(),
                    type: 'Like',
                    postId: postId
                })
                console.log(a);
            }
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Like removed from reply successfully",
            });
        }

        const newLike = {
            name: req.user.name,
            userName: req.user.userName,
            userId: req.user.id,
            userAvatar: req.user.avatar.url
        };
        reply.likes.push(newLike);

        if (req.user.id !== reply.user._id) {
            await Notification.create({
                'creator': req.user,
                userId: reply.user._id,
                type: 'Like',
                title: replyTitle ? replyTitle : 'Like your Reply',
                postId: postId
            })
        }
        await post.save();
        return res.status(200).json({
            success: true,
            message: "Like added from reply successfully",
        });


    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 400));

    }
})

// delete post
exports.deletePost = catchAsyncErrors(async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return next(new ErrorHandler("Post is not found with this id", 404));
        }

        if (post.image?.public_id) {
            await cloudinary.v2.uploader.destroy(post.image.public_id);
        }

        await Post.deleteOne({ _id: req.params.id });

        res.status(201).json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error, 400));
    }
});