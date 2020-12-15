/*
  This function is used to transform the Azure BlobDownloadResponse
  to a String.
*/
async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => {
      chunks.push(data.toString());
    });
    readableStream.on('end', () => {
      resolve(chunks.join(''));
    });
    readableStream.on('error', reject);
  });
}

/*
  The response of the function context.storage.read() differ between the
  implementation of Azure and AWS in the StorageMiddleware. Then we created a
  function called readAsString() that will return a string independently of
  which cloud provider context is currently used. Finally, if the function cant
  find the requested file, the function calls a context.send() to return
  an error message and a 400 HTTP status code.
*/
module.exports.readAsString = async (context, readOptions) => {
  let value;
  try {
    const buffer = await context.storage.read(readOptions);
    if (context.providerType === 'azure' || context.providerType === 'gcp') {
      value = await streamToString(buffer);
    } else {
      value = buffer.toString('utf-8');
    }
  } catch (e) {
    context.send({ result: e }, 400);
  }
  return value;
};

/*
  This function write data into a container of a cloud provider.
  Finally, if the function cant write into the requested file, the
  function calls a context.send() to return an error message and
  a 400 HTTP status code.
*/
module.exports.writeAString = async (context, writeOptions) => {
  try {
    await context.storage.write(writeOptions);
  } catch (e) {
    context.send({ result: e }, 400);
  }
};
