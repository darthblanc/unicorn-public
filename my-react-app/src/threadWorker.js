import { createQuadTreeStrokes } from "./quadtreeWorker"

onmessage = e => {
    const [ taskName, taskContent, taskSize ] = e.data
    if (taskName === "quadtree") {
        const quadTreeStrokes = createQuadTreeStrokes(taskContent)
        console.log("quadtree constructed")
        postMessage([taskName, quadTreeStrokes, 0])
    }
}