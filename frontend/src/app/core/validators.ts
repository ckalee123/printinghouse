export const PASSWORD_REGEX = /^(?=.{8,12}$)(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z].*$/;
export const REGISTRATION_NUMBER_REGEX = /^\d{8}$/;
export const PIB_REGEX = /^[1-9]\d{8}$/;

export const PASSWORD_HINT =
  "Lozinka mora imati 8-12 karaktera, bar jedno veliko slovo, jedan broj i jedan specijalni karakter, i mora početi slovom.";
