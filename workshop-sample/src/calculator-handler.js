/*
  Multi-Cloud Core and Middlewares import.
*/
const {
  App, HTTPBindingMiddleware, StorageMiddleware, createValidationMiddleware,
} = require('@multicloud/sls-core');

/*
 Imports from the cloud providers where we will deploy the handler.
*/
const { AzureModule } = require('@multicloud/sls-azure');
const { AwsModule } = require('@multicloud/sls-aws');
const { GcpModule } = require('@multicloud/sls-gcp');
/*
  Import that allows us to generate a UUID session ID.
*/
const { v4: uuidv4 } = require('uuid');

/*
 Your business logic imports.
*/
const { operation } = require('./calculator');

/*
  Imports that give us an abstraction of the cloud provider storage read and write.
*/
const { readAsString, writeAString } = require('./storage');

/*
  Validation function Import.
*/
const { inputValidationOptions } = require('./validate-input');

/*
 Multi-Cloud Library constructor allows multiple cloud providers.
 In this case, we are going to use Azure and AWS, so we instantiate those modules.
*/
const app = new App(new AzureModule(), new AwsModule(), new GcpModule());

/*
  The name of the container. The Bucket name in AWS and Container in Azure must be the same.
  This name is the same that's appears in the serverless-aws.yml and the azuredeploy.json.
*/
const CONTAINER = 'calculator-workshop';

/*
  A validation function is assigned to the createValidationMiddleware() middleware.
  For more information about the validation options, read the validation-input.js.
*/
const InputValidationMiddleware = createValidationMiddleware(inputValidationOptions());

/*
 An array of middlewares is assigned to the app function. Each middleware in this array
 will be part of the middleware pipeline. For more information about the middlewares,
 read the middleware section of the README.md.
 The context param has the cloud context of the current cloud provider.
*/
module.exports.handler = app.use(
  [HTTPBindingMiddleware(), InputValidationMiddleware, StorageMiddleware()],
  async (context) => {
    /*
     This is the business logic of the handler. Get the operands, operator and
     sessionId from the request body.
    */
    const response = {};
    const {
      firstOperand, secondOperand, operator, sessionId,
    } = context.req.body;
    let previousResult;
    /*
     If exists a sessionId, a readAsString() function is called with a read options,
     and if not, it will create a new sessionId.
    */
    if (sessionId) {
      /*
        The readAsString function needs the context to get the read function
        from context.storage.read() as well as to known the provider who is
        calling it from the context.providerType.
        For more information about the readAsString() function, read the storage.js.
      */
      const readOptions = { container: CONTAINER, path: `${sessionId}.txt` };
      previousResult = await readAsString(context, readOptions);
    }
    response.sessionId = sessionId || uuidv4();

    /*
      We get result form the math operation and we assigned to the response.result.
    */

    const result = operation(previousResult || firstOperand, secondOperand, operator);
    response.result = result;
    /*
      The result of the math operation is written to the container of the Cloud provider
      by calling the writeAString() function. This function receives the context of the current
      cloud provider and the write options, then prepares the data and writes the operation
      result in a file inside of a cloud container.
      Finally, the context will return a response with the result of the math operation
      and 200 HTTP status code.
    */
    const writeOptions = { container: CONTAINER, path: `${response.sessionId}.txt`, body: result.toString() };
    await writeAString(context, writeOptions);
    context.send(response, 200);
  },
);
