import crypto from 'crypto';
import exifReader from 'exif-reader';
import fs2 from 'fs';
import fs from 'fs/promises';
import path from "path";
import sharp from 'sharp';
import stream from 'stream/promises';

import { roundNumber } from '@/common/helpers/numberHelper';
import socketIO from '@/common/helpers/socketIOClient';
import SocketEventType from '@/common/types/socketEventType';


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
    createdDate: Date;
    modifiedDate: Date;
    contentModifiedDate: Date;
}

export interface FolderInfoModel {
    name: string
    relativePath: string;
    absolutePath: string;
    size: number;
    createdDate: Date;
    modifiedDate: Date;
    contentModifiedDate: Date;
    files: FileInfoModel[];
    childFolders: FolderInfoModel[];
}

const MAX_SIZE_TO_GENERATE_CONTENT_HASH = 5000000;

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
        socketIO.io.emit(SocketEventType.RootFolderProcessingStatus, this.rootFolderId, 0, null);

        await this.calculateFilesCount(this.rootFolderPath);

        this.itemsLeftToProcess = this.totalItemsCount;

        const stats = await fs.stat(this.rootFolderPath);
        const result = await this.processDirectory(this.rootFolderPath, stats);

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

    private async processDirectory(folderPath: string, stats: fs2.Stats) {
        const folderInfo: FolderInfoModel = {
            name: path.basename(folderPath),
            absolutePath: folderPath,
            relativePath: path.relative(this.rootFolderPath, folderPath),
            createdDate: stats.birthtime,
            modifiedDate: stats.ctime,
            contentModifiedDate: stats.mtime,
            size: 0,
            files: [],
            childFolders: []
        };

        const items = await fs.readdir(folderPath);
        for (const item of items) {
            const itemPath = path.join(folderPath, item);
            const stats = await fs.stat(itemPath);
            if (stats.isDirectory()) {
                const childFolderInfo = await this.processDirectory(itemPath, stats);
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
                                SocketEventType.RootFolderProcessingStatus,
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

        folderInfo.size = folderInfo.childFolders.map(folder => Number(folder.size))
            .concat(folderInfo.files.map(file => Number(file.size)))
            .reduce((acc, size) => acc + size, 0);

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

        let hash = stats.size.toString();

        if (stats.size < MAX_SIZE_TO_GENERATE_CONTENT_HASH) {
            hash = await this.computeHash(filePath);
        }

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
                    const exifMetadata = exifReader(metadata.exif);
                    const gpsLatitude = exifMetadata.GPSInfo?.GPSLatitude;
                    const gpsLongitude = exifMetadata.GPSInfo?.GPSLongitude;
                    if (gpsLatitude && gpsLongitude) {
                        latitude = roundNumber(gpsLatitude[0] + gpsLatitude[1] / 60 + gpsLatitude[2] / 3600, 4);
                        longitude = roundNumber(gpsLongitude[0] + gpsLongitude[1] / 60 + gpsLongitude[2] / 3600, 4);
                    }
                }
            } catch (error) {
                console.error(`Error parsing EXIF data for file: ${filePath}`, error);
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
            createdDate: stats.birthtime,
            modifiedDate: stats.ctime,
            contentModifiedDate: stats.mtime,
            latitude,
            longitude
        };
    }
}
