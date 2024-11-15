let barCount = 50; // Default number of bars
let animationSpeed = 25; // Default to Normal (25ms)

let isSorting = false;
let isSorting1 = false;
let isSorting2 = false;
let completedSorts = 0;
const array = [];
const array1 = [];
const array2 = [];

init();

// Add an event listener to the slider to update barCount when the user changes the value
const valueNInput = document.getElementById("valueN");
const nValueDisplay = document.getElementById("nValueDisplay");
// Get the dropdown element
const animationSpeedInput = document.getElementById("animationSpeed");

// Update the barCount value and the display when the slider value changes
valueNInput.addEventListener("input", function() {
    barCount = parseInt(valueNInput.value);
    nValueDisplay.textContent = barCount; // Update the display text
    init(); // Re-initialize the bars with the new value of barCount
});

// Update animation speed when the dropdown value changes
animationSpeedInput.addEventListener("change", function () {
    animationSpeed = parseInt(animationSpeedInput.value);
});

// Initialize the bars when the page loads or when barCount changes
function init() {
    isSorting = false;
    updateButtonStaus();

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

function play() {
	isSorting = true;
  completedSorts = 0;
	updateButtonStaus();

    // Get the selected sorting algorithm from the dropdown
    const algorithmSelect1 = document.getElementById("algorithmSelect1");
    const selectedAlgorithm1 = algorithmSelect1.value;

    const algorithmSelect2 = document.getElementById("algorithmSelect2");
    const selectedAlgorithm2 = algorithmSelect2.value;

    // Create a copy of the array to avoid visual glitches
    const copy1 = [...array1];
    const copy2 = [...array2];

    let swaps1 = [];
    let swaps2 = [];
    
    // Choose the sorting algorithm based on user selection
    if (selectedAlgorithm1 === "bubble") {
        swaps1 = sortBubble(copy1);
    } else if (selectedAlgorithm1 === "cocktail") {
        swaps1 = sortCocktail(copy1);
    } else if (selectedAlgorithm1 === "comb") {
        swaps1 = sortComb(copy1);
    } else if (selectedAlgorithm1 === "gnome") {
        swaps1 = sortGnome(copy1);
    } else if (selectedAlgorithm1 === "heap") {
        swaps1 = sortHeap(copy1);
    } else if (selectedAlgorithm1 === "insertion") {
        swaps1 = sortInsertion(copy1);
    } else if (selectedAlgorithm1 === "merge") {
        swaps1 = sortMerge(copy1);
    } else if (selectedAlgorithm1 === "quick") {
        swaps1 = sortQuick(copy1);
    } else if (selectedAlgorithm1 === "selection") {
        swaps1 = sortSelection(copy1);
    } else if (selectedAlgorithm1 === "shell") {
        swaps1 = sortShell(copy1);
    }

    // Choose the sorting algorithm based on user selection
    if (selectedAlgorithm2 === "bubble") {
        swaps2 = sortBubble(copy2);
    } else if (selectedAlgorithm2 === "cocktail") {
        swaps2 = sortCocktail(copy2);
    } else if (selectedAlgorithm2 === "heap") {
        swaps2 = sortHeap(copy2);
    } else if (selectedAlgorithm2 === "insertion") {
        swaps2 = sortInsertion(copy2);
    } else if (selectedAlgorithm2 === "quick") {
        swaps2 = sortQuick(copy2);
    } else if (selectedAlgorithm2 === "selection") {
        swaps2 = sortSelection(copy2);
    }

    animate("container1", array1, swaps1);  // Animate the selected algorithm
    animate("container2", array2, swaps2);  // Animate the selected algorithm
}

function pause() {
	isSorting = false;
	updateButtonStaus();
}


// Update Button status
function updateButtonStaus(){
    const buttonGenerateData = document.getElementById("buttonGenerateData");
    buttonGenerateData.disabled = isSorting;
    const buttonPlay = document.getElementById("buttonPlay");
    buttonPlay.disabled = isSorting;
    const buttonPause = document.getElementById("buttonPause");
    buttonPause.disabled = !isSorting;
}


/* Animation / UI Functions */
function animate(elementId, array, swaps) {
	if (!isSorting) {
		drawBars(elementId, array);
		return;
	}
    
    if (swaps.length == 0) {
        // This is a last callback to drawBars()
        // It should draw the bars again without the color change in the animation
        drawBars(elementId, array);
        completedSorts++;

        if (completedSorts === 2) {
            isSorting = false;
            updateButtonStaus();
            completedSorts = 0;
            return;
        }        
    }
    
    const [i, j] = swaps.shift();  // Get the indices to swap

    // De-structure technique to swap the items in the array without the need of temps
    [array[i], array[j]] = [array[j], array[i]];
    drawBars(elementId, array, [i, j]);  // Highlight swapped bars
    setTimeout(function() {
        animate(elementId, array, swaps);
    }, animationSpeed);
}

function drawBars(elementId, array, swappedArray = []) {
    const container = document.getElementById(elementId);
    
    container.innerHTML = "";  // Clears container before updating the bars

    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("sort-bar");
        
        // Dynamically set the color based on the value
        const value = array[i];
        const color = getColorFromValue(value);

        bar.style.backgroundColor = color;  // Apply calculated color
        bar.style.width = (95.0/barCount) + "vw";
        
        container.appendChild(bar);
    }
}
// Helper function to get a color from a value (between 0 and 1)
function getColorFromValue(value) {
    // Define the start and end colors (in RGB format)
    const colorStart = { r: 0, g: 186, b: 216 };   // #00b4d8
    const colorEnd = { r: 131, g: 56, b: 236 };    // #8338ec

    // Interpolate each color component (r, g, b) based on the value
    const r = Math.floor(interpolate(value, colorStart.r, colorEnd.r));
    const g = Math.floor(interpolate(value, colorStart.g, colorEnd.g));
    const b = Math.floor(interpolate(value, colorStart.b, colorEnd.b));

    // Convert the RGB to hex
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
/* ### ALGORITHMS ADDED BELOW ### */

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
