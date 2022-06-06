const continueRegister = (email, password, confirmPassword) => {
  if (email == null || email == "") {
    return "Please enter an email address";
  } else if (password == null || password == "") {
    return "Please enter a password";
  } else if (password !== confirmPassword) {
    return "Passwords do not match!";
  }
  return null;
};

const finishRegister = (name, address, institution) => {
  if (name == null || name == "") {
    return "Please enter a name";
  } else if (address == null || address == "") {
    return "Please enter an address";
  } else if (institution == null || institution == "") {
    return "Please enter an institution affiliation";
  }
  return null;
};

const passwordReset = (email) => {
  if (email == null || email == "") {
    return "Please enter an email address";
  }
  return null;
};

const login = (email, password) => {
  if (email == null || email == "") {
    return "Please enter an email address";
  } else if (password == null || password == "") {
    return "Please enter a password";
  }
  return null;
};

export default {
  continueRegister,
  finishRegister,
  passwordReset,
  login,
};
