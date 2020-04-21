const express = require('express');
var router = express.Router();
var Member = require('../controllers/Member.controller');

router.post('/create', Member.createMember);
router.get('/get', Member.getMembers);
router.get('/get/:id', Member.getMemberByID);
router.put('/update/:id', Member.updateMember);
router.delete('/remove/:id', Member.remove);
module.exports = router;
