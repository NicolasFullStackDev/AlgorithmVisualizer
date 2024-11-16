This project was inspired by the Harvard CS50 Lessons This is the third project on my portifolio and one I built without any external libraries (except for fontawesome icons because I am not good at drawing icons).

Functionalities

The user can compare two different sorting algorithms. Current options are:
Bubble; Cocktail; Comb; Gnome; Heap; Insertion; Quick; Selection; Shell;
The user will get a feedback of how many steps it took as well as how long it took (to sort and to animate);

TO-DO's

Add Marge Sort and Radix Sort / Review animation function to handle those cases(??);
Generate a database to register performance benchmarks of each algorithm
Make general improvements to performance to allow for even larger datasets. I think up to 500 would be my goal. Technically it already works but it gets laggy.
Allow the user to start the sorting process by using a hotkey like s or space

KNOWN ISSUES
Timer and Step counter does not reset without refreshing the page
Weird things happen when you pause and play multiple times;
When you switch algoritms  mid-sim sometimes it will break the logic and the app will get stuck on running and you have to pause even when it ends the process.

Both issues are fixed by manually pausing and then generating a new dataset and restarting it.
