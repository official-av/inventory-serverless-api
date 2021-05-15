import * as postgres from 'postgres';
import * as Config from 'lamcfg';
import * as Logger from 'lamlog';

export class DBConnect {
	public dbClient: any;

	constructor(private config: Config, private logger: Logger) {
		this.logger = logger.child('postgres connection');
		this.getConnection();
	}

	private async getConnection() {
		const initOptions = {
			host: this.config.get('DefaultDBHost'),
			port: this.config.get('DefaultDBPort'),
			user: this.config.get('DefaultDBUser'),
			database: this.config.get('DefaultDBName'),
			password: this.config.get('DefaultDBPassword'),
			idle_timeout: 2 // timeout idle connection after 2 seconds
		} as ConnectionOptions;

		try {
			if (!this.dbClient) {
				this.dbClient = await postgres(initOptions);
				this.logger.info('db logged in successfully');
			}
		} catch (ex) {
			console.log("db connection error================================================");
			this.logger.error('dbConnect Error', ex);
			console.log(ex);
			throw ex;
		}
	}
}

export interface ConnectionOptions {
	host: string;
	port: number;
	user: string;
	database: string;
	password: string;
}
