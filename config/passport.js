const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')

//Strategy 정의 

module.exports = () => {
    // Local Strategy
    passport.use(new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'password'
    },
        function (userId, password, done) {
            // 이 부분에선 저장되어 있는 User를 비교하면 된다. 
            return User.findOne({ userId, password })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: '아이디나 비밀번호가 잘못됐습니다.' });
                    }
                    return done(null, user, { message: '로그인 성공!' });
                })
                .catch(err => done(err));
        }
    ));

    //JWT Strategy
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "my-secret-key"
    },
        function (jwtPayload, done) {
            return User.findOneById(jwtPayload.id)
                .then(user => {
                    return done(null, user);
                })
                .catch(err => {
                    return done(err);
                });
        }
    ));
}