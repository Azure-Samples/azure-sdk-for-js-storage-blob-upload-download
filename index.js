const { AbortController } = require("@azure/abort-controller");
const {
    BlobServiceClient,
    SharedKeyCredential,
    newPipeline
} = require('@azure/storage-blob');

const fs = require("fs");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;

async function showContainerNames(abortSignal, blobServiceClient) {
    for await (let container of blobServiceClient.listContainers({ 
        abortSignal: abortSignal
    })) {
        console.log(` - ${ container.name }`);
    }
}

async function uploadLocalFile(abortSignal, containerClient, filePath) {

    filePath = path.resolve(filePath);

    const fileName = path.basename(filePath);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    return await blockBlobClient.uploadFile(filePath, {
        abortSignal: abortSignal
    });
}

async function uploadStream(abortSignal, containerClient, filePath) {

    filePath = path.resolve(filePath);

    const fileName = path.basename(filePath).replace('.md', '-stream.md');
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const stream = fs.createReadStream(filePath, {
      highWaterMark: FOUR_MEGABYTES,
    });

    return await blockBlobClient.uploadStream(stream, FOUR_MEGABYTES, 5, {
        abortSignal: abortSignal
    });
}

async function showBlobNames(abortSignal, containerClient) {
    for await (let blob of containerClient.listBlobsFlat({
        abortSignal: abortSignal
    })) {
        console.log(` - ${ blob.name }`);
    }
}

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
        chunks.push(data.toString());
        });
        readableStream.on("end", () => {
        resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}

async function execute() {

    const containerName = "demo";
    const blobName = "quickstart.txt";
    const content = "hello!";
    const localFilePath = "./readme.md";

    const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
    const pipeline = newPipeline(credentials);
    const serviceURL = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;
    
    const blobServiceClient = new BlobServiceClient(serviceURL, pipeline);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    const abortSignal = AbortController.timeout(30 * ONE_MINUTE);

    console.log("Containers:");
    await showContainerNames(abortSignal, blobServiceClient);

    await containerClient.create({
        abortSignal: abortSignal
    });
    console.log(`Container: "${containerName}" is created`);

    await blockBlobClient.upload(content, content.length, {
        abortSignal: abortSignal
    });
    console.log(`Blob "${blobName}" is uploaded`);
    
    await uploadLocalFile(abortSignal, containerClient, localFilePath);
    console.log(`Local file "${localFilePath}" is uploaded`);

    await uploadStream(abortSignal, containerClient, localFilePath);
    console.log(`Local file "${localFilePath}" is uploaded as a stream`);

    console.log(`Blobs in "${containerName}" container:`);
    await showBlobNames(abortSignal, containerClient);

    const downloadResponse = await blockBlobClient.download(0, undefined, {
        abortSignal: abortSignal
    });
    const downloadedContent = await streamToString(downloadResponse.readableStreamBody);

    console.log(`Downloaded blob content: "${downloadedContent}"`);

    await blockBlobClient.delete({
        abortSignal: abortSignal
    });
    console.log(`Block blob "${blobName}" is deleted`);
    
    // List blobs again to demonstrate that deletion was effective
    console.log(`Blobs in "${containerName}" container:`);
    await showBlobNames(abortSignal, containerClient);

    await containerClient.delete({
        abortSignal: abortSignal
    });
    console.log(`Container "${containerName}" is deleted`);
}

execute().then(() => console.log("Done")).catch((e) => console.log(e));
