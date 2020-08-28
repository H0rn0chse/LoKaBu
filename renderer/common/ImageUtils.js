export function getCroppingBox (image, selection) {
    var imgBox = image.getBoundingClientRect();
    var selBox = selection.getBoundingClientRect();

    const sizeFactor = image.naturalHeight / imgBox.height;
    const iMinSize = 500;
    const zoomFactor = iMinSize / Math.min(selBox.width, selBox.height);

    const targetX = 0;
    const targetY = 0;
    const sourceX = (selBox.x - imgBox.x) * sizeFactor;
    const sourceY = (selBox.y - imgBox.y) * sizeFactor;

    const targetWidth = selBox.width * zoomFactor;
    const targetHeight = selBox.height * zoomFactor;
    const sourceWidth = targetWidth * sizeFactor / zoomFactor;
    const sourceHeight = targetHeight * sizeFactor / zoomFactor;

    return [sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight];
}

export function applyCroppingBoxToCanvas (canvas, sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const oContext = canvas.getContext('2d');
    oContext.drawImage(sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
}
