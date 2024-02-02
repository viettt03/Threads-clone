const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken.js");
const cloudinary = require("cloudinary");
const Notification = require("../models/NotificationModel.js");

// Register user
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    let myCloud = {}
    if (avatar) {
      myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
    }

    const userNameWithoutSpace = name.replace(/\s/g, '');
    const uniqueNumber = Math.floor(Math.random() * 1000);

    user = await User.create({
      name,
      email,
      password,
      userName: userNameWithoutSpace + uniqueNumber,
      avatar: avatar
        ? {
          public_id: myCloud.public_id,
          url: myCloud.secure_url
        }
        : null,
    });

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter the email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("User is not find with this email & password", 401)
    );
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("User is not find with this email & password", 401)
    );
  }

  sendToken(user, 201, res);
});

//  Log out user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Log out success",
  });
});

//  Get user Details
exports.userDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const loggedInuser = req.user.id;

  const users = await User.find({ _id: { $ne: loggedInuser } }).sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    users
  })
})


//follow and unfollow
exports.followUnfollowUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const { followUserId } = req.body;
    const isFollowedBefore = loggedInUser.following.find((item) => item.userId === followUserId);

    const loggedInUserId = loggedInUser._id;

    if (isFollowedBefore) {
      await User.updateOne({
        _id: followUserId,
      }, {
        $pull: { followers: { userId: loggedInUserId } }
      });
      await User.updateOne(
        { _id: loggedInUserId },
        { $pull: { following: { userId: followUserId } } }
      );
      await Notification.deleteOne({
        'creator._id:': loggedInUserId,
        userId: followUserId,
        type: 'Follow'
      })

      res.status(200).json({
        success: true,
        message: 'User Unfollowed Successfully'
      })
    } else {
      await User.updateOne({
        _id: followUserId,
      }, {
        $push: { followers: { userId: loggedInUserId } }
      });

      await User.updateOne(
        { _id: loggedInUserId },
        { $push: { following: { userId: followUserId } } }
      );
      await Notification.create({
        creator: req.user,
        userId: followUserId,
        type: 'Follow',
        title: 'Followed you'
      })

      res.status(200).json({
        success: true,
        message: 'User Followed Successfully'
      })
    }

  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
})


//get user notification 
exports.getNotification = catchAsyncErrors(async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      notifications
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 401))
  }
});

//get signle user
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(201).json({
      success: true,
      user
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 401))

  }
})

//update avatar
exports.updateUserAvatar = catchAsyncErrors(async (req, res, next) => {
  try {
    let existsUser = await User.findById(req.user.id);

    if (req.body.avatar !== '') {
      const imageId = existsUser.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imageId);
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });
      existsUser.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    }
    await existsUser.save();
    res.status(200).json({
      success: true,
      user: existsUser
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 401))

  }
})

//update user ifo
exports.updateUserInfo = catchAsyncErrors(async (req, res, next) => {
  try {
    let existsUser = await User.findById(req.user.id);


    if (req.body.avatar !== '') {
      const imageId = existsUser.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imageId);
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });
      existsUser.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    }
    existsUser.name = req.body.name;
    existsUser.userName = req.body.userName;
    existsUser.bio = req.body.bio;

    await existsUser.save();
    res.status(200).json({
      success: true,
      user: existsUser
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 401))

  }
})
