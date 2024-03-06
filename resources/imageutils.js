const { EC2Client, DescribeImagesCommand } = require("@aws-sdk/client-ec2");


const client = new EC2Client({ });

/**
 * @param 
 */
const listImageNames = async () => {
    const command = new DescribeImagesCommand({
        MaxResults: Number(10),
    });

    const { Contents } = await client.send(command);
  
    // if (!Contents.length) {
    //   const err = new Error(`No objects found in ${bucketName}`);
    //   err.name = "EmptyBucketError";
    //   throw err;
    // }
  
    // Map the response to a list of strings representing the keys of the Amazon Simple Storage Service (Amazon S3) objects.
    // Filter out any objects that don't have keys.
    return Contents;
  };
  
  /**
   * @typedef {{ httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', path: string }} LambdaEvent
   */
  
  /**
   *
   * @param {LambdaEvent} lambdaEvent
   */
  const routeRequest = (lambdaEvent) => {
    if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path === "/") {
      return handleGetRequest();
    }
  
    const error = new Error(
      `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`,
    );
    error.name = "UnimplementedHTTPMethodError";
    throw error;
  };
  
  // pass env from java code
  const handleGetRequest = async () => {
    // if (process.env.BUCKET === "undefined") {
    //   const err = new Error(`No bucket name provided.`);
    //   err.name = "MissingBucketName";
    //   throw err;
    // }
  
    const objects = await listImageNames();
    return buildResponseBody(200, objects);
  };
  
  /**
   * @typedef {{statusCode: number, body: string, headers: Record<string, string> }} LambdaResponse
   */
  
  /**
   *
   * @param {number} status
   * @param {Record<string, string>} headers
   * @param {Record<string, unknown>} body
   *
   * @returns {LambdaResponse}
   */
  const buildResponseBody = (status, body, headers = {}) => {
    return {
      statusCode: status,
      headers,
      body,
    };
  };
  
  /**
   *
   * @param {LambdaEvent} event
   */
  exports.handler = async (event) => {
    try {
      return await routeRequest(event);
    } catch (err) {
      console.error(err);
      return buildResponseBody(500, err.message || "Unknown server error");
    }
  };