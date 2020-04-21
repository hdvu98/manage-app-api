const express = require('express');
var router = express.Router();
var Project = require('../controllers/Project.controller');

router.post('/create', Project.createProject);
router.get('/get', Project.getProjects);
router.get('/get/:id', Project.getProjectByID);
router.put('/update/:id', Project.updateProject);
router.delete('/remove/:id', Project.remove);
router.put('/assign/:id', Project.assignMemberToProject);
module.exports = router;
