const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createSendToken = (statusCode, user, res, message) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

    const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      };
      if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    
    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: 'success',
        token,
        message: message || undefined,
        data: user
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const {name, email, role, password, passwordConfirm} = req.body;
    if(role === 'admin'){
        return next(new AppError(401, 'You are not permitted to create an admin'))
    }

    const emailToken = crypto.randomBytes(24).toString('hex');;
    const emailVerifiedToken = crypto
    .createHash('sha256')
    .update(emailToken)
    .digest('hex');

    const newUser = await User.create({
        name,
        email,
        role,
        password,
        passwordConfirm,
        emailVerifiedToken
    });

    // const emailVerifiedToken = newUser.emailToken;
    
    const emailVerifyUrl = `${req.protocol}/${req.get('host')}/api/v1/verifyemail/${emailToken}`;
    
    const message = `Please verify email address here: ${emailVerifyUrl}`

    createSendToken(201, newUser, res, message);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if(!user){
        return next(new AppError(400, 'email/password are invalid'));
    }

    const checked = await user.comparePasswords(password, user.password);
    console.log(checked)
    
    if(!checked){
        return next(new AppError(400, 'email/password are invalid'));
    }

    user.password = undefined;

    createSendToken(200, user, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const { passwordCurrent, passwordNew, passwordConfirm } = req.body;
    const user = await User.findById(req.user.id).select('+password')
    const checked = await user.comparePasswords( passwordCurrent, user.password);
    
    if(!checked){
        return next(new AppError(400, 'You current password is wrong'));
    }

    if(passwordCurrent === passwordNew){
        return next(new AppError(400, 'You current and new paswwords cannot be thesame'));
    }

    user.password = passwordNew;
    user.passwordConfirm = passwordConfirm;
    await user.save({
        validateBeforeSave: true
    });

    createSendToken(200,user, res);

});

exports.protect = catchAsync(async (req, res, next) => {
    
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    
    if(!token){
        return next(new AppError(400, 'please provide a token'));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if(!decodedToken){
        return next(new AppError(401, 'Invalid token!!!, please login to get a token'));
    }

    const user = await User.findById(decodedToken.id);
    if(!user){
        return next(new AppError(404, 'user that bears this token no longer exists'));
    }

    const date = new Date(decodedToken.iat * 1000)

    if(user.passwordChangedAt > date){
        return next(new AppError(401, 'token is invalid, you recently change your password. Login to get a token'));
    }

    req.user = user;
    
    next();

});

exports.restrictTo = (...roles) => catchAsync(async (req, res, next) => {
    const allowedRoles = [];
    roles.forEach(role => {
        if(req.user.role === role){
            allowedRoles.push(role)
        }
    })

    if(allowedRoles.length === 0){
        return next(new AppError(401, 'You are not authorized to perform this action'))
    }

    next();
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
    const { emailToken } = req.params;

    const hashedToken = crypto
    .createHash('sha256')
    .update(emailToken)
    .digest('hex');

    const user = await User.findOne({ emailVerifiedToken: hashedToken });
    if(!user){
        return next(new AppError(404, 'There is no user with this email'));
    }
    if(user.emailVerified === true){
        return next(new AppError(404, "This user's email is already verified"));
    }
    user.emailVerified = true;
    await user.save({
        validateBeforeSave: false
    });

    res.status(200).json({
        status: 'success',
        user,
        data: 'email has been sent'

    })
});

exports.isEmailVerified = catchAsync(async (req, res, next) => {
    const { emailVerified } = req.user;
    console.log(emailVerified)
    if(!emailVerified){
        return next(new AppError(404, 'Please verify your email address'));
    }
    next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user){
        return next(new AppError(404, 'There is no user with this email'));
    }

    const resetToken = user.generateResetToken();

    await user.save({
        validateBeforeSave: false
    });

    const resetUrl = `${req.protocol}/${req.get('host')}/api/v1/resetpassword/${resetToken}`;
    //send email
    res.status(200).json({
        status: 'success',
        url: resetUrl,
        data: 'email has been sent'

    })
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { passwordCurrent, passwordNew, passwordConfirm } = req.body;

    const { resetToken } = req.params;
    console.log(resetToken)

    const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    const user = await User.findOne({ passwordResetExpireToken: hashedToken, passwordResetExpiresAt: {$gt: Date.now()} }).select('+password')
    if(!user){
        return next(new AppError(400, 'Token is invalid or has expired'));
    }
    const checked = await user.comparePasswords( passwordCurrent, user.password);
    if(!checked){
        return next(new AppError(400, 'You current password is wrong'));
    }

    if(passwordCurrent === passwordNew){
        return next(new AppError(400, 'You current and new paswwords cannot be thesame'));
    }

    // user.password = passwordNew;
    // user.passwordConfirm = passwordConfirm;
    // await user.save({
    //     validateBeforeSave: false
    // });

    console.log(req.params)

    res.status(200).json({
        status: 'success',
        data: 'user',
    });
});