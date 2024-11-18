// ======= CONTROL VARIABLES ======= //

/*
	Add the stepsCount
*/

// Default settings
let barCount = 50;  // Number of bars to display in the visualization
let animationSpeed = 25;  // Speed of animation (in milliseconds)
let isSorting = false;  // Flag to indicate whether sorting is in progress
let completedSorts = 0;  // Counter to track how many sorts have completed
const array = [];  // Main array for sorting
const array1 = [];  // Copy of the array for the first container
const array2 = [];  // Copy of the array for the second container
// Variables to track steps and time for each algorithm
let startTime = 0;
let stepsCount1 = 0;
let stepsCount2 = 0;
let timeSort1 = 0;
let timeAnimate1 = 0;
let timeSort2 = 0;
let timeAnimate2 = 0;


// Initialize the arrays and UI elements
init();

// Add an event listener to the slider to update `barCount` when the user changes the value
const valueNInput = document.getElementById("valueN");
const nValueDisplay = document.getElementById("nValueDisplay");
const animationSpeedInput = document.getElementById("animationSpeed");

// Update the barCount value and the display when the slider value changes
valueNInput.addEventListener("input", function() {
    barCount = parseInt(valueNInput.value);  // Update bar count
    nValueDisplay.textContent = barCount;  // Update displayed bar count
    init();  // Re-initialize the bars with the new `barCount` value
});

// Update animation speed when the dropdown value changes
animationSpeedInput.addEventListener("change", function () {
    animationSpeed = parseInt(animationSpeedInput.value);  // Set new animation speed
});


// ======= BUTTONS ======= //

// Initialize the bars and arrays when the page loads or when `barCount` changes
function init() {
    isSorting = false;  // Reset sorting flag
    updateButtonStatus();  // Update button states based on sorting status

	// Timer variables
	let startTime = 0;
	let stepsCount1 = 0;
	let stepsCount2 = 0;
	let timeSort1 = 0;
	let timeAnimate1 = 0;
	let timeSort2 = 0;
	let timeAnimate2 = 0;

    // Clear existing arrays
    array.length = 0;
    array1.length = 0;
    array2.length = 0;

    // Generate new random array values for `barCount`
    for (let i = 0; i < barCount; i++) {
        const value = Math.random();  // Generate random value between 0 and 1
        array[i] = value;   //
        array1[i] = value;  // Initialize the first array for container1
        array2[i] = value;  // Initialize the second array for container2
    }

    // Draw bars for both containers
    drawBars("container1", array1);
    drawBars("container2", array2);
}

// Helper function to select the sorting algorithm and return the appropriate steps
function selectAnimation(option, copy, container) {
    // Handles the backend logic for sorting based on selected algorithm
    switch (option) {
        case "bubble": return sortBubble(copy, container);
        case "bucket": return sortBucket(copy, container);
        case "cocktail": return sortCocktail(copy, container);
        case "comb": return sortComb(copy, container);
        case "gnome": return sortGnome(copy, container);
        case "heap": return sortHeap(copy, container);
        case "insertion": return sortInsertion(copy, container);
		case "merge": return sortMerge(copy, container);
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
    const copy1 = [...array1];
    const copy2 = [...array2];

    let steps1 = selectAnimation(selectedAlgorithm1, copy1, "container1");  // Get steps for the first algorithm
    let steps2 = selectAnimation(selectedAlgorithm2, copy2, "container2");  // Get steps for the second algorithm

    // Start the animation for both containers with their respective steps
    animate("container1", array1, steps1);
    animate("container2", array2, steps2);
}

// Stop button function to stop sorting
function stop() {
    isSorting = false;  // Set sorting flag to false
    updateButtonStatus();  // Update button states
	init();
}

// Update the button status (disabled/enabled) based on whether sorting is in progress
function updateButtonStatus() {
    const buttonGenerateData = document.getElementById("buttonGenerateData");
    const buttonPlay = document.getElementById("buttonPlay");
    const buttonStop = document.getElementById("buttonStop");

    buttonGenerateData.disabled = isSorting;  // Disable data generation button if sorting
    buttonPlay.disabled = isSorting;  // Disable play button if sorting
    buttonStop.disabled = !isSorting;  // Disable pause button if not sorting
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
            updateButtonStatus();
            completedSorts = 0;
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
        bar.style.width = (95.0 / barCount) + "vw";  // Set the width of the bars

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
    const timeSortDisplay1 = document.getElementById('timeSort1');
    const timeSortDisplay2 = document.getElementById('timeSort2');

    // Populate the modal with swap counts and times for both algorithms
    stepsDisplay1.textContent = stepsCount1;
    stepsDisplay2.textContent = stepsCount2;
    timeAnimateDisplay1.textContent = (timeAnimate1 / 1000.0).toFixed(2) + " s";
    timeAnimateDisplay2.textContent = (timeAnimate2 / 1000.0).toFixed(2) + " s";
    timeSortDisplay1.textContent = (timeSort1 * 1).toFixed(3) + " ms";
    timeSortDisplay2.textContent = (timeSort2 * 1).toFixed(3) + " ms";

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

// ======= ALGORITHM LOGIC ======= //

// Bubble Sort Algorithm
function sortBubble(array, container) {
    const stepsHistory = [];
    let stepsCount = 0;  // Initialize steps count

    do {
        var swapped = false;
        for (let i = 1; i < array.length; i++) {
            if (array[i - 1] > array[i]) {
                swapped = true;
                stepsHistory.push([i - 1, i]);
                [array[i - 1], array[i]] = [array[i], array[i - 1]];  // Swap elements
                stepsCount++;  // Increment step count after a swap
            }
        }
    } while (swapped);

    // Update stepsCount for the appropriate container
    switch (container) {
        case "container1":
            stepsCount1 = stepsCount;
            timeSort1 = performance.now() - startTime;
            break;
        case "container2":
            stepsCount2 = stepsCount;
            timeSort2 = performance.now() - startTime;
            break;
        default:
            break;
    }

    return stepsHistory;
}

// Cocktail Shaker Sort Algorithm
function sortCocktail(array, container) {
    const stepsHistory = [];
    let stepsCount = 0;  // Initialize steps count
    let swapped = true;
    let start = 0;
    let end = array.length - 1;

    while (swapped) {
        swapped = false;

        // Left to right pass
        for (let i = start; i < end; i++) {
            if (array[i] > array[i + 1]) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];  // Swap elements
                stepsHistory.push([i, i + 1]);
                stepsCount++;  // Increment step count after a swap
                swapped = true;
            }
        }

        if (!swapped) break;

        swapped = false;
        end--;

        // Right to left pass
        for (let i = end - 1; i >= start; i--) {
            if (array[i] > array[i + 1]) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];  // Swap elements
                stepsHistory.push([i, i + 1]);
                stepsCount++;  // Increment step count after a swap
                swapped = true;
            }
        }
        start++;
    }

    // Update stepsCount for the appropriate container
    switch (container) {
        case "container1":
            stepsCount1 = stepsCount;
            timeSort1 = performance.now() - startTime;
            break;
        case "container2":
            stepsCount2 = stepsCount;
            timeSort2 = performance.now() - startTime;
            break;
        default:
            break;
    }

    return stepsHistory;
}

// Comb Sort Algorithm
function sortComb(array, container) {
    const stepsHistory = [];
    let stepsCount = 0;  // Initialize steps count
    let gap = array.length;
    const shrink = 1.3;
    let sorted = false;

    while (!sorted) {
        gap = Math.floor(gap / shrink);
        if (gap <= 1) {
            gap = 1;
            sorted = true;
        }
        for (let i = 0; i + gap < array.length; i++) {
            if (array[i] > array[i + gap]) {
                [array[i], array[i + gap]] = [array[i + gap], array[i]];  // Swap elements
                stepsHistory.push([i, i + gap]);
                stepsCount++;  // Increment step count after a swap
                sorted = false;
            }
        }
    }

    // Update stepsCount for the appropriate container
    switch (container) {
        case "container1":
            stepsCount1 = stepsCount;
            timeSort1 = performance.now() - startTime;
            break;
        case "container2":
            stepsCount2 = stepsCount;
            timeSort2 = performance.now() - startTime;
            break;
        default:
            break;
    }

    return stepsHistory;
}

// Gnome Sort Algorithm
function sortGnome(array, container) {
    const stepsHistory = [];
    let stepsCount = 0;  // Initialize steps count
    let pos = 0;

    while (pos < array.length) {
        if (pos === 0 || array[pos] >= array[pos - 1]) {
            pos++;
        } else {
            stepsHistory.push([pos, pos - 1]);
            [array[pos], array[pos - 1]] = [array[pos - 1], array[pos]];  // Swap elements
            stepsCount++;  // Increment step count after a swap
            pos--;
        }
    }

    // Update stepsCount for the appropriate container
    switch (container) {
        case "container1":
            stepsCount1 = stepsCount;
            timeSort1 = performance.now() - startTime;
            break;
        case "container2":
            stepsCount2 = stepsCount;
            timeSort2 = performance.now() - startTime;
            break;
        default:
            break;
    }

    return stepsHistory;
}

// Heap Sort Algorithm
function sortHeap(array, container) {
    const stepsHistory = [];
    let stepsCount = 0;  // Initialize steps count

    // Helper function to heapify a subtree rooted at index i
    function heapify(arr, n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];  // Swap elements
            stepsHistory.push([i, largest]);
            stepsCount++;  // Increment step count after a swap
            heapify(arr, n, largest);
        }
    }

    // Build a max heap
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        heapify(array, array.length, i);
    }

    // Extract elements from heap
    for (let i = array.length - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];  // Swap elements
        stepsHistory.push([0, i]);
        stepsCount++;  // Increment step count after a swap
        heapify(array, i, 0);
    }

    // Update stepsCount for the appropriate container
    switch (container) {
        case "container1":
            stepsCount1 = stepsCount;
            timeSort1 = performance.now() - startTime;
            break;
        case "container2":
            stepsCount2 = stepsCount;
            timeSort2 = performance.now() - startTime;
            break;
        default:
            break;
    }

    return stepsHistory;
}

// Insertion Sort Algorithm
function sortInsertion(array, container) {
    const stepsHistory = [];
    let stepsCount = 0;  // Initialize steps count

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        
        // Shift elements of array[0..i-1] that are greater than key
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            stepsHistory.push([j, j + 1]);  // Log the swap for visualization
            stepsCount++;  // Increment step count after a swap
            j = j - 1;
        }
        
        // Place key after the last element smaller than it
        array[j + 1] = key;
    }

    // Update stepsCount for the appropriate container
    switch (container) {
        case "container1":
            stepsCount1 = stepsCount;
            timeSort1 = performance.now() - startTime;
            break;
        case "container2":
            stepsCount2 = stepsCount;
            timeSort2 = performance.now() - startTime;
            break;
        default:
            break;
    }

    return stepsHistory;
}

// Quick Sort Algorithm
function sortQuick(array, container) {
    const stepsHistory = [];
    let stepsCount = 0;  // Track the number of swaps (steps)
    
    // Helper function to partition the array
    function partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];  // Swap elements
                stepsHistory.push([i, j]);  // Record the swap
                stepsCount++;  // Increment the step count after a swap
            }
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];  // Swap pivot with the correct position
        stepsHistory.push([i + 1, high]);  // Record the swap for pivot
        stepsCount++;  // Increment the step count for pivot swap
        
        return i + 1;
    }

    // Recursive Quick Sort function
    function quickSort(arr, low, high) {
        if (low < high) {
            const pi = partition(arr, low, high);  // Partition the array
            quickSort(arr, low, pi - 1);  // Recursively sort the left part
            quickSort(arr, pi + 1, high);  // Recursively sort the right part
        }
    }

    // Start the quickSort process
    quickSort(array, 0, array.length - 1);

    // After sorting, update the steps count for the corresponding container
    switch (container) {
        case "container1":
            stepsCount1 = stepsCount;  // Update global step count for container1
            timeSort1 = performance.now() - startTime;  // Calculate time taken for sorting
            break;
        case "container2":
            stepsCount2 = stepsCount;  // Update global step count for container2
            timeSort2 = performance.now() - startTime;  // Calculate time taken for sorting
            break;
        default:
            break;
    }

    // Return the swap steps for animation (stepsHistory)
    return stepsHistory;
}


// Selection Sort Algorithm
function sortSelection(array, container) {
    const stepsHistory = [];
    let stepsCount = 0;  // Track the number of steps (swaps)

    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;

        // Find the minimum element in the unsorted part
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }

        // Swap the found minimum element with the element at index i
        if (minIndex !== i) {
            stepsHistory.push([i, minIndex]);  // Record the swap
            [array[i], array[minIndex]] = [array[minIndex], array[i]];  // Swap elements
            stepsCount++;  // Increment step count after a swap
        }
    }

    // After sorting, update the steps count for the corresponding container
    switch (container) {
        case "container1":
            stepsCount1 = stepsCount;  // Update global step count for container1
            timeSort1 = performance.now() - startTime;  // Calculate time taken for sorting
            break;
        case "container2":
            stepsCount2 = stepsCount;  // Update global step count for container2
            timeSort2 = performance.now() - startTime;  // Calculate time taken for sorting
            break;
        default:
            break;
    }

    // Return the swap steps for animation
    return stepsHistory;
}


// Shell Sort Algorithm
function sortShell(array) {
    const stepsHistory = [];
    const gaps = [701, 301, 132, 57, 23, 10, 4, 1];
    for (let gap of gaps) {
        for (let i = gap; i < array.length; i++) {
            let temp = array[i];
            let j = i;
            while (j >= gap && array[j - gap] > temp) {
                stepsHistory.push([j, j - gap]);
                array[j] = array[j - gap];
                j -= gap;
            }
            array[j] = temp;
        }
    }
    return stepsHistory;
}

