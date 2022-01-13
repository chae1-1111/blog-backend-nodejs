const memberCont = require("../controller/member");

const cors = require("cors");
const { idCheck } = require("../controller/member");

var express = require("express"),
    router = express.Router();

router.use(cors());

router.route("/login").post((req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const jsonData = {};
    memberCont.loginMember(userid, userpw, (err, result) => {
        if (err) {
            jsonData.result = 400;
            jsonData.resultMsg = "error";
            res.status(resultJson.result).json(resultJson);
        } else {
            if (result != 0) {
                jsonData.result = 200;
                jsonData.resultMsg = "로그인 성공";
                jsonData.userkey = result;
            } else {
                jsonData.result = 201;
                jsonData.resultMsg = "로그인 실패";
            }
            res.status(jsonData.result).json(jsonData);
        }
    });
});

router.route("/join").post((req, res) => {
    const name = req.body.name;
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const email = req.body.email;
    const year = req.body.year;
    const month = req.body.month;
    const date = req.body.date;
    const gender = req.body.gender;

    const jsonData = { result: null, resultMsg: null };
    memberCont.joinMember(
        name,
        userid,
        userpw,
        email,
        year,
        month,
        date,
        gender,
        (err, result) => {
            if (err) {
                jsonData.result = 400;
                jsonData.resultMsg = err;
            } else {
                jsonData.result = 200;
                jsonData.resultMsg = "회원가입 성공";
            }
            res.json(jsonData);
        }
    );
});

router.route("/modify").post((req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const email = req.body.email;

    const jsonData = {};

    memberCont.modify(userid, userpw, email, (err, result) => {
        if (err) {
            jsonData.result = 400;
            jsonData.resultMsg = err;
        } else {
            if (result != null) {
                jsonData.result = 200;
                jsonData.resultMsg = "회원 정보 수정 성공";
            } else {
                jsonData.result = 201;
                jsonData.resultMsg = "일치하는 회원 없음";
            }
        }
        res.status(jsonData.result).json(jsonData);
    });
});

router.route("/idCheck").post((req, res) => {
    const userid = req.body.userid;
    const jsonData = { result: null, resultMsg: null };
    memberCont.idCheck(userid, (err, result) => {
        if (err) {
            jsonData.result = 400;
            jsonData.resultMsg = err;
            res.status(resultJson.result).json(resultJson);
        } else {
            if (result != 0) {
                jsonData.result = 201;
                jsonData.resultMsg = "일치하는 사용자가 있음";
            } else {
                jsonData.result = 200;
                jsonData.resultMsg = "일치하는 사용자가 없음";
            }
            res.status(jsonData.result).json(jsonData);
        }
    });
});

router.route("/findId").post((req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    const jsonData = {};
    memberCont.findId(name, email, (err, result) => {
        if (err) {
            jsonData.result = 400;
            jsonData.resultMsg = err;
        } else {
            if (result != null) {
                jsonData.result = 200;
                jsonData.resultMsg = "아이디 찾기 성공";
                jsonData.userid = result.substr(0, result.length - 3) + "***";
            } else {
                jsonData.result = 201;
                jsonData.resultMsg = "일치하는 사용자 없음";
            }
        }
        res.status(jsonData.result).json(jsonData);
    });
});

router.route("/name").get((req, res) => {
    const userkey = req.query.userkey;

    const jsonData = {};
    memberCont.getName(userkey, (err, result) => {
        if (err) {
            jsonData.result = 400;
            jsonData.resultMsg = err;
        } else {
            if (result != null) {
                jsonData.result = 200;
                jsonData.resultMsg = "아이디 찾기 성공";
                jsonData.name = result;
            } else {
                jsonData.result = 201;
                jsonData.resultMsg = "일치하는 사용자 없음";
            }
        }
        res.status(jsonData.result).json(jsonData);
    });
});

module.exports = router;
