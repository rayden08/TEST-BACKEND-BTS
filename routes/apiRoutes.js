
const createError = require('http-errors');
const express = require('express');

const apiModel = require("../models/apiModel");

const moment = require("moment-timezone");
const router = express.Router();


const jwt = require('jsonwebtoken');


const jwtKeyAccessToken=process.env.JWT_KEY_ACCESS_TOKEN;

const expiredInAccessToken = '1d';



function authenticateAccessToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) return res.status(401).json({ message: 'Access token missing' });
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) return res.status(401).json({message: 'Invalid Authorization format. Use Bearer <token>',});

    jwt.verify(token,jwtKeyAccessToken, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired access token' });
        req.validAccessToken = user;
        next(); 
    });
}

router.post('/login',async function(req, res, next) {
    try {
       
        const username = req.body.username;
        const password = req.body.password;
        
    
        //region Check apakah user terdaftar
        let isAuthenticated = await apiModel.isAuthenticated(username, password);
        if (!isAuthenticated) {
            return res.status(401).send({
                status: 'failure',
                message: "Login tidak berhasil. Periksa kembali username atau password Anda",
                data: null
            });
            
        }

       
        //create access token and refresh token
       
        let accessToken = jwt.sign({user: isAuthenticated}, jwtKeyAccessToken,{ expiresIn: expiredInAccessToken });
       


        

       

        return res.status(200).send({
            status: "success",
            message: "",
            data: {
                access_token: accessToken,
            }
        });

    } catch (err) {
        next(createError(err.code, err.message));
    }
});

router.post('/regiter',async function(req, res, next) {
    try {
       
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        
        const passHash = await userModel.createPassHash(password);

        const data = {        
            username: username,
            password: passHash,
            email: email,
        };

        let insertData = await apiModel.insert( "users", data);
       
        if(insertData){
            return res.status(200).send({
                status: "success",
                message: "Data berhasil di daftarkan",
                
            });
        }
        else{
            return res.status(500).send({
                status: "failure",
                message: "Data tidak berhasil di daftarkan",
                
            });
        }

    } catch (err) {
        next(createError(err.code, err.message));
    }
});


router.get('/checklist',authenticateAccessToken,async function(req, res, next) {
    try {
       
       
        
        let userIdToken = req.validAccessToken.user.user_id;
        let checkListUser = await apiModel.getChecklistUser(userIdToken)
        

        return res.status(200).send({
            status: "success",
            message: "",
            data: checkListUser
            
        });

    

    } catch (err) {
        next(createError(err.code, err.message));
    }
});

router.post('/checklist',authenticateAccessToken,async function(req, res, next) {
    try {
       
       
        
        let userIdToken = req.validAccessToken.user.user_id;
        let nameChecklist  = req.body.name

        const data = {        
            name:nameChecklist,
            user_id:userIdToken
        };

        let insertData = await apiModel.insert( "checklist", data);
        

        if(insertData){
            return res.status(200).send({
                status: "success",
                message: "Data berhasil di daftarkan",
                
            });
        }
        else{
            return res.status(500).send({
                status: "failure",
                message: "Data tidak berhasil di daftarkan",
                
            });
        }

    

    } catch (err) {
        next(createError(err.code, err.message));
    }
});

router.delete('/checklist/:checklistId',authenticateAccessToken,async function(req, res, next) {
    try {


        const checklistId = req.params.checklistId;
        

    

        let isSuccess = await apiModel.deleteChecklistByChecklistId(checklistId)
        

        if(isSuccess){
            return res.status(200).send({
                status: "success",
                message: "Data berhasil di hapus",
                
            });
        }
        else{
            return res.status(500).send({
                status: "failure",
                message: "Data tidak berhasil di hapus",
                
            });
        }

    

    } catch (err) {
        next(createError(err.code, err.message));
    }
});

router.get('/checklist/:checklistId/item',authenticateAccessToken,async function(req, res, next) {
    try {


        const checklistId = req.params.checklistId;
        

    
        let checkListItem = await apiModel.getChecklistItemByChecklistId(checklistId)
        
        

        return res.status(200).send({
            status: "success",
            message: "",
            data: checkListItem
            
        });

    

    } catch (err) {
        next(createError(err.code, err.message));
    }
});

router.post('/checklist/:checklistId/item',authenticateAccessToken,async function(req, res, next) {
    try {
       
       
        
        const checklistId = req.params.checklistId;
        let itemName  = req.body.itemName

        const data = {        
            item_name:itemName,
            checklist_id:checklistId
        };

        let insertData = await apiModel.insert( "checklist_item", data);
        

        if(insertData){
            return res.status(200).send({
                status: "success",
                message: "Data berhasil di daftarkan",
                
            });
        }
        else{
            return res.status(500).send({
                status: "failure",
                message: "Data tidak berhasil di daftarkan",
                
            });
        }

    

    } catch (err) {
        next(createError(err.code, err.message));
    }
});
router.get('/checklist/:checklistId/item/:checklistItemId',authenticateAccessToken,async function(req, res, next) {
    try {


        const checklistId = req.params.checklistId;
        const checklistItemId = req.params.checklistitemId;

    
        let checkListItem = await apiModel.getChecklistItemByChecklistIdAndChecklistItemId(checklistId,checklistItemId)
        
        

        return res.status(200).send({
            status: "success",
            message: "",
            data: checkListItem
            
        });

    

    } catch (err) {
        next(createError(err.code, err.message));
    }
});
router.put('/checklist/:checklistId/item/:checklistItemId',authenticateAccessToken,async function(req, res, next) {
    try {
       
       
        
        const checklistId = req.params.checklistId;
        const checklistItemId = req.params.checklistitemId;
        const isDone = req.body.isDone;
        
        const data = {        
            is_done:isDone,
            
        };

        const whereData = {

            checklist_id:checklistId,
            checklist_item_id:checklistItemId,
        };

        let isSuccess = await apiModel.update('checklist_item',data,whereData)
        

        if(isSuccess){
            return res.status(200).send({
                status: "success",
                message: "Data berhasil di hapus",
                
            });
        }
        else{
            return res.status(500).send({
                status: "failure",
                message: "Data tidak berhasil di hapus",
                
            });
        }

    

    } catch (err) {
        next(createError(err.code, err.message));
    }
});


router.delete('/checklist/:checklistId/item/:checklistItemId',authenticateAccessToken,async function(req, res, next) {
    try {
       
       
        
        const checklistId = req.params.checklistId;
        const checklistItemId = req.params.checklistitemId;
        

        

        let isSuccess = await apiModel.deleteChecklistItemByChecklistIdAndChecklistItemId(checklistId,checklistItemId)
        

        if(isSuccess){
            return res.status(200).send({
                status: "success",
                message: "Data berhasil di hapus",
                
            });
        }
        else{
            return res.status(500).send({
                status: "failure",
                message: "Data tidak berhasil di hapus",
                
            });
        }

    

    } catch (err) {
        next(createError(err.code, err.message));
    }
});

router.put('/checklist/:checklistId/item/rename/:checklistItemId',authenticateAccessToken,async function(req, res, next) {
    try {
       
       
        
        const checklistId = req.params.checklistId;
        const checklistItemId = req.params.checklistitemId;
        const itemName = req.body.itemName;
        
        const data = {        
            item_name:itemName,
            checklist_id:checklistId
        };

        const whereData = {

            checklist_id:checklistId,
            checklist_item_id:checklistItemId,
        };

        let isSuccess = await apiModel.update('checklist_item',data,whereData)
        

        if(isSuccess){
            return res.status(200).send({
                status: "success",
                message: "Data berhasil di hapus",
                
            });
        }
        else{
            return res.status(500).send({
                status: "failure",
                message: "Data tidak berhasil di hapus",
                
            });
        }

    

    } catch (err) {
        next(createError(err.code, err.message));
    }
});



module.exports = router;