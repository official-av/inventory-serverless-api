import type {AWS} from '@serverless/typescript';
import {env} from "./environment";
import {login, register, verifyToken} from "./src/functions/authoriser";
import {user} from './src/functions/user';
import {inventory} from './src/functions/inventory';

const serverlessConfiguration: AWS = {
	service: 'inventory-endpoints',
	frameworkVersion: '2',
	custom: {
		webpack: {
			webpackConfig: './webpack.config.js',
			includeModules: true
		}
	},
	plugins: ['serverless-webpack',
		'serverless-offline'],
	provider: {
		name: 'aws',
		profile: 'serverless-admin',
		region: 'us-east-1',
		runtime: 'nodejs12.x',
		// deploymentBucket: {
		// 	name: 'anmol-dev1'
		// },
		memorySize: 128,
		vpc: {
			securityGroupIds: [env.DefaultSecurityGroupId],
			subnetIds: [env.DefaultSubnetId1, env.DefaultSubnetId2, env.DefaultSubnetId3]
		},
		iamRoleStatements: [
			{
				Effect: 'Allow',
				Action: ['ses:*'],
				Resource: ['*']
			}
		],
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			...env
		},
		// resourcePolicy: [{
		// 	Principal: '*',
		// 	Effect: 'Allow',
		// 	Action: 'execute-api:Invoke',
		// 	Resource: 'execute-api:/*/*/*'
		// }],
		lambdaHashingVersion: '20201221',
	},
	resources: {
		Resources: {
			GatewayResponseDefault4XX: {
				Type: "AWS::ApiGateway::GatewayResponse",
				Properties: {
					ResponseParameters: {
						'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
						'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
					},
					ResponseType: "DEFAULT_4XX",
					RestApiId: {
						Ref: "ApiGatewayRestApi"
					}
				}
			}
		}
	},
	functions: {verifyToken, login, register, inventory, user}
}

module.exports = serverlessConfiguration;
