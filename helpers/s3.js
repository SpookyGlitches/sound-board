const {
	DeleteObjectsCommand,
	DeleteObjectCommand,
	ListObjectsCommand,
	PutObjectCommand,
	GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/s3Client");

let bucketParams = {
	Bucket: process.env.AWS_BUCKET_NAME,
};

async function deleteObjects(key) {
	bucketParams.Key = key;
	const { Contents } = await s3Client.send(
		new ListObjectsCommand(bucketParams)
	);
	delete bucketParams.Key;
	bucketParams.Delete = { Objects: Contents };
	await s3Client.send(new DeleteObjectsCommand(bucketParams));
}

async function deleteObject(key) {
	bucketParams.Key = key;
	await s3Client.send(new DeleteObjectCommand(bucketParams));
}

async function uploadObject(file, fileName) {
	bucketParams.Body = file;
	bucketParams.Key = fileName;
	await s3Client.send(new PutObjectCommand(bucketParams));
}

async function getObject(key) {
	bucketParams.Key = key;
	return await s3Client.send(new GetObjectCommand(bucketParams));
}

module.exports = {
	deleteObjects,
	deleteObject,
	uploadObject,
	getObject,
};
