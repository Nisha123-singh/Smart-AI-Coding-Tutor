import type { CodingProblem } from '../types';

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'cp-two-sum',
    number: '01',
    title: 'Two Sum Indices',
    topic: 'Arrays',
    difficulty: 'Easy',
    statement:
      'Given an array of integers and a target integer, find the two distinct indices whose elements add up to the target. Print the two 0-based indices separated by a single space in ascending order.',
    inputFormat:
      'First line: integer n (number of elements). Second line: n space-separated integers. Third line: integer target.',
    outputFormat: 'Two space-separated 0-based indices i and j (i < j).',
    constraints: '2 <= n <= 1000, -10^5 <= nums[i], target <= 10^5. Exactly one valid pair exists.',
    sampleInput: '4\n2 7 11 15\n9',
    sampleOutput: '0 1',
    sampleExplanation: 'nums[0] + nums[1] = 2 + 7 = 9, so the indices are 0 and 1.',
    starterCode: {
      python: `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# TODO: Find two indices i < j such that nums[i] + nums[j] == target
# and print them separated by a space.
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        // TODO: Find two indices i < j such that nums[i] + nums[j] == target
        // and print them separated by a space.
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    // TODO: Find two indices i < j such that nums[i] + nums[j] == target
    // and print them separated by a space.

    return 0;
}
`,
    },
    testCases: [
      { id: 'tc1', input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isSample: true },
      { id: 'tc2', input: '3\n3 2 4\n6', expectedOutput: '1 2', isSample: true },
      { id: 'tc3', input: '4\n-3 4 3 90\n0', expectedOutput: '0 2' },
      { id: 'tc4', input: '2\n3 3\n6', expectedOutput: '0 1' },
    ],
  },
  {
    id: 'cp-palindrome-number',
    number: '02',
    title: 'Palindrome Number',
    topic: 'Math & Loops',
    difficulty: 'Easy',
    statement:
      'Given an integer n, determine whether it is a palindrome. An integer is a palindrome when it reads the same forward and backward (negative numbers are not palindromes).',
    inputFormat: 'A single integer n.',
    outputFormat: 'Print "true" if n is a palindrome, otherwise print "false".',
    constraints: '-10^9 <= n <= 10^9',
    sampleInput: '121',
    sampleOutput: 'true',
    sampleExplanation: '121 reads as 121 from left to right and from right to left.',
    starterCode: {
      python: `n = int(input().strip())

# TODO: Print "true" if n is a palindrome, otherwise print "false".
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();

        // TODO: Print "true" if n is a palindrome, otherwise print "false".
    }
}
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;

    // TODO: Print "true" if n is a palindrome, otherwise print "false".

    return 0;
}
`,
    },
    testCases: [
      { id: 'tc1', input: '121', expectedOutput: 'true', isSample: true },
      { id: 'tc2', input: '-121', expectedOutput: 'false', isSample: true },
      { id: 'tc3', input: '10', expectedOutput: 'false' },
      { id: 'tc4', input: '0', expectedOutput: 'true' },
      { id: 'tc5', input: '1234321', expectedOutput: 'true' },
    ],
  },
  {
    id: 'cp-reverse-words',
    number: '03',
    title: 'Reverse Words in a Sentence',
    topic: 'Strings',
    difficulty: 'Easy',
    statement:
      'Given a sentence containing words separated by spaces (possibly with leading, trailing, or multiple spaces between words), reverse the order of the words and join them with a single space.',
    inputFormat: 'A single line containing a string s.',
    outputFormat: 'The words in reverse order separated by single spaces.',
    constraints: '1 <= length of s <= 5000',
    sampleInput: '  hello   world coding  ',
    sampleOutput: 'coding world hello',
    sampleExplanation: 'Extra spaces are removed and the three words appear in reverse order.',
    starterCode: {
      python: `s = input()

# TODO: Reverse the order of words and print them joined by a single space.
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();

        // TODO: Reverse the order of words and print them joined by a single space.
    }
}
`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string line;
    getline(cin, line);

    // TODO: Reverse the order of words and print them joined by a single space.

    return 0;
}
`,
    },
    testCases: [
      { id: 'tc1', input: '  hello   world coding  ', expectedOutput: 'coding world hello', isSample: true },
      { id: 'tc2', input: 'the sky is blue', expectedOutput: 'blue is sky the', isSample: true },
      { id: 'tc3', input: 'python', expectedOutput: 'python' },
      { id: 'tc4', input: 'a good   example', expectedOutput: 'example good a' },
    ],
  },
  {
    id: 'cp-fizzbuzz',
    number: '04',
    title: 'FizzBuzz Sequence',
    topic: 'Math & Loops',
    difficulty: 'Easy',
    statement:
      'Given a positive integer n, print the sequence from 1 to n separated by spaces. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both 3 and 5 print "FizzBuzz".',
    inputFormat: 'A single positive integer n.',
    outputFormat: 'Space-separated sequence of n tokens.',
    constraints: '1 <= n <= 100',
    sampleInput: '5',
    sampleOutput: '1 2 Fizz 4 Buzz',
    sampleExplanation: '3 is divisible by 3 (Fizz) and 5 is divisible by 5 (Buzz).',
    starterCode: {
      python: `n = int(input())

# TODO: Print 1..n space-separated with Fizz / Buzz / FizzBuzz rules.
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        // TODO: Print 1..n space-separated with Fizz / Buzz / FizzBuzz rules.
    }
}
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    // TODO: Print 1..n space-separated with Fizz / Buzz / FizzBuzz rules.

    return 0;
}
`,
    },
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '1 2 Fizz 4 Buzz', isSample: true },
      { id: 'tc2', input: '15', expectedOutput: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz', isSample: true },
      { id: 'tc3', input: '1', expectedOutput: '1' },
      { id: 'tc4', input: '3', expectedOutput: '1 2 Fizz' },
    ],
  },
  {
    id: 'cp-max-subarray',
    number: '05',
    title: 'Maximum Subarray Sum',
    topic: 'Arrays',
    difficulty: 'Medium',
    statement:
      'Given an integer array of length n, find the contiguous subarray (containing at least one number) which has the largest sum and print that maximum sum.',
    inputFormat: 'First line: integer n. Second line: n space-separated integers.',
    outputFormat: 'A single integer representing the maximum subarray sum.',
    constraints: '1 <= n <= 10^5, -10^4 <= nums[i] <= 10^4',
    sampleInput: '9\n-2 1 -3 4 -1 2 1 -5 4',
    sampleOutput: '6',
    sampleExplanation: 'The subarray [4, -1, 2, 1] has the largest sum = 6.',
    starterCode: {
      python: `n = int(input())
nums = list(map(int, input().split()))

# TODO: Compute and print the maximum contiguous subarray sum.
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] nums = new long[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextLong();

        // TODO: Compute and print the maximum contiguous subarray sum.
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // TODO: Compute and print the maximum contiguous subarray sum.

    return 0;
}
`,
    },
    testCases: [
      { id: 'tc1', input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isSample: true },
      { id: 'tc2', input: '1\n5', expectedOutput: '5', isSample: true },
      { id: 'tc3', input: '4\n-5 -2 -9 -1', expectedOutput: '-1' },
      { id: 'tc4', input: '5\n5 4 -1 7 8', expectedOutput: '23' },
    ],
  },
  {
    id: 'cp-longest-unique-substr',
    number: '06',
    title: 'Longest Unique Substring',
    topic: 'Strings',
    difficulty: 'Medium',
    statement:
      'Given a string s, find the length of the longest contiguous substring without any repeating characters.',
    inputFormat: 'A single line containing string s (may contain letters, digits, or symbols).',
    outputFormat: 'A single integer: the maximum length of a substring with unique characters.',
    constraints: '1 <= length of s <= 10^4',
    sampleInput: 'abcabcbb',
    sampleOutput: '3',
    sampleExplanation: 'The answer is "abc", which has length 3.',
    starterCode: {
      python: `s = input().rstrip("\\n")

# TODO: Print the length of the longest substring without repeating characters.
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";

        // TODO: Print the length of the longest substring without repeating characters.
    }
}
`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    getline(cin, s);

    // TODO: Print the length of the longest substring without repeating characters.

    return 0;
}
`,
    },
    testCases: [
      { id: 'tc1', input: 'abcabcbb', expectedOutput: '3', isSample: true },
      { id: 'tc2', input: 'bbbbb', expectedOutput: '1', isSample: true },
      { id: 'tc3', input: 'pwwkew', expectedOutput: '3' },
      { id: 'tc4', input: 'abcdefg', expectedOutput: '7' },
    ],
  },
  {
    id: 'cp-binary-search',
    number: '07',
    title: 'Binary Search in Sorted Array',
    topic: 'Searching & Sorting',
    difficulty: 'Medium',
    statement:
      'Given a sorted array of n distinct integers in ascending order and a target value, use binary search to find the 0-based index of the target. If the target does not exist, print -1.',
    inputFormat: 'First line: n. Second line: n sorted integers. Third line: target integer.',
    outputFormat: '0-based index of target, or -1 if not found.',
    constraints: '1 <= n <= 10^5, integers sorted strictly ascending.',
    sampleInput: '6\n-1 0 3 5 9 12\n9',
    sampleOutput: '4',
    sampleExplanation: '9 exists in nums and its index is 4.',
    starterCode: {
      python: `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# TODO: Print the 0-based index of target in nums, or -1 if not present.
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        // TODO: Print the 0-based index of target in nums, or -1 if not present.
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    // TODO: Print the 0-based index of target in nums, or -1 if not present.

    return 0;
}
`,
    },
    testCases: [
      { id: 'tc1', input: '6\n-1 0 3 5 9 12\n9', expectedOutput: '4', isSample: true },
      { id: 'tc2', input: '6\n-1 0 3 5 9 12\n2', expectedOutput: '-1', isSample: true },
      { id: 'tc3', input: '1\n7\n7', expectedOutput: '0' },
      { id: 'tc4', input: '5\n10 20 30 40 50\n10', expectedOutput: '0' },
    ],
  },
  {
    id: 'cp-climbing-stairs',
    number: '08',
    title: 'Climbing Stairs',
    topic: 'Recursion & DP',
    difficulty: 'Medium',
    statement:
      'You are climbing a staircase with n steps. Each time you can either climb 1 step or 2 steps. Print the total number of distinct ways you can reach the top.',
    inputFormat: 'A single integer n.',
    outputFormat: 'A single integer: number of distinct ways to climb n steps.',
    constraints: '1 <= n <= 45',
    sampleInput: '4',
    sampleOutput: '5',
    sampleExplanation: 'The 5 ways are: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2.',
    starterCode: {
      python: `n = int(input())

# TODO: Print the number of distinct ways to reach step n.
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        // TODO: Print the number of distinct ways to reach step n.
    }
}
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    // TODO: Print the number of distinct ways to reach step n.

    return 0;
}
`,
    },
    testCases: [
      { id: 'tc1', input: '4', expectedOutput: '5', isSample: true },
      { id: 'tc2', input: '2', expectedOutput: '2', isSample: true },
      { id: 'tc3', input: '1', expectedOutput: '1' },
      { id: 'tc4', input: '10', expectedOutput: '89' },
      { id: 'tc5', input: '20', expectedOutput: '10946' },
    ],
  },
  {
    id: 'cp-merge-intervals',
    number: '09',
    title: 'Merge Overlapping Intervals',
    topic: 'Arrays',
    difficulty: 'Hard',
    statement:
      'Given n intervals [start, end], merge all overlapping intervals and print the resulting non-overlapping intervals sorted by start time, one interval per line.',
    inputFormat: 'First line: integer n. Next n lines: two space-separated integers start and end.',
    outputFormat: 'Each merged interval on its own line as "start end".',
    constraints: '1 <= n <= 10^4, 0 <= start <= end <= 10^6',
    sampleInput: '4\n1 3\n2 6\n8 10\n15 18',
    sampleOutput: '1 6\n8 10\n15 18',
    sampleExplanation: '[1, 3] and [2, 6] overlap and merge into [1, 6].',
    starterCode: {
      python: `n = int(input())
intervals = [tuple(map(int, input().split())) for _ in range(n)]

# TODO: Merge overlapping intervals and print each "start end" on its own line.
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] intervals = new int[n][2];
        for (int i = 0; i < n; i++) {
            intervals[i][0] = sc.nextInt();
            intervals[i][1] = sc.nextInt();
        }

        // TODO: Merge overlapping intervals and print each "start end" on its own line.
    }
}
`,
      cpp: `#include <iostream>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> intervals(n);
    for (int i = 0; i < n; i++) cin >> intervals[i].first >> intervals[i].second;

    // TODO: Merge overlapping intervals and print each "start end" on its own line.

    return 0;
}
`,
    },
    testCases: [
      { id: 'tc1', input: '4\n1 3\n2 6\n8 10\n15 18', expectedOutput: '1 6\n8 10\n15 18', isSample: true },
      { id: 'tc2', input: '2\n1 4\n4 5', expectedOutput: '1 5', isSample: true },
      { id: 'tc3', input: '3\n6 8\n1 9\n2 4', expectedOutput: '1 9' },
      { id: 'tc4', input: '1\n5 10', expectedOutput: '5 10' },
    ],
  },
  {
    id: 'cp-edit-distance',
    number: '10',
    title: 'Edit Distance (Levenshtein)',
    topic: 'Recursion & DP',
    difficulty: 'Hard',
    statement:
      'Given two strings word1 and word2, print the minimum number of single-character operations (insert, delete, or replace) required to convert word1 into word2.',
    inputFormat: 'First line: word1. Second line: word2.',
    outputFormat: 'A single integer: the minimum edit distance.',
    constraints: '0 <= len(word1), len(word2) <= 500',
    sampleInput: 'horse\nros',
    sampleOutput: '3',
    sampleExplanation: 'horse -> rorse (replace h with r) -> rose (remove r) -> ros (remove e).',
    starterCode: {
      python: `w1 = input().strip()
w2 = input().strip()

# TODO: Compute and print the minimum edit distance between w1 and w2.
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String w1 = sc.hasNextLine() ? sc.nextLine().trim() : "";
        String w2 = sc.hasNextLine() ? sc.nextLine().trim() : "";

        // TODO: Compute and print the minimum edit distance between w1 and w2.
    }
}
`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string w1, w2;
    getline(cin, w1);
    getline(cin, w2);

    // TODO: Compute and print the minimum edit distance between w1 and w2.

    return 0;
}
`,
    },
    testCases: [
      { id: 'tc1', input: 'horse\nros', expectedOutput: '3', isSample: true },
      { id: 'tc2', input: 'intention\nexecution', expectedOutput: '5', isSample: true },
      { id: 'tc3', input: 'abc\nabc', expectedOutput: '0' },
      { id: 'tc4', input: 'kitten\nsitting', expectedOutput: '3' },
    ],
  },
];
