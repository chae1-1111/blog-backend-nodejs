const crypto = require("crypto");
const mysql = require("mysql");
const config = require("../config.json");

const pool = mysql.createPool(config);

const memberCont = {};

memberCont.idCheck = function (userid, callback) {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("DB 연결 성공!");
            const sql = conn.query(
                "select count(userid) c from member where userid = ?;",
                userid,
                (err, result) => {
                    conn.release();
                    if (err) {
                        callback(err, null);
                        return;
                    } else {
                        result = result[0].c;
                        callback(null, result);
                        return;
                    }
                }
            );
        }
    });
};

memberCont.loginMember = function (userid, userpw, callback) {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("DB 연결 성공!");
            const sql = conn.query(
                "select userkey, salt, userpw from member where userid = ?;",
                userid,
                (err, result) => {
                    conn.release();
                    if (err) {
                        callback(err, null);
                        return;
                    } else {
                        const encryptPw = memberCont.encrypt(
                            userpw,
                            result[0].salt
                        );
                        if (encryptPw == result[0].userpw) {
                            callback(null, result[0].userkey);
                            return;
                        } else {
                            callback(null, 0);
                            return;
                        }
                    }
                }
            );
        }
    });
};

memberCont.joinMember = function (
    name,
    userid,
    userpw,
    email,
    year,
    month,
    date,
    gender,
    callback
) {
    const salt = Math.round(new Date().valueOf() * Math.random()) + "";

    pool.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("DB 연결 성공!");
            var birthday = year + "-" + month + "-" + date + "";
            const encryptPw = memberCont.encrypt(userpw, salt);
            const sql = conn.query(
                "insert into member(name, userid, userpw, email, birthday, gender, salt) values(?, ?, ?, ?, ?, ?, ?);",
                [name, userid, encryptPw, email, birthday, gender, salt],
                (err, result) => {
                    conn.release();
                    if (err) {
                        callback(err, null);
                        return;
                    } else {
                        console.log("회원가입 성공");
                        console.log("이름 : " + name);
                        console.log("아이디 : " + userid);
                        callback(null, result);
                    }
                }
            );
        }
    });
};

memberCont.modify = (userid, userpw, email, callback) => {
    const salt = Math.round(new Date().valueOf() * Math.random()) + "";

    pool.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("DB 연결 성공!");
            const encryptPw = memberCont.encrypt(userpw, salt);
            const sql = conn.query(
                "update member set userpw = ? email = ? salt = ? where userid = ?",
                [encryptPw, email, salt, userid],
                (err, result) => {
                    conn.release();
                    if (err) {
                        callback(err, null);
                        return;
                    } else {
                        if (result.changedRows == 0) {
                            console.log("일치하는 사용자 없음");
                            callback(null, null);
                        } else {
                            console.log("회원 정보 수정 성공");
                            callback(null, result);
                        }
                    }
                }
            );
        }
    });
};

memberCont.findId = (name, email, callback) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("DB 연결 성공!");
            const sql = conn.query(
                "select userid from member where name = ? and email = ?",
                [name, email],
                (err, result) => {
                    conn.release();
                    if (err) {
                        callback(err, null);
                        return;
                    } else {
                        if (result.length == 0) {
                            console.log("일치하는 사용자 없음");
                            callback(null, null);
                        } else {
                            console.log("아이디 조회 성공");
                            callback(null, result[0].userid);
                        }
                    }
                }
            );
        }
    });
};

memberCont.getName = (userkey, callback) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("DB 연결 성공!");
            const sql = conn.query(
                "select name from member where userkey = ?",
                userkey,
                (err, result) => {
                    conn.release();
                    if (err) {
                        callback(err, null);
                        return;
                    } else {
                        if (result.length == 0) {
                            console.log("일치하는 사용자 없음");
                            callback(null, null);
                        } else {
                            console.log("이름 조회 성공");
                            callback(null, result[0].name);
                        }
                    }
                }
            );
        }
    });
};

memberCont.encrypt = function (userpw, salt) {
    const hashPassword = crypto
        .createHash("sha512")
        .update(userpw + salt)
        .digest("hex");

    return hashPassword;
};

module.exports = memberCont;
