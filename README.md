# Quickstart - JavaScript SDK v10 for Azure Storage

This repository implements the [quickstart](http://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-nodejs-v10) sample for the [Azure Storage v10 SDK for JavaScript](https://github.com/Azure/azure-storage-js).

## Set up
First, clone the repository on your machine:

```bash
git clone https://github.com/Azure-Samples/azure-storage-js-v10-quickstart.git
```

Then, switch to the appropriate folder:

```bash
cd azure-storage-js-v10-quickstart
```

Next, install the dependencies:

    npm install

Finally, rename the file `.env.example` to `.env` and add your values for *AZURE_STORAGE_ACCOUNT_NAME* and *AZURE_STORAGE_ACCOUNT_ACCESS_KEY*.


## Running the sample

To run the sample, run the following command on the terminal:

```bash
npm start
```

The output in the terminal will resemble something like this:

```bash
Containers:
 - container-a
 - container-b
Container: "demo" is created
Blob "quickstart.txt" is uploaded
Local file "./readme.md" is uploaded
Blobs in "demo" container:
 - quickstart.txt
 - readme-stream.md
 - readme.md
Downloaded blob content: "hello Node SDK"
Block blob "quickstart.txt" is deleted
Container "demo" is deleted
Done
```
