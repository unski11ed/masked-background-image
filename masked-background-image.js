'use strict';

(function(doc, wnd){
    function MaskedBackgroundImage(targetElement, imageUrl, cbReady) {
        // Validate input params
        if(!targetElement)
            throw "BlendedBackground: there was no valid element in arg 0";

        if(!imageUrl)
            throw "BlendedBackground: there was no valid url in arg 1";

        cbReady = cbReady || function() { };

        // Variables
        var mainImage = doc.createElement('img');

        // Local functions
        function generateImageMask(image) {
            // Init offscreen canvas
            var canvas = doc.createElement('canvas');
            var sizeX = canvas.width = image.width;
            var sizeY = canvas.height = image.height;
            // Get teh context
            var ctx = canvas.getContext('2d');
            // Draw the image
            ctx.drawImage(image, 0, 0, sizeX, sizeY);
            // Prapare the source and destination ImageData objects
            var imageData = ctx.getImageData(0, 0, sizeX, sizeY);
            var newImageData = ctx.createImageData(sizeX, sizeY);
            // Generate the image mask
            for(var i = 0; i <= imageData.data.length; i+=4){
                var mask = imageData.data[i + 3] / 255;
                var color = (imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2]) / 3

                newImageData.data[i] = newImageData.data[i + 1] = newImageData.data[i + 2] = color;
                newImageData.data[i + 3] = color > 0 ? imageData.data[i + 3] : 0
            }
            // Assign the generated mask to the context
            ctx.putImageData(newImageData, 0, 0);
            // Get the generated mask as Data Url
            var canvasImage = canvas.toDataURL();

            return canvasImage;
        }

        // Init
        mainImage.addEventListener('load', function() {
            var maskDataUrl = generateImageMask(this);
            // Assign the mask to the element style object
            targetElement.style.backgroundImage = 'url(' + imageUrl + ')';
            targetElement.style.maskImage = 'url(' + maskDataUrl + ')';
            targetElement.style.webkitMaskImage = 'url(' + maskDataUrl + ')';
            targetElement.style.mozMaskImage = 'url(' + maskDataUrl + ')';

            // Mark the element with a class
            targetElement.classList.add('masked-background-image');

            cbReady.call(this);
        });
        mainImage.src = imageUrl;
    }

    wnd.MaskedBackgroundImage = MaskedBackgroundImage;
})(document, window);
