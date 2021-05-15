export const env = {
	stage: "dev",
	DefaultAWSRegion: "us-east-1",
	DefaultDBType: "postgressql",
	DefaultDBHost: "xxxxx.us-east-1.rds.amazonaws.com",
	DefaultDBPort: "5432",
	DefaultDBUser: "postgres",
	DefaultDBPassword: "xxxxx",
	DefaultDBName: "postgres",
	DefaultPasswordRegex: "(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}",
	DefaultJWTSecret: "xxxxx",
	DefaultTokenExpiry: "2592000", // 30 days
	DefaultUIURL: "http://xxxx.s3-website-us-east-1.amazonaws.com/",
	DefaultFromMail: "noreply@xxxx.com",
	DefaultAWSAccessKey: "xxxx",
	DefaultAWSSecretKey: "xxxx",
	DefaultSecurityGroupId: "sg-xxxxx",
	DefaultSubnetId1: "subnet-xxxxxx",
	DefaultSubnetId2: "subnet-xxxxxx",
	DefaultSubnetId3: "subnet-xxxxxx",
}
