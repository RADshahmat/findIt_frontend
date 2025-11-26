import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

export const processImageForVerification = async (file) => {
    return new Promise((resolve) => {

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = async () => {
            console.log("Image loaded successfully.");

            // Load model
            const model = await cocoSsd.load();
            console.log("Model loaded.");

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original
            ctx.drawImage(img, 0, 0);

            // ---- Step 1: COCO-SSD logo blur ----
            const predictions = await model.detect(canvas);

            predictions.forEach((pred) => {
                if (pred.score < 0.45) return;

                const [x, y, w, h] = pred.bbox;

                if (w * h > canvas.width * canvas.height * 0.2) return;
                if (w < 25 || h < 25) return;

                blurArea(ctx, x, y, w, h);
            });

            // ---- Step 2: Edge-based (Sobel) blur ----
            applyEdgeBasedLogoBlur(ctx, canvas.width, canvas.height);
            // Blur all dark logo-like blobs (Apple)
            blurAppleLogoHard(ctx, canvas.width, canvas.height);


            // ---- Step 3: Soft grayscale (color hide only) ----
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                let gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = gray;
            }

            ctx.putImageData(imageData, 0, 0);

            // ---- Step 4: Export final ----
            canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
        };
    });
};


// -------------------------
// LOGO BLUR (COCO SSD)
// -------------------------
function blurArea(ctx, x, y, w, h) {
    const temp = document.createElement("canvas");
    const tctx = temp.getContext("2d");

    temp.width = w;
    temp.height = h;

    tctx.drawImage(ctx.canvas, x, y, w, h, 0, 0, w, h);

    tctx.filter = "blur(12px)";
    tctx.drawImage(temp, 0, 0);

    ctx.drawImage(temp, x, y, w, h);
}



// -------------------------
// EDGE-BASED LOGO BLUR (YOUR METHOD)
// -------------------------
function applyEdgeBasedLogoBlur(ctx, W, H) {
    const imgData = ctx.getImageData(0, 0, W, H);
    const data = imgData.data;

    const edges = new Uint8ClampedArray(data.length);

    const sobel = (x, y) => {
        const i = (y * W + x) * 4;
        return data[i];
    };

    for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
            const gx =
                -sobel(x - 1, y - 1) -
                2 * sobel(x - 1, y) -
                sobel(x - 1, y + 1) +
                sobel(x + 1, y - 1) +
                2 * sobel(x + 1, y) +
                sobel(x + 1, y + 1);

            const gy =
                -sobel(x - 1, y - 1) -
                2 * sobel(x, y - 1) -
                sobel(x + 1, y - 1) +
                sobel(x - 1, y + 1) +
                2 * sobel(x, y + 1) +
                sobel(x + 1, y + 1);

            const g = Math.sqrt(gx * gx + gy * gy);
            const idx = (y * W + x) * 4;
            edges[idx] = edges[idx + 1] = edges[idx + 2] = g > 200 ? 255 : 0;
            edges[idx + 3] = 255;
        }
    }

    const boxSize = Math.floor(Math.max(W, H) * 0.06);

    for (let y = 0; y < H; y += boxSize) {
        for (let x = 0; x < W; x += boxSize) {
            let edgeCount = 0;

            for (let yy = y; yy < y + boxSize && yy < H; yy++) {
                for (let xx = x; xx < x + boxSize && xx < W; xx++) {
                    const idx = (yy * W + xx) * 4;
                    if (edges[idx] === 255) edgeCount++;
                }
            }

            if (edgeCount > boxSize * boxSize * 0.12) {
                blurArea(ctx, x, y, boxSize, boxSize);
            }
        }
    }
}


function blurAppleLogoHard(ctx, W, H) {
    const img = ctx.getImageData(0, 0, W, H);
    const data = img.data;

    const visited = new Uint8Array(W * H);

    const isDarkPixel = (i) => {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        return r < 70 && g < 70 && b < 70; // Apple logo is very dark
    };

    const dirs = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [-1, 1], [1, -1], [-1, -1]
    ];

    // scan for dark blobs
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {

            const base = (y * W + x);
            if (visited[base]) continue;

            const i = base * 4;
            if (!isDarkPixel(i)) continue;

            // BFS region detection
            let queue = [[x, y]];
            let cluster = [];
            visited[base] = 1;

            while (queue.length) {
                const [cx, cy] = queue.shift();
                cluster.push([cx, cy]);

                for (let [dx, dy] of dirs) {
                    const nx = cx + dx, ny = cy + dy;
                    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;

                    const idx = ny * W + nx;
                    if (visited[idx]) continue;

                    const ii = idx * 4;
                    if (!isDarkPixel(ii)) continue;

                    visited[idx] = 1;
                    queue.push([nx, ny]);
                }
            }

            // ignore tiny specks
            if (cluster.length < 200) continue;

            // ignore huge areas (shadows)
            if (cluster.length > (W * H * 0.15)) continue;

            // find bounding box
            let minX = W, minY = H, maxX = 0, maxY = 0;
            for (const [px, py] of cluster) {
                if (px < minX) minX = px;
                if (py < minY) minY = py;
                if (px > maxX) maxX = px;
                if (py > maxY) maxY = py;
            }

            // adjust for logo padding
            const pad = Math.floor((maxX - minX) * 0.25);

            const bx = Math.max(0, minX - pad);
            const by = Math.max(0, minY - pad);
            const bw = Math.min(W - bx, (maxX - minX) + pad * 2);
            const bh = Math.min(H - by, (maxY - minY) + pad * 2);

            // FINAL strong blur
            blurArea(ctx, bx, by, bw, bh);
        }
    }
}
