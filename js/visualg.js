// === Global Variables ===
let barCount = 50; // Default number of bars
let animationSpeed = 25; // Default to Normal (25ms)
let isSorting = false;
let completedSorts = 0;

const array = [];
const array1 = [];
const array2 = [];

// === DOM Elements ===
const valueNInput = document.getElementById("valueN");
const nValueDisplay = document.getElementById("nValueDisplay");
const animationSpeedInput = document.getElementById("animationSpeed");
const algorithmSelect1 = document.getElementById("algorithmSelect1");
const algorithmSelect2 = document.getElementById("algorithmSelect2");
const buttonGenerateData = document.getElementById("buttonGenerateData");
const buttonPlay = document.getElementById("buttonPlay");
const buttonPause = document.getElementById("buttonPause");

// === Event Listeners ===
// Update the barCount when the slider value changes
valueNInput.addEventListener("input", updateBarCount);
// Update the animation speed when the dropdown value changes
animationSpeedInput.addEventListener("change", updateAnimationSpeed);

// === Initialization ===
init(); // Initialize bars and reset state

// === Helper Functions ===

// Function to update the bar count and display
function updateBarCount() {
    barCount = parseInt(valueNInput.value);
    nValueDisplay.textContent = barCount; // Update the display text
    init(); // Re-initialize the bars with the new value of barCount
}

// Function to update the animation speed based on user input
function updateAnimationSpeed() {
    animationSpeed = parseInt(animationSpeedInput.value);
}

// Function to update the status of buttons
function updateButtonStatus() {
    buttonGenerateData.disabled = isSorting;
    buttonPlay.disabled = isSorting;
    buttonPause.disabled = !isSorting;
}

// === Sorting Setup ===

// Function to initialize the bars
function init() {
    isSorting = false;
    updateButtonStatus();

    array.length = 0; // Clear the existing array
    array1.length = 0;
    array2.length = 0;

    // Generate new array with the updated value of barCount
    for (let i = 0; i < barCount; i++) {
        const value = Math.random();
        array[i] = value;
        array1[i] = value;
        array2[i] = value;
    }

    drawBars("container1", array1);
    drawBars("container2", array2);
}

// Function to start the sorting animation
function play() {
    isSorting = true;
    completedSorts = 0;
    updateButtonStatus();

    const selectedAlgorithm1 = algorithmSelect1.value;
    const selectedAlgorithm2 = algorithmSelect2.value;

    const copy1 = [...array1];
    const copy2 = [...array2];

    let swaps1 = getSortSwaps(selectedAlgorithm1, copy1);
    let swaps2 = getSortSwaps(selectedAlgorithm2, copy2);

    animate("container1", array1, swaps1);
    animate("container2", array2, swaps2);
}

// Function to pause the sorting animation
function pause() {
    isSorting = false;
    updateButtonStatus();
}

// === Sorting Algorithm Selection ===

// Function to get sorting swaps based on selected algorithm
function getSortSwaps(algorithm, array) {
    switch (algorithm) {
        case "bubble":
            return sortBubble(array);
        case "cocktail":
            return sortCocktail(array);
        case "heap":
            return sortHeap(array);
        case "insertion":
            return sortInsertion(array);
        case "merge":
            return sortMerge(array);
        case "quick":
            return sortQuick(array);
        case "selection":
            return sortSelection(array);
        default:
            return [];
    }
}

// === Animation & UI ===

// Function to animate the sorting process
function animate(elementId, array, swaps) {
    if (!isSorting) {
        drawBars(elementId, array);
        return;
    }

    if (swaps.length === 0) {
        drawBars(elementId, array);
        completedSorts++;

        if (completedSorts === 2) {
            isSorting = false;
            updateButtonStatus();
            completedSorts = 0;
            return;
        }
    }

    const [i, j] = swaps.shift();  // Get the indices to swap
    [array[i], array[j]] = [array[j], array[i]]; // Swap the items
    drawBars(elementId, array, [i, j]);  // Highlight swapped bars

    setTimeout(() => {
        animate(elementId, array, swaps);
    }, animationSpeed);
}

// Function to draw the bars on the screen
function drawBars(elementId, array, swappedArray = []) {
    const container = document.getElementById(elementId);
    container.innerHTML = "";  // Clears container before updating the bars

    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("sort-bar");

        const value = array[i];
        const color = getColorFromValue(value);
        bar.style.backgroundColor = color;
        bar.style.width = (95.0 / barCount) + "vw";

        container.appendChild(bar);
    }
}

// Function to get a color from a value (between 0 and 1)
function getColorFromValue(value) {
    const colorStart = { r: 0, g: 186, b: 216 };   // #00b4d8
    const colorEnd = { r: 131, g: 56, b: 236 };    // #8338ec

    const r = Math.floor(interpolate(value, colorStart.r, colorEnd.r));
    const g = Math.floor(interpolate(value, colorStart.g, colorEnd.g));
    const b = Math.floor(interpolate(value, colorStart.b, colorEnd.b));

    return rgbToHex(r, g, b);
}

// Interpolate between two values based on the ratio (value between 0 and 1)
function interpolate(value, start, end) {
    return start + (end - start) * value;
}

// Convert RGB values to Hex
function rgbToHex(r, g, b) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert a single RGB component to a two-digit hex value
function toHex(n) {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

// === Sorting Algorithms ===

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

// Merge Sort Algorithm
function sortMerge(array) {
    const swapHistory = [];  // To store the swap history

    // Helper function to merge two sorted subarrays
    function merge(arr, left, right) {
        const merged = [];
        let leftIndex = 0;
        let rightIndex = 0;
        
        // Merge the two subarrays
        while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex] < right[rightIndex]) {
                merged.push(left[leftIndex]);
                leftIndex++;
            } else {
                merged.push(right[rightIndex]);
                rightIndex++;
            }
        }
        
        // Add the remaining elements from the left or right subarrays
        while (leftIndex < left.length) {
            merged.push(left[leftIndex]);
            leftIndex++;
        }
        
        while (rightIndex < right.length) {
            merged.push(right[rightIndex]);
            rightIndex++;
        }
        
        // Copy the merged result back into the original array
        for (let i = 0; i < merged.length; i++) {
            arr[i] = merged[i];
            swapHistory.push([i, merged[i]]);  // Track the merge history (for animation)
        }

        return arr;
    }

    // Recursive function to divide the array into halves and merge them
    function mergeSort(arr) {
        if (arr.length <= 1) {
            return arr;
        }
        
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
        
        // Recursively sort the left and right halves
        mergeSort(left);
        mergeSort(right);
        
        // Merge the sorted halves
        return merge(arr, left, right);
    }

    // Start the merge sort process
    mergeSort(array);

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
