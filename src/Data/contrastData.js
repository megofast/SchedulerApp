export function fixContrastColor(color)
{
    // Before continuing with contrast fix, removed the '#' from the color
    let newColor = color.charAt(1) + color.charAt(2) + color.charAt(3) + color.charAt(4) + color.charAt(5) + color.charAt(6);
    return (luma(newColor) >= 165) ? '#000000' : '#ffffff';
}

function luma(color) // color can be a hx string or an array of RGB values 0-255
{
    var rgb = (typeof color === 'string') ? hexToRGBArray(color) : color;
    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
}

function hexToRGBArray(color)
{
    var rgb = [];
    for (var i = 0; i <= 2; i++)
        rgb[i] = parseInt(color.substr(i * 2, 2), 16);
    return rgb;
}