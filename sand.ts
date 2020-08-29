const catNum = 5;
const tracingCatNum = 2
const catImgSize = 32;
const canvasSize = 512;
const solutionDim = 2;
const seekingMemorySize = 10;
const seekingRange = canvasSize / 100;
const interval = 10;
const velocityMax = canvasSize * interval / 1000;

function fitness(position: number[]): number{
    return constrain(0.001 * Math.pow(position[0] - canvasSize / 2, 2)
        + 0.01 * Math.pow(position[1] - canvasSize / 2, 2), 0, 255)
}

interface cat {
    position: number[]
    velocity: number[]
}

const cats: cat[] = [...Array(catNum)].map(() => {
    return {
        position: [...Array(solutionDim)].map(() => Math.random() * canvasSize),
        velocity: [...Array(solutionDim)].map(() => Math.random() * canvasSize)
    }
});
function updateCats(): void{
    /*
    cats.forEach(cat => {
        cat.position[0] += 2
        cat.position[1] += 1
    });
    */
    const fitnessVals = cats.map(cat => fitness(cat.position));
    const argMinFitCat = argMin(fitnessVals);
    shuffledBits(catNum, tracingCatNum).forEach((bit, i) => {
        if (bit === 0){// seeking
            const newPositions = [...Array(seekingMemorySize)].map(() => 
                [...Array(solutionDim).map((_, d) => 
                    cats[i].position[d] + (Math.random() * 2 - 1) * seekingRange)]);
            const newFitnessVals = newPositions.map(p => fitness(p));
            const newFitnessValMax = Math.max(...newFitnessVals);
            const probs = newFitnessVals.map(newFitnessVal => newFitnessValMax - newFitnessVal);
            cats[i].position = newPositions[roulette(probs)].map(x => constrain(x, 0, canvasSize));
            alert("awawaw");
            //cats[i].position[0] += 2
            //cats[i].position[1] += 1
        }
        else{// tracing
            
        }
    });
}

window.onload = () => {
    const canvas = document.getElementById("canvas");
    if　(canvas == null || !(canvas instanceof HTMLCanvasElement)){
        alert("Can't find \"canvas\": HTMLCanvasElement")
        return
    }
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const context = canvas.getContext('2d');
    if　(context == null){
        alert("Can't find context2d")
        return
    }
    [...Array(canvasSize)].forEach((_, x) => {
        [...Array(canvasSize)].forEach((_, y) => {
            const z = Math.floor(fitness([x, y]))
            context.fillStyle = "rgb("+[z, z, 255 - z].join(",")+")"
            context.fillRect(x, y, 1, 1)
        });
    });

    const upper = document.getElementById("upper");
    if　(upper == null || !(upper instanceof HTMLDivElement)){
        alert("Can't find \"upper\": HTMLDivElement")
        return
    }
    upper.style.width = canvasSize + "px";
    upper.style.height = canvasSize + "px";

    const catImgs: HTMLImageElement[] = [...Array(catNum)].map(() => {
        const catImg = document.createElement("img")
        catImg.src = "kedukuroi.png"
        catImg.style.position = "absolute"
        catImg.style.width = catImgSize + "px"
        upper.appendChild(catImg)
        return catImg
    });
    const updateCatImgs: () => void = () => {
        catImgs.forEach((_, i) => {
            catImgs[i].style.left = cats[i].position[0] - catImgSize / 2 + "px"
            catImgs[i].style.top = cats[i].position[1] - catImgSize / 2 + "px"
        });
    };
    updateCatImgs();
    setInterval(() => {
        updateCats();
        updateCatImgs();
    }, interval);
};