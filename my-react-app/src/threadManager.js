const cpuCoresAvailable = (navigator.hardwareConcurrency || 4) - 2
const webWorkerStates = Array(cpuCoresAvailable).fill("free")
let webWorkers = []
for (let i = 0; i < webWorkerStates.length; i ++){
    const worker = new Worker(new URL('./threadWorker.js', import.meta.url), {type: "module"})
    worker.onmessage = e => onWorkerMessage(i, e)
    webWorkers.push(worker)
}
let taskQueue = []

function onWorkerMessage(workerIndex, message) {
    webWorkerStates[workerIndex] = "free"
    postMessage(message.data)
    assignNextTask(workerIndex)
}

function assignNextTask(workerIndex) {
    if (taskQueue.length === 0) return
    console.log("here", taskQueue)
    const task = taskQueue.shift()
    webWorkerStates[workerIndex] = "working"
    webWorkers[workerIndex].postMessage(task)
}

onmessage = e => {
    const freeIndex = webWorkerStates.findIndex(state => state === "free")
    if (freeIndex === -1){
        taskQueue.push(e.data)
    }
    else {
        webWorkerStates[freeIndex] = "working"
        webWorkers[freeIndex].postMessage(e.data)
    }
}