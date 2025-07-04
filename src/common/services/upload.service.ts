import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UploadService {
  private readonly storage: Storage;
  private readonly publicBucketName: string;
  private readonly privateBucketName: string;
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly configService: ConfigService) {
    // Initialize Google Cloud Storage
    // This assumes the GCS_CREDENTIALS environment variable is set with the JSON key file content
    this.storage = new Storage();

    this.publicBucketName = this.configService.get<string>(
      "GCS_PUBLIC_BUCKET_NAME"
    );
    this.privateBucketName = this.configService.get<string>(
      "GCS_PRIVATE_BUCKET_NAME"
    );

    if (!this.publicBucketName || !this.privateBucketName) {
      this.logger.error(
        "GCS bucket names are not configured in environment variables."
      );
      throw new Error("Google Cloud Storage is not properly configured.");
    }
  }

  /**
   * Uploads a file to the appropriate GCS bucket based on the path.
   * @param file - The file object from Express.Multer.File.
   * @param path - The destination path within the bucket (e.g., 'public/avatars/', 'private/documents/').
   * @returns The public URL of the uploaded file.
   */
  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    if (!file) {
      throw new Error("No file provided for upload.");
    }

    const isPublic = path.startsWith("public/");
    const bucketName = isPublic
      ? this.publicBucketName
      : this.privateBucketName;
    const bucket = this.storage.bucket(bucketName);

    // Generate a unique filename to prevent overwrites
    const uniqueFileName = `${uuidv4()}-${file.originalname.replace(/\\s+/g, "_")}`;
    const destination = `${path}${uniqueFileName}`;

    const blob = bucket.file(destination);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", (err) => {
        this.logger.error(`GCS Upload Error: ${err.message}`, err.stack);
        reject(`Unable to upload file, please try again later.`);
      });

      blobStream.on("finish", async () => {
        this.logger.log(
          `File ${uniqueFileName} uploaded to ${bucketName}/${path}`
        );

        // If the bucket is public, make the file publicly readable
        if (isPublic) {
          try {
            await blob.makePublic();
          } catch (e) {
            this.logger.error(
              `Failed to make file public: ${e.message}`,
              e.stack
            );
            // Even if it fails to be made public, we can still resolve with the path
          }
        }

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }

  /**
   * Deletes a file from GCS.
   * @param fileUrl - The full public URL of the file to delete.
   */
  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      const urlParts = fileUrl
        .replace("https://storage.googleapis.com/", "")
        .split("/");
      const bucketName = urlParts.shift();
      const fileName = urlParts.join("/");

      if (!bucketName || !fileName) {
        this.logger.warn(`Invalid GCS URL format, cannot delete: ${fileUrl}`);
        return;
      }

      await this.storage.bucket(bucketName).file(fileName).delete();
      this.logger.log(`File ${fileName} deleted from bucket ${bucketName}`);
    } catch (error) {
      // If the file doesn't exist, GCS will throw an error, which we can ignore.
      if (error.code === 404) {
        this.logger.warn(
          `Attempted to delete a file that does not exist: ${fileUrl}`
        );
        return;
      }
      this.logger.error(
        `Failed to delete file from GCS: ${fileUrl}`,
        error.stack
      );
      // We don't throw here to avoid breaking a larger process if a file deletion fails
    }
  }
}
