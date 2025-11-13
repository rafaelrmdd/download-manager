/// <reference types="chrome" />
/// <reference lib="webworker" />

interface DownloadProps {
	id: number;
	filename: string;
	state: string;
}

const downloads: DownloadProps[] = [];

chrome.downloads.onCreated.addListener((download) => {
  downloads.push(download);
  console.log("new download added:", download);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "getDownloads") {
    sendResponse({ downloads });
  }
  return true;
});