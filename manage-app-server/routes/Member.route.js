var Member = require('../controllers/Member.controller');

module.exports = (router) => {
  router.post('/create', Member.createMember);
  router.get('/get', Member.getMembers);
  router.get('/get/:id', Member.getMemberByID);
  router.put('/update/:id', Member.updateMember);
  router.delete('/remove/:id', Member.remove);
};
