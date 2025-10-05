import AppErr from "../../exception/error.js"
import pool from "../../config/database.connection.js";

class Confession {

    create = async (req, res, next) => {
        try {
            const { title, content, is_anonymous = true } = req.body;
            const user = req.user;

            pool.query(
                "INSERT INTO confessions (user_id, content, is_anonymous, title) VALUES (?, ?, ?, ?)",
                [user.id, content, is_anonymous, title],
                (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: "Database error" });
                    }
                    res.status(201).json({
                        message: "Confession created successfully",
                        confessionId: results.insertId
                    });
                }
            );
        } catch (err) {
            console.log(err);
            throw new AppErr({ message: "Error in create confession", code: 500 });
        }
    }

    getAll = async (req, res, next) => {
        try {
            pool.query(
                `SELECT c.*, u.username, 
                        COUNT(pl.id) AS likeCount
                 FROM confessions c
                 LEFT JOIN users u ON c.user_id = u.id
                 LEFT JOIN post_likes pl ON c.id = pl.post_id
                 GROUP BY c.id
                 ORDER BY c.created_at DESC`,
                (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: "Database error" });
                    }
                    res.status(200).json({
                        result: {
                            confessions: results,
                            count: results.length
                        }
                    });
                }
            );
        } catch (err) {
            throw new AppErr({ message: "Error in getAll confession", code: 500 });
        }
    };

    getPostById = async (req, res, next) => {
        try {
            const { id } = req.params;

            pool.query(
                `SELECT c.*, u.username, 
                        COUNT(pl.id) AS likeCount
                 FROM confessions c
                 LEFT JOIN users u ON c.user_id = u.id
                 LEFT JOIN post_likes pl ON c.id = pl.post_id
                 WHERE c.id = ?
                 GROUP BY c.id`,
                [id],
                (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: "Database error" });
                    }
                    if (results.length === 0) {
                        return res.status(404).json({ error: "Confession not found" });
                    }
                    res.status(200).json({
                        result: results[0]
                    });
                }
            );
        } catch (err) {
            throw new AppErr({ message: "Error in get confession by id", code: 500 });
        }
    }

    toggleLike = async (req, res, next) => {
        try {
            const { postId } = req.body;
            const userId = req.user.id;

            pool.query(
                "INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)",
                [postId, userId],
                (err, result) => {
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
                            pool.query(
                                "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?",
                                [postId, userId],
                                (delErr) => {
                                    if (delErr) {
                                        console.error(delErr);
                                        return res.status(500).json({ error: "Database error" });
                                    }
                                    pool.query(
                                        "SELECT COUNT(*) AS likeCount FROM post_likes WHERE post_id = ?",
                                        [postId],
                                        (countErr, countResult) => {
                                            if (countErr) {
                                                console.error(countErr);
                                                return res.status(500).json({ error: "Database error" });
                                            }
                                            return res.status(200).json({
                                                message: "Post unliked",
                                                likeCount: countResult[0].likeCount
                                            });
                                        }
                                    );
                                }
                            );
                        } else {
                            console.error(err);
                            return res.status(500).json({ error: "Database error" });
                        }
                    } else {
                        pool.query(
                            "SELECT COUNT(*) AS likeCount FROM post_likes WHERE post_id = ?",
                            [postId],
                            (countErr, countResult) => {
                                if (countErr) {
                                    console.error(countErr);
                                    return res.status(500).json({ error: "Database error" });
                                }
                                return res.status(200).json({
                                    message: "Post liked",
                                    likeCount: countResult[0].likeCount
                                });
                            }
                        );
                    }
                }
            );
        } catch (err) {
            throw new AppErr({ message: "Error toggling like", code: 500 });
        }
    };


    delete = async (req, res) => {
        const id = req.params.id;

        try {
            const post = await new Promise((resolve, reject) => {
                pool.query(
                    "SELECT * FROM confessions WHERE id = ?",
                    [id],
                    (err, results) => {
                        if (err) return reject(err);
                        if (results.length === 0) return reject("Post not found");
                        resolve(results[0]);
                    }
                );
            });

            await new Promise((resolve, reject) => {
                pool.query(
                    `INSERT INTO deleted_confessions 
         (original_post_id, user_id, title, content, is_anonymous) 
         VALUES (?, ?, ?, ?, ?)`,
                    [post.id, post.user_id, post.title, post.content, post.is_anonymous],
                    (err) => (err ? reject(err) : resolve())
                );
            });
            await new Promise((resolve, reject) => {
                pool.query("DELETE FROM post_likes WHERE post_id = ?", [id], (err) =>
                    err ? reject(err) : resolve()
                );
            });
            await new Promise((resolve, reject) => {
                pool.query("DELETE FROM confessions WHERE id = ?", [id], (err) =>
                    err ? reject(err) : resolve()
                );
            });

            res.status(200).json({ message: "Post moved to bin successfully" });

        } catch (err) {
           console.log("eRROR",err);

            if (err === "Post not found") {
                return res.status(404).json({ error: "Post not found" });
            }

            res.status(500).json({
                error: "Something went wrong while deleting the post",
                details: err,
            });
        }

    }

    bin = async (req, res, next) => {
        const userId = req.user.id;
        try {
            const binPosts = await new Promise((resolve, reject) => {
                pool.query("SELECT * FROM deleted_confessions WHERE user_id=?", [userId], (err, results) => {
                    if (err) reject(err);
                    else if (results.length === 0) reject("No deleted Posts");
                    else resolve(results);

                })
            })
            if (binPosts.length === 0) {
                return res.status(200).json({ message: "No deleted posts found", data: [] });
            }

            res.status(200).json({ message: "Deleted posts fetched successfully", data: binPosts })

        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: "Something went wrong" });
        }
    }

    restore = async (req, res, next) => {
        const deletedId = req.params.id
        try {
            const post = await new Promise((resolve, reject) => {
                pool.query("SELECT * FROM deleted_confessions WHERE id=?", [deletedId], (err, results) => {
                    if (err) reject(err);
                    else if (results.length === 0) reject("Post not found");
                    else resolve(results[0]);
                });
            });

            await new Promise((resolve, reject) => {
                pool.query(
                    `INSERT INTO confessions (id, user_id, title, content, is_anonymous)
                 VALUES (?, ?, ?, ?, ?)`,
                    [post.original_post_id, post.user_id, post.title, post.content, post.is_anonymous],
                    (err) => (err ? reject(err) : resolve())
                );
            });

            await new Promise((resolve, reject) => {
                pool.query("DELETE FROM deleted_confessions WHERE id=?", [deletedId], (err) => (err ? reject(err) : resolve()));
            });

            res.status(200).json({ message: "Post restored successfully" });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: "Something went wrong" });
        }
    }

    autoDeletePosts = () => {
        pool.query(
            "DELETE FROM deleted_confessions WHERE deleted_at < NOW() - INTERVAL 15 DAY",
            (err) => {
                if (err) console.log("Auto-delete error:", err);
            }
        );

    }
}

const Confess = new Confession();
export default Confess;
