// ======= CONTROL VARIABLES ======= //

// Default settings
let barCount = 50;  // Number of bars to display in the visualization
let animationSpeed = 25;  // Speed of animation (in milliseconds)
let isSorting = false;  // Flag to indicate whether sorting is in progress
let completedSorts = 0;  // Counter to track how many sorts have completed
const array = [];  // Main array for sorting
const array1 = [];  // Copy of the array for the first container
const array2 = [];  // Copy of the array for the second container

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

    // Clear existing arrays
    array.length = 0;
    array1.length = 0;
    array2.length = 0;

    // Generate new random array values for `barCount`
    for (let i = 0; i < barCount; i++) {
        const value = Math.random();  // Generate random value between 0 and 1
        array[i] = value;
        array1[i] = value;  // Initialize the first array for container1
        array2[i] = value;  // Initialize the second array for container2
    }

    // Draw bars for both containers
    drawBars("container1", array1);
    drawBars("container2", array2);
}

// Helper function to select the sorting algorithm and return the appropriate swaps
function selectAnimation(option, copy) {
    // Handles the backend logic for sorting based on selected algorithm
    switch (option) {
        case "bubble": return sortBubble(copy);
        case "cocktail": return sortCocktail(copy);
        case "comb": return sortComb(copy);
        case "gnome": return sortGnome(copy);
        case "heap": return sortHeap(copy);
        case "insertion": return sortInsertion(copy);
        case "quick": return sortQuick(copy);
        case "selection": return sortSelection(copy);
        case "shell": return sortShell(copy);
        default: return [];  // Return empty array for invalid options
    }
}

// Play button function to start the sorting animations
function play() {
    isSorting = true;  // Set sorting flag to true
    completedSorts = 0;  // Reset completed sorts counter
    updateButtonStatus();  // Update button states

    // Get the selected sorting algorithms from dropdowns
    const selectedAlgorithm1 = document.getElementById("algorithmSelect1").value;
    const selectedAlgorithm2 = document.getElementById("algorithmSelect2").value;

    // Create copies of the arrays to avoid visual glitches during sorting
    const copy1 = [...array1];
    const copy2 = [...array2];

    let swaps1 = selectAnimation(selectedAlgorithm1, copy1);  // Get swaps for the first algorithm
    let swaps2 = selectAnimation(selectedAlgorithm2, copy2);  // Get swaps for the second algorithm

    // Start the animation for both containers with their respective swaps
    animate("container1", array1, swaps1);
    animate("container2", array2, swaps2);
}

// Pause button function to stop sorting
function pause() {
    isSorting = false;  // Set sorting flag to false
    updateButtonStatus();  // Update button states
}

// Update the button status (disabled/enabled) based on whether sorting is in progress
function updateButtonStatus() {
    const buttonGenerateData = document.getElementById("buttonGenerateData");
    const buttonPlay = document.getElementById("buttonPlay");
    const buttonPause = document.getElementById("buttonPause");

    buttonGenerateData.disabled = isSorting;  // Disable data generation button if sorting
    buttonPlay.disabled = isSorting;  // Disable play button if sorting
    buttonPause.disabled = !isSorting;  // Disable pause button if not sorting
}

// ======= ANIMATION/UI ======= //

// Animation function to animate the sorting process
function animate(elementId, array, swaps) {
    if (!isSorting) {
        drawBars(elementId, array);  // Draw the final array if sorting has stopped
        return;
    }

    if (swaps.length === 0) {
        // No more swaps, end animation and reset sorting state
        drawBars(elementId, array);
        completedSorts++;

        if (completedSorts === 2) {
            isSorting = false;  // Stop sorting when both animations are complete
            updateButtonStatus();
            completedSorts = 0;
            return;
        }
    }

    const [i, j] = swaps.shift();  // Get the indices to swap

    // Swap the elements in the array using destructuring
    [array[i], array[j]] = [array[j], array[i]];
    drawBars(elementId, array, [i, j]);  // Highlight swapped bars

    // Recursively call `animate()` after the animation speed delay
    setTimeout(function() {
        animate(elementId, array, swaps);
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


// ======= ALGORITHMS ======= //

// Bubble Sort Algorithm
function sortBubble(array) {
    const swapHistory = [];
    do {
        var swapped = false;
        for (let i = 1; i < array.length; i++) {
            if (array[i - 1] > array[i]) {
                swapped = true;
                swapHistory.push([i - 1, i]);
                [array[i - 1], array[i]] = [array[i], array[i - 1]];  // Swap elements
            }
        }
    } while (swapped);
    return swapHistory;
}

// Cocktail Shaker Sort Algorithm
function sortCocktail(array) {
    const swapHistory = [];
    let swapped = true;
    let start = 0;
    let end = array.length - 1;

    while (swapped) {
        swapped = false;

        // Left to right pass
        for (let i = start; i < end; i++) {
            if (array[i] > array[i + 1]) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                swapHistory.push([i, i + 1]);
                swapped = true;
            }
        }

        if (!swapped) break;

        swapped = false;
        end--;

        // Right to left pass
        for (let i = end - 1; i >= start; i--) {
            if (array[i] > array[i + 1]) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                swapHistory.push([i, i + 1]);
                swapped = true;
            }
        }
        start++;
    }

    return swapHistory;
}

// Comb Sort Algorithm
function sortComb(array) {
    const swaps = [];
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
                swaps.push([i, i + gap]);
                [array[i], array[i + gap]] = [array[i + gap], array[i]];
                sorted = false;
            }
        }
    }
    return swaps;
}

// Gnome Sort Algorithm
function sortGnome(array) {
    const swaps = [];
    let pos = 0;

    while (pos < array.length) {
        if (pos === 0 || array[pos] >= array[pos - 1]) {
            pos++;
        } else {
            swaps.push([pos, pos - 1]);
            [array[pos], array[pos - 1]] = [array[pos - 1], array[pos]];
            pos--;
        }
    }
    return swaps;
}

// Heap Sort Algorithm
function sortHeap(array) {
    const swapHistory = [];
    
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
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            swapHistory.push([i, largest]);
            heapify(arr, n, largest);
        }
    }

    // Build a max heap
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        heapify(array, array.length, i);
    }

    // Extract elements from heap
    for (let i = array.length - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        swapHistory.push([0, i]);
        heapify(array, i, 0);
    }

    return swapHistory;
}

// Insertion Sort Algorithm
function sortInsertion(array) {
    const swapHistory = [];
    
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        
        // Shift elements of array[0..i-1] that are greater than key
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            swapHistory.push([j, j + 1]);  // Log the swap for visualization
            j = j - 1;
        }
        
        // Place key after the last element smaller than it
        array[j + 1] = key;
    }
    
    return swapHistory;
}

// Quick Sort Algorithm
function sortQuick(array) {
    const swapHistory = [];
    
    // Helper function to partition the array
    function partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                swapHistory.push([i, j]);
            }
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        swapHistory.push([i + 1, high]);
        
        return i + 1;
    }

    // Recursive Quick Sort function
    function quickSort(arr, low, high) {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    quickSort(array, 0, array.length - 1);

    return swapHistory;
}


// Selection Sort Algorithm
function sortSelection(array) {
    const swapHistory = [];
 
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            swapHistory.push([i, minIndex]);
            [array[i], array[minIndex]] = [array[minIndex], array[i]];  // Swap elements
        }
    }

    return swapHistory;
}

// Shell Sort Algorithm
function sortShell(array) {
    const swaps = [];
    const gaps = [701, 301, 132, 57, 23, 10, 4, 1];
    for (let gap of gaps) {
        for (let i = gap; i < array.length; i++) {
            let temp = array[i];
            let j = i;
            while (j >= gap && array[j - gap] > temp) {
                swaps.push([j, j - gap]);
                array[j] = array[j - gap];
                j -= gap;
            }
            array[j] = temp;
        }
    }
    return swaps;
}
