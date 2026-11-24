import type { TheoryTopic } from '../types';

export const THEORY_TOPICS: TheoryTopic[] = [
  // Python Theory
  {
    id: 'th-py-1',
    language: 'python',
    number: '01',
    title: 'How Python Executes Code & Dynamic Typing',
    summary: 'Understand why Python is interpreted line-by-line and how variables work without type declarations.',
    points: [
      'Python is an interpreted language: the Python interpreter reads and executes your script top-to-bottom without a separate manual compile step.',
      'Variables are references (labels) attached to objects in memory, so you can store an integer first and later point the same name to text.',
      'Indentation (4 spaces) is part of Python syntax—it defines which statements belong inside an if block, loop, or function.',
    ],
    keyTerms: [
      {
        term: 'Interpreter',
        definition: 'A program that translates and executes source code line by line at runtime.',
      },
      {
        term: 'Dynamic Typing',
        definition: 'Data types belong to the value itself rather than being fixed on the variable name.',
      },
    ],
    exampleCode: `score = 10        # int object
score = "Ten"     # now points to a str object
print(type(score))`,
  },
  {
    id: 'th-py-2',
    language: 'python',
    number: '02',
    title: 'Core Data Structures: Lists & Dictionaries',
    summary: 'Learn how Python groups ordered items and key-value pairs in memory.',
    points: [
      'A list ([]) stores an ordered sequence of items accessed by zero-based integer index (0, 1, 2...).',
      'A dictionary ({}) stores key-value pairs for instant lookup by meaningful name rather than numeric position.',
      'Both lists and dictionaries are mutable, meaning you can add, change, or remove items after creating them.',
    ],
    keyTerms: [
      {
        term: 'Zero-Based Indexing',
        definition: 'Counting positions starting at 0, so the first element is item[0].',
      },
      {
        term: 'Mutability',
        definition: 'Whether an object in memory can be modified in place after creation.',
      },
    ],
    exampleCode: `topics = ["Variables", "Loops", "Functions"]
student = {"name": "Maya", "level": 2}
print(topics[0], "-", student["name"])`,
  },
  {
    id: 'th-py-3',
    language: 'python',
    number: '03',
    title: 'Functions, Scope & Return Values',
    summary: 'Understand local variable scope and how functions pass data back to callers.',
    points: [
      'Variables created inside a function live in local scope and disappear once the function finishes.',
      'Parameters accept input arguments; the return statement hands a computed value back to the line that called the function.',
      'Separating logic into small functions avoids repeating code and makes bugs easier to isolate.',
    ],
    keyTerms: [
      {
        term: 'Local Scope',
        definition: 'Variables defined inside a function are only accessible within that function.',
      },
      {
        term: 'Return Value',
        definition: 'The output sent back by a function to its caller using the return keyword.',
      },
    ],
    exampleCode: `def double(num):
    result = num * 2
    return result

print(double(7))`,
  },

  // Java Theory
  {
    id: 'th-java-1',
    language: 'java',
    number: '01',
    title: 'JVM, Bytecode & Static Typing',
    summary: 'How Java compiles source code into portable bytecode and enforces strict types.',
    points: [
      'Java uses a two-step workflow: javac compiles .java source files into platform-independent bytecode (.class), and the JVM runs it.',
      'Static typing means every variable must declare its type (int, double, boolean, String) before use, catching errors early.',
      'Every Java program starts execution inside public static void main(String[] args).',
    ],
    keyTerms: [
      {
        term: 'JVM (Java Virtual Machine)',
        definition: 'The runtime engine that executes compiled Java bytecode on any operating system.',
      },
      {
        term: 'Static Typing',
        definition: 'Checking variable and expression types at compile time before the program runs.',
      },
    ],
    exampleCode: `public class Main {
    public static void main(String[] args) {
        int year = 2026;
        System.out.println("Year: " + year);
    }
}`,
  },
  {
    id: 'th-java-2',
    language: 'java',
    number: '02',
    title: 'Classes, Objects & Methods',
    summary: 'Grasp the building blocks of Object-Oriented Programming (OOP) in Java.',
    points: [
      'A class is a blueprint describing data (fields) and behavior (methods); an object is an actual instance created from that blueprint.',
      'Primitive types (int, double, boolean) store raw values directly, while object types (like String) store references.',
      'Use .equals() instead of == when comparing the text inside two String objects.',
    ],
    keyTerms: [
      {
        term: 'Class vs. Object',
        definition: 'A class is the template design; an object is a concrete copy built in memory from that template.',
      },
      {
        term: 'Method Signature',
        definition: 'The combination of a method’s name and parameter list used by Java to identify it.',
      },
    ],
    exampleCode: `String a = new String("Java");
String b = new String("Java");
System.out.println(a.equals(b)); // true`,
  },
  {
    id: 'th-java-3',
    language: 'java',
    number: '03',
    title: 'Control Flow & Block Scope',
    summary: 'Understand curly-brace scope rules inside conditionals and loops.',
    points: [
      'Curly braces { } define a block scope: variables declared inside a loop or if block cannot be accessed outside it.',
      'Java requires boolean expressions in if and while conditions—numbers like 1 or 0 are not valid booleans.',
      'For loops separate initialization, condition, and counter increment cleanly in one header.',
    ],
    keyTerms: [
      {
        term: 'Block Scope',
        definition: 'A variable is visible only inside the nearest pair of enclosing curly braces { }.',
      },
      {
        term: 'Boolean Expression',
        definition: 'An expression that strictly evaluates to true or false.',
      },
    ],
    exampleCode: `for (int i = 1; i <= 3; i++) {
    System.out.println("Step " + i);
}`,
  },

  // C++ Theory
  {
    id: 'th-cpp-1',
    language: 'cpp',
    number: '01',
    title: 'Compilation, Headers & Namespaces',
    summary: 'Learn how C++ compiles directly to machine code and organizes standard libraries.',
    points: [
      'C++ compiles directly into native machine instructions, making it fast and memory-efficient for systems and games.',
      'Header files (#include <iostream>) declare available functions and objects before the compiler builds your file.',
      'The std:: prefix specifies the standard library namespace so standard names like cout do not clash with your own names.',
    ],
    keyTerms: [
      {
        term: 'Compiler',
        definition: 'A tool that translates C++ source code into native executable machine code.',
      },
      {
        term: 'Namespace (std)',
        definition: 'A named container grouping standard library symbols like cout, cin, and string.',
      },
    ],
    exampleCode: `#include <iostream>
int main() {
    std::cout << "Compiled C++" << std::endl;
    return 0;
}`,
  },
  {
    id: 'th-cpp-2',
    language: 'cpp',
    number: '02',
    title: 'Memory, Value Semantics & References',
    summary: 'Understand how C++ passes values by copy versus referencing existing memory.',
    points: [
      'By default, passing a variable to a C++ function copies its value (pass-by-value), leaving the original variable unchanged.',
      'Adding & to a parameter (int& x) creates a reference—an alias pointing directly to the caller’s variable.',
      'Knowing when data is copied vs. referenced helps prevent bugs and avoids unnecessary memory copies.',
    ],
    keyTerms: [
      {
        term: 'Pass-by-Value',
        definition: 'A function receives an independent copy of the argument’s value.',
      },
      {
        term: 'Reference (&)',
        definition: 'An alias name bound directly to an existing variable in memory.',
      },
    ],
    exampleCode: `void addOne(int& x) {
    x = x + 1;
}`,
  },
  {
    id: 'th-cpp-3',
    language: 'cpp',
    number: '03',
    title: 'Top-Down Declaration & Functions',
    summary: 'Why C++ requires function declarations before main() calls them.',
    points: [
      'The C++ compiler scans each source file strictly from top to bottom.',
      'Any helper function called inside main() must either be defined above main() or announced with a prototype header.',
      'Returning 0 from main() communicates to the operating system that the program succeeded.',
    ],
    keyTerms: [
      {
        term: 'Function Prototype',
        definition: 'A single-line declaration (e.g., int add(int a, int b);) telling the compiler a function exists.',
      },
      {
        term: 'Exit Code',
        definition: 'An integer returned by main() where 0 means normal completion.',
      },
    ],
    exampleCode: `int multiply(int a, int b); // prototype

int main() {
    return 0;
}`,
  },

  // SQL Theory
  {
    id: 'th-sql-1',
    language: 'sql',
    number: '01',
    title: 'Relational Databases, Tables & Keys',
    summary: 'Understand how SQL organizes structured data into rows, columns, and primary keys.',
    points: [
      'A relational database stores information in tables—grids made of typed columns (fields) and rows (individual records).',
      'Every table should have a Primary Key column (such as student_id) whose value uniquely identifies each row.',
      'SQL is a declarative language: you describe what data you want, and the database engine figures out how to fetch it.',
    ],
    keyTerms: [
      {
        term: 'Primary Key',
        definition: 'A column (or set of columns) that uniquely identifies every row in a table and cannot be NULL.',
      },
      {
        term: 'Declarative Query',
        definition: 'Describing the desired result (e.g., SELECT ... WHERE) rather than writing manual loops.',
      },
    ],
    exampleCode: `CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    track VARCHAR(20)
);`,
  },
  {
    id: 'th-sql-2',
    language: 'sql',
    number: '02',
    title: 'Query Execution Order & Filtering',
    summary: 'Learn the difference between how you write a SELECT query and how SQL evaluates it.',
    points: [
      'Even though you write SELECT first, SQL logically reads FROM first, filters rows with WHERE, sorts with ORDER BY, and selects columns.',
      'WHERE filters individual rows before grouping, whereas HAVING filters grouped summaries after GROUP BY.',
      'Always wrap text values in single quotes (\'Python\') in standard SQL queries.',
    ],
    keyTerms: [
      {
        term: 'FROM / WHERE',
        definition: 'Clauses that specify which table to read and which rows satisfy a condition.',
      },
      {
        term: 'NULL',
        definition: 'Represents a missing or unknown value—test for it with IS NULL, never = NULL.',
      },
    ],
    exampleCode: `SELECT name, score
FROM students
WHERE score >= 80
ORDER BY score DESC;`,
  },
  {
    id: 'th-sql-3',
    language: 'sql',
    number: '03',
    title: 'Aggregations, Grouping & Joins',
    summary: 'Summarize metrics with COUNT/AVG and connect related tables using Foreign Keys.',
    points: [
      'Aggregate functions like COUNT(), SUM(), AVG(), MIN(), and MAX() collapse multiple rows into summary numbers.',
      'GROUP BY splits rows into buckets (such as per language track) so aggregates compute one result per group.',
      'JOIN combines rows from two tables by matching a Foreign Key in one table to the Primary Key in another.',
    ],
    keyTerms: [
      {
        term: 'Foreign Key',
        definition: 'A column in one table that references the Primary Key of another table to link records.',
      },
      {
        term: 'INNER JOIN',
        definition: 'Returns rows that have matching key values in both joined tables.',
      },
    ],
    exampleCode: `SELECT track, COUNT(*) AS student_count
FROM students
GROUP BY track;`,
  },
];
