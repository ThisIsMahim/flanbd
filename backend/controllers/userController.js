const User = require("../models/userModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const sendToken = require("../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register User
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, gender, password } = req.body;

  const user = await User.create({
    name,
    email,
    gender,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});

// Login User
// Register User
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, gender, password } = req.body;

  const user = await User.create({
    name,
    email,
    gender,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});

// Login User
exports.loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email And Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // Invalidate any existing sessions
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  // Then send new token
  sendToken(user, 200, res);
});

// Logout User
// controllers/userController.js
exports.logoutUser = asyncErrorHandler(async (req, res, next) => {
  // Clear the token cookie
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  // Additional security measures
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Details
exports.getUserDetails = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Forgot Password
// Forgot Password
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  // Prepare email content with HTML design
      const emailSubject = "Password Reset Request - eyegears";

  const emailMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #1976d2;">Password Reset Request</h2>
                <div style="width: 100px; height: 3px; background-color: #1976d2; margin: 10px auto;"></div>
            </div>
            
            <p style="font-size: 16px;">Hello ${user.name},</p>
            
            <p style="font-size: 16px;">We received a request to reset your password for your eyegears account.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; font-size: 14px;">Click the button below to reset your password:</p>
                <a href="${resetPasswordUrl}" 
                   style="display: inline-block; margin-top: 15px; padding: 10px 20px; 
                          background-color: #1976d2; color: white; text-decoration: none; 
                          border-radius: 5px; font-weight: bold;">
                    Reset Password
                </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
                <strong>Note:</strong> This link will expire in 15 minutes. If you didn't request a password reset, 
                you can safely ignore this email - your password will remain unchanged.
            </p>
            
            <p style="font-size: 16px; margin-top: 30px;">Thank you,<br>The eyegears Team</p>
            
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; text-align: center;">
                <p style="font-size: 12px; color: #999;">
                    If you're having trouble clicking the button, copy and paste the following link into your browser:
                </p>
                <p style="font-size: 12px; color: #1976d2; word-break: break-all;">
                    ${resetPasswordUrl}
                </p>
            </div>
        </div>
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: emailSubject,
      message: emailMessage,
    });

    res.status(200).json({
      success: true,
      message: `Password reset email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  // create hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid reset password token", 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

// Update Password
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is Invalid", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 201, res);
});

// Update User Profile
exports.updateProfile = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
  });
});

// ADMIN DASHBOARD

// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get Single User Details --ADMIN
exports.getSingleUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role --ADMIN
exports.updateUserRole = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete Role --ADMIN
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting user:", error); // Log error for debugging
    return next(
      new ErrorHandler("Internal Server Error: " + error.message, 500)
    );
  }
});

// Check and update Gold User status
exports.checkGoldUserStatus = asyncErrorHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Check if user should be upgraded to Gold User
    if (!user.isGoldUser && user.totalSpent >= user.goldUserThreshold) {
      user.isGoldUser = true;
      user.goldUserSince = new Date();
      await user.save();

      res.status(200).json({
        success: true,
        message: "Congratulations! You are now a Gold User!",
        isGoldUser: true,
        goldUserSince: user.goldUserSince,
        totalSpent: user.totalSpent
      });
    } else {
      res.status(200).json({
        success: true,
        isGoldUser: user.isGoldUser,
        goldUserSince: user.goldUserSince,
        totalSpent: user.totalSpent,
        remainingToGold: Math.max(0, user.goldUserThreshold - user.totalSpent)
      });
    }
  } catch (error) {
    return next(new ErrorHandler("Error checking Gold User status", 500));
  }
});

// Update user's total spent amount
exports.updateTotalSpent = asyncErrorHandler(async (req, res, next) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return next(new ErrorHandler("Invalid amount", 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.totalSpent += amount;
    
    // Check if user should be upgraded to Gold User
    let isNewGoldUser = false;
    if (!user.isGoldUser && user.totalSpent >= user.goldUserThreshold) {
      user.isGoldUser = true;
      user.goldUserSince = new Date();
      isNewGoldUser = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      totalSpent: user.totalSpent,
      isGoldUser: user.isGoldUser,
      isNewGoldUser,
      goldUserSince: user.goldUserSince,
      remainingToGold: Math.max(0, user.goldUserThreshold - user.totalSpent)
    });
  } catch (error) {
    return next(new ErrorHandler("Error updating total spent", 500));
  }
});
