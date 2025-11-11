import { DownloadItem } from "./components/DownloadItem"

function App() {
  return (
    <div className="w-[350px]">
        <header className="flex justify-between items-center bg-gray-800 px-3 py-5">
            <div className="flex gap-x-5 ">
                <svg 
					xmlns="http://www.w3.org/2000/svg" 
					height="24px" 
					viewBox="0 -960 960 960" 
					width="24px" 
					className="fill-blue-400"
				>
					<path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
				</svg>
                <h1 className="font-semibold text-white">Download Manager</h1>
            </div>

            <span className="text-gray-400 text-[0.9rem]">1 Active</span>
        </header>

		<main className="bg-gray-900">
			<DownloadItem status="in_progress"/>
			<DownloadItem status="paused"/>
			<DownloadItem status="finished"/>
		</main>

		<footer className="p-3 bg-gray-800 flex justify-between">
			<h2 className="text-gray-400 text-[0.8rem]">3 download(s)</h2>
			<h2 className="text-blue-400 text-[0.8rem]">Clean Finished</h2>
		</footer>
    </div>
  )
}

export default App
