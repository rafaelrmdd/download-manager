/// <reference types="chrome" />
/// <reference lib="webworker" />

import { useEffect, useState } from "react"
import { DownloadItem } from "./components/DownloadItem"
import type {  MyDownload } from "./service-worker";
import { DownloadIcon } from "./components/Icons/DownloadIcon";

function App() {
	const [activeDownloads, setActiveDownloads] = useState<MyDownload[]>([]);

	//Only runs on extension environtment (not node)
	useEffect(() => {
		if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {

			chrome.runtime.sendMessage({ type: "getDownloads" }, response => {
				setActiveDownloads(response.downloads);
				console.log('Downloads: ', response.downloads);
			})	
		}
	}, [])

	const downloadsLength = activeDownloads.length;
	const activeDownloadsLength = activeDownloads.filter((d) => d.state === "in_progress").length;

	return (
		<div className="w-[350px]">
			<header className="flex justify-between items-center bg-gray-800 px-3 py-5">
				<div className="flex gap-x-5 ">
					<DownloadIcon color="fill-blue-400" />
					<h1 className="font-semibold text-white">Download Manager</h1>
				</div>

				<span className="text-gray-400 text-[0.9rem]">{activeDownloadsLength} Active</span>
			</header>

			<main className="bg-gray-900">
				{/* <DownloadItem status="in_progress"/>
				<DownloadItem status="paused"/>
				<DownloadItem status="finished"/> */}

				{activeDownloads.map((download) => (
					<DownloadItem 
						status="in_progress"
						download={download}
					/>
				))}
			</main>

			<footer className="p-3 bg-gray-800 flex justify-between">
				<h2 className="text-gray-400 text-[0.8rem]">{downloadsLength} download(s)</h2>
				<h2 className="text-blue-400 text-[0.8rem]">Clean Finished</h2>
			</footer>
		</div>
	)
}

export default App
