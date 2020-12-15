const { CloudContextBuilder } = require('@multicloud/sls-core');
const mock = require('./storage');
const { handler } = require('./calculator-handler');

jest.mock('./storage');

describe('Calculator with storage workshop', () => {
  it('Should add two numbers, return the result and a status code 200', async () => {
    const builder = new CloudContextBuilder();
    const context = await builder
      .asHttpRequest({})
      .withRequestBody(
        {
          firstOperand: '10',
          secondOperand: '15',
          operator: '+',
        },
      )
      .withRequestMethod('POST')
      .invokeHandler(handler);

    expect(context.res.status).toEqual(200);
    expect(context.res.body.result).toEqual(25);
    expect(context.res.body).toHaveProperty('sessionId');
  });

  it('Should add the number from the request and the number from storage, return the result and a status code 200', async () => {
    const builder = new CloudContextBuilder();
    const addMock = jest.spyOn(mock, 'readAsString');
    addMock.mockImplementation(() => '20');
    const context = await builder
      .asHttpRequest({})
      .withRequestBody(
        {
          sessionId: '0e1cb016-f9f0-46ba-89cb-6bf4669c94d6',
          secondOperand: '15',
          operator: '+',
        },
      )
      .withRequestMethod('POST')
      .invokeHandler(handler);
    expect(context.res.status).toEqual(200);
    expect(context.res.body.result).toEqual(35);
    expect(context.res.body).toHaveProperty('sessionId');
  });

  it('Should substract the number from the request to the number from storage, return the result and a status code 200', async () => {
    const builder = new CloudContextBuilder();
    const addMock = jest.spyOn(mock, 'readAsString');
    addMock.mockImplementation(() => '20');
    const context = await builder
      .asHttpRequest({})
      .withRequestBody(
        {
          sessionId: '0e1cb016-f9f0-46ba-89cb-6bf4669c94d6',
          secondOperand: '15',
          operator: '-',
        },
      )
      .withRequestMethod('POST')
      .invokeHandler(handler);
    expect(context.res.status).toEqual(200);
    expect(context.res.body.result).toEqual(5);
    expect(context.res.body).toHaveProperty('sessionId');
  });
  it('Should divide the number from the storage by the number from the request, return the result and a status code 200', async () => {
    const builder = new CloudContextBuilder();
    const addMock = jest.spyOn(mock, 'readAsString');
    addMock.mockImplementation(() => '20');
    const context = await builder
      .asHttpRequest({})
      .withRequestBody(
        {
          sessionId: '0e1cb016-f9f0-46ba-89cb-6bf4669c94d6',
          secondOperand: '4',
          operator: '/',
        },
      )
      .withRequestMethod('POST')
      .invokeHandler(handler);
    expect(context.res.status).toEqual(200);
    expect(context.res.body.result).toEqual(5);
    expect(context.res.body).toHaveProperty('sessionId');
  });

  it('Should multiply the number from the request and the number from storage, return the result and a status code 200', async () => {
    const builder = new CloudContextBuilder();
    const addMock = jest.spyOn(mock, 'readAsString');
    addMock.mockImplementation(() => '20');
    const context = await builder
      .asHttpRequest({})
      .withRequestBody(
        {
          sessionId: '0e1cb016-f9f0-46ba-89cb-6bf4669c94d6',
          secondOperand: '5',
          operator: '*',
        },
      )
      .withRequestMethod('POST')
      .invokeHandler(handler);
    expect(context.res.status).toEqual(200);
    expect(context.res.body.result).toEqual(100);
    expect(context.res.body).toHaveProperty('sessionId');
  });

  it('return NaN and status code 200 when divided by 0', async () => {
    const builder = new CloudContextBuilder();
    const context = await builder
      .asHttpRequest()
      .withRequestBody(
        {
          firstOperand: '10',
          secondOperand: '0',
          operator: '/',
        },
      )
      .withRequestMethod('POST')
      .invokeHandler(handler);

    expect(context.res.status).toEqual(200);
    expect(context.res.body.result).toEqual('NaN');
    expect(context.res.body).toHaveProperty('sessionId');
  });

  it('Should return Invalid Operand and status code 400 when at least one param is not a number', async () => {
    const builder = new CloudContextBuilder();
    const context = await builder
      .asHttpRequest()
      .withRequestBody(
        {
          firstOperand: '10',
          secondOperand: 'This is not a number',
          operator: '/',
        },
      )
      .withRequestMethod('POST')
      .invokeHandler(handler);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual({ result: 'Invalid Operand' });
  });

  it('Should return Invalid Input and status code 400 when at least one param is undefined', async () => {
    const builder = new CloudContextBuilder();
    const context = await builder
      .asHttpRequest()
      .withRequestBody(
        {
          secondOperand: '1',
          operator: '/',
        },
      )
      .withRequestMethod('POST')
      .invokeHandler(handler);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual({ result: 'Invalid Input' });
  });

  it('Should return Invalid Operator and status code 400 when a non supported operation is requested', async () => {
    const builder = new CloudContextBuilder();
    const context = await builder
      .asHttpRequest()
      .withRequestBody(
        {
          firstOperand: '10',
          secondOperand: '12',
          operator: 'ñ',
        },
      )
      .withRequestMethod('POST')
      .invokeHandler(handler);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual({ result: 'Invalid Operator' });
  });
});
