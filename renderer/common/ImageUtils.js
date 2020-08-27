export function getCroppingBox (image, selection) {
    var imgBox = image.getBoundingClientRect();
    var selBox = selection.getBoundingClientRect();

    const sizeFactor = image.naturalHeight / imgBox.height;

    const targetX = 0;
    const targetY = 0;
    const sourceX = (selBox.x - imgBox.x) * sizeFactor;
    const sourceY = (selBox.y - imgBox.y) * sizeFactor;

    const targetWidth = selBox.width;
    const targetHeight = selBox.height;
    const sourceWidth = targetWidth * sizeFactor;
    const sourceHeight = targetHeight * sizeFactor;

    return [sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight];
}

export function applyCroppingBoxToCanvas (canvas, sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const oContext = canvas.getContext('2d');
    oContext.drawImage(sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
}
