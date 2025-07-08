
export function createQuadTreeStrokes(interpolatedStrokes) {
    let rvInterpolatedStrokes = []
    for (const [k, stroke] of interpolatedStrokes.entries()){
        const points = stroke
        for (let j = 0; j < points.length; j++){
            rvInterpolatedStrokes.push([ points[j][0], points[j][1], k])
        }
    }
    return rvInterpolatedStrokes
}
