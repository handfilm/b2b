import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  HardDrive,
  Search,
  RefreshCw,
  ExternalLink,
  Trash2,
  FileText,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCheck,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  FolderOpen,
  Lock,
  Plus,
} from 'lucide-react';
import {
  GoogleDriveFile,
  listDriveFiles,
  deleteDriveFile,
  uploadTextFileToDrive,
  formatDriveFileSize,
} from '../services/googleDriveService';
import {
  getAccessToken,
  signInWithGooglePopup,
  auth,
} from '../firebase';
import { AuthUser } from '../types';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser: AuthUser | null;
  onLoginRequest?: () => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  authUser,
  onLoginRequest,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'specs' | 'docs' | 'sheets' | 'images'>('all');

  // Deletion Confirmation State (Mandatory User Confirmation per Workspace Guidelines)
  const [fileToDelete, setFileToDelete] = useState<GoogleDriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick Upload / Create Spec in Drive
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('RAWx_B2B_Sourcing_Dossier_2026.json');
  const [newDocContent, setNewDocContent] = useState(
    JSON.stringify(
      {
        platform: 'RAWx B2B Marketplace Bangladesh',
        division: 'Export Knitwear & Woven Division',
        date: new Date().toISOString(),
        orderType: 'Commercial Garment TechPack & RFQ Specification',
        standards: ['OEKO-TEX Standard 100', 'GOTS Organic Cotton', 'BSCI Audited'],
        specs: {
          fabricWeight: '240 GSM Combed Ring-Spun Cotton',
          dyeStandard: 'Azo-Free Reactive Dyeing',
          incoterm: 'FOB Chittagong Sea Port',
          inspectionStandard: 'AQL 1.5 Final Random Inspection',
        },
      },
      null,
      2
    )
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Check initial token on open
  useEffect(() => {
    if (isOpen) {
      getAccessToken().then((t) => {
        setToken(t);
        if (t) {
          fetchFiles(t);
        }
      });
    }
  }, [isOpen]);

  const handleGoogleDriveSignIn = async () => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const res = await signInWithGooglePopup();
      if (res?.accessToken) {
        setToken(res.accessToken);
        await fetchFiles(res.accessToken);
      } else {
        setError('No access token received. Please complete Google Sign-In with Drive permissions.');
      }
    } catch (err: any) {
      console.error('Drive sign-in error:', err);
      setError(err?.message || 'Failed to authenticate with Google Drive.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchFiles = useCallback(
    async (accessToken: string) => {
      setIsLoadingFiles(true);
      setError(null);
      try {
        const result = await listDriveFiles(accessToken, {
          searchTerm: searchQuery,
          filterType: activeFilter,
        });
        setFiles(result.files);
      } catch (err: any) {
        console.error('Fetch Drive files error:', err);
        if (err.message?.includes('401')) {
          setToken(null);
          setError('Google Drive session expired. Please re-authenticate below.');
        } else {
          setError(err?.message || 'Failed to load Google Drive files.');
        }
      } finally {
        setIsLoadingFiles(false);
      }
    },
    [searchQuery, activeFilter]
  );

  // Trigger search / filter refetch when token is ready
  useEffect(() => {
    if (token) {
      const debounceTimer = setTimeout(() => {
        fetchFiles(token);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [token, searchQuery, activeFilter, fetchFiles]);

  const confirmDeleteFile = async () => {
    if (!fileToDelete || !token) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteDriveFile(token, fileToDelete.id);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setFileToDelete(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete file from Google Drive.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadNewFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsUploading(true);
    setUploadSuccessMsg(null);
    setError(null);
    try {
      const isJson = newDocTitle.toLowerCase().endsWith('.json');
      const mimeType = isJson ? 'application/json' : 'text/plain';
      const created = await uploadTextFileToDrive(token, {
        name: newDocTitle.trim() || 'RAWx_B2B_Spec.json',
        content: newDocContent,
        mimeType,
        description: 'B2B Trade Dossier exported from RAWx Bangladesh Hub',
      });
      setUploadSuccessMsg(`Saved to Drive: "${created.name}"`);
      setIsCreateModalOpen(false);
      await fetchFiles(token);
      setTimeout(() => setUploadSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload document to Google Drive.');
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (mimeType: string, name: string) => {
    if (mimeType === 'application/vnd.google-apps.spreadsheet' || name.endsWith('.csv') || name.endsWith('.xlsx')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
    if (mimeType.includes('image/')) {
      return <ImageIcon className="w-5 h-5 text-blue-400 shrink-0" />;
    }
    if (mimeType === 'application/pdf') {
      return <FileText className="w-5 h-5 text-rose-400 shrink-0" />;
    }
    if (name.endsWith('.json') || mimeType.includes('json')) {
      return <FileCode className="w-5 h-5 text-amber-400 shrink-0" />;
    }
    return <FileText className="w-5 h-5 text-slate-300 shrink-0" />;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drive-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-[#0e0e0e] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#121212] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4285F4]/20 via-[#34A853]/20 to-[#FBBC05]/20 border border-white/15 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-[#4285F4]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="drive-modal-title" className="text-base sm:text-lg font-black text-white">
                  Google Drive Workspace Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4285F4]/15 text-[#60a5fa] border border-[#4285F4]/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage B2B TechPack CADs, RFQ dossiers, inspection sheets & export documents
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {token && (
              <button
                type="button"
                id="drive-create-spec-btn"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#22c55e] text-slate-950 text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload Dossier</span>
              </button>
            )}
            <button
              type="button"
              id="drive-modal-close-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Google Drive Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {uploadSuccessMsg && (
          <div className="bg-[#10b981]/15 border-b border-[#10b981]/30 px-4 py-2 text-xs text-[#10b981] font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{uploadSuccessMsg}</span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-rose-950/40 border-b border-rose-500/30 px-4 py-2 text-xs text-rose-300 font-medium flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            {token && (
              <button
                type="button"
                onClick={() => fetchFiles(token)}
                className="text-xs text-rose-300 underline hover:text-white ml-2 cursor-pointer"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        {!token ? (
          /* Authentication Screen with Official Sign In With Google styling */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
              <FolderOpen className="w-8 h-8 text-[#4285F4]" />
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-lg font-bold text-white">Connect Google Drive</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your Google Drive to browse, export, and organize B2B garment TechPacks, RFQ dossiers,
                and mill inspection certificates directly, with permission from your Google account.
              </p>
            </div>

            {/* Official GSI Material Style Button */}
            <div className="flex flex-col items-center space-y-3">
              <button
                type="button"
                id="drive-official-gsi-button"
                onClick={handleGoogleDriveSignIn}
                disabled={isAuthenticating}
                className="inline-flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-6 py-3 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-5 h-5 shrink-0"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                </svg>
                <span>{isAuthenticating ? 'Connecting Google Drive...' : 'Sign in with Google'}</span>
              </button>

              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Tokens are cached in-memory only and never persisted to browser storage</span>
              </div>
            </div>
          </div>
        ) : (
          /* Connected Google Drive File Explorer */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Search & Filter Bar */}
            <div className="p-3 sm:p-4 border-b border-white/10 bg-[#141414] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="drive-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files in Google Drive..."
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4285F4] transition-colors"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'specs', label: 'TechPacks & Specs' },
                    { id: 'docs', label: 'Docs & PDFs' },
                    { id: 'sheets', label: 'Sheets' },
                    { id: 'images', label: 'Images' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeFilter === tab.id
                        ? 'bg-[#4285F4] text-white shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                <button
                  type="button"
                  id="drive-refresh-btn"
                  onClick={() => fetchFiles(token)}
                  disabled={isLoadingFiles}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Refresh files"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin text-[#4285F4]' : ''}`} />
                </button>
              </div>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
              {isLoadingFiles && files.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#4285F4]" />
                  <span>Scanning Google Drive files...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center space-y-3">
                  <FolderOpen className="w-8 h-8 text-slate-600" />
                  <p>No matching files found in your Google Drive.</p>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Upload first TechPack spec
                  </button>
                </div>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className="group p-3 rounded-xl bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {getFileIcon(file.mimeType, file.name)}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate max-w-sm sm:max-w-md">
                          {file.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{formatDriveFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{new Date(file.modifiedTime).toLocaleDateString()}</span>
                          {file.owners && file.owners[0] && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[120px] text-slate-500">
                                {file.owners[0].displayName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-1.5 shrink-0">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Open in Google Drive"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setFileToDelete(file)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete from Google Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Mandatory Explicit User Confirmation Dialog for File Deletion */}
        {fileToDelete && (
          <div
            className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <div className="w-full max-w-md bg-[#161616] border border-rose-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3 text-rose-400">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="delete-dialog-title" className="text-sm font-bold text-white">
                    Confirm Google Drive File Deletion
                  </h3>
                  <p className="text-[11px] text-rose-300/80">
                    This destructive operation permanently removes the file.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-300">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Target File:</span>
                <span className="font-semibold text-white break-all">{fileToDelete.name}</span>
                <div className="text-[10px] text-slate-500 mt-1">
                  ID: {fileToDelete.id} • Size: {formatDriveFileSize(fileToDelete.size)}
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Are you sure you want to delete this file from your Google Drive? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  id="cancel-drive-delete-btn"
                  onClick={() => setFileToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-drive-delete-btn"
                  onClick={confirmDeleteFile}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md shadow-rose-600/25"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete File</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create / Upload B2B Spec Dialog */}
        {isCreateModalOpen && (
          <div
            className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <form
              onSubmit={handleUploadNewFile}
              className="w-full max-w-lg bg-[#161616] border border-white/20 rounded-2xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <UploadCloud className="w-5 h-5 text-[#10b981]" />
                  <h3 className="text-sm font-bold text-white">Save B2B Specification to Google Drive</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  File Name in Google Drive
                </label>
                <input
                  type="text"
                  required
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Specification Body (JSON / CAD / Plain Text)
                </label>
                <textarea
                  rows={8}
                  required
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-[#10b981] resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#22c55e] text-slate-950 text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 shadow-md"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading to Drive...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload to Drive</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#121212] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
            <span>Google Drive API v3 Integrated</span>
          </div>

          <div className="flex items-center space-x-2">
            {token ? (
              <span className="text-[11px] text-slate-500">
                Connected with authorized Workspace scopes
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Authentication required</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
