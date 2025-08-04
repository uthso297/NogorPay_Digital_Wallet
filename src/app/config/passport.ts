import passport from "passport";
import { Strategy as LocalStratrgy } from "passport-local";
import { User } from "../modules/user/user.moel";
import bcryptjs from 'bcryptjs'
passport.use(
    new LocalStratrgy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email: string, password: string, done) => {

        const isUserExist = await User.findOne({ email })

        if (!isUserExist) {
            return done("User does not exist")
        }

        const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
        if (!isPasswordMatched) {
            return done(null, false, { message: "Password does not match" })
        }

        return done(null, isUserExist)

    })
)

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});