/// <reference types="chrome" />
/// <reference lib="webworker" />

export type Download = chrome.downloads.DownloadItem;
type DownloadDelta = chrome.downloads.DownloadDelta;

const downloads = new Map<number, Download>();

//Creates new download in Map when it is received from chrome
chrome.downloads.onCreated.addListener((download: chrome.downloads.DownloadItem) => {
    downloads.set(download.id, download);
    console.log('Download created: ', download);
});

//Receive message from popup (App.tsx) and returns an array of downloads
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "getDownloads") {
        sendResponse({ downloads: Array.from(downloads.values()) });
    }
    return true;
});

//Keep downloads updated whenever it changes
chrome.downloads.onChanged.addListener((delta: DownloadDelta) => {
    const current = downloads.get(delta.id);

    if (current) {
        if (delta.bytesReceived?.current !== undefined) {
            current.bytesReceived = delta.bytesReceived.current;
        }
        if (delta.state?.current !== undefined){
            current.state = delta.state.current as chrome.downloads.State;
        }

        downloads.set(delta.id, current);
    }
}) 