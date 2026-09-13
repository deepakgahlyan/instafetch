import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;

export const r2Configured = Boolean(
  accountId && accessKeyId && secretAccessKey && bucket
);

function getClient(): S3Client {
  if (!r2Configured) {
    throw new Error("R2 object storage is not configured.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  });
}

export async function putMediaObject(input: {
  key: string;
  body: ArrayBuffer;
  contentType: string;
  contentLength?: number;
}) {
  const client = getClient();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket!,
      Key: input.key,
      Body: Buffer.from(input.body),
      ContentType: input.contentType,
      ContentLength: input.contentLength,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return input.key;
}

export async function getMediaObjectUrl(
  key: string,
  filename: string,
  contentType?: string
): Promise<string> {
  const client = getClient();

  const command = new GetObjectCommand({
    Bucket: bucket!,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
    ...(contentType ? { ResponseContentType: contentType } : {}),
  });

  return getSignedUrl(client, command, { expiresIn: 3600 });
}
