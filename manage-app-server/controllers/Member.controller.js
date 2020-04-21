const Member = require('./../models/Member.model');
const {
  dateValidation,
  fullNameValidation,
  phoneNumberValidation,
  normalizeHumanName,
  formatPhoneNumber,
} = require('./../utils/helpers');
module.exports = {
  createMember: (req, res, next) => {
    var { full_name, phone_number, birthday } = req.body;
    if (!full_name || !phone_number || !birthday) {
      return res.status(400).send({
        message: 'full_name, phone_number, birthday are required',
      });
    }
    full_name = normalizeHumanName(full_name);
    if (!dateValidation(birthday))
      return res.status(400).send({
        message: 'birthday format is invalid',
      });
    if (!phoneNumberValidation(phone_number))
      return res.status(400).send({
        message: 'phonenumber format is invalid',
      });
    if (!fullNameValidation(full_name))
      return res.status(400).send({
        message: 'full_name format is invalid',
      });
    phone_number = formatPhoneNumber(phone_number);
    var member = { full_name, phone_number, birthday };
    Member.create(member)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  },
};
