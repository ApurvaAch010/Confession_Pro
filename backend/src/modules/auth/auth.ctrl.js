import AppErr from "../../exception/error.js"
import pool from "../../config/database.connection.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

class Authorization {
    register = async (req, res, next) => {
        try {
            let { username, email, password } = req.body;
            let newpass = await bcrypt.hash(password, 10);
            const user = { username, email, password_hash: newpass }
            // console.log("user:", user)
            pool.query(`INSERT INTO users SET ?`, user, (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ error: 'User already exists' });
                    }
                    return res.status(500).json({ error: 'Database error', details: err.message });
                }

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
            res.status(200).json({
                result: {
                    username: loggedInUser.username,
                    email: loggedInUser.email
                },
                message: "Your profile",
                meta: null

            })

        } catch (error) {
            throw new AppErr({ message: "Problem while loading dashboard" })
            // next(error);
        }
    }

    logout = async (req, res, next) => {
        try {
            const user=req.user

            // Use UPDATE instead of DELETE to clear tokens
            pool.query(
                'UPDATE users SET access_token = NULL, refresh_token = NULL WHERE id = ?',
                [user.id],
                (err, results) => {
                    if (err) {
                        console.log(err);
                        // Use 500 for server errors
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