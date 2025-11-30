
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_DEPLOYED_URL||"http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export const registerUser = async (name: string, email: string, password: string) => {
  const res = await API.post("/auth/register", { name, email, password });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};


export const uploadFile = async (file: File, folderId: string | null = null, onProgress) => {
  const form = new FormData();
  form.append("file", file);
  if (folderId) form.append("folder", folderId);

  const res = await API.post("/files/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onProgress,
  });

  return res.data;
};

export const getFiles = async (folderId: string | null = null) => {
  const res = await API.get(`/files/folder/${folderId || null}`);
  return res.data;
};

export const downloadFile = async (fileId: string) => {
  const res = await API.get(`/files/${fileId}/download`, {
    responseType: "blob",
  });

  const contentType = res.headers['content-type'] || '';
  const contentDisposition = res.headers['content-disposition'];
  console.log(res.headers);
  console.log('Content-Disposition:', contentDisposition);

  let fileName = 'downloaded_file';
  const matches = contentDisposition?.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)/i);
  if (matches?.[1]) {
    fileName = decodeURIComponent(matches[1]);
  }

  const blob = new Blob([res.data], { type: contentType });
  const downloadUrl = URL.createObjectURL(blob);

  return { fileName, downloadUrl, mimeType: contentType };
};


export const renameFile = async (fileId: string, newName: string) => {
  const res = await API.put(`/files/${fileId}/rename`, { newName });
  return res.data;
};

export const deleteFile = async (fileId: string) => {
  const res = await API.delete(`/files/${fileId}`);
  return res.data;
};


export const createFolder = async (name: string, parent: string | null = null) => {
  const res = await API.post("/folders/", { name, parent });
  return res.data;
};

export const getFolders = async (parent: string | null = null) => {
  const res = await API.get(`/folders/${parent || null}`);
  return res.data;
};

export const deleteFolder = async (folderId: string) => {
  const res = await API.delete(`/folders/${folderId}`);
  return res.data;
};
export const renameFolder = async (folderId: string, newName: string) => {
  const res = await API.put(`/folders/${folderId}/rename`, { newName });
  return res.data;
};
