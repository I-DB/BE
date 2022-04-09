const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcrypt")
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')


//Strategy 정의 
//LocalStrategy의 역할은 request에 넘겨져오는 form-data와 localDB에 저장되어 있는 
//user와 비교하는 것이다. 
//JWTStrategy는 jwt토큰을 읽어서 해당 사용자를 인증한다. 
// Locarlstrategy는 로그인, JWT Strategy는 API 접근 인증이다




module.exports = () => {
    // Local Strategy
    passport.use(new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'password'
    },
        function (userId, password, done) {
            // 이 부분에선 저장되어 있는 User를 비교하면 된다. 
            return User.findOne({ userId })
                .then(user => {
                    const decodedPassword = user.password
                    if (!bcrypt.compareSync(password, decodedPassword)) {
                        return done(null, false, { message: '아이디나 비밀번호가 잘못됐습니다.' });
                    }
                    return done(null, user, { message: '로그인 성공!' });
                })
                .catch(err => done(err));
        }
    ));

    //local 인증을 통해 JWT TOKEN 발급해주는 API작성 필요!
    //JWT Strategy
    //JWT 토큰이 있는지, 유효한 토큰인지 확인 
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "my-secret-key"
    },
        function (jwtPayload, done) {
            const { userId } = jwtPayload

            return User.findOne({ userId }).select('-password')//password 빼주기
                .then(user => {
                    return done(null, user);
                })
                .catch(err => {
                    return done(err);
                });
        }
    ));
}