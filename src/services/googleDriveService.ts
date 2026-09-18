export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  description?: string;
  owners?: Array<{
    displayName: string;
    emailAddress?: string;
    photoLink?: string;
  }>;
}

export interface ListFilesResponse {
  files: GoogleDriveFile[];
  nextPageToken?: string;
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

/**
 * List files from Google Drive
 */
export async function listDriveFiles(
  accessToken: string,
  options: {
    pageSize?: number;
    searchTerm?: string;
    filterType?: 'all' | 'specs' | 'docs' | 'sheets' | 'images';
    pageToken?: string;
  } = {}
): Promise<ListFilesResponse> {
  const { pageSize = 30, searchTerm = '', filterType = 'all', pageToken } = options;

  const queryParts: string[] = ['trashed = false'];

  if (searchTerm.trim()) {
    const escapedTerm = searchTerm.replace(/'/g, "\\'");
    queryParts.push(`name contains '${escapedTerm}'`);
  }

  if (filterType === 'specs') {
    queryParts.push("(name contains 'TechPack' or name contains 'Spec' or name contains 'RFQ' or mimeType = 'application/json')");
  } else if (filterType === 'docs') {
    queryParts.push("(mimeType = 'application/pdf' or mimeType = 'application/vnd.google-apps.document' or mimeType = 'text/plain' or mimeType = 'application/msword')");
  } else if (filterType === 'sheets') {
    queryParts.push("(mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'text/csv' or mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')");
  } else if (filterType === 'images') {
    queryParts.push("(mimeType contains 'image/')");
  }

  const q = queryParts.join(' and ');

  const params = new URLSearchParams({
    pageSize: String(pageSize),
    fields: 'nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,iconLink,thumbnailLink,description,owners)',
    orderBy: 'modifiedTime desc',
    q,
  });

  if (pageToken) {
    params.append('pageToken', pageToken);
  }

  const response = await fetch(`${DRIVE_API_URL}?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = 'Failed to fetch Google Drive files';
    try {
      const errJson = JSON.parse(errorText);
      message = errJson.error?.message || message;
    } catch {
      // ignore
    }
    throw new Error(`${response.status}: ${message}`);
  }

  const data = await response.json();
  return {
    files: data.files || [],
    nextPageToken: data.nextPageToken,
  };
}

/**
 * Upload a text, JSON, or CSV file to Google Drive using multipart upload
 */
export async function uploadTextFileToDrive(
  accessToken: string,
  params: {
    name: string;
    content: string;
    mimeType?: string;
    description?: string;
    folderId?: string;
  }
): Promise<GoogleDriveFile> {
  const {
    name,
    content,
    mimeType = 'application/json',
    description = 'Exported from RAWx Made-in-Bangladesh B2B Sourcing Platform',
    folderId,
  } = params;

  const metadata: Record<string, any> = {
    name,
    mimeType,
    description,
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------RAWxDriveBoundary' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
    content +
    closeDelimiter;

  const response = await fetch(DRIVE_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = 'Failed to upload file to Google Drive';
    try {
      const errJson = JSON.parse(errorText);
      message = errJson.error?.message || message;
    } catch {
      // ignore
    }
    throw new Error(`${response.status}: ${message}`);
  }

  return response.json();
}

/**
 * Delete a file from Google Drive
 * Mandatory: Caller MUST confirm with the user before calling this destructive operation!
 */
export async function deleteDriveFile(
  accessToken: string,
  fileId: string
): Promise<void> {
  const response = await fetch(`${DRIVE_API_URL}/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 204 && response.status !== 404) {
    const errorText = await response.text();
    throw new Error(`Failed to delete file (${response.status}): ${errorText}`);
  }
}

/**
 * Format bytes to readable string (e.g. 1.2 MB)
 */
export function formatDriveFileSize(bytes?: string | number): string {
  if (!bytes) return '—';
  const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(num) || num === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(num) / Math.log(k));
  return parseFloat((num / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
