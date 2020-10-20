class Coloors {
    constructor() {
        // Globals selections and variables
        this.colourDivs = document.querySelectorAll(".colour");
        this.generateBtn = document.querySelector(".generate");
        this.sliders = document.querySelectorAll('input[type="range"]');
        this.currentHexes = document.querySelectorAll(".colour h2");
        this.initalColours;
    }

    // Colour Generator
    // generateHex() {
    //     const letters = "0123456789ABCDEF";
    //     let hash = "#";
    //     for (let i = 0; i < 6; i++) {
    //         hash += letters[Math.floor(Math.random() * 16)];
    //     }
    //     return hash;
    // }

    generateHex() {
        const hexColour = chroma.random();
        return hexColour;
    }

    randomColours() {
        this.colourDivs.forEach((div, index) => {
            const hexText = div.children[0];
            const randomColour = this.generateHex();

            // Add the colour to the background
            div.style.backgroundColor = randomColour;
            hexText.innerText = randomColour;

            // Check for contrast
            this.checkTextContrast(randomColour, hexText);

            // Initial Colourize Sliders
            const colour = chroma(randomColour);
            const sliders = div.querySelectorAll(".sliders input");
            const hue = sliders[0];
            const brightness = sliders[1];
            const saturation = sliders[2];

            this.colourizeSliders(colour, hue, brightness, saturation);
        });
    }

    checkTextContrast(colour, text) {
        const luminance = chroma(colour).luminance();
        if (luminance > 0.5) {
            text.style.color = "black";
        } else {
            text.style.color = "white";
        }
    }

    colourizeSliders(colour, hue, brightness, saturation) {
        //Scale brightness
        const midBright = colour.set("hsl.l", 0.5);
        const scaleBright = chroma.scale(["black", midBright, "white"]);

        // Scale saturation
        const noSat = colour.set("hsl.s", 0);
        const fullSat = colour.set("hsl.s", 1);
        const scaleSat = chroma.scale([noSat, colour, fullSat]);

        // Update input colours

        hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75)`;

        brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
            0
        )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;

        saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
            0
        )}, ${scaleSat(1)})`;
    }
}

const coloors = new Coloors();

let output = coloors.randomColours();
