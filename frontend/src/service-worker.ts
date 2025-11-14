/// <reference types="chrome" />
/// <reference lib="webworker" />

// export type Download = chrome.downloads.DownloadItem;
// type DownloadDelta = chrome.downloads.DownloadDelta;

// interface MyDownload {
//     id: number;
//     url: string;
//     totalBytes: number;
//     receivedBytes: number;
//     state: "in_progress" | "complete" | "error";
//     segments: number;
// }

// const downloads = new Map<number, Download>();
// const myDownloads = new Map<number, MyDownload>();

// // Creates new download in Map when it is received from chrome
// // chrome.downloads.onCreated.addListener((download: chrome.downloads.DownloadItem) => {
// //     downloads.set(download.id, download);
// //     console.log('Download created: ', download);
// // });

// //Receive message from popup (App.tsx) and returns an array of downloads
// chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
//     if (message.type === "getDownloads") {
//         sendResponse({ downloads: Array.from(myDownloads.values()) });
//     }
    
//     return true;
// });

// //Keep downloads updated whenever it changes
// chrome.downloads.onChanged.addListener((delta: DownloadDelta) => {
//     const current = downloads.get(delta.id);

//     if (current) {
//         if (delta.bytesReceived?.current !== undefined) {
//             current.bytesReceived = delta.bytesReceived.current;
//         }
//         if (delta.state?.current !== undefined){
//             current.state = delta.state.current as chrome.downloads.State;
//         }

//         downloads.set(delta.id, current);
//     }
// }) 

// const isDataUrl = (url: string) => url.startsWith("data:");

// const getDataUrlBytes = (dataUrl: string): Uint8Array => {
//     const base64 = dataUrl.split(",")[1];
//     const binary = atob(base64);
//     const len = binary.length;
//     const bytes = new Uint8Array(len);

//     for (let i = 0; i < len; i++) {
//         bytes[i] = binary.charCodeAt(i);
//     }

//     return bytes;
// };

// const getFileSize = async (url: string) => {
//     if (isDataUrl(url)) {
//         return getDataUrlBytes(url);
//     }

//     //Verifying if content-length exists
//     try {
//         const res = await fetch(url, { method: "HEAD" });
//         const size = res.headers.get("content-length");
//         return size ? parseInt(size, 10) : null;
//     } catch {
//         return null;
//     }
// }

// const serverSupportsRange = async (url: string) => {
//     try {
//         const res = await fetch(url, { method: "HEAD" });
//         return res.headers.get("Accept-Ranges") === "bytes";
//     } catch {
//         return false;
//     }
// };

// const downloadPart = async (url: string, start: number, end: number): Promise<Uint8Array> => {
//     const response = await fetch(url, {
//         headers: {
//             "Range": `bytes=${start}-${end}`
//         }
//     })

//     const buffer = await response.arrayBuffer();

//     return new Uint8Array(buffer);
// }

// const segmentedDownload = async (id: number, url: string, segments: number) => {
//     const size = await getFileSize(url);

//     if (size === null || isDataUrl(url)) {
//         console.log("Can't segment download. Downloading using directly approach.");
//         const full = new Uint8Array(await (await fetch(url)).arrayBuffer());
//         return full;
//     }

//     const acceptsRange = await serverSupportsRange(url);
//     if (!acceptsRange) {
//         console.log("Server don't suport 'range'. Downloading using directly approach.");
//         const full = new Uint8Array(await (await fetch(url)).arrayBuffer());
//         return full;
//     }

//     const chunkSize = Math.floor(size / segments);

//     const specificDownload = myDownloads.get(id);

//     if (!specificDownload) {
//         return;
//     }

//     const promises: Promise<Uint8Array>[] = [];

//     for (let i = 0; i < segments; i++) {
//         const start = i * chunkSize;
//         const end = i === segments - 1 ? size - 1 : (start + chunkSize - 1);

//         const incrementDeltaReceivedBytes = downloadPart(url, start, end).then((part) => {
//             specificDownload.receivedBytes += part.length;
//             myDownloads.set(id, {...specificDownload});

//             return part;
//         })

//         promises.push(incrementDeltaReceivedBytes);
//     }

//     console.log("Downloading in parallel: ", segments, "parts");

//     const parts = await Promise.all(promises);
//     specificDownload.state = "complete";
//     myDownloads.set(id, {...specificDownload});

//     const finalFile = new Uint8Array(size);

//     let offset = 0;

//     parts.forEach((part) => {
//         finalFile.set(part, offset);
//         offset += part.length;
//     })

//     return finalFile;
// }

// const DOWNLOAD_SEGMENTS = 4;
// chrome.downloads.onCreated.addListener(async (download: Download) => {
//     console.log('Intercepted: ', download);

//     chrome.downloads.cancel(download.id);

//     const myDownload: MyDownload = {
//         id: download.id,
//         url: download.url,
//         totalBytes: 0,
//         receivedBytes: 0,
//         state: "in_progress",
//         segments: DOWNLOAD_SEGMENTS
//     }
    
//     const data = segmentedDownload(download.id, download.url, myDownload.segments);

//     const my = myDownloads.get(download.id);
//     if (my) {
//         my.totalBytes = data.length;
//         my.receivedBytes = data.length;
//         my.state = "complete";
//         myDownloads.set(download.id, my);
//     }

// });

export type Download = chrome.downloads.DownloadItem;

export interface MyDownload {
    id: number;
    url: string;
    name: string;
    totalBytes: number;
    receivedBytes: number;
    state: "in_progress" | "complete" | "error";
    segments: number;
}

const myDownloads = new Map<number, MyDownload>();

const isDataUrl = (url: string) => url.startsWith("data:");

const getDataUrlBytes = (dataUrl: string): Uint8Array => {
    const base64 = dataUrl.split(",")[1];
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
};

const getFileSize = async (url: string): Promise<number | null> => {
    if (isDataUrl(url)) {
        return getDataUrlBytes(url).length;
    }

    try {
        const res = await fetch(url, { method: "HEAD" });
        const size = res.headers.get("content-length");
        return size ? parseInt(size, 10) : null;
    } catch {
        return null;
    }
};

const serverSupportsRange = async (url: string) => {
    try {
        const res = await fetch(url, { method: "HEAD" });
        return res.headers.get("Accept-Ranges") === "bytes";
    } catch {
        return false;
    }
};

async function downloadPartWithProgress(
    id: number,
    url: string,
    start: number,
    end: number
): Promise<Uint8Array> {

    const res = await fetch(url, {
        headers: { "Range": `bytes=${start}-${end}` }
    });

    const reader = res.body!.getReader();
    const chunks: Uint8Array[] = [];

    let received = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value!);
        received += value!.length;

        const d = myDownloads.get(id);
        if (d) {
            d.receivedBytes += value!.length;
            myDownloads.set(id, { ...d });
        }
    }

    const full = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
        full.set(chunk, offset);
        offset += chunk.length;
    }

    return full;
}


const segmentedDownload = async (id: number, url: string, segments: number) => {
    const size = await getFileSize(url);

    if (size === null || isDataUrl(url) || !(await serverSupportsRange(url))) {
        const full = new Uint8Array(await (await fetch(url)).arrayBuffer());

        const d = myDownloads.get(id);
        if (d) {
            d.totalBytes = full.length;
            d.receivedBytes = full.length;
            d.state = "complete";
            myDownloads.set(id, { ...d });
        }

        return full;
    }

    const d = myDownloads.get(id);
    if (d) {
        d.totalBytes = size;
        myDownloads.set(id, { ...d });
    }

    const chunkSize = Math.floor(size / segments);
    const promises: Promise<Uint8Array>[] = [];

    for (let i = 0; i < segments; i++) {
        const start = i * chunkSize;
        const end = i === segments - 1 ? size - 1 : start + chunkSize - 1;

        promises.push(downloadPartWithProgress(id, url, start, end));
    }

    const parts = await Promise.all(promises);

    const final = new Uint8Array(size);
    let offset = 0;

    for (const p of parts) {
        final.set(p, offset);
        offset += p.length;
    }

    const done = myDownloads.get(id);
    if (done) {
        done.receivedBytes = size;
        done.state = "complete";
        myDownloads.set(id, { ...done });
    }

    return final;
};

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "getDownloads") {
        sendResponse({ downloads: Array.from(myDownloads.values()) });
    }
    return true;
});

const DOWNLOAD_SEGMENTS = 4;

function uint8ToBase64(bytes: Uint8Array) {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

const extensionCreatedDownloads = new Set<string>();

// Função auxiliar para gerar um identificador único
function generateDownloadKey(url: string, filename: string): string {
    return `${url}_${filename}`;
}

chrome.downloads.onCreated.addListener(async (download: Download) => {
    //avoid eternal loops
    console.log('dowlnoad ob: ', download);
    const downloadKey = generateDownloadKey(download.url, download.filename);
    
    // Se este download foi criado pela extensão, apenas o remove do Set e retorna
    if (extensionCreatedDownloads.has(downloadKey)) {
        extensionCreatedDownloads.delete(downloadKey);
        console.log('Download criado pela extensão, ignorando...');
        return;
    }
    
    // Se é uma data URL, também ignora (downloads da extensão usam data URLs)
    if (download.url.startsWith('data:')) {
        console.log('Data URL detectada, ignorando...');
        return;
    }

    console.log("Intercepted:", download);

    chrome.downloads.cancel(download.id);

    const myDownload: MyDownload = {
        id: download.id,
        url: download.url,
        name: download.filename,
        totalBytes: 0,
        receivedBytes: 0,
        state: "in_progress",
        segments: DOWNLOAD_SEGMENTS,
    };

    myDownloads.set(download.id, myDownload);

    console.log('download started');
    const finalBytes = await segmentedDownload(download.id, download.url, DOWNLOAD_SEGMENTS);
    console.log('download finished');

    const base64 = uint8ToBase64(finalBytes);

    const dataUrl = `data:application/octet-stream;base64,${base64}`;

    chrome.downloads.download({
        url: dataUrl,
        filename: download.filename || "arquivo",
        saveAs: true,
    });

    return true;
});
