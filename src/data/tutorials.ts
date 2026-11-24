import type { LanguageId, TutorialLesson } from '../types';

export const LANGUAGE_META: Record<
  LanguageId,
  {
    name: string;
    tagline: string;
    fileExtension: string;
    starterCode: string;
  }
> = {
  python: {
    name: 'Python',
    tagline: 'Readable syntax ideal for first-time programmers',
    fileExtension: 'main.py',
    starterCode: `# Welcome to Python!
name = "Alex"
lessons_completed = 3

print(f"Hello, {name}!")
print("Next goal: finish loops.")

for step in range(1, lessons_completed + 1):
    print(f"Step {step} complete")`,
  },
  java: {
    name: 'Java',
    tagline: 'Structured, strongly typed object-oriented language',
    fileExtension: 'Main.java',
    starterCode: `public class Main {
    public static void main(String[] args) {
        String student = "Alex";
        int score = 95;

        System.out.println("Welcome to Java, " + student + "!");
        if (score >= 90) {
            System.out.println("Status: Great progress!");
        }
    }
}`,
  },
  cpp: {
    name: 'C++',
    tagline: 'Fast, foundational language for systems and logic',
    fileExtension: 'main.cpp',
    starterCode: `#include <iostream>
#include <string>

int main() {
    std::string topic = "Variables";
    int count = 3;

    std::cout << "Learning C++: " << topic << std::endl;
    for (int i = 1; i <= count; i++) {
        std::cout << "Practice rep " << i << std::endl;
    }
    return 0;
}`,
  },
  sql: {
    name: 'SQL',
    tagline: 'Query, filter, and organize data inside relational tables',
    fileExtension: 'query.sql',
    starterCode: `-- Sample table: learners (id, name, language, score)
CREATE TABLE learners (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    language VARCHAR(20),
    score INT
);

INSERT INTO learners VALUES
(1, 'Maya', 'Python', 92),
(2, 'Liam', 'Java', 85),
(3, 'Noah', 'SQL', 96);

SELECT name, language, score
FROM learners
WHERE score >= 85
ORDER BY score DESC;`,
  },
};

export const TUTORIAL_LESSONS: TutorialLesson[] = [
  // Python Lessons
  {
    id: 'py-1',
    language: 'python',
    number: '01',
    title: 'Variables and Printing Output',
    duration: '5 min',
    summary: 'Store text and numbers in variables and display messages with print().',
    explanation: [
      'In Python, a variable is a named label that holds a value in memory. You do not need to declare the data type manually—Python figures it out from the value you assign.',
      'Use the built-in print() function to show text or variable values on screen. Putting f before quotes lets you insert variables directly inside curly braces.',
    ],
    theoryPoints: [
      'Dynamic typing: Python automatically determines whether a value is text (str), whole number (int), or boolean (bool) at runtime.',
      'Assignment vs. equality: A single equals sign (=) stores a value into a variable from right to left.',
      'String interpolation: Prefixing a string with f lets Python evaluate expressions inside { } before printing.',
    ],
    keyPoints: [
      'Variable names use lowercase letters and underscores (like user_age).',
      'Strings are wrapped in single or double quotes.',
      'f-strings like f"Score: {score}" combine text and variables cleanly.',
    ],
    code: `student_name = "Maya"
age = 19
is_beginner = True

print(f"Hello, {student_name}!")
print(f"Age: {age}")
print(f"Ready to learn: {is_beginner}")`,
    codeExplanation: [
      {
        lines: 'Line 1',
        explanation: 'Creates a string variable named student_name and stores "Maya".',
      },
      {
        lines: 'Lines 2–3',
        explanation: 'Stores an integer (19) in age and a boolean (True) in is_beginner.',
      },
      {
        lines: 'Lines 5–7',
        explanation: 'Uses f-strings inside print() to format and output all three values cleanly.',
      },
    ],
    commonMistakes: [
      {
        title: 'Forgetting the f before curly braces',
        wrongCode: `name = "Maya"\nprint("Hello, {name}!")`,
        rightCode: `name = "Maya"\nprint(f"Hello, {name}!")`,
        reason: 'Without the leading f, Python treats {name} as literal text instead of inserting the variable value.',
      },
      {
        title: 'Lowercase true/false booleans',
        wrongCode: `is_beginner = true`,
        rightCode: `is_beginner = True`,
        reason: 'Python booleans are case-sensitive and must start with a capital letter: True or False.',
      },
    ],
  },
  {
    id: 'py-2',
    language: 'python',
    number: '02',
    title: 'Making Decisions with if / else',
    duration: '6 min',
    summary: 'Control what your program does based on conditions.',
    explanation: [
      'Programs often need to choose between different paths. Python uses if, elif (else if), and else statements to test conditions.',
      'Notice that Python uses indentation (4 spaces) instead of curly braces to group code inside an if block.',
    ],
    theoryPoints: [
      'Branching control flow: Conditions evaluate to either True or False, and only the first matching branch runs.',
      'Mutual exclusivity: In an if / elif / else chain, once one branch succeeds, Python skips the remaining branches.',
      'Significant whitespace: Indentation defines block ownership in Python, making structure visually explicit.',
    ],
    keyPoints: [
      'Always end an if, elif, or else line with a colon (:).',
      'Indent every line inside the block consistently with 4 spaces.',
      'Use == to check equality and >= or < to compare numbers.',
    ],
    code: `score = 84

if score >= 90:
    print("Grade: A - Excellent!")
elif score >= 75:
    print("Grade: B - Good job!")
else:
    print("Keep practicing, you are getting closer.")`,
    codeExplanation: [
      {
        lines: 'Line 1',
        explanation: 'Sets score to 84 so the program has a value to test.',
      },
      {
        lines: 'Lines 3–4',
        explanation: 'Checks if score is 90 or above. Since 84 >= 90 is False, this block is skipped.',
      },
      {
        lines: 'Lines 5–8',
        explanation: 'Tests elif score >= 75 (True), prints the Grade B message, and skips the else fallback.',
      },
    ],
    commonMistakes: [
      {
        title: 'Using = instead of == in a condition',
        wrongCode: `if score = 100:\n    print("Perfect!")`,
        rightCode: `if score == 100:\n    print("Perfect!")`,
        reason: '= assigns a value, whereas == compares two values for equality.',
      },
      {
        title: 'Missing colon or indentation',
        wrongCode: `if score >= 90\nprint("Grade: A")`,
        rightCode: `if score >= 90:\n    print("Grade: A")`,
        reason: 'Python requires a colon at the end of the condition and 4-space indentation for the body.',
      },
    ],
  },
  {
    id: 'py-3',
    language: 'python',
    number: '03',
    title: 'Repeating Tasks with Loops',
    duration: '7 min',
    summary: 'Use for loops and range() to repeat actions without copying code.',
    explanation: [
      'A for loop lets you run the same block of code multiple times. Combined with range(start, stop), it counts cleanly from one number up to (but not including) the stop number.',
      'Loops are essential for processing lists of items, counting scores, or automating repetitive calculations.',
    ],
    theoryPoints: [
      'Iteration: Loops eliminate duplicate code by repeating a single block across a sequence of values.',
      'Half-open intervals: range(start, stop) includes start and excludes stop, matching 0-based indexing in programming.',
      'Loop variable scope: On each pass, Python automatically updates the loop variable to the next element.',
    ],
    keyPoints: [
      'range(1, 6) produces the numbers 1, 2, 3, 4, 5.',
      'You can also loop directly over items in a list like ["Python", "Java", "C++"].',
      'Use meaningful loop variable names such as num or language.',
    ],
    code: `languages = ["Python", "Java", "C++"]

for lang in languages:
    print(f"Studying {lang}")

for count in range(1, 4):
    print(f"Loop iteration #{count}")`,
    codeExplanation: [
      {
        lines: 'Line 1',
        explanation: 'Creates a list containing three language names.',
      },
      {
        lines: 'Lines 3–4',
        explanation: 'Iterates over each item in languages, printing Studying Python, Studying Java, and Studying C++.',
      },
      {
        lines: 'Lines 6–7',
        explanation: 'Uses range(1, 4) to count 1, 2, and 3, printing each iteration number.',
      },
    ],
    commonMistakes: [
      {
        title: 'Expecting range(1, 4) to include 4',
        wrongCode: `# Expects 1, 2, 3, 4\nfor n in range(1, 4):\n    print(n)`,
        rightCode: `# Stops before 5, so prints 1, 2, 3, 4\nfor n in range(1, 5):\n    print(n)`,
        reason: 'The stop argument in range() is exclusive, so add 1 if you want to include the final number.',
      },
      {
        title: 'Forgetting to indent the loop body',
        wrongCode: `for lang in languages:\nprint(lang)`,
        rightCode: `for lang in languages:\n    print(lang)`,
        reason: 'Every statement that should repeat must be indented inside the for block.',
      },
    ],
  },
  {
    id: 'py-4',
    language: 'python',
    number: '04',
    title: 'Writing Reusable Functions',
    duration: '7 min',
    summary: 'Group logic into named functions using def and return values.',
    explanation: [
      'Functions let you package a piece of logic once and reuse it anywhere by calling its name. Define a function with the def keyword.',
      'Parameters let you pass input data into the function, and return sends a calculated result back to the caller.',
    ],
    theoryPoints: [
      'Abstraction & reuse: Functions hide implementation details behind a descriptive name so logic is written once.',
      'Parameters vs. arguments: Parameters are the placeholder names in def; arguments are the real values passed at call time.',
      'Return vs. print: return sends a value back for further calculation, while print only displays text on screen.',
    ],
    keyPoints: [
      'Define a function with def function_name(parameter): before calling it.',
      'Use return to send a value back out of a function.',
      'Keep each function focused on one clear job.',
    ],
    code: `def calculate_area(width, height):
    return width * height

room_area = calculate_area(5, 4)
print(f"Room area: {room_area} sq meters")
print(f"Desk area: {calculate_area(2, 1)} sq meters")`,
    codeExplanation: [
      {
        lines: 'Lines 1–2',
        explanation: 'Defines calculate_area taking width and height, returning their product.',
      },
      {
        lines: 'Line 4',
        explanation: 'Calls calculate_area(5, 4) and stores the returned result (20) in room_area.',
      },
      {
        lines: 'Lines 5–6',
        explanation: 'Prints room_area and demonstrates reusing the same function with new arguments (2, 1).',
      },
    ],
    commonMistakes: [
      {
        title: 'Using print() instead of return',
        wrongCode: `def add(a, b):\n    print(a + b)\ntotal = add(2, 3) + 1  # Error!`,
        rightCode: `def add(a, b):\n    return a + b\ntotal = add(2, 3) + 1`,
        reason: 'A function without return evaluates to None, which cannot be added to a number.',
      },
      {
        title: 'Calling a function without parentheses',
        wrongCode: `area = calculate_area`,
        rightCode: `area = calculate_area(5, 4)`,
        reason: 'Omitting parentheses refers to the function object itself instead of executing it.',
      },
    ],
  },

  // Java Lessons
  {
    id: 'java-1',
    language: 'java',
    number: '01',
    title: 'Your First Java Program & Types',
    duration: '6 min',
    summary: 'Understand Java classes, main(), and strongly typed variables.',
    explanation: [
      'Every Java application starts inside a class and runs from a special main method: public static void main(String[] args).',
      'Java is statically typed, meaning you specify the type of each variable—such as int for whole numbers, double for decimals, and String for text—and end statements with a semicolon.',
    ],
    theoryPoints: [
      'Static typing: Declaring types up front lets the Java compiler catch type mismatches before the program ever runs.',
      'Class container: Java organizes all executable code inside classes, with main() acting as the program entry point.',
      'String concatenation: Using + between a String and a number converts the number to text and joins them.',
    ],
    keyPoints: [
      'Every statement ends with a semicolon (;).',
      'System.out.println() prints a line of text to the console.',
      'Common beginner types: int, double, boolean, and String.',
    ],
    code: `public class Main {
    public static void main(String[] args) {
        String name = "Liam";
        int lessons = 4;
        double progress = 25.5;

        System.out.println("Learner: " + name);
        System.out.println("Lessons: " + lessons + ", Progress: " + progress + "%");
    }
}`,
    codeExplanation: [
      {
        lines: 'Lines 1–2',
        explanation: 'Declares the Main class and the standard main method where Java begins execution.',
      },
      {
        lines: 'Lines 3–5',
        explanation: 'Declares three strongly typed variables: String name, int lessons, and double progress.',
      },
      {
        lines: 'Lines 7–8',
        explanation: 'Prints formatted lines by combining text literals with variables using +.',
      },
    ],
    commonMistakes: [
      {
        title: 'Missing semicolon at statement end',
        wrongCode: `int lessons = 4\nSystem.out.println(lessons);`,
        rightCode: `int lessons = 4;\nSystem.out.println(lessons);`,
        reason: 'Java requires a semicolon (;) to mark the end of every statement.',
      },
      {
        title: 'Using single quotes for a String',
        wrongCode: `String name = 'Liam';`,
        rightCode: `String name = "Liam";`,
        reason: 'Double quotes are for Strings; single quotes are strictly for a single char like \'A\'.',
      },
    ],
  },
  {
    id: 'java-2',
    language: 'java',
    number: '02',
    title: 'Conditionals in Java',
    duration: '6 min',
    summary: 'Use if, else if, and else blocks with curly braces.',
    explanation: [
      'Java checks boolean expressions inside parentheses after if or else if. Curly braces { } wrap the statements that run when the condition is true.',
      'For numbers, compare with ==, !=, >, and <. When comparing String text values in Java, always use .equals() instead of ==.',
    ],
    theoryPoints: [
      'Boolean evaluation: Conditions in Java must strictly evaluate to a boolean (true or false)—numbers cannot act as booleans.',
      'Value vs. reference equality: == compares memory references for objects like String, whereas .equals() compares characters.',
      'Block scoping: Curly braces { } explicitly group statements belonging to an if or else branch.',
    ],
    keyPoints: [
      'Conditions must be inside parentheses: if (age >= 18).',
      'Use curly braces { } to keep blocks readable and bug-free.',
      'Use textA.equals(textB) when comparing Strings.',
    ],
    code: `public class Main {
    public static void main(String[] args) {
        int points = 78;
        String track = "Java";

        if (points >= 80) {
            System.out.println("Passed with distinction!");
        } else if (points >= 60) {
            System.out.println("Passed! Keep building.");
        } else {
            System.out.println("Review the notes and retry.");
        }

        if (track.equals("Java")) {
            System.out.println("Active track: Java Fundamentals");
        }
    }
}`,
    codeExplanation: [
      {
        lines: 'Lines 3–4',
        explanation: 'Initializes an integer score (78) and a String track ("Java").',
      },
      {
        lines: 'Lines 6–12',
        explanation: 'Evaluates the grade thresholds; since 78 >= 60, the else if branch prints.',
      },
      {
        lines: 'Lines 14–16',
        explanation: 'Safely checks String content with .equals("Java") and prints the active track.',
      },
    ],
    commonMistakes: [
      {
        title: 'Comparing Strings with ==',
        wrongCode: `if (track == "Java") { ... }`,
        rightCode: `if (track.equals("Java")) { ... }`,
        reason: '== checks if two variables point to the same object in memory rather than comparing the text inside them.',
      },
      {
        title: 'Omitting parentheses around condition',
        wrongCode: `if points >= 80 {`,
        rightCode: `if (points >= 80) {`,
        reason: 'Java requires parentheses around every if and else if condition.',
      },
    ],
  },
  {
    id: 'java-3',
    language: 'java',
    number: '03',
    title: 'For Loops & Counting',
    duration: '7 min',
    summary: 'Iterate cleanly with Java’s three-part for loop.',
    explanation: [
      'A standard Java for loop has three parts inside parentheses: initialization (int i = 1), condition (i <= 5), and update (i++).',
      'As long as the condition stays true, the loop body runs and then updates the counter.',
    ],
    theoryPoints: [
      'Counter-controlled iteration: Separating init, condition, and increment keeps loop bounds transparent in one header.',
      'Accumulator pattern: Declaring total outside the loop preserves its sum across every iteration.',
      'Loop invariant: Each pass updates total so after step k, total equals the sum of numbers 1 through k.',
    ],
    keyPoints: [
      'i++ is shorthand for increasing i by 1 each round.',
      'Watch your condition (< vs <=) to avoid off-by-one errors.',
      'You can accumulate totals inside a variable declared before the loop.',
    ],
    code: `public class Main {
    public static void main(String[] args) {
        int total = 0;

        for (int i = 1; i <= 5; i++) {
            total += i;
            System.out.println("Step " + i + " running total: " + total);
        }
    }
}`,
    codeExplanation: [
      {
        lines: 'Line 3',
        explanation: 'Initializes total to 0 before the loop begins so the sum persists across iterations.',
      },
      {
        lines: 'Line 5',
        explanation: 'Starts i at 1, repeats while i <= 5, and increments i by 1 after each cycle.',
      },
      {
        lines: 'Lines 6–7',
        explanation: 'Adds i to total (total += i) and prints the running total at each step.',
      },
    ],
    commonMistakes: [
      {
        title: 'Placing a semicolon right after the for header',
        wrongCode: `for (int i = 1; i <= 5; i++);\n{\n    System.out.println(i);\n}`,
        rightCode: `for (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}`,
        reason: 'A trailing semicolon creates an empty loop body and breaks the block connection.',
      },
      {
        title: 'Resetting the total inside the loop',
        wrongCode: `for (int i = 1; i <= 5; i++) {\n    int total = 0;\n    total += i;\n}`,
        rightCode: `int total = 0;\nfor (int i = 1; i <= 5; i++) {\n    total += i;\n}`,
        reason: 'Declaring total inside the loop wipes it back to 0 on every single pass.',
      },
    ],
  },
  {
    id: 'java-4',
    language: 'java',
    number: '04',
    title: 'Creating Java Methods',
    duration: '8 min',
    summary: 'Organize reusable logic with typed parameters and return types.',
    explanation: [
      'In Java, functions inside a class are called methods. Each method declares its return type (or void if it returns nothing) and the type of every parameter.',
      'Calling a helper method from main() keeps your code modular and easy to read.',
    ],
    theoryPoints: [
      'Method signatures: Java identifies a method by its name and parameter types, enforcing strict type contracts.',
      'Static context: main() is static, so helper methods called directly from main() without an object must also be static.',
      'Void vs. typed return: void methods perform an action only; typed methods compute and hand back a value.',
    ],
    keyPoints: [
      'Specify the return type before the method name (e.g., int add(int a, int b)).',
      'Use static when calling a method directly from main().',
      'Use void when the method prints output instead of returning a value.',
    ],
    code: `public class Main {
    static int square(int number) {
        return number * number;
    }

    public static void main(String[] args) {
        int result = square(6);
        System.out.println("6 squared is " + result);
    }
}`,
    codeExplanation: [
      {
        lines: 'Lines 2–4',
        explanation: 'Defines a static method square that accepts an int parameter and returns an int.',
      },
      {
        lines: 'Line 7',
        explanation: 'Calls square(6), receiving 36 and storing it inside result.',
      },
      {
        lines: 'Line 8',
        explanation: 'Prints "6 squared is 36" to the console.',
      },
    ],
    commonMistakes: [
      {
        title: 'Forgetting the return type on a method',
        wrongCode: `static square(int number) {\n    return number * number;\n}`,
        rightCode: `static int square(int number) {\n    return number * number;\n}`,
        reason: 'Java requires every method to state the exact data type it returns (or void).',
      },
      {
        title: 'Missing static when calling from main',
        wrongCode: `int square(int n) { return n * n; }\n// Called from static main()`,
        rightCode: `static int square(int n) { return n * n; }`,
        reason: 'A static method like main() cannot call a non-static method directly without creating an instance.',
      },
    ],
  },

  // C++ Lessons
  {
    id: 'cpp-1',
    language: 'cpp',
    number: '01',
    title: 'C++ Structure & Console Output',
    duration: '6 min',
    summary: 'Learn #include <iostream>, int main(), and std::cout.',
    explanation: [
      'A C++ program begins by including headers like <iostream> for input and output. Execution starts in the int main() function and ends with return 0;.',
      'Use std::cout with the << operator to send text and variables to the screen, and std::endl to move to a new line.',
    ],
    theoryPoints: [
      'Preprocessor directives: Lines starting with #include pull library declarations into your file before compilation.',
      'Namespaces: std:: tells C++ to look inside the standard library namespace, avoiding naming collisions.',
      'Exit status codes: Returning 0 from main() is a universal convention indicating zero runtime errors.',
    ],
    keyPoints: [
      '#include <iostream> gives access to std::cout.',
      'Every statement ends with a semicolon (;).',
      'return 0; signals the operating system that the program finished cleanly.',
    ],
    code: `#include <iostream>
#include <string>

int main() {
    std::string learner = "Noah";
    int level = 1;

    std::cout << "Welcome, " << learner << "!" << std::endl;
    std::cout << "Starting C++ Level " << level << std::endl;
    return 0;
}`,
    codeExplanation: [
      {
        lines: 'Lines 1–2',
        explanation: 'Includes <iostream> for console printing and <string> for std::string variables.',
      },
      {
        lines: 'Lines 5–6',
        explanation: 'Declares a string learner and an integer level inside main().',
      },
      {
        lines: 'Lines 8–10',
        explanation: 'Chains << insertions into std::cout to print two lines, then returns 0.',
      },
    ],
    commonMistakes: [
      {
        title: 'Using >> instead of << with std::cout',
        wrongCode: `std::cout >> "Hello";`,
        rightCode: `std::cout << "Hello";`,
        reason: 'Think of << as arrows pushing data into cout (output), while >> pulls data out of cin (input).',
      },
      {
        title: 'Forgetting #include <iostream>',
        wrongCode: `int main() {\n    std::cout << "Hi";\n}`,
        rightCode: `#include <iostream>\nint main() {\n    std::cout << "Hi";\n}`,
        reason: 'Without <iostream>, the compiler does not know what std::cout is.',
      },
    ],
  },
  {
    id: 'cpp-2',
    language: 'cpp',
    number: '02',
    title: 'Conditions & Logical Operators',
    duration: '6 min',
    summary: 'Branch your C++ code with if, else if, &&, and ||.',
    explanation: [
      'Just like Java, C++ evaluates conditions inside parentheses and runs code inside curly braces.',
      'You can combine multiple checks using && (AND, both must be true) or || (OR, at least one must be true).',
    ],
    theoryPoints: [
      'Boolean algebra: && requires every operand to be true; || succeeds if any single operand is true.',
      'Short-circuit evaluation: In A && B, if A is false, C++ stops immediately without evaluating B.',
      'Relational chaining trap: Writing 10 < x < 20 does not work mathematically in C++—join comparisons with && instead.',
    ],
    keyPoints: [
      'Use && when two conditions must both be true.',
      'Use || when either condition is enough.',
      'Do not confuse = (assignment) with == (comparison).',
    ],
    code: `#include <iostream>

int main() {
    int temperature = 22;
    bool sunny = true;

    if (temperature >= 20 && sunny) {
        std::cout << "Great weather for a walk." << std::endl;
    } else if (temperature < 10) {
        std::cout << "Bring a warm jacket." << std::endl;
    } else {
        std::cout << "Mild weather today." << std::endl;
    }
    return 0;
}`,
    codeExplanation: [
      {
        lines: 'Lines 4–5',
        explanation: 'Sets temperature to 22 and sunny to true.',
      },
      {
        lines: 'Lines 7–8',
        explanation: 'Tests both temperature >= 20 AND sunny; both are true, so the first message prints.',
      },
      {
        lines: 'Lines 9–13',
        explanation: 'Defines fallback branches if the temperature is cold or cloudy.',
      },
    ],
    commonMistakes: [
      {
        title: 'Chaining comparisons without &&',
        wrongCode: `if (10 <= temperature <= 25)`,
        rightCode: `if (temperature >= 10 && temperature <= 25)`,
        reason: 'C++ evaluates 10 <= temperature as true (1) or false (0), then compares 1 <= 25, which is always true!',
      },
      {
        title: 'Accidental = inside an if condition',
        wrongCode: `if (temperature = 20)`,
        rightCode: `if (temperature == 20)`,
        reason: 'Single = overwrites temperature with 20 and evaluates to true instead of comparing.',
      },
    ],
  },
  {
    id: 'cpp-3',
    language: 'cpp',
    number: '03',
    title: 'Loops in C++ (for & while)',
    duration: '7 min',
    summary: 'Repeat calculations efficiently with for and while loops.',
    explanation: [
      'C++ supports both for loops (best when you know how many times to repeat) and while loops (best when looping until a condition changes).',
      'Keep loop conditions accurate so your loop terminates as expected and never runs forever.',
    ],
    theoryPoints: [
      'Pre-test loops: Both for and while check the condition before running the body, so 0 iterations happen if initially false.',
      'Termination guarantee: Every while loop must modify at least one variable involved in its condition toward an exit state.',
      'Choosing the right loop: Prefer for when counting steps; prefer while when waiting for a changing state.',
    ],
    keyPoints: [
      'for (int i = 1; i <= 4; i++) counts from 1 to 4.',
      'while (condition) checks the condition before every pass.',
      'Always update the loop variable inside a while loop.',
    ],
    code: `#include <iostream>

int main() {
    int countdown = 3;
    while (countdown > 0) {
        std::cout << "Countdown: " << countdown << std::endl;
        countdown--;
    }
    std::cout << "Start!" << std::endl;
    return 0;
}`,
    codeExplanation: [
      {
        lines: 'Line 4',
        explanation: 'Initializes countdown to 3 before entering the loop.',
      },
      {
        lines: 'Lines 5–8',
        explanation: 'Prints 3, 2, and 1, subtracting 1 via countdown-- each time until countdown hits 0.',
      },
      {
        lines: 'Lines 9–10',
        explanation: 'Runs once the loop finishes, printing "Start!" and exiting cleanly.',
      },
    ],
    commonMistakes: [
      {
        title: 'Infinite loop from forgetting countdown--',
        wrongCode: `while (countdown > 0) {\n    std::cout << countdown << std::endl;\n}`,
        rightCode: `while (countdown > 0) {\n    std::cout << countdown << std::endl;\n    countdown--;\n}`,
        reason: 'If countdown never decreases, countdown > 0 stays true forever.',
      },
      {
        title: 'Off-by-one boundary (>= vs >)',
        wrongCode: `while (countdown >= 0) { ... } // Prints 0 too`,
        rightCode: `while (countdown > 0) { ... }`,
        reason: 'Using >= includes 0 as an extra iteration when you only want 3, 2, 1.',
      },
    ],
  },
  {
    id: 'cpp-4',
    language: 'cpp',
    number: '04',
    title: 'Functions in C++',
    duration: '8 min',
    summary: 'Declare helper functions above main() to keep code modular.',
    explanation: [
      'In C++, a function must be declared before main() calls it. Like Java, you specify the return type and parameter types.',
      'Breaking larger problems into small functions makes debugging much easier for beginners.',
    ],
    theoryPoints: [
      'Top-down compilation: The C++ compiler reads files from top to bottom, so functions need a definition or prototype before use.',
      'Pass-by-value default: Passing int a, int b copies the numbers into the function without changing the caller’s variables.',
      'Modularity: Separating helper functions from main() keeps control flow readable and testable.',
    ],
    keyPoints: [
      'Define helper functions above main() (or declare a prototype first).',
      'Specify parameter types like int addNumbers(int a, int b).',
      'Use void if the function does not return a value.',
    ],
    code: `#include <iostream>

int addNumbers(int a, int b) {
    return a + b;
}

int main() {
    int sum = addNumbers(12, 8);
    std::cout << "12 + 8 = " << sum << std::endl;
    return 0;
}`,
    codeExplanation: [
      {
        lines: 'Lines 3–5',
        explanation: 'Declares addNumbers above main(), taking two ints and returning their sum.',
      },
      {
        lines: 'Line 8',
        explanation: 'Calls addNumbers(12, 8) and stores the returned value (20) in sum.',
      },
      {
        lines: 'Lines 9–10',
        explanation: 'Displays "12 + 8 = 20" and exits main() with 0.',
      },
    ],
    commonMistakes: [
      {
        title: 'Defining the function below main() without a prototype',
        wrongCode: `int main() {\n    addNumbers(1, 2); // Error: not declared yet\n}\nint addNumbers(int a, int b) { return a + b; }`,
        rightCode: `int addNumbers(int a, int b) { return a + b; }\nint main() {\n    addNumbers(1, 2);\n}`,
        reason: 'C++ compiles top-to-bottom and needs to know a function’s signature before main() calls it.',
      },
      {
        title: 'Forgetting parameter types',
        wrongCode: `int addNumbers(a, b)`,
        rightCode: `int addNumbers(int a, int b)`,
        reason: 'Every single parameter in C++ must explicitly declare its own type.',
      },
    ],
  },

  // SQL Lessons
  {
    id: 'sql-1',
    language: 'sql',
    number: '01',
    title: 'Tables, Rows & SELECT Basics',
    duration: '5 min',
    summary: 'Retrieve columns from a database table using SELECT and FROM.',
    explanation: [
      'SQL (Structured Query Language) is used to talk to relational databases where data lives inside tables made of columns and rows.',
      'The SELECT statement picks which columns you want to see, and FROM names the table you are reading from.',
    ],
    theoryPoints: [
      'Relational model: Every table represents one entity (like students or courses), where columns are attributes and rows are individual records.',
      'Declarative querying: You describe the columns and table you need rather than writing loops to scan rows manually.',
      'Projection: Listing explicit columns like SELECT name, track is cleaner and faster than SELECT * in real apps.',
    ],
    keyPoints: [
      'SELECT * returns every column in the table.',
      'List column names separated by commas to select specific fields.',
      'End SQL statements with a semicolon (;).',
    ],
    code: `CREATE TABLE courses (
    id INT PRIMARY KEY,
    title VARCHAR(50),
    level VARCHAR(20)
);

INSERT INTO courses VALUES
(1, 'Python Basics', 'Beginner'),
(2, 'SQL Foundations', 'Beginner');

SELECT title, level
FROM courses;`,
    codeExplanation: [
      {
        lines: 'Lines 1–5',
        explanation: 'Creates a courses table with three columns: id (unique primary key), title, and level.',
      },
      {
        lines: 'Lines 7–9',
        explanation: 'Inserts two sample course rows into the courses table.',
      },
      {
        lines: 'Lines 11–12',
        explanation: 'Selects only the title and level columns from every row in courses.',
      },
    ],
    commonMistakes: [
      {
        title: 'Using double quotes for text values',
        wrongCode: `SELECT * FROM courses WHERE level = "Beginner";`,
        rightCode: `SELECT * FROM courses WHERE level = 'Beginner';`,
        reason: 'Standard SQL uses single quotes (\'...\') for text strings; double quotes are reserved for column/table names.',
      },
      {
        title: 'Missing comma between selected columns',
        wrongCode: `SELECT title level FROM courses;`,
        rightCode: `SELECT title, level FROM courses;`,
        reason: 'Without a comma, SQL treats level as an alias name for the title column instead of a second column.',
      },
    ],
  },
  {
    id: 'sql-2',
    language: 'sql',
    number: '02',
    title: 'Filtering Rows with WHERE',
    duration: '6 min',
    summary: 'Narrow down query results using conditions, AND/OR, and IS NULL.',
    explanation: [
      'The WHERE clause lets you keep only rows that match specific conditions, such as students scoring above 80 or enrolled in Python.',
      'You can combine conditions with AND or OR, and test for missing values using IS NULL.',
    ],
    theoryPoints: [
      'Row-level filtering: WHERE evaluates each row independently before any sorting or grouping happens.',
      'Three-valued logic: Comparisons with NULL return UNKNOWN instead of TRUE, so always use IS NULL or IS NOT NULL.',
      'Operator precedence: AND binds tighter than OR—use parentheses ( ) when mixing both.',
    ],
    keyPoints: [
      'Use = (single equals), != or <>, >, <, >=, <= in WHERE.',
      'Combine conditions with AND and OR.',
      'Use LIKE with % for pattern matching (e.g., name LIKE \'M%\').',
    ],
    code: `SELECT name, track, score
FROM students
WHERE track = 'Python' AND score >= 80;`,
    codeExplanation: [
      {
        lines: 'Line 1',
        explanation: 'Chooses name, track, and score columns for the output.',
      },
      {
        lines: 'Line 2',
        explanation: 'Specifies the students table to read from.',
      },
      {
        lines: 'Line 3',
        explanation: 'Filters to rows where track equals \'Python\' AND score is at least 80.',
      },
    ],
    commonMistakes: [
      {
        title: 'Writing == instead of = in WHERE',
        wrongCode: `SELECT * FROM students WHERE score == 90;`,
        rightCode: `SELECT * FROM students WHERE score = 90;`,
        reason: 'Unlike Python, Java, or C++, SQL uses a single = sign for equality comparisons.',
      },
      {
        title: 'Checking = NULL instead of IS NULL',
        wrongCode: `SELECT * FROM students WHERE email = NULL;`,
        rightCode: `SELECT * FROM students WHERE email IS NULL;`,
        reason: 'In SQL, nothing is ever equal to NULL; IS NULL is required to find empty fields.',
      },
    ],
  },
  {
    id: 'sql-3',
    language: 'sql',
    number: '03',
    title: 'Sorting & Counting (ORDER BY, COUNT)',
    duration: '7 min',
    summary: 'Sort rows cleanly and summarize totals with aggregate functions.',
    explanation: [
      'Use ORDER BY to sort results alphabetically or numerically—ASC for ascending (lowest first) or DESC for descending (highest first).',
      'Aggregate functions like COUNT(*), AVG(), and MAX() summarize multiple rows into a single metric, often paired with GROUP BY.',
    ],
    theoryPoints: [
      'Execution pipeline: FROM -> WHERE -> GROUP BY -> SELECT -> ORDER BY determines how a query transforms data.',
      'Aggregation collapse: Functions like COUNT() and AVG() combine groups of rows into one summary row per group.',
      'GROUP BY rule: Every non-aggregated column in SELECT must appear in GROUP BY.',
    ],
    keyPoints: [
      'ORDER BY score DESC puts the highest scores at the top.',
      'LIMIT 5 restricts how many rows are returned.',
      'COUNT(*) counts all rows in each group.',
    ],
    code: `SELECT track, COUNT(*) AS learners, AVG(score) AS avg_score
FROM students
GROUP BY track
ORDER BY avg_score DESC;`,
    codeExplanation: [
      {
        lines: 'Line 1',
        explanation: 'Outputs each track along with its learner count and average score using AS aliases.',
      },
      {
        lines: 'Lines 2–3',
        explanation: 'Reads students and groups rows by track so COUNT and AVG run per language.',
      },
      {
        lines: 'Line 4',
        explanation: 'Sorts the grouped summary so the highest average score appears first.',
      },
    ],
    commonMistakes: [
      {
        title: 'Putting ORDER BY before WHERE',
        wrongCode: `SELECT name FROM students ORDER BY score DESC WHERE score >= 70;`,
        rightCode: `SELECT name FROM students WHERE score >= 70 ORDER BY score DESC;`,
        reason: 'SQL clauses must follow strict order: SELECT -> FROM -> WHERE -> GROUP BY -> ORDER BY.',
      },
      {
        title: 'Using WHERE instead of HAVING on an aggregate',
        wrongCode: `SELECT track, COUNT(*) FROM students WHERE COUNT(*) > 5 GROUP BY track;`,
        rightCode: `SELECT track, COUNT(*) FROM students GROUP BY track HAVING COUNT(*) > 5;`,
        reason: 'WHERE filters individual rows before grouping; HAVING filters groups after COUNT(*) is computed.',
      },
    ],
  },
  {
    id: 'sql-4',
    language: 'sql',
    number: '04',
    title: 'Inserting & Updating Records',
    duration: '7 min',
    summary: 'Add new rows with INSERT INTO and modify existing rows safely with UPDATE.',
    explanation: [
      'INSERT INTO adds new records into a table by matching column names with values.',
      'UPDATE modifies existing rows—always include a WHERE clause so you only update the exact record you intend!',
    ],
    theoryPoints: [
      'Data integrity: Constraints like PRIMARY KEY and NOT NULL prevent duplicate IDs or missing required fields on insert.',
      'Targeted mutations: UPDATE and DELETE without a WHERE clause modify every single row in the table.',
      'Explicit column lists: Naming columns in INSERT INTO protects your query if the table gains new columns later.',
    ],
    keyPoints: [
      'Always test your WHERE condition with SELECT before running UPDATE or DELETE.',
      'Match the number and order of columns in INSERT INTO with VALUES.',
      'Use single quotes around text values.',
    ],
    code: `INSERT INTO students (id, name, track, score)
VALUES (4, 'Elena', 'SQL', 88);

UPDATE students
SET score = 95
WHERE id = 4;

SELECT * FROM students WHERE id = 4;`,
    codeExplanation: [
      {
        lines: 'Lines 1–2',
        explanation: 'Inserts a new student row with id 4, name Elena, track SQL, and score 88.',
      },
      {
        lines: 'Lines 4–6',
        explanation: 'Updates only the row where id = 4, changing Elena’s score from 88 to 95.',
      },
      {
        lines: 'Line 8',
        explanation: 'Queries id = 4 to verify the updated row.',
      },
    ],
    commonMistakes: [
      {
        title: 'Running UPDATE without a WHERE clause',
        wrongCode: `UPDATE students SET score = 100;`,
        rightCode: `UPDATE students SET score = 100 WHERE id = 4;`,
        reason: 'Omitting WHERE updates every student in the entire table instead of just one!',
      },
      {
        title: 'Mismatched column and value counts',
        wrongCode: `INSERT INTO students (id, name, track) VALUES (5, 'Sam');`,
        rightCode: `INSERT INTO students (id, name, track) VALUES (5, 'Sam', 'SQL');`,
        reason: 'Every column listed in INSERT INTO must have a corresponding value in VALUES.',
      },
    ],
  },
];
