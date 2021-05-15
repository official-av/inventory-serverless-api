import * as Logger from 'lamlog';
import * as Config from 'lamcfg';
import * as AWS from 'aws-sdk'

export class AWSSESHelper {

	constructor(private logger: Logger, private config: Config) {
		this.logger = this.logger.child('mail service');
		// Set the region and credentials
		AWS.config.update({
			region: this.config.get("DefaultAWSRegion"),
			accessKeyId: this.config.get("DefaultAWSAccessKey"),
			secretAccessKey: this.config.get("DefaultAWSSecretKey"),
		});
	}

	public async sendMail(ToAddresses: Array<string>, messageBody: string, subject: string, from: string) {
		try {
			console.log('inside send mail');
			const ses = new AWS.SES({apiVersion: "2010-12-01"});
			const params = {
				Destination: {
					ToAddresses: ToAddresses // Email address/addresses that you want to send your email
				},
				Message: {
					Body: {
						Text: {
							Charset: "UTF-8",
							Data: messageBody
						}
					},
					Subject: {
						Charset: "UTF-8",
						Data: subject
					}
				},
				Source: from
			};
			console.log('params', params);
			return await ses.sendEmail(params);
		} catch (e) {
			this.logger.error(e, 'error while sending mail');
			console.log('error', e);
			throw e;
		}
	}
}
