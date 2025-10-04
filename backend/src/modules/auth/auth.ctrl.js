import AppErr from "../../exception/error.js"
import pool from "../../config/database.connection.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

class Authorization {
    register = async (req, res, next) => {
        console.log("req.body:", req.body)
        try {
            let { username, email, password, confirmPassword } = req.body
            let newpass = await bcrypt.hash(password, 10);
            const user = { username, email, password_hash: newpass }
            pool.query(`INSERT INTO users SET ?`, user, (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ error: 'User already exists' });
                    }
                    return res.status(500).json({ error: 'Database error', details: err.message });
                }
                console.log("here")
                res.status(200).json({
                    result: {},
                    message: "Successfully registered",
                    meta: null,
                })
            })

        }
        catch (err) {
            throw new AppErr({ message: "Register is not responsding" })
        }
    }
    login = (req, res, next) => {
        try {
            let { email, password } = req.body;

            let user;

            pool.query('SELECT * from users WHERE email=?', [email], async (err, results) => {
                if (err) {
                    // console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (results.length === 0) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }
                user = results[0]
                const match = await bcrypt.compare(password, user.password_hash)
                if (!match) {
                    return res.status(401).json({ message: "Inavlid email or password" });
                }
                // console.log("users:", users)

                //generating token
                const accessToken = jwt.sign({
                    id: user.id,

                }, process.env.JWT_TOKEN, {
                    expiresIn: "4h"
                })

                const refreshToken = jwt.sign({
                    id: user.id,
                    type: "refresh"
                }, process.env.JWT_TOKEN, {
                    expiresIn: "1d"
                })

                pool.query('UPDATE users SET access_token=?,refresh_token=? WHERE id=?', [accessToken, refreshToken, user.id], (err, results) => {
                    if (err) {
                        console.log(err)
                        return res.status(404).json({ error: "Database error" });

                    }
                    // console.log(user)
                    // console.log("accessToken and refresh Token addded")
                    return res.status(200).json({
                        result: {
                            userName: user.username,
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        },
                        message: "Login Succesfull",
                        meta: null

                    })
                })


            })


        }
        catch (err) {
            throw new AppErr({ message: "Problem while logging in.Please try again" })
        }
    }
    dashboard = async (req, res, next) => {
        try {

            const loggedInUser = req.user;


            const getUserPosts = () => {
                return new Promise((resolve, reject) => {
                    pool.query(
                        `SELECT 
          c.id,
          c.title,
          c.content,
          c.created_at,
          c.is_anonymous,
          COUNT(pl.id) AS likeCount
       FROM confessions c
       LEFT JOIN post_likes pl ON c.id = pl.post_id
       WHERE c.user_id = ?
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
                        [req.user.id],
                        (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        }
                    );
                });
            };



            let userPosts = await getUserPosts();
            let confessionCount = userPosts.length;
            let totalLikes = userPosts.reduce((sum, post) => sum + post.likeCount, 0);
            res.status(200).json({
                result: {
                    userId:loggedInUser.id,
                    username: loggedInUser.username,
                    email: loggedInUser.email,
                    posts: userPosts,
                    confessionCount: confessionCount,
                    totalLikes: totalLikes
                },
                message: "Your profile",
                meta: null

            })

        } catch (error) {
            throw new AppErr({ message: "Problem while loading dashboard" })

        }
    }

    logout = async (req, res, next) => {
        try {
            const user = req.user
            

            pool.query(
                'UPDATE users SET access_token = NULL, refresh_token = NULL WHERE id = ?',
                [user.id],
                (err, results) => {
                    if (err) {
                        console.log(err);

                        return res.status(500).json({ error: "Database error" });
                    }

                    if (results.affectedRows === 0) {
                        return res.status(404).json({ error: "User not found" });
                    }

                    return res.status(200).json({
                        result: {},
                        message: "Successfully logged out",
                        meta: null
                    });
                }
            );
        }
        catch (err) {
            console.error(err);
            next(new AppErr({ message: "Problem while logging out", code: 500 }));
        }
    }



}

const Auth = new Authorization()
export default Auth