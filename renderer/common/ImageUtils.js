export function getCroppingBox (image, selection) {
    var imgBox = image.getBoundingClientRect();
    var selBox = selection.getBoundingClientRect();

    const ySizeFactor = image.naturalHeight / imgBox.height;
    const xSizeFactor = image.naturalWidth / imgBox.width;
    const iMinSize = 500;
    const zoomFactor = iMinSize / Math.min(selBox.width, selBox.height);

    const targetX = 0;
    const targetY = 0;
    // top left corner
    const sourceX = (selBox.left - imgBox.left) * xSizeFactor;
    const sourceY = (selBox.top - imgBox.top) * ySizeFactor;

    const targetWidth = selBox.width * zoomFactor;
    const targetHeight = selBox.height * zoomFactor;
    const sourceWidth = targetWidth * xSizeFactor / zoomFactor;
    const sourceHeight = targetHeight * ySizeFactor / zoomFactor;

    return [sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight].map(Math.round);
}

export function applyCroppingBoxToCanvas (canvas, sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const oContext = canvas.getContext('2d');
    oContext.drawImage(sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
}
