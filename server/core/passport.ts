import { createJwtWebToken } from './../utils/creqateJwtToken';
import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../../models';
import { UserData } from '../../pages';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
}
passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) =>{
  done(null,jwt_payload.data)
}));

passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/github/callback',
    },
    async (_: unknown, __: unknown, profile, done) => {
        try {
          let userData: UserData
          const obj: Omit<UserData, 'id'> = {
            fullname: profile.displayName,
            avatarUrl: profile.photos?.[0].value,
            isActive: 0,
            username: profile.username,
            phone: '',
          };
          obj.token = createJwtWebToken(obj)

          const findUser =  await User.findOne({
            where: {
              username: obj.username
            }
          })
          

          if(!findUser){
            const user = await User.create(obj);
            userData = user.toJSON()
          }else{
            userData = await findUser.toJSON()
          }
          
          done(null, {
            ...userData,
            token: createJwtWebToken(userData)
          })

        } catch (error) {

          done(error)  
        }
     
    },
  ),
);


passport.serializeUser(function(user, done) {
  done(null, user); 
 
});


passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user);
  });
});

export { passport };
