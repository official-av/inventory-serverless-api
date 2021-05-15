import type {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from "aws-lambda"
import type {FromSchema} from "json-schema-to-ts";
import {INVResponse} from "../_interfaces/INVResponse.interface";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: INVResponse) => {
	return {
		statusCode: response.status,
		body: JSON.stringify({message: response.message, data: response.data})
	}
}
