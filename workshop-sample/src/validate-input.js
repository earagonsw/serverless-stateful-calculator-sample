/*
  Import that allows us to validate a UUID session ID.
*/
const { validate: uuidValidate } = require('uuid');

/*
  Import an object with the valid list operators.
*/
const { operators } = require('./calculator');

/*
  This class is used to structure the validation business logic
  into the middleware expected input. If the isValid property is
  true, it will let to continue the app workflow. If not, it will
  return a message in third argument of the constructor.
*/
class InputValidationResult {
  constructor(isValid, context, message) {
    this.isValid = isValid;
    this.context = context;
    this.message = message;
  }

  hasError() {
    return !this.isValid;
  }

  send() {
    return Promise.resolve(this.context.send(this.message, 400));
  }
}

/*
 Here we add a function that verify if the inputs are correct to make
 the requested math operation return a promise with the InputValidationResult().
*/
module.exports.inputValidationOptions = () => ({
  validate(context) {
    const {
      firstOperand, secondOperand, operator, sessionId,
    } = context.req.body;
    if (
      (firstOperand === undefined && sessionId === undefined)
      || secondOperand === undefined
      || operator === undefined
      || (firstOperand !== undefined && sessionId !== undefined)
    ) {
      return Promise.resolve(
        new InputValidationResult(false, context, { result: 'Invalid Input' }),
      );
    }
    if (sessionId !== undefined && !uuidValidate(sessionId)) {
      return Promise.resolve(
        new InputValidationResult(false, context, { result: 'Invalid sessionId' }),
      );
    }
    if ((firstOperand !== undefined && Number.isNaN(Number(firstOperand)))
      || Number.isNaN(Number(secondOperand))) {
      return Promise.resolve(
        new InputValidationResult(false, context, { result: 'Invalid Operand' }),
      );
    }
    if (operators[operator] === undefined) {
      return Promise.resolve(
        new InputValidationResult(false, context, { result: 'Invalid Operator' }),
      );
    }
    return Promise.resolve(new InputValidationResult(true, context));
  },
});
