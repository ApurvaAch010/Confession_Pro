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
                            // Already liked → unlike
                            pool.query(
                                "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?",
                                [postId, userId],
                                (delErr) => {
                                    if (delErr) {
                                        console.error(delErr);
                                        return res.status(500).json({ error: "Database error" });
                                    }

                                    // Get updated count
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
                        // Successfully liked → get updated count
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

    update = async (req, res, next) => {
        try {
            const id = req.params.id;
            const { title, content, is_anonymous } = req.body;

            pool.query('SELECT * FROM confessions WHERE id=?', [id], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Database error" });
                }
                if (result.length === 0) {
                    return res.status(404).json({ error: "Confession not found" });
                }

                const update = result[0];

                pool.query(
                    'UPDATE confessions SET title=?, content=?, is_anonymous=? WHERE id=?',
                    [
                        title ? title : update.title,
                        content ? content : update.content,
                        typeof is_anonymous !== 'undefined' ? is_anonymous : update.is_anonymous,
                        id
                    ],
                    (errors) => {
                        if (errors) {
                            console.log(errors);
                            return res.status(500).json({ error: "Database error" });
                        }
                        res.status(200).json({
                            result: { confessionId: id },
                            message: "Successfully updated"
                        });
                    }
                );
            });
        } catch (err) {
            throw new AppErr({ message: "Error in update confession", code: 500 });
        }
    }

    delete = async (req, res, next) => {
        try {
            const id = req.params.id;

            pool.query('DELETE FROM confessions WHERE id=?', [id], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Database error" });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: "No such confession exists" });
                }

                res.status(200).json({
                    result: { confessionId: id },
                    message: "Successfully deleted",
                    meta: null
                });
            });
        } catch (err) {
            throw new AppErr({ message: "Error in delete confession", code: 500 });
        }
    }
}

const Confess = new Confession();
export default Confess;
