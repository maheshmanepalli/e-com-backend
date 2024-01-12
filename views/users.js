const express = require('express');
const userModel = require('../Model/userSchema');
const router = express.Router();
// const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/getuser', async (req, res) => {
    let user = await userModel.find({})
    res.json(user)
})
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let exists = await userModel.findOne({ email });
        if (username === "") {
            return res.status(400).json({ message: "Username required" });
        } else if (email === "") {
            return res.status(400).json({ message: "Email required" });
        } else if (password === "") {
            return res.status(400).json({ message: "Password required" });
        }
        else if (exists) {
            return res.status(400).json({ message: "Email Id already exist" });
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await userModel.create({ username, email, password: hashedPassword });
            return res.status(200).json({ message: "User registerd successfully" ,status:200});
        }
    } catch (err) {
        console.log("Register Error :", err);
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let exists = await userModel.findOne({ email });
        if (email === "" || password === "") {
            return res.status(400).json({ message: "Email and password required" });
        } else if (!exists) {
            return res.status(404).json({ message: "Email doesn't exist, Register First" });
        } else {
            const passwordMatch = await bcrypt.compare(password, exists.password);
            if (!passwordMatch) {
                return res.status(400).json({ message: "Password doesn't match" });
            }
            const payload = {
                user: {
                    id: exists.id,
                },
            };
            /* console.log(payload);*/
            jwt.sign(
                payload,
                "jwtSecret",
                { expiresIn: 3600000 },
                async (err, token) => {
                    try {
                        if (err) throw err;
                        else {
                            await res.json({ token ,message:"user signin successful",status:200});
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            );
        }
    } catch (e) {
        console.log(e);
    }
});
// router.put('/updateuser/:id',async(req,res)=>{
//     let result = await userModel.updateOne( {_id: new ObjectId(req.params.id)},req.body)
//     res.json(result)
// })
// router.delete('/deleteuser/:id',async(req,res)=>{
//     let result = await userModel.deleteOne( {_id : new ObjectId(req.params.id)});
//     res.json(result)
// })

module.exports = router