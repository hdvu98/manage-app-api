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
  getMembers: (req, res, next) => {
    Member.get({})
      .then((data) => res.send(data))
      .catch((err) => res.status(400).send({ message: err.message }));
  },
  getMemberByID: (req, res, next) => {
    Member.get({ _id: req.params.id })
      .then((data) => {
        if (data.length > 0) res.send(data[0]);
        res.send(data);
      })
      .catch((err) => res.status(400).send({ message: err.message }));
  },
  updateMember: (req, res, next) => {
    var { full_name, phone_number, birthday } = req.body;
    var member = {};
    if (full_name) {
      full_name = normalizeHumanName(full_name);
      if (!fullNameValidation(full_name))
        return res.status(400).send({
          message: 'full_name format is invalid',
        });
      member = { ...member, full_name: full_name };
    }
    if (phone_number) {
      if (!phoneNumberValidation(phone_number))
        return res.status(400).send({
          message: 'phonenumber format is invalid',
        });
      phone_number = formatPhoneNumber(phone_number);
      member = { ...member, phone_number: phone_number };
    }
    if (birthday) {
      if (!dateValidation(birthday))
        return res.status(400).send({
          message: 'birthday format is invalid',
        });
      member = { ...member, birthday: new Date(birthday) };
    }
    Member.update({ _id: req.params.id }, member)
      .then((data) => {
        if (!data)
          return res.status(400).send({ message: 'the member not exits' });
        return res.send(data);
      })
      .catch((err) => res.status(400).send({ message: err.message }));
  },
  remove: (req, res, next) => {
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: 'invaid id' });
    Member.delete({ _id: id })
      .then((data) => {
        if (data) return res.send({ message: `removed the member: ${id}` });
        else
          return res.status(400).send({ message: 'the memeber id not exits' });
      })
      .catch((err) => res.status(400).send({ message: err.message }));
  },
};
