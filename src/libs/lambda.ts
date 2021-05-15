import middy from "@middy/core"
import cors from '@middy/http-cors';
import middyJsonBodyParser from "@middy/http-json-body-parser"
import middyDoNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

export const middyfy = (handler) => {
	return middy(handler)
		.use(middyJsonBodyParser())
		.use(middyDoNotWaitForEmptyEventLoop({
		runOnBefore: true,
		runOnAfter: true,
		runOnError: true
	})).use(cors());
}
