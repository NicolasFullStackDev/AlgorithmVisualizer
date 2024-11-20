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
            break;
        case "container2":
            stepsCount2 = stepsCount;
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
            break;
        case "container2":
            stepsCount2 = stepsCount;
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
            break;
        case "container2":
            stepsCount2 = stepsCount;
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
            break;
        case "container2":
            stepsCount2 = stepsCount;
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
            break;
        case "container2":
            stepsCount2 = stepsCount;
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
            break;
        case "container2":
            stepsCount2 = stepsCount;
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
            break;
        case "container2":
            stepsCount2 = stepsCount;  // Update global step count for container2
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
            break;
        case "container2":
            stepsCount2 = stepsCount;  // Update global step count for container2
            break;
        default:
            break;
    }

    // Return the swap steps for animation
    return stepsHistory;
}


// Shell Sort Algorithm
function sortShell(array, container) {
    const stepsHistory = [];

	let stepsCount = 0;  // Track the number of steps (swaps)

    const gaps = [701, 301, 132, 57, 23, 10, 4, 1];
    for (let gap of gaps) {
        for (let i = gap; i < array.length; i++) {
            let temp = array[i];
            let j = i;
            while (j >= gap && array[j - gap] > temp) {
                stepsHistory.push([j, j - gap]);
                array[j] = array[j - gap];
                j -= gap;
				stepsCount++;

            }
            array[j] = temp;
        }
    }

    // After sorting, update the steps count for the corresponding container
    switch (container) {
        case "container1":
            stepsCount1 = stepsCount;  // Update global step count for container1
            break;
        case "container2":
            stepsCount2 = stepsCount;  // Update global step count for container2
            break;
        default:
            break;
    }

    return stepsHistory;
}

