// ======= CONTROL VARIABLES ======= //
const state = {
    barCount: 25,         // Number of bars to display
    animationSpeed: 25,   // Animation speed in milliseconds
    isSorting: false,     // Sorting in progress flag
    completedSorts: 0,    // Tracks completed sorts
    arrays: {
        main: [],
        container1: [],
        container2: []
    },
    sortData: {
        startTime: 0,
        stepsCount1: 0,
        stepsCount2: 0,
        timeAnimate1: 0,
        timeAnimate2: 0
    }
};

document.addEventListener("DOMContentLoaded", () => {
	// Initialize the arrays and UI elements
	generateDataset();

	// Add an event listener to the slider to update `state.barCount` when the user changes the value
	const valueNInput = document.getElementById("valueN");
	const nValueDisplay = document.getElementById("nValueDisplay");
	const animationSpeedInput = document.getElementById("animationSpeed");

	// Update the state.barCount value and the display when the slider value changes
	valueNInput.addEventListener("input", function() {
		state.barCount = parseInt(valueNInput.value);  // Update bar count
		nValueDisplay.textContent = state.barCount;  // Update displayed bar count
		generateDataset();  // Re-initialize the bars with the new `state.barCount` value
	});

	// Update animation speed when the dropdown value changes
	animationSpeedInput.addEventListener("change", function () {
		animationSpeed = parseInt(animationSpeedInput.value);  // Set new animation speed
	});

});

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault(); // Prevent the default action of the spacebar (e.g., scrolling)
        if (!state.isSorting) {
            play(); // Call the play function
        }
    } else if (event.code === "KeyR") {
        generateDataset(); // Call the generateDataset function
    } else if (event.code === "KeyZ") {
        stop(); // Call the generateDataset function
    }
});


// ======= BUTTONS ======= //

// Initialize the bars and arrays when the page loads or when `state.barCount` changes
function generateDataset() {
    isSorting = false;  // Reset sorting flag
	completedSorts = 0;
    updateButtonStatus();  // Update button states based on sorting status

	// Timer variables
	let startTime = 0;
	let stepsCount1 = 0;
	let stepsCount2 = 0;
	let timeAnimate1 = 0;
	let timeAnimate2 = 0;

    // Clear existing arrays
    state.arrays.main.length = 0;
    state.arrays.container1.length = 0;
    state.arrays.container2.length = 0;

    // Generate new random array values for `state.barCount`
    for (let i = 0; i < state.barCount; i++) {
        const value = Math.random();  // Generate random value between 0 and 1
        state.arrays.main[i] = value;   //
        state.arrays.container1[i] = value;  // Initialize the first array for container1
        state.arrays.container2[i] = value;  // Initialize the second array for container2
    }

    // Draw bars for both containers
    drawBars("container1", state.arrays.container1);
    drawBars("container2", state.arrays.container2);
}

// Helper function to select the sorting algorithm and return the appropriate steps
function selectAnimation(option, copy, container) {
    // Handles the backend logic for sorting based on selected algorithm
    switch (option) {
        case "bubble": return sortBubble(copy, container);
        // case "bucket": return sortBucket(copy, container);
        case "cocktail": return sortCocktail(copy, container);
        case "comb": return sortComb(copy, container);
        case "gnome": return sortGnome(copy, container);
        case "heap": return sortHeap(copy, container);
        case "insertion": return sortInsertion(copy, container);
	    // case "merge": return sortMerge(copy, container);
        case "quick": return sortQuick(copy, container);
        case "selection": return sortSelection(copy, container);
        case "shell": return sortShell(copy, container);
        default: return [];  // Return empty array for invalid options
    }
}

// Play button function to start the sorting animations
function play() {
    isSorting = true;  // Set sorting flag to true
    completedSorts = 0;  // Reset completed sorts counter
    updateButtonStatus();  // Update button states
	startTime = performance.now(); // Track start time

    // Get the selected sorting algorithms from dropdowns
    const selectedAlgorithm1 = document.getElementById("algorithmSelect1").value;
    const selectedAlgorithm2 = document.getElementById("algorithmSelect2").value;

    // Create copies of the arrays to avoid visual glitches during sorting
    const copy1 = [...state.arrays.container1];
    const copy2 = [...state.arrays.container2];

    let steps1 = selectAnimation(selectedAlgorithm1, copy1, "container1");  // Get steps for the first algorithm
    let steps2 = selectAnimation(selectedAlgorithm2, copy2, "container2");  // Get steps for the second algorithm

    // Start the animation for both containers with their respective steps
    animate("container1", state.arrays.container1, steps1);
    animate("container2", state.arrays.container2, steps2);
}

// Stop button function to stop sorting
function stop() {
    isSorting = false;  // Set sorting flag to false
    updateButtonStatus();  // Update button states
    // Draw bars for both containers
    drawBars("container1", state.arrays.container1);
    drawBars("container2", state.arrays.container2);
}

// Update the button status (disabled/enabled) based on whether sorting is in progress
function updateButtonStatus() {
    // const buttonGenerateData = document.getElementById("buttonGenerateData");
    const buttonPlay = document.getElementById("buttonPlay");
    const buttonStop = document.getElementById("buttonStop");

    // buttonGenerateData.disabled = isSorting;  // Disable data generation button if sorting
    buttonStop.disabled = !isSorting;  // Disable pause button if not sorting
	buttonPlay.disabled = isSorting || completedSorts === -1;  // Disable play button if sorting
}

// ======= ANIMATION/UI ======= //

// Animation function to animate the sorting process
function animate(elementId, array, steps) {
	const startTime1 = startTime;
	const startTime2 = startTime;

    if (!isSorting) {
        drawBars(elementId, array);  // Draw the final array if sorting has stopped
        return;
    }

    if (steps.length === 0) {
        // No more steps, end animation and reset sorting state
        drawBars(elementId, array);
        completedSorts++;
		switch (elementId) {
			case "container1":
				timeAnimate1 = performance.now() - startTime;  // Calculate time taken
				break;
			case "container2":
				timeAnimate2 = performance.now() - startTime;
				break;
			default:
				break;
		}

        if (completedSorts === 2) {
            // Both sorts are completed, show the "sorting completed" modal
            showSortingCompletedModal();

            // Reset sorting state
            isSorting = false;
            completedSorts = -1;
			updateButtonStatus();
            return;
        }
    }

    const [i, j] = steps.shift();  // Get the indices to swap

    // Swap the elements in the array using destructuring
    [array[i], array[j]] = [array[j], array[i]];
    drawBars(elementId, array, [i, j]);  // Highlight swapped bars

    // Recursively call `animate()` after the animation speed delay
    setTimeout(function() {
        animate(elementId, array, steps);
    }, animationSpeed);
}

// Function to draw bars in the container based on the current array
function drawBars(elementId, array, swappedArray = []) {
    const container = document.getElementById(elementId);
    
    container.innerHTML = "";  // Clear container before updating

    // Draw each bar based on the array values
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";  // Set bar height based on array value
        bar.classList.add("sort-bar");

        // Dynamically set the color based on the value
        const value = array[i];
        const color = getColorFromValue(value);
        bar.style.backgroundColor = color;  // Apply calculated color
        bar.style.width = (95.0 / state.barCount) + "vw";  // Set the width of the bars

        container.appendChild(bar);  // Append the bar to the container
    }
}

// Helper function to get a color based on the value (between 0 and 1)
function getColorFromValue(value) {
    const colorStart = { r: 0, g: 186, b: 216 };  // RGB for color #00b4d8
    const colorEnd = { r: 131, g: 56, b: 236 };  // RGB for color #8338ec

    const r = Math.floor(interpolate(value, colorStart.r, colorEnd.r));
    const g = Math.floor(interpolate(value, colorStart.g, colorEnd.g));
    const b = Math.floor(interpolate(value, colorStart.b, colorEnd.b));

    return rgbToHex(r, g, b);  // Convert RGB to Hex and return
}

// Function to interpolate between two values based on the ratio (value between 0 and 1)
function interpolate(value, start, end) {
    return start + (end - start) * value;
}

// Function to convert RGB values to Hex format
function rgbToHex(r, g, b) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Helper function to convert an RGB component to a two-digit hex value
function toHex(n) {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

// Function to show the sorting completed modal
function showSortingCompletedModal() {
    const modal = document.getElementById('sortingCompletedModal');

    // Select the modal content elements where we will display the swap count and time
    const stepsDisplay1 = document.getElementById('stepsCount1');
    const stepsDisplay2 = document.getElementById('stepsCount2');
    const timeAnimateDisplay1 = document.getElementById('timeAnimate1');
    const timeAnimateDisplay2 = document.getElementById('timeAnimate2');

    // Populate the modal with swap counts and times for both algorithms
    stepsDisplay1.textContent = stepsCount1;
    stepsDisplay2.textContent = stepsCount2;
    timeAnimateDisplay1.textContent = (timeAnimate1 / 1000.0).toFixed(2) + " s";
    timeAnimateDisplay2.textContent = (timeAnimate2 / 1000.0).toFixed(2) + " s";

    // Show the modal
    modal.style.display = 'block';
}

// Close modal when the user clicks the close button or the "×"
document.getElementById('closeModalButton').addEventListener('click', function () {
    const modal = document.getElementById('sortingCompletedModal');
    modal.style.display = 'none'; // Close the modal
});

document.querySelector('.modal-close').addEventListener('click', function () {
    const modal = document.getElementById('sortingCompletedModal');
    modal.style.display = 'none'; // Close the modal when the "×" is clicked
});

// Close modal when the user clicks the close button or the "×"
document.getElementById('closeModalButton').addEventListener('click', function () {
    const modal = document.getElementById('sortingCompletedModal');
    modal.style.display = 'none'; // Close the modal
});

document.querySelector('.modal-close').addEventListener('click', function () {
    const modal = document.getElementById('sortingCompletedModal');
    modal.style.display = 'none'; // Close the modal when the "×" is clicked
});
