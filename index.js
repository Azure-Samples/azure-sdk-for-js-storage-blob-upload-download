// tslint:disable:no-console
const {
    Aborter,
    BlobURL,
    BlockBlobURL,
    ContainerURL,
    ServiceURL,
    SharedKeyCredential,
    StorageURL,
    uploadStreamToBlockBlob,
    uploadFileToBlockBlob
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

async function showContainerNames(serviceURL, aborter) {

    let response;
    let marker;

    do {
        response = await serviceURL.listContainersSegment(aborter.withTimeout(ONE_MINUTE), marker);
        marker = response.marker;
        for(let container of response.containerItems) {
            console.log(` - ${ container.name }`);
        }
    } while (marker);
}

async function uploadLocalFile(containerURL, filePath, aborter) {

    filePath = path.resolve(filePath);

    const fileName = path.win32.basename(filePath);
    const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

    return await uploadFileToBlockBlob(aborter.withTimeout(ONE_MINUTE), filePath, blockBlobURL);
}

async function uploadStream(containerURL, filePath, aborter) {

    filePath = path.resolve(filePath);

    const fileName = path.win32.basename(filePath).replace('.md', '-stream.md');
    const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

    const stream = fs.createReadStream(filePath, {
      highWaterMark: FOUR_MEGABYTES,
    });

    const uploadOptions = {
        bufferSize: FOUR_MEGABYTES,
        maxBuffers: 5,
    };

    return await uploadStreamToBlockBlob(
                    aborter.withTimeout(ONE_MINUTE), 
                    stream, 
                    blockBlobURL, 
                    uploadOptions.bufferSize, 
                    uploadOptions.maxBuffers);
}

async function showBlobNames(containerURL, aborter) {

    let response;
    let marker;

    do {
        response = await containerURL.listBlobFlatSegment(aborter.withTimeout(ONE_MINUTE));
        marker = response.marker;
        for(let blob of response.segment.blobItems) {
            console.log(` - ${ blob.name }`);
        }
    } while (marker);
}

async function execute() {

    const containerName = "demo";
    const blobName = "quickstart.txt";
    const content = "hello!";
    const localFilePath = "./readme.md";

    const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
    const pipeline = StorageURL.newPipeline(credentials);
    const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);
    
    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);
    
    const aborter = Aborter.timeout(30 * ONE_MINUTE);

    console.log("Containers:");
    await showContainerNames(serviceURL, aborter);

    await containerURL.create(aborter.withTimeout(ONE_MINUTE));
    console.log(`Container: "${containerName}" is created`);

    await blockBlobURL.upload(aborter.withTimeout(ONE_MINUTE), content, content.length);
    console.log(`Blob "${blobName}" is uploaded`);
    
    await uploadLocalFile(containerURL, localFilePath, aborter);
    console.log(`Local file "${localFilePath}" is uploaded`);

    await uploadStream(containerURL, localFilePath, aborter);
    console.log(`Local file "${localFilePath}" is uploaded as a stream`);

    console.log(`Blobs in "${containerName}" container:`);
    await showBlobNames(containerURL, aborter);

    const downloadResponse = await blockBlobURL.download(aborter.withTimeout(ONE_MINUTE), 0);
    const downloadedContent = downloadResponse.readableStreamBody.read(content.length).toString();
    console.log(`Downloaded blob content: "${downloadedContent}"`);

    await blockBlobURL.delete(aborter.withTimeout(ONE_MINUTE))
    console.log(`Block blob "${blobName}" is deleted`);
    
    await containerURL.delete(aborter.withTimeout(ONE_MINUTE));
    console.log(`Container "${containerName}" is deleted`);
}

execute().then(() => console.log("Done")).catch((e) => console.log(e));
