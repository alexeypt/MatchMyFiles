import crypto from 'crypto';
import exifReader from 'exif-reader';
import fs2 from 'fs';
import fs from 'fs/promises';
import path from "path";
import sharp from 'sharp';
import stream from 'stream/promises';

import socketIO from '@/common/helpers/socketIOClient';


export interface FileInfoModel {
    relativePath: string;
    absolutePath: string;
    size: number;
    hash: string;
    name: string;
    fullName: string;
    extension: string;
    latitude: number | null;
    longitude: number | null;
}

export interface FolderInfoModel {
    name: string
    relativePath: string;
    absolutePath: string;
    files: FileInfoModel[];
    childFolders: FolderInfoModel[];
}


export class RootFolderProcessor {
    private totalItemsCount: number = 0;
    private itemsLeftToProcess: number = 0;
    private queue: Set<Promise<any>> = new Set();

    constructor(
        private rootFolderPath: string,
        private rootFolderId: number,
        private maxConcurrencyLimit = 1
    ) {

    }

    public async start() {
        var startTime = performance.now();
        // TODO: move event names to constants
        socketIO.io.emit('rootFolder:processingStatus', this.rootFolderId, 0, null);

        await this.calculateFilesCount(this.rootFolderPath);

        this.itemsLeftToProcess = this.totalItemsCount;

        const result = await this.processDirectory(this.rootFolderPath);

        var endTime = performance.now();
        console.log(`Processing of ${this.rootFolderId} takes ${endTime - startTime} milliseconds`);

        return result;
    }

    private async calculateFilesCount(folderPath: string): Promise<void> {
        const items = await fs.readdir(folderPath);
        this.totalItemsCount += items.length - 1;

        for (const item of items) {
            const itemPath = path.join(folderPath, item);
            const stats = await fs.stat(itemPath);
            if (stats.isDirectory()) {
                await this.calculateFilesCount(itemPath);
            }
        }
    }

    private async processDirectory(folderPath: string) {
        const folderInfo: FolderInfoModel = {
            name: path.basename(folderPath),
            absolutePath: folderPath,
            relativePath: path.relative(this.rootFolderPath, folderPath),
            files: [],
            childFolders: []
        };

        const items = await fs.readdir(folderPath);
        for (const item of items) {
            const itemPath = path.join(folderPath, item);
            const stats = await fs.stat(itemPath);
            if (stats.isDirectory()) {
                const childFolderInfo = await this.processDirectory(itemPath);
                folderInfo.childFolders.push(childFolderInfo);
            } else {
                if (this.queue.size > this.maxConcurrencyLimit) {
                    await Promise.all(Array.from(this.queue.values()));
                }

                const promise = this.getFileData(itemPath)
                    .then(fileData => {
                        folderInfo.files.push(fileData);
                        this.itemsLeftToProcess--;

                        if (this.itemsLeftToProcess % 10 === 0) {
                            socketIO.io.emit(
                                'rootFolder:processingStatus',
                                this.rootFolderId,
                                (this.totalItemsCount - this.itemsLeftToProcess) / this.totalItemsCount * 100,
                                `${(this.totalItemsCount - this.itemsLeftToProcess)} / ${this.totalItemsCount}`);
                        }
                    })
                    .finally(() => this.queue.delete(promise));

                this.queue.add(promise);
            }
        }

        await Promise.all(Array.from(this.queue.values()));

        return folderInfo;
    }

    private async computeHash(filepath: string) {
        const input = fs2.createReadStream(filepath);
        const hash = crypto.createHash('sha256');
        
        // Connect the output of the `input` stream to the input of `hash`
        // and let Node.js do the streaming
        await stream.pipeline(input, hash);
      
        return hash.digest('hex');
    }

    private async getFileData(filePath: string): Promise<FileInfoModel> {
        const stats = await fs.stat(filePath);
        const relativePath = path.relative(this.rootFolderPath, filePath);
        // const fileContent = await fs.readFile(filePath);
        // const hash = await this.computeHash(filePath);
        // TODO: use contentHash for small files and file size for large files as unique key for duplications
        const hash = stats.size.toString();
        const ext = path.extname(filePath);
        const fileName = path.basename(filePath);
        const fileNameWithoutExt = path.basename(filePath, ext);
        let latitude = null;
        let longitude = null;

        if (ext === '.jpg' || ext === '.jpeg') {
            try {
                const fileContent = await fs.readFile(filePath);
                const metadata = await sharp(fileContent).metadata();
                if (metadata.exif) {
                    var exifMetadata = exifReader(metadata.exif);
                    if (exifMetadata.GPSInfo?.GPSLatitude && exifMetadata.GPSInfo?.GPSLongitude) {
                        latitude = exifMetadata.GPSInfo.GPSLatitude[0] + exifMetadata.GPSInfo.GPSLatitude[1] / 60 + exifMetadata.GPSInfo.GPSLatitude[2] / 3600;
                        longitude = exifMetadata.GPSInfo.GPSLongitude[0] + exifMetadata.GPSInfo.GPSLongitude[1] / 60 + exifMetadata.GPSInfo.GPSLongitude[2] / 3600;
                    }
                }
            } catch (error) {
                console.error(`Error parsing EXIF data for file ${filePath}:`, error);
            }
        }

        return {
            fullName: fileName,
            name: fileNameWithoutExt,
            relativePath,
            absolutePath: filePath,
            extension: ext,
            hash,
            size: stats.size,
            latitude,
            longitude
        };
    }
}

