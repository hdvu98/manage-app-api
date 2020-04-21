var Member = require('../controllers/Member.controller');

module.exports = (router) => {
  router.post('/create', Member.createMember);
};
