const moment = require('moment');
var mongoose = require('mongoose');
const lodash = require('lodash');
const dateFormat = require('../constants/dateFormat');
const { VN_PHONE, FULLNAME, PROJECT_NAME } = require('../constants/regex');

const dateValidation = (date) => {
  return moment(date, dateFormat.format, true).isValid();
};
const fullNameValidation = (name) => {
  if (!name || name.length === 0) {
    return false;
  }
  return FULLNAME.test(name);
};
const phoneNumberValidation = (phoneNumber) => {
  if (!phoneNumber || phoneNumber.length === 0) {
    return false;
  }
  return VN_PHONE.test(phoneNumber);
};
const projectNameValidation = (name) => {
  if (!name || name.length === 0) {
    return false;
  }
  return PROJECT_NAME.test(name);
};

const normalizeHumanName = (fullName) => {
  const newName = lodash.trim(fullName);
  const arrs = lodash.split(newName, ' ');
  let result = '';

  arrs.forEach((word) => {
    result += ` ${lodash.upperFirst(word)}`;
  });

  result = lodash.trimStart(result);

  return result;
};
const formatPhoneNumber = (phoneNumber) => {
  phoneNumber = phoneNumber.replace(/^(84|\+84)/, '0');
  return phoneNumber;
};
const objectIDValidation = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
  dateValidation,
  fullNameValidation,
  phoneNumberValidation,
  projectNameValidation,
  normalizeHumanName,
  formatPhoneNumber,
  objectIDValidation,
};
