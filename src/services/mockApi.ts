import { MOCK_API_DELAY } from '../shared/constants';
import type {
  User,
  DashboardStats,
  Subject,
  Chapter,
  Lesson,
  Test,
  TestResult,
  LeaderboardEntry,
  AnalyticsData,
  Tournament,
} from '../shared/types';

const delay = (ms: number = MOCK_API_DELAY) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data store
const mockStore = {
  users: [] as User[],
  currentUser: null as User | null,
  subjects: [] as Subject[],
  chapters: [] as Chapter[],
  lessons: [] as Lesson[],
  tests: [] as Test[],
  results: [] as TestResult[],
  leaderboard: [] as LeaderboardEntry[],
  tournaments: [] as Tournament[],
};

// Initialize mock data
const initializeMockData = () => {
  mockStore.subjects = [
    { id: '1', name: 'Mathematics', icon: '📐', description: 'Quantitative aptitude', chaptersCount: 5, progress: 60 },
    { id: '2', name: 'Logical Reasoning', icon: '🧩', description: 'Analytical thinking', chaptersCount: 4, progress: 45 },
    { id: '3', name: 'Verbal Ability', icon: '📚', description: 'English comprehension', chaptersCount: 6, progress: 30 },
    { id: '4', name: 'Data Interpretation', icon: '📊', description: 'Charts and graphs', chaptersCount: 3, progress: 75 },
  ];

  mockStore.chapters = [
    // Mathematics chapters
    { id: '1', subjectId: '1', name: 'Number Systems', description: 'Basic number theory and operations', lessonsCount: 8, progress: 80, order: 1 },
    { id: '2', subjectId: '1', name: 'Algebra', description: 'Equations and expressions', lessonsCount: 10, progress: 50, order: 2 },
    { id: '3', subjectId: '1', name: 'Geometry', description: 'Shapes, angles, and theorems', lessonsCount: 12, progress: 40, order: 3 },
    { id: '4', subjectId: '1', name: 'Percentages', description: 'Profit, loss, and discounts', lessonsCount: 6, progress: 70, order: 4 },
    { id: '5', subjectId: '1', name: 'Time & Work', description: 'Work efficiency problems', lessonsCount: 8, progress: 30, order: 5 },
    
    // Logical Reasoning chapters
    { id: '6', subjectId: '2', name: 'Puzzles', description: 'Logical puzzles and arrangements', lessonsCount: 10, progress: 60, order: 1 },
    { id: '7', subjectId: '2', name: 'Blood Relations', description: 'Family tree problems', lessonsCount: 6, progress: 50, order: 2 },
    { id: '8', subjectId: '2', name: 'Coding-Decoding', description: 'Pattern recognition', lessonsCount: 8, progress: 40, order: 3 },
    { id: '9', subjectId: '2', name: 'Syllogisms', description: 'Logical deductions', lessonsCount: 7, progress: 20, order: 4 },
    
    // Verbal Ability chapters
    { id: '10', subjectId: '3', name: 'Reading Comprehension', description: 'Passage understanding', lessonsCount: 12, progress: 35, order: 1 },
    { id: '11', subjectId: '3', name: 'Vocabulary', description: 'Synonyms and antonyms', lessonsCount: 15, progress: 45, order: 2 },
    { id: '12', subjectId: '3', name: 'Grammar', description: 'Sentence correction', lessonsCount: 10, progress: 25, order: 3 },
    { id: '13', subjectId: '3', name: 'Para Jumbles', description: 'Sentence rearrangement', lessonsCount: 8, progress: 30, order: 4 },
    { id: '14', subjectId: '3', name: 'Fill in the Blanks', description: 'Context-based completion', lessonsCount: 9, progress: 20, order: 5 },
    { id: '15', subjectId: '3', name: 'Idioms & Phrases', description: 'Common expressions', lessonsCount: 7, progress: 15, order: 6 },
    
    // Data Interpretation chapters
    { id: '16', subjectId: '4', name: 'Tables', description: 'Tabular data analysis', lessonsCount: 8, progress: 80, order: 1 },
    { id: '17', subjectId: '4', name: 'Bar Charts', description: 'Bar graph interpretation', lessonsCount: 10, progress: 75, order: 2 },
    { id: '18', subjectId: '4', name: 'Pie Charts', description: 'Circular data representation', lessonsCount: 9, progress: 70, order: 3 },
  ];

  mockStore.lessons = [
    // Number Systems lessons
    { 
      id: '1', 
      chapterId: '1', 
      name: 'Introduction to Numbers', 
      content: `<h1>Introduction to Numbers</h1>
<p>Numbers are the foundation of mathematics and aptitude tests. Understanding different types of numbers is crucial for solving complex problems.</p>

<h2>Types of Numbers</h2>
<ul>
  <li><strong>Natural Numbers (N):</strong> 1, 2, 3, 4, 5... (counting numbers)</li>
  <li><strong>Whole Numbers (W):</strong> 0, 1, 2, 3, 4... (natural numbers + zero)</li>
  <li><strong>Integers (Z):</strong> ...-3, -2, -1, 0, 1, 2, 3... (positive and negative whole numbers)</li>
  <li><strong>Rational Numbers (Q):</strong> Numbers that can be expressed as p/q where q ≠ 0</li>
  <li><strong>Irrational Numbers:</strong> Numbers that cannot be expressed as fractions (π, √2, etc.)</li>
</ul>

<h2>Key Properties</h2>
<p><strong>Commutative Property:</strong> a + b = b + a and a × b = b × a</p>
<p><strong>Associative Property:</strong> (a + b) + c = a + (b + c)</p>
<p><strong>Distributive Property:</strong> a × (b + c) = (a × b) + (a × c)</p>

<h2>Practice Tips</h2>
<p>✓ Memorize number properties<br>
✓ Practice mental calculations<br>
✓ Understand number relationships</p>`, 
      duration: 15, 
      completed: true, 
      order: 1, 
      videoUrl: 'https://www.youtube.com/embed/5SqLJRUNh3A' 
    },
    { 
      id: '2', 
      chapterId: '1', 
      name: 'Prime Numbers', 
      content: `<h1>Prime Numbers</h1>
<p>A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.</p>

<h2>First 20 Prime Numbers</h2>
<p>2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71</p>

<h2>Key Facts</h2>
<ul>
  <li>2 is the only even prime number</li>
  <li>1 is neither prime nor composite</li>
  <li>All prime numbers except 2 are odd</li>
  <li>Twin primes: Prime pairs with difference of 2 (3,5), (11,13), (17,19)</li>
</ul>

<h2>How to Check if a Number is Prime</h2>
<p>1. Check if divisible by 2<br>
2. Check odd numbers up to √n<br>
3. If no divisors found, it's prime</p>

<h2>Applications in Aptitude</h2>
<p>✓ Number series problems<br>
✓ Factorization questions<br>
✓ Cryptography concepts</p>`, 
      duration: 20, 
      completed: true, 
      order: 2, 
      videoUrl: 'https://www.youtube.com/embed/mIStB5X4U8M' 
    },
    { 
      id: '3', 
      chapterId: '1', 
      name: 'HCF and LCM', 
      content: `<h1>HCF and LCM</h1>
<p>Highest Common Factor (HCF) and Lowest Common Multiple (LCM) are fundamental concepts in number theory.</p>

<h2>HCF (Highest Common Factor)</h2>
<p>The largest number that divides two or more numbers without remainder.</p>
<p><strong>Example:</strong> HCF of 12 and 18 = 6</p>

<h2>LCM (Lowest Common Multiple)</h2>
<p>The smallest number that is a multiple of two or more numbers.</p>
<p><strong>Example:</strong> LCM of 12 and 18 = 36</p>

<h2>Methods to Find HCF</h2>
<ul>
  <li><strong>Prime Factorization:</strong> Find common prime factors</li>
  <li><strong>Division Method:</strong> Divide larger by smaller repeatedly</li>
  <li><strong>Euclidean Algorithm:</strong> Most efficient for large numbers</li>
</ul>

<h2>Important Formula</h2>
<p><strong>HCF × LCM = Product of two numbers</strong></p>
<p>If HCF(a,b) = h and LCM(a,b) = l, then a × b = h × l</p>

<h2>Quick Tips</h2>
<p>✓ HCF is always ≤ smaller number<br>
✓ LCM is always ≥ larger number<br>
✓ For coprime numbers, HCF = 1 and LCM = product</p>`, 
      duration: 25, 
      completed: true, 
      order: 3, 
      videoUrl: 'https://www.youtube.com/embed/Jj7l8fJcKAw' 
    },
    { 
      id: '4', 
      chapterId: '1', 
      name: 'Divisibility Rules', 
      content: `<h1>Divisibility Rules</h1>
<p>Quick tricks to check if a number is divisible by another without actual division.</p>

<h2>Common Divisibility Rules</h2>
<ul>
  <li><strong>By 2:</strong> Last digit is even (0, 2, 4, 6, 8)</li>
  <li><strong>By 3:</strong> Sum of digits is divisible by 3</li>
  <li><strong>By 4:</strong> Last two digits form a number divisible by 4</li>
  <li><strong>By 5:</strong> Last digit is 0 or 5</li>
  <li><strong>By 6:</strong> Divisible by both 2 and 3</li>
  <li><strong>By 8:</strong> Last three digits form a number divisible by 8</li>
  <li><strong>By 9:</strong> Sum of digits is divisible by 9</li>
  <li><strong>By 10:</strong> Last digit is 0</li>
  <li><strong>By 11:</strong> Difference of sum of alternate digits is 0 or divisible by 11</li>
</ul>

<h2>Examples</h2>
<p><strong>Is 2,346 divisible by 3?</strong><br>
Sum = 2+3+4+6 = 15 (divisible by 3) ✓ Yes</p>

<p><strong>Is 5,678 divisible by 11?</strong><br>
(5+7) - (6+8) = 12-14 = -2 (not divisible by 11) ✗ No</p>

<h2>Pro Tips</h2>
<p>✓ Memorize all rules<br>
✓ Practice with large numbers<br>
✓ Combine rules for faster solving</p>`, 
      duration: 18, 
      completed: false, 
      order: 4, 
      videoUrl: 'https://www.youtube.com/embed/UNgr3IxCUKA' 
    },
    { 
      id: '5', 
      chapterId: '1', 
      name: 'Number Series', 
      content: `<h1>Number Series</h1>
<p>Identify patterns in sequences and find missing numbers - a common aptitude test topic.</p>

<h2>Types of Series</h2>
<ul>
  <li><strong>Arithmetic Series:</strong> Constant difference (2, 5, 8, 11...)</li>
  <li><strong>Geometric Series:</strong> Constant ratio (2, 6, 18, 54...)</li>
  <li><strong>Square Series:</strong> Perfect squares (1, 4, 9, 16, 25...)</li>
  <li><strong>Cube Series:</strong> Perfect cubes (1, 8, 27, 64...)</li>
  <li><strong>Prime Series:</strong> Prime numbers (2, 3, 5, 7, 11...)</li>
  <li><strong>Fibonacci Series:</strong> Sum of previous two (1, 1, 2, 3, 5, 8...)</li>
</ul>

<h2>Pattern Recognition Tips</h2>
<p>1. Check differences between consecutive terms<br>
2. Check ratios between consecutive terms<br>
3. Look for alternating patterns<br>
4. Check if terms are squares, cubes, or primes</p>

<h2>Example Problems</h2>
<p><strong>Find next: 3, 7, 15, 31, ?</strong><br>
Pattern: Each term = (previous × 2) + 1<br>
Answer: 63</p>

<p><strong>Find missing: 2, 6, 12, ?, 30</strong><br>
Pattern: 2×1, 2×3, 2×6, 2×10, 2×15<br>
Answer: 20</p>`, 
      duration: 22, 
      completed: false, 
      order: 5, 
      videoUrl: 'https://www.youtube.com/embed/Qhaz36TZG5Y' 
    },
    
    // Algebra lessons
    { id: '6', chapterId: '2', name: 'Linear Equations', content: `<h1>Linear Equations</h1>
<p>Master the art of solving linear equations - one of the most fundamental skills in algebra and aptitude tests.</p>

<h2>What is a Linear Equation?</h2>
<p>A linear equation is an algebraic equation where the highest power of the variable is 1. The standard form is:</p>
<p><strong>ax + b = c</strong>, where a ≠ 0</p>

<h2>Steps to Solve Linear Equations</h2>
<ol>
  <li><strong>Simplify both sides:</strong> Remove brackets and combine like terms</li>
  <li><strong>Isolate the variable term:</strong> Move constants to one side</li>
  <li><strong>Solve for the variable:</strong> Divide by the coefficient</li>
  <li><strong>Verify the solution:</strong> Substitute back to check</li>
</ol>

<h2>Example Problems</h2>
<p><strong>Example 1: Basic Linear Equation</strong><br>
Solve: 3x + 5 = 20<br>
Step 1: 3x = 20 - 5<br>
Step 2: 3x = 15<br>
Step 3: x = 15 ÷ 3<br>
<strong>Answer: x = 5</strong></p>

<p><strong>Example 2: Equation with Variables on Both Sides</strong><br>
Solve: 5x - 3 = 2x + 9<br>
Step 1: 5x - 2x = 9 + 3<br>
Step 2: 3x = 12<br>
<strong>Answer: x = 4</strong></p>

<p><strong>Example 3: Equation with Fractions</strong><br>
Solve: (x/2) + 3 = 7<br>
Step 1: x/2 = 7 - 3<br>
Step 2: x/2 = 4<br>
<strong>Answer: x = 8</strong></p>

<h2>Common Mistakes to Avoid</h2>
<ul>
  <li>❌ Forgetting to change signs when moving terms</li>
  <li>❌ Not distributing negative signs correctly</li>
  <li>❌ Dividing only one side by the coefficient</li>
  <li>✅ Always perform the same operation on both sides</li>
</ul>

<h2>Quick Tips for Aptitude Tests</h2>
<p>✓ Check your answer by substituting back<br>
✓ Look for shortcuts in multiple choice questions<br>
✓ Practice mental math for simple equations<br>
✓ Watch out for negative coefficients</p>`, duration: 20, completed: true, order: 1, videoUrl: 'https://www.youtube.com/embed/WUvTyaaNkzM' },
    { id: '7', chapterId: '2', name: 'Quadratic Equations', content: `<h1>Quadratic Equations</h1>
<p>Learn to solve quadratic equations - equations where the highest power of the variable is 2. Essential for competitive exams!</p>

<h2>Standard Form</h2>
<p><strong>ax² + bx + c = 0</strong>, where a ≠ 0</p>
<p>Example: x² - 5x + 6 = 0</p>

<h2>Methods to Solve</h2>

<h3>1. Factorization Method</h3>
<p>Break down the equation into two factors.</p>
<p><strong>Example:</strong> x² - 5x + 6 = 0<br>
(x - 2)(x - 3) = 0<br>
<strong>Solutions: x = 2 or x = 3</strong></p>

<h3>2. Quadratic Formula</h3>
<p><strong>x = [-b ± √(b² - 4ac)] / 2a</strong></p>
<p>This formula works for ALL quadratic equations!</p>

<p><strong>Example:</strong> 2x² + 5x - 3 = 0<br>
Here: a = 2, b = 5, c = -3<br>
x = [-5 ± √(25 + 24)] / 4<br>
x = [-5 ± √49] / 4<br>
x = [-5 ± 7] / 4<br>
<strong>Solutions: x = 0.5 or x = -3</strong></p>

<h2>The Discriminant (D)</h2>
<p><strong>D = b² - 4ac</strong></p>
<p>The discriminant tells us about the nature of roots:</p>
<ul>
  <li><strong>D > 0:</strong> Two distinct real roots</li>
  <li><strong>D = 0:</strong> One repeated real root (equal roots)</li>
  <li><strong>D < 0:</strong> No real roots (complex roots)</li>
</ul>

<h2>Sum and Product of Roots</h2>
<p>For equation ax² + bx + c = 0:</p>
<ul>
  <li><strong>Sum of roots:</strong> α + β = -b/a</li>
  <li><strong>Product of roots:</strong> α × β = c/a</li>
</ul>

<h2>Practice Problems</h2>
<p><strong>Problem 1:</strong> Solve x² - 7x + 12 = 0<br>
<strong>Answer:</strong> x = 3 or x = 4</p>

<p><strong>Problem 2:</strong> Find the discriminant of 3x² + 2x + 1 = 0<br>
<strong>Answer:</strong> D = 4 - 12 = -8 (No real roots)</p>

<h2>Quick Tips</h2>
<p>✓ Always check if factorization is possible first<br>
✓ Use the quadratic formula when factorization is difficult<br>
✓ Calculate discriminant to know the nature of roots<br>
✓ Verify your answers by substituting back</p>`, duration: 30, completed: false, order: 2, videoUrl: 'https://www.youtube.com/embed/i7idZfS8t8w' },
    { id: '8', chapterId: '2', name: 'Inequalities', content: `<h1>Inequalities</h1>
<p>Master the art of solving and graphing inequalities - a crucial skill for optimization problems and real-world applications.</p>

<h2>What are Inequalities?</h2>
<p>Inequalities compare two expressions using inequality symbols instead of an equals sign.</p>

<h2>Inequality Symbols</h2>
<ul>
  <li><strong>&lt;</strong> Less than (5 &lt; 10)</li>
  <li><strong>&gt;</strong> Greater than (10 &gt; 5)</li>
  <li><strong>≤</strong> Less than or equal to (x ≤ 5)</li>
  <li><strong>≥</strong> Greater than or equal to (x ≥ 3)</li>
  <li><strong>≠</strong> Not equal to (x ≠ 0)</li>
</ul>

<h2>Rules for Solving Inequalities</h2>
<ol>
  <li><strong>Addition/Subtraction:</strong> Adding or subtracting the same number preserves the inequality<br>
  Example: If x + 3 &gt; 5, then x &gt; 2</li>
  <li><strong>Multiplication/Division by Positive:</strong> Preserves the inequality<br>
  Example: If 2x &gt; 6, then x &gt; 3</li>
  <li><strong>Multiplication/Division by Negative:</strong> REVERSES the inequality<br>
  Example: If -2x &gt; 6, then x &lt; -3</li>
</ol>

<h2>Example Problems</h2>
<p><strong>Example 1: Simple Inequality</strong><br>
Solve: 3x - 5 &gt; 10<br>
Step 1: 3x &gt; 10 + 5<br>
Step 2: 3x &gt; 15<br>
<strong>Answer: x &gt; 5</strong></p>

<p><strong>Example 2: Negative Coefficient</strong><br>
Solve: -4x + 8 ≤ 20<br>
Step 1: -4x ≤ 20 - 8<br>
Step 2: -4x ≤ 12<br>
Step 3: x ≥ -3 (inequality reversed!)<br>
<strong>Answer: x ≥ -3</strong></p>

<p><strong>Example 3: Compound Inequality</strong><br>
Solve: -2 &lt; 3x + 1 &lt; 10<br>
Step 1: -3 &lt; 3x &lt; 9<br>
<strong>Answer: -1 &lt; x &lt; 3</strong></p>

<h2>Graphing Inequalities</h2>
<ul>
  <li><strong>Open circle (○):</strong> Use for &lt; or &gt; (value not included)</li>
  <li><strong>Closed circle (●):</strong> Use for ≤ or ≥ (value included)</li>
  <li><strong>Shade right:</strong> For x &gt; a or x ≥ a</li>
  <li><strong>Shade left:</strong> For x &lt; a or x ≤ a</li>
</ul>

<h2>Common Mistakes</h2>
<ul>
  <li>❌ Forgetting to reverse inequality when multiplying/dividing by negative</li>
  <li>❌ Using wrong circle type (open vs closed)</li>
  <li>❌ Shading the wrong direction on number line</li>
  <li>✅ Always check your solution by testing a value</li>
</ul>

<h2>Quick Tips</h2>
<p>✓ Remember: Negative multiplication/division flips the sign<br>
✓ Test your answer with a sample value<br>
✓ Draw a number line for visualization<br>
✓ Pay attention to "or equal to" conditions</p>`, duration: 18, completed: false, order: 3, videoUrl: 'https://www.youtube.com/embed/VqKq78PVO9g' },
    
    // Puzzles lessons
    { id: '9', chapterId: '6', name: 'Seating Arrangements', content: `<h1>Seating Arrangements</h1>
<p>Master one of the most common logical reasoning topics in aptitude tests - seating arrangement puzzles!</p>

<h2>Types of Seating Arrangements</h2>

<h3>1. Linear Arrangement</h3>
<p>People sit in a straight line (row), either facing the same direction or opposite directions.</p>
<p><strong>Formula:</strong> n people can be arranged in <strong>n!</strong> ways</p>

<h3>2. Circular Arrangement</h3>
<p>People sit around a circular table. One position is fixed as reference.</p>
<p><strong>Formula:</strong> n people can be arranged in <strong>(n-1)!</strong> ways</p>

<h2>Key Concepts</h2>
<ul>
  <li><strong>Facing Center:</strong> Left and right are as we see them</li>
  <li><strong>Facing Outside:</strong> Left and right are reversed</li>
  <li><strong>Immediate Neighbors:</strong> People sitting directly next to each other</li>
  <li><strong>Opposite:</strong> In circular: directly across; In linear: not applicable</li>
</ul>

<h2>Solving Strategy</h2>
<ol>
  <li><strong>Draw a diagram:</strong> Visual representation is crucial</li>
  <li><strong>Mark fixed positions first:</strong> Start with definite information</li>
  <li><strong>Use given conditions:</strong> Apply each clue systematically</li>
  <li><strong>Eliminate impossible arrangements:</strong> Cross out what can't work</li>
  <li><strong>Verify all conditions:</strong> Check your final answer</li>
</ol>

<h2>Example Problem</h2>
<p><strong>Linear Arrangement:</strong></p>
<p>Six friends A, B, C, D, E, F are sitting in a row facing north.</p>
<ul>
  <li>A sits third from the left end</li>
  <li>B sits second to the right of A</li>
  <li>C sits at one of the ends</li>
  <li>D sits between E and F</li>
</ul>

<p><strong>Solution:</strong><br>
Position: 1 - 2 - 3 - 4 - 5 - 6<br>
Step 1: A is at position 3<br>
Step 2: B is at position 5 (second right of A)<br>
Step 3: C is at position 1 or 6<br>
Step 4: D is between E and F<br>
<strong>Final: C - E - A - D - B - F</strong></p>

<h2>Common Patterns</h2>
<ul>
  <li>✓ "Second to the right" = 2 positions away</li>
  <li>✓ "Immediate right" = Next position</li>
  <li>✓ "Between X and Y" = X - Person - Y</li>
  <li>✓ "At the end" = Position 1 or last position</li>
</ul>

<h2>Tips for Quick Solving</h2>
<p>✓ Always draw the arrangement<br>
✓ Start with the most specific clues<br>
✓ Use elimination method for options<br>
✓ Check if facing direction matters<br>
✓ Count positions carefully (don't skip!)</p>

<h2>Practice Tip</h2>
<p>These puzzles appear in almost every aptitude test. Practice 10-15 different patterns to master this topic!</p>`, duration: 25, completed: true, order: 1, videoUrl: 'https://www.youtube.com/embed/Yx8Tn0UT8Hs' },
    { id: '10', chapterId: '6', name: 'Floor Puzzles', content: `<h1>Floor Puzzles</h1>
<p>Learn to solve floor-based arrangement puzzles - a popular variation of logical reasoning questions in competitive exams.</p>

<h2>What are Floor Puzzles?</h2>
<p>Floor puzzles involve arranging people or objects across different floors of a building based on given conditions.</p>

<h2>Common Patterns</h2>
<ul>
  <li><strong>Who lives on which floor:</strong> Direct floor assignment</li>
  <li><strong>Who lives above/below whom:</strong> Relative positioning</li>
  <li><strong>Floor number constraints:</strong> Specific floor requirements</li>
  <li><strong>Gap between floors:</strong> Number of floors between people</li>
  <li><strong>Consecutive floors:</strong> People on adjacent floors</li>
</ul>

<h2>Types of Buildings</h2>
<h3>1. Ground Floor = Floor 1</h3>
<p>Floors numbered from bottom: 1, 2, 3, 4, 5...</p>

<h3>2. Ground Floor = Floor 0</h3>
<p>Floors numbered: 0, 1, 2, 3, 4...</p>

<p><strong>Important:</strong> Always check which numbering system is used!</p>

<h2>Solving Strategy</h2>
<ol>
  <li><strong>Create a floor diagram:</strong> Draw vertical representation</li>
  <li><strong>Mark definite positions:</strong> Start with absolute clues</li>
  <li><strong>Use relative positions:</strong> Apply "above/below" conditions</li>
  <li><strong>Apply constraints:</strong> Use "not on same floor" type clues</li>
  <li><strong>Use elimination:</strong> Cross out impossible arrangements</li>
  <li><strong>Verify all conditions:</strong> Check every given statement</li>
</ol>

<h2>Example Problem</h2>
<p><strong>Problem:</strong> A building has 7 floors (1-7). Seven people A, B, C, D, E, F, G live on different floors.</p>
<ul>
  <li>A lives on floor 4</li>
  <li>B lives 2 floors above A</li>
  <li>C lives on an odd-numbered floor below A</li>
  <li>D lives immediately above E</li>
  <li>F lives on the topmost floor</li>
  <li>G lives below C</li>
</ul>

<p><strong>Solution:</strong></p>
<pre>
Floor 7: F (topmost)
Floor 6: B (2 above A)
Floor 5: D
Floor 4: A (given)
Floor 3: E (immediately below D)
Floor 2: (empty - not used)
Floor 1: C (odd, below A)
Floor 0: G (below C)
</pre>

<h2>Key Terms to Remember</h2>
<ul>
  <li><strong>"Immediately above/below":</strong> Next floor (gap = 0)</li>
  <li><strong>"Two floors above":</strong> Gap of 2 floors</li>
  <li><strong>"Between X and Y":</strong> On a floor between X's and Y's floors</li>
  <li><strong>"Topmost/Bottommost":</strong> Highest/Lowest floor</li>
  <li><strong>"Odd/Even floor":</strong> Floor number is odd/even</li>
</ul>

<h2>Common Mistakes to Avoid</h2>
<ul>
  <li>❌ Confusing "above" with "immediately above"</li>
  <li>❌ Not checking the floor numbering system</li>
  <li>❌ Forgetting to count the gap correctly</li>
  <li>❌ Missing the "different floors" constraint</li>
  <li>✅ Always draw a clear diagram</li>
</ul>

<h2>Quick Tips</h2>
<p>✓ Draw a vertical diagram with floor numbers<br>
✓ Start with absolute positions (specific floors)<br>
✓ Then apply relative positions (above/below)<br>
✓ Use process of elimination for remaining positions<br>
✓ Double-check all conditions before finalizing</p>

<h2>Practice Variations</h2>
<p>Floor puzzles can be combined with:</p>
<ul>
  <li>Different professions or colors</li>
  <li>Multiple buildings</li>
  <li>Flat numbers within floors</li>
  <li>Time-based conditions (who moved when)</li>
</ul>`, duration: 28, completed: false, order: 2, videoUrl: 'https://www.youtube.com/embed/8p7Yx8tn0hs' },
    
    // Reading Comprehension lessons
    { id: '11', chapterId: '10', name: 'Main Idea Questions', content: `<h1>Main Idea Questions</h1>
<p>Learn to identify the central theme of any passage - a critical skill for reading comprehension in all competitive exams.</p>

<h2>What is the Main Idea?</h2>
<p>The main idea is the primary point or central message the author wants to convey. It's the "big picture" of the passage.</p>

<h2>Main Idea vs Supporting Details</h2>
<ul>
  <li><strong>Main Idea:</strong> The overall message (What is the passage about?)</li>
  <li><strong>Supporting Details:</strong> Facts, examples, and evidence that support the main idea</li>
</ul>

<h2>How to Find the Main Idea</h2>
<ol>
  <li><strong>Read the first paragraph carefully:</strong> Often contains the introduction to the main idea</li>
  <li><strong>Read the last paragraph:</strong> Usually summarizes or reinforces the main idea</li>
  <li><strong>Look for repeated concepts:</strong> Ideas mentioned multiple times are likely central</li>
  <li><strong>Identify topic sentences:</strong> Usually the first sentence of each paragraph</li>
  <li><strong>Eliminate specific details:</strong> Focus on the broader message</li>
  <li><strong>Ask "What is this mostly about?":</strong> Your answer is likely the main idea</li>
</ol>

<h2>Common Question Formats</h2>
<ul>
  <li>"The passage is primarily about..."</li>
  <li>"The main purpose of the passage is to..."</li>
  <li>"The author's central argument is..."</li>
  <li>"Which best describes the main idea?"</li>
  <li>"The passage mainly discusses..."</li>
  <li>"What is the primary focus of the passage?"</li>
</ul>

<h2>Example Passage</h2>
<p><em>"Climate change is one of the most pressing issues of our time. Rising temperatures are causing glaciers to melt, sea levels to rise, and weather patterns to become more extreme. Scientists warn that without immediate action, the consequences could be catastrophic. Governments worldwide are implementing policies to reduce carbon emissions, but progress has been slow. Individual actions, such as reducing energy consumption and supporting sustainable practices, are also crucial in combating this global challenge."</em></p>

<p><strong>Question:</strong> What is the main idea of this passage?</p>
<p><strong>Options:</strong></p>
<ol type="A">
  <li>Glaciers are melting due to rising temperatures</li>
  <li>Governments are implementing carbon reduction policies</li>
  <li>Climate change is a critical issue requiring urgent action</li>
  <li>Individual actions can help reduce energy consumption</li>
</ol>

<p><strong>Answer: C</strong> - This captures the overall message. Options A, B, and D are supporting details.</p>

<h2>Tips to Identify Main Idea</h2>
<ul>
  <li>✓ The main idea is usually stated, not implied</li>
  <li>✓ It should be broad enough to cover the entire passage</li>
  <li>✓ It should not be too specific (that's a detail)</li>
  <li>✓ It should not be too vague (that's too general)</li>
  <li>✓ All paragraphs should relate to the main idea</li>
</ul>

<h2>Common Mistakes</h2>
<ul>
  <li>❌ Choosing a supporting detail instead of the main idea</li>
  <li>❌ Selecting an option that's too broad or too narrow</li>
  <li>❌ Getting distracted by interesting but minor points</li>
  <li>❌ Not reading the entire passage before answering</li>
  <li>✅ Always read the full passage and all options</li>
</ul>

<h2>Quick Strategy</h2>
<p><strong>The 3-Step Method:</strong></p>
<ol>
  <li>Read the passage completely</li>
  <li>Summarize it in one sentence in your mind</li>
  <li>Find the option that matches your summary</li>
</ol>

<h2>Practice Tip</h2>
<p>After reading any article or passage, practice summarizing it in one sentence. This builds your main idea identification skill!</p>`, duration: 20, completed: false, order: 1, videoUrl: 'https://www.youtube.com/embed/TqQQexKZook' },
    { id: '12', chapterId: '10', name: 'Inference Questions', content: `<h1>Inference Questions</h1>
<p>Master the art of reading between the lines - drawing logical conclusions from what's stated in the passage.</p>

<h2>What is an Inference?</h2>
<p>An inference is a logical conclusion reached based on evidence and reasoning from the passage. It's something that is <strong>implied but not directly stated</strong>.</p>

<h2>Inference vs Assumption</h2>
<ul>
  <li><strong>Inference:</strong> Based on evidence in the passage (✓ Correct)</li>
  <li><strong>Assumption:</strong> Based on personal beliefs or outside knowledge (✗ Wrong)</li>
</ul>

<h2>Key Skills for Making Inferences</h2>
<ol>
  <li><strong>Read between the lines:</strong> Look for implied meanings</li>
  <li><strong>Use context clues:</strong> Surrounding information provides hints</li>
  <li><strong>Connect ideas:</strong> Link different parts of the passage</li>
  <li><strong>Avoid assumptions:</strong> Don't bring in outside knowledge</li>
  <li><strong>Stay logical:</strong> The inference must be reasonable</li>
</ol>

<h2>Common Question Formats</h2>
<ul>
  <li>"It can be inferred from the passage that..."</li>
  <li>"The author suggests that..."</li>
  <li>"The passage implies that..."</li>
  <li>"Based on the passage, we can conclude..."</li>
  <li>"Which of the following can be inferred?"</li>
  <li>"The author would most likely agree that..."</li>
</ul>

<h2>Example Passage</h2>
<p><em>"Maria checked her watch for the third time in five minutes. The train was already twenty minutes late. She tapped her foot impatiently and kept glancing at the empty tracks. Her interview was scheduled to start in forty minutes, and the journey would take at least thirty minutes."</em></p>

<p><strong>Question:</strong> What can be inferred about Maria?</p>
<p><strong>Options:</strong></p>
<ol type="A">
  <li>Maria is going to miss her interview</li>
  <li>Maria is anxious about being late</li>
  <li>Maria has never taken a train before</li>
  <li>The train service is always unreliable</li>
</ol>

<p><strong>Answer: B</strong> - Her repeated watch-checking, foot-tapping, and the time pressure suggest anxiety. Option A is too definite, C and D are assumptions not supported by the text.</p>

<h2>Types of Inference Questions</h2>

<h3>1. Character Inference</h3>
<p>What can we infer about a person's feelings, motivations, or personality?</p>

<h3>2. Cause and Effect Inference</h3>
<p>What likely caused something or what will likely happen next?</p>

<h3>3. Author's Purpose Inference</h3>
<p>Why did the author include certain information or use specific language?</p>

<h3>4. Relationship Inference</h3>
<p>How are ideas, events, or people connected?</p>

<h2>How to Answer Inference Questions</h2>
<ol>
  <li><strong>Read the passage carefully:</strong> Don't skim</li>
  <li><strong>Identify relevant information:</strong> What evidence supports each option?</li>
  <li><strong>Eliminate extreme options:</strong> Avoid "always," "never," "must"</li>
  <li><strong>Choose the most logical:</strong> The inference should be reasonable</li>
  <li><strong>Verify with passage:</strong> Can you point to supporting evidence?</li>
</ol>

<h2>Red Flags - Avoid These Options</h2>
<ul>
  <li>❌ Requires outside knowledge not in the passage</li>
  <li>❌ Makes extreme claims (always, never, only, must)</li>
  <li>❌ Contradicts information in the passage</li>
  <li>❌ Goes too far beyond what's stated</li>
  <li>✅ Supported by evidence in the passage</li>
  <li>✅ Uses moderate language (likely, suggests, may)</li>
</ul>

<h2>Practice Example</h2>
<p><em>"The ancient library contained thousands of scrolls, many of which had not been read in centuries. Dust covered the shelves, and the air smelled of old parchment. The librarian, an elderly man with thick glasses, spent his days carefully cataloging each document."</em></p>

<p><strong>What can be inferred?</strong></p>
<ol type="A">
  <li>The library is no longer in use</li>
  <li>The librarian is dedicated to preserving the scrolls</li>
  <li>All the scrolls are written in ancient languages</li>
  <li>The library will be demolished soon</li>
</ol>

<p><strong>Answer: B</strong> - The librarian's careful cataloging despite the library's condition suggests dedication. Options A, C, and D make unsupported assumptions.</p>

<h2>Quick Tips</h2>
<p>✓ Inference = Evidence + Logic<br>
✓ Stay within the passage's scope<br>
✓ Look for tone and word choice clues<br>
✓ Connect multiple pieces of information<br>
✓ The answer should feel "strongly suggested"</p>

<h2>Common Mistakes</h2>
<ul>
  <li>❌ Choosing what you personally believe</li>
  <li>❌ Selecting information directly stated (that's not inference!)</li>
  <li>❌ Making wild leaps in logic</li>
  <li>✅ Choose what the passage strongly suggests</li>
</ul>`, duration: 22, completed: false, order: 2, videoUrl: 'https://www.youtube.com/embed/8Z5sMb7QV-Y' },
    
    // Tables lessons
    { id: '13', chapterId: '16', name: 'Basic Table Reading', content: `<h1>Basic Table Reading</h1>
<p>Extract information from tabular data efficiently.</p>

<h2>Table Components</h2>
<p>✓ Column headers<br>
✓ Row labels<br>
✓ Data cells<br>
✓ Totals/subtotals</p>

<h2>Reading Strategy</h2>
<p>1. Understand headers<br>
2. Identify units<br>
3. Locate required data<br>
4. Perform calculations</p>

<h2>Common Operations</h2>
<p>✓ Finding maximum/minimum<br>
✓ Calculating totals<br>
✓ Comparing values<br>
✓ Finding averages</p>`, duration: 15, completed: true, order: 1, videoUrl: 'https://www.youtube.com/embed/RjQda040BU0' },
    { id: '14', chapterId: '16', name: 'Percentage Calculations', content: `<h1>Percentage Calculations</h1>
<p>Calculate percentages from table data quickly and accurately.</p>

<h2>Basic Formula</h2>
<p>Percentage = (Part / Whole) × 100</p>

<h2>Common Calculations</h2>
<p>✓ Percentage increase/decrease<br>
✓ Percentage share<br>
✓ Percentage change<br>
✓ Percentage distribution</p>

<h2>Quick Tips</h2>
<p>✓ Convert fractions to percentages<br>
✓ Use approximation for speed<br>
✓ Remember common percentages (1/2 = 50%, 1/4 = 25%)</p>

<h2>Example</h2>
<p>If sales increased from 200 to 250:<br>
Increase = 250 - 200 = 50<br>
% Increase = (50/200) × 100 = 25%</p>`, duration: 20, completed: true, order: 2, videoUrl: 'https://www.youtube.com/embed/WYWPx317qgw' },
    
    // More Number Systems lessons (6-8)
    { id: '15', chapterId: '1', name: 'Fractions and Decimals', content: `<h1>Fractions and Decimals</h1>
<p>Understanding fractions and decimals is essential for solving aptitude problems efficiently.</p>

<h2>Types of Fractions</h2>
<p>Proper Fraction: Numerator less than denominator (3/4)<br>
Improper Fraction: Numerator greater than denominator (7/4)<br>
Mixed Fraction: Whole number + proper fraction (1 3/4)</p>

<h2>Converting Fractions to Decimals</h2>
<p>Divide numerator by denominator<br>
Example: 3/4 = 0.75</p>

<h2>Common Fraction-Decimal Equivalents</h2>
<p>1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75<br>
1/3 = 0.333..., 2/3 = 0.666...<br>
1/5 = 0.2, 1/8 = 0.125</p>`, duration: 18, completed: false, order: 6, videoUrl: 'https://www.youtube.com/embed/tW4QfO_JX3k' },
    { id: '16', chapterId: '1', name: 'Squares and Cubes', content: `<h1>Squares and Cubes</h1>
<p>Memorizing squares and cubes helps solve problems faster in competitive exams.</p>

<h2>Squares (1-30)</h2>
<p>1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49, 8²=64, 9²=81, 10²=100<br>
11²=121, 12²=144, 13²=169, 14²=196, 15²=225, 16²=256, 17²=289, 18²=324, 19²=361, 20²=400<br>
25²=625, 30²=900</p>

<h2>Cubes (1-15)</h2>
<p>1³=1, 2³=8, 3³=27, 4³=64, 5³=125, 6³=216, 7³=343, 8³=512, 9³=729, 10³=1000<br>
11³=1331, 12³=1728, 13³=2197, 14³=2744, 15³=3375</p>

<h2>Quick Tricks</h2>
<p>Square of numbers ending in 5: (n)(n+1) followed by 25<br>
Example: 25² = (2×3)25 = 625</p>`, duration: 20, completed: false, order: 7, videoUrl: 'https://www.youtube.com/embed/Qhaz36TZG5Y' },
    { id: '17', chapterId: '1', name: 'Square Roots and Cube Roots', content: `<h1>Square Roots and Cube Roots</h1>
<p>Learn methods to find square roots and cube roots quickly.</p>

<h2>Perfect Squares</h2>
<p>√1=1, √4=2, √9=3, √16=4, √25=5, √36=6, √49=7, √64=8, √81=9, √100=10<br>
√121=11, √144=12, √169=13, √196=14, √225=15</p>

<h2>Perfect Cubes</h2>
<p>∛1=1, ∛8=2, ∛27=3, ∛64=4, ∛125=5, ∛216=6, ∛343=7, ∛512=8, ∛729=9, ∛1000=10</p>

<h2>Estimation Method</h2>
<p>For √50: Between √49=7 and √64=8<br>
Closer to 7, approximately 7.07</p>`, duration: 22, completed: false, order: 8, videoUrl: 'https://www.youtube.com/embed/5SqLJRUNh3A' },
    
    // More Algebra lessons (9-15)
    { id: '18', chapterId: '2', name: 'Polynomials', content: `<h1>Polynomials</h1>
<p>Expressions with multiple terms involving variables and coefficients.</p>

<h2>Types of Polynomials</h2>
<p>Monomial: One term (3x)<br>
Binomial: Two terms (x + 5)<br>
Trinomial: Three terms (x² + 2x + 1)</p>

<h2>Degree of Polynomial</h2>
<p>Highest power of variable<br>
Example: 3x³ + 2x² + x has degree 3</p>

<h2>Operations</h2>
<p>Addition: Combine like terms<br>
Multiplication: Use distributive property<br>
Factorization: Break into simpler expressions</p>`, duration: 25, completed: false, order: 4, videoUrl: 'https://www.youtube.com/embed/WUvTyaaNkzM' },
    { id: '19', chapterId: '2', name: 'Exponents and Powers', content: `<h1>Exponents and Powers</h1>
<p>Understanding laws of exponents is crucial for simplifying expressions.</p>

<h2>Laws of Exponents</h2>
<p>aᵐ × aⁿ = aᵐ⁺ⁿ<br>
aᵐ ÷ aⁿ = aᵐ⁻ⁿ<br>
(aᵐ)ⁿ = aᵐⁿ<br>
a⁰ = 1<br>
a⁻ⁿ = 1/aⁿ</p>

<h2>Examples</h2>
<p>2³ × 2² = 2⁵ = 32<br>
(3²)³ = 3⁶ = 729<br>
5⁻² = 1/25</p>`, duration: 20, completed: false, order: 5, videoUrl: 'https://www.youtube.com/embed/i7idZfS8t8w' },
    { id: '20', chapterId: '2', name: 'Logarithms', content: `<h1>Logarithms</h1>
<p>Logarithms are the inverse of exponential functions.</p>

<h2>Basic Definition</h2>
<p>If aˣ = b, then logₐ(b) = x</p>

<h2>Properties</h2>
<p>log(ab) = log(a) + log(b)<br>
log(a/b) = log(a) - log(b)<br>
log(aⁿ) = n × log(a)<br>
logₐ(a) = 1<br>
logₐ(1) = 0</p>`, duration: 28, completed: false, order: 6, videoUrl: 'https://www.youtube.com/embed/VqKq78PVO9g' },
    { id: '21', chapterId: '2', name: 'Ratio and Proportion', content: `<h1>Ratio and Proportion</h1>
<p>Comparing quantities and solving proportion problems.</p>

<h2>Ratio</h2>
<p>Comparison of two quantities: a:b = a/b</p>

<h2>Proportion</h2>
<p>Equality of two ratios: a:b = c:d<br>
Then a×d = b×c (cross multiplication)</p>

<h2>Types</h2>
<p>Direct Proportion: Both increase/decrease together<br>
Inverse Proportion: One increases, other decreases</p>`, duration: 22, completed: false, order: 7, videoUrl: 'https://www.youtube.com/embed/WUvTyaaNkzM' },
    { id: '22', chapterId: '2', name: 'Sequences and Series', content: `<h1>Sequences and Series</h1>
<p>Ordered lists of numbers following a pattern.</p>

<h2>Arithmetic Progression (AP)</h2>
<p>Constant difference between terms<br>
nth term: aₙ = a + (n-1)d<br>
Sum: Sₙ = n/2[2a + (n-1)d]</p>

<h2>Geometric Progression (GP)</h2>
<p>Constant ratio between terms<br>
nth term: aₙ = arⁿ⁻¹<br>
Sum: Sₙ = a(rⁿ-1)/(r-1)</p>`, duration: 26, completed: false, order: 8, videoUrl: 'https://www.youtube.com/embed/i7idZfS8t8w' },
    { id: '23', chapterId: '2', name: 'Functions', content: `<h1>Functions</h1>
<p>Relationship between input and output values.</p>

<h2>Function Notation</h2>
<p>f(x) represents function of x<br>
Example: f(x) = 2x + 3</p>

<h2>Types of Functions</h2>
<p>Linear: f(x) = mx + c<br>
Quadratic: f(x) = ax² + bx + c<br>
Exponential: f(x) = aˣ<br>
Logarithmic: f(x) = log(x)</p>`, duration: 24, completed: false, order: 9, videoUrl: 'https://www.youtube.com/embed/VqKq78PVO9g' },
    { id: '24', chapterId: '2', name: 'Algebraic Identities', content: `<h1>Algebraic Identities</h1>
<p>Standard formulas for quick calculations.</p>

<h2>Important Identities</h2>
<p>(a+b)² = a² + 2ab + b²<br>
(a-b)² = a² - 2ab + b²<br>
a² - b² = (a+b)(a-b)<br>
(a+b)³ = a³ + 3a²b + 3ab² + b³<br>
(a-b)³ = a³ - 3a²b + 3ab² - b³<br>
a³ + b³ = (a+b)(a² - ab + b²)<br>
a³ - b³ = (a-b)(a² + ab + b²)</p>`, duration: 20, completed: false, order: 10, videoUrl: 'https://www.youtube.com/embed/WUvTyaaNkzM' },
  ];

  mockStore.leaderboard = Array.from({ length: 20 }, (_, i) => ({
    rank: i + 1,
    userId: `user-${i + 1}`,
    name: `Student ${i + 1}`,
    college: i % 3 === 0 ? 'MIT' : i % 3 === 1 ? 'Stanford' : 'Harvard',
    score: 1000 - i * 50,
    testsCompleted: 20 - i,
    accuracy: 95 - i * 2,
  }));

  // Initialize tournaments
  mockStore.tournaments = [
    // World Level
    {
      id: 't-1',
      name: 'Global Aptitude Championship 2026',
      description: 'The world\'s largest aptitude competition with participants from 150+ countries',
      organizer: 'World Aptitude Federation',
      organizerType: 'world',
      level: 'expert',
      startDate: '2026-04-01',
      endDate: '2026-04-15',
      registrationDeadline: '2026-03-25',
      status: 'upcoming',
      participants: 45230,
      maxParticipants: 50000,
      prizePool: '$100,000',
      prizes: [
        { position: '1st', reward: '$50,000 + Trophy', badge: '🥇' },
        { position: '2nd', reward: '$30,000 + Trophy', badge: '🥈' },
        { position: '3rd', reward: '$20,000 + Trophy', badge: '🥉' },
      ],
      eligibility: 'Open to all',
      duration: 120,
      questionsCount: 100,
      isRegistered: false,
      tags: ['Mathematics', 'Reasoning', 'Verbal'],
    },
    {
      id: 't-2',
      name: 'International Math Olympiad',
      description: 'Test your mathematical prowess against the world\'s best',
      organizer: 'International Math Society',
      organizerType: 'world',
      level: 'advanced',
      startDate: '2026-03-20',
      endDate: '2026-03-20',
      registrationDeadline: '2026-03-15',
      status: 'ongoing',
      participants: 12500,
      prizePool: '$50,000',
      prizes: [
        { position: 'Top 10', reward: '$5,000 each', badge: '🏆' },
        { position: 'Top 100', reward: 'Gold Badge', badge: '⭐' },
      ],
      eligibility: 'Open to all',
      duration: 90,
      questionsCount: 50,
      isRegistered: true,
      tags: ['Mathematics', 'Problem Solving'],
    },

    // Country Level (India)
    {
      id: 't-3',
      name: 'All India Aptitude Test 2026',
      description: 'National level competition for Indian students',
      organizer: 'National Testing Agency',
      organizerType: 'country',
      level: 'intermediate',
      startDate: '2026-03-25',
      endDate: '2026-03-25',
      registrationDeadline: '2026-03-20',
      status: 'upcoming',
      participants: 25000,
      maxParticipants: 30000,
      prizePool: '₹25,00,000',
      prizes: [
        { position: '1st', reward: '₹10,00,000', badge: '🥇' },
        { position: '2nd', reward: '₹8,00,000', badge: '🥈' },
        { position: '3rd', reward: '₹7,00,000', badge: '🥉' },
      ],
      eligibility: 'Indian residents only',
      duration: 90,
      questionsCount: 75,
      isRegistered: true,
      tags: ['All Subjects', 'National'],
    },
    {
      id: 't-4',
      name: 'India Reasoning Challenge',
      description: 'Sharpen your logical reasoning skills',
      organizer: 'Indian Aptitude Council',
      organizerType: 'country',
      level: 'beginner',
      startDate: '2026-04-10',
      endDate: '2026-04-10',
      registrationDeadline: '2026-04-05',
      status: 'upcoming',
      participants: 8500,
      prizePool: '₹5,00,000',
      prizes: [
        { position: 'Top 50', reward: '₹10,000 each', badge: '🎯' },
      ],
      eligibility: 'Indian students',
      duration: 60,
      questionsCount: 50,
      isRegistered: false,
      tags: ['Logical Reasoning'],
    },

    // Region Level
    {
      id: 't-5',
      name: 'South India Aptitude League',
      description: 'Regional championship for South Indian states',
      organizer: 'South India Education Board',
      organizerType: 'region',
      level: 'intermediate',
      startDate: '2026-03-28',
      endDate: '2026-03-28',
      registrationDeadline: '2026-03-23',
      status: 'upcoming',
      participants: 5200,
      maxParticipants: 10000,
      prizePool: '₹10,00,000',
      prizes: [
        { position: '1st', reward: '₹5,00,000', badge: '🥇' },
        { position: '2nd', reward: '₹3,00,000', badge: '🥈' },
        { position: '3rd', reward: '₹2,00,000', badge: '🥉' },
      ],
      eligibility: 'Students from TN, KA, AP, TG, KL',
      duration: 75,
      questionsCount: 60,
      isRegistered: false,
      tags: ['Regional', 'All Subjects'],
    },

    // State Level
    {
      id: 't-6',
      name: 'Karnataka State Aptitude Championship',
      description: 'Compete with the best minds in Karnataka',
      organizer: 'Karnataka Education Department',
      organizerType: 'state',
      level: 'beginner',
      startDate: '2026-04-05',
      endDate: '2026-04-05',
      registrationDeadline: '2026-03-30',
      status: 'upcoming',
      participants: 3200,
      prizePool: '₹3,00,000',
      prizes: [
        { position: '1st', reward: '₹1,50,000', badge: '🥇' },
        { position: '2nd', reward: '₹1,00,000', badge: '🥈' },
        { position: '3rd', reward: '₹50,000', badge: '🥉' },
      ],
      eligibility: 'Karnataka residents',
      duration: 60,
      questionsCount: 50,
      isRegistered: false,
      tags: ['State Level', 'Karnataka'],
    },
    {
      id: 't-7',
      name: 'Tamil Nadu Math Challenge',
      description: 'Mathematics competition for TN students',
      organizer: 'TN Math Association',
      organizerType: 'state',
      level: 'intermediate',
      startDate: '2026-03-15',
      endDate: '2026-03-15',
      registrationDeadline: '2026-03-10',
      status: 'completed',
      participants: 4500,
      prizePool: '₹2,00,000',
      prizes: [
        { position: 'Top 20', reward: '₹10,000 each', badge: '🏆' },
      ],
      eligibility: 'Tamil Nadu students',
      duration: 90,
      questionsCount: 40,
      isRegistered: true,
      tags: ['Mathematics', 'State'],
    },

    // Company Organized
    {
      id: 't-8',
      name: 'Google Aptitude Challenge 2026',
      description: 'Compete for internship opportunities at Google',
      organizer: 'Google India',
      organizerType: 'company',
      level: 'advanced',
      startDate: '2026-04-15',
      endDate: '2026-04-15',
      registrationDeadline: '2026-04-10',
      status: 'upcoming',
      participants: 15000,
      maxParticipants: 20000,
      prizePool: 'Internships + ₹15,00,000',
      prizes: [
        { position: 'Top 10', reward: 'Google Internship', badge: '💼' },
        { position: 'Top 100', reward: '₹15,000 each', badge: '🎁' },
      ],
      eligibility: 'Engineering students',
      duration: 120,
      questionsCount: 80,
      isRegistered: false,
      tags: ['Coding', 'Aptitude', 'Google'],
    },
    {
      id: 't-9',
      name: 'Microsoft Talent Hunt',
      description: 'Showcase your skills to Microsoft recruiters',
      organizer: 'Microsoft',
      organizerType: 'company',
      level: 'expert',
      startDate: '2026-03-22',
      endDate: '2026-03-22',
      registrationDeadline: '2026-03-18',
      status: 'ongoing',
      participants: 12000,
      prizePool: 'Job Offers + ₹10,00,000',
      prizes: [
        { position: 'Top 5', reward: 'Job Offer', badge: '💼' },
        { position: 'Top 50', reward: '₹20,000 each', badge: '🏆' },
      ],
      eligibility: 'Final year students',
      duration: 150,
      questionsCount: 100,
      isRegistered: true,
      tags: ['Aptitude', 'Coding', 'Microsoft'],
    },
    {
      id: 't-10',
      name: 'Amazon Campus Challenge',
      description: 'Get hired by Amazon through this competition',
      organizer: 'Amazon',
      organizerType: 'company',
      level: 'advanced',
      startDate: '2026-04-20',
      endDate: '2026-04-20',
      registrationDeadline: '2026-04-15',
      status: 'upcoming',
      participants: 18000,
      prizePool: 'Interviews + ₹8,00,000',
      prizes: [
        { position: 'Top 20', reward: 'Direct Interview', badge: '💼' },
        { position: 'Top 100', reward: '₹8,000 each', badge: '🎁' },
      ],
      eligibility: 'All students',
      duration: 90,
      questionsCount: 70,
      isRegistered: false,
      tags: ['Aptitude', 'Amazon'],
    },

    // College Organized
    {
      id: 't-11',
      name: 'IIT Delhi Inter-College Championship',
      description: 'Compete against students from top colleges',
      organizer: 'IIT Delhi',
      organizerType: 'college',
      level: 'advanced',
      startDate: '2026-03-30',
      endDate: '2026-03-30',
      registrationDeadline: '2026-03-25',
      status: 'upcoming',
      participants: 2500,
      maxParticipants: 3000,
      prizePool: '₹5,00,000',
      prizes: [
        { position: '1st', reward: '₹2,00,000', badge: '🥇' },
        { position: '2nd', reward: '₹1,50,000', badge: '🥈' },
        { position: '3rd', reward: '₹1,00,000', badge: '🥉' },
      ],
      eligibility: 'College students',
      duration: 90,
      questionsCount: 60,
      isRegistered: false,
      tags: ['Inter-College', 'IIT'],
    },
    {
      id: 't-12',
      name: 'MIT Campus Aptitude Fest',
      description: 'Annual aptitude competition at MIT',
      organizer: 'MIT',
      organizerType: 'college',
      level: 'beginner',
      startDate: '2026-04-08',
      endDate: '2026-04-08',
      registrationDeadline: '2026-04-03',
      status: 'upcoming',
      participants: 800,
      maxParticipants: 1000,
      prizePool: '₹1,00,000',
      prizes: [
        { position: '1st', reward: '₹50,000', badge: '🥇' },
        { position: '2nd', reward: '₹30,000', badge: '🥈' },
        { position: '3rd', reward: '₹20,000', badge: '🥉' },
      ],
      eligibility: 'MIT students only',
      duration: 60,
      questionsCount: 50,
      isRegistered: true,
      tags: ['Campus', 'MIT'],
    },
  ];
};

initializeMockData();

export const mockApi = {
  // Auth
  login: async (email: string): Promise<User> => {
    await delay();
    
    // Admin credentials for testing
    if (email === 'admin@aptiq.com') {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@aptiq.com',
        name: 'Admin User',
        college: 'AptIQ Platform',
        role: 'admin',
        badges: [],
        createdAt: new Date().toISOString(),
      };
      mockStore.currentUser = adminUser;
      return adminUser;
    }
    
    // Teacher credentials for testing
    if (email === 'teacher@aptiq.com') {
      const teacherUser: User = {
        id: 'teacher-1',
        email: 'teacher@aptiq.com',
        name: 'Prof. Smith',
        college: 'AptIQ Platform',
        role: 'teacher',
        badges: [],
        createdAt: new Date().toISOString(),
      };
      mockStore.currentUser = teacherUser;
      return teacherUser;
    }
    
    // Default student user
    const user: User = {
      id: '1',
      email,
      name: 'John Doe',
      college: 'MIT',
      role: 'student',
      badges: [],
      createdAt: new Date().toISOString(),
    };
    mockStore.currentUser = user;
    return user;
  },

  register: async (data: { email: string; password: string; name: string; role?: 'student' | 'teacher' }): Promise<User> => {
    await delay();
    const user: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role || 'student',
      badges: [],
      createdAt: new Date().toISOString(),
    };
    mockStore.users.push(user);
    mockStore.currentUser = user;
    return user;
  },

  logout: async (): Promise<void> => {
    await delay();
    mockStore.currentUser = null;
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay();
    return {
      currentStreak: 7,
      totalTests: 24,
      accuracy: 87.5,
      weakestSubject: 'Verbal Ability',
      recentActivity: [
        { id: '1', type: 'test', title: 'Mock Test 5', timestamp: new Date().toISOString(), score: 85 },
        { id: '2', type: 'lesson', title: 'Algebra Basics', timestamp: new Date().toISOString() },
      ],
      badges: [
        { id: '1', name: 'First Test', icon: '🎯', description: 'Completed first test', earnedAt: new Date().toISOString() },
      ],
    };
  },

  // Subjects
  getSubjects: async (): Promise<Subject[]> => {
    await delay();
    return mockStore.subjects;
  },

  // Chapters
  getChapters: async (subjectId: string): Promise<Chapter[]> => {
    await delay();
    return mockStore.chapters.filter(c => c.subjectId === subjectId);
  },

  // Lessons
  getLessons: async (chapterId: string): Promise<Lesson[]> => {
    await delay();
    return mockStore.lessons.filter(l => l.chapterId === chapterId);
  },

  getLesson: async (lessonId: string): Promise<Lesson> => {
    await delay();
    const lesson = mockStore.lessons.find(l => l.id === lessonId);
    if (!lesson) throw new Error('Lesson not found');
    return lesson;
  },

  markLessonComplete: async (lessonId: string): Promise<void> => {
    await delay();
    const lesson = mockStore.lessons.find(l => l.id === lessonId);
    if (lesson) lesson.completed = true;
  },

  // Tests
  getTest: async (testId: string): Promise<Test> => {
    await delay();
    return {
      id: testId,
      name: 'Mock Aptitude Test 1',
      duration: 60,
      totalMarks: 100,
      questions: [
        // Mathematics questions
        {
          id: 'q-1',
          text: 'If a train travels 120 km in 2 hours, what is its average speed?',
          options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
          correctAnswer: 1,
          subject: 'Mathematics',
          explanation: 'Speed = Distance/Time = 120/2 = 60 km/h'
        },
        {
          id: 'q-2',
          text: 'What is 25% of 80?',
          options: ['15', '20', '25', '30'],
          correctAnswer: 1,
          subject: 'Mathematics',
          explanation: '25% of 80 = (25/100) × 80 = 20'
        },
        {
          id: 'q-3',
          text: 'If x + 5 = 12, what is the value of x?',
          options: ['5', '6', '7', '8'],
          correctAnswer: 2,
          subject: 'Mathematics',
          explanation: 'x + 5 = 12, therefore x = 12 - 5 = 7'
        },
        {
          id: 'q-4',
          text: 'The HCF of 12 and 18 is:',
          options: ['2', '3', '6', '9'],
          correctAnswer: 2,
          subject: 'Mathematics',
          explanation: 'Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. HCF = 6'
        },
        
        // Logical Reasoning questions
        {
          id: 'q-5',
          text: 'If all roses are flowers and some flowers are red, which conclusion is valid?',
          options: [
            'All roses are red',
            'Some roses are red',
            'No roses are red',
            'Cannot be determined'
          ],
          correctAnswer: 3,
          subject: 'Logical Reasoning',
          explanation: 'We cannot determine if roses are red from the given statements.'
        },
        {
          id: 'q-6',
          text: 'Complete the series: 2, 6, 12, 20, 30, ?',
          options: ['40', '42', '44', '46'],
          correctAnswer: 1,
          subject: 'Logical Reasoning',
          explanation: 'Pattern: +4, +6, +8, +10, +12. Next is 30 + 12 = 42'
        },
        {
          id: 'q-7',
          text: 'If CODING is written as DPEJOH, how is BRAIN written?',
          options: ['CSBJO', 'CSBJM', 'CTBJO', 'CQBHM'],
          correctAnswer: 0,
          subject: 'Logical Reasoning',
          explanation: 'Each letter is shifted by +1. B→C, R→S, A→B, I→J, N→O'
        },
        
        // Verbal Ability questions
        {
          id: 'q-8',
          text: 'Choose the synonym of "Abundant":',
          options: ['Scarce', 'Plentiful', 'Rare', 'Limited'],
          correctAnswer: 1,
          subject: 'Verbal Ability',
          explanation: 'Abundant means plentiful or existing in large quantities.'
        },
        {
          id: 'q-9',
          text: 'Identify the grammatically correct sentence:',
          options: [
            'She don\'t like coffee',
            'She doesn\'t likes coffee',
            'She doesn\'t like coffee',
            'She don\'t likes coffee'
          ],
          correctAnswer: 2,
          subject: 'Verbal Ability',
          explanation: 'Correct form: She doesn\'t like coffee (third person singular)'
        },
        {
          id: 'q-10',
          text: 'Choose the antonym of "Brave":',
          options: ['Courageous', 'Fearless', 'Cowardly', 'Bold'],
          correctAnswer: 2,
          subject: 'Verbal Ability',
          explanation: 'Cowardly is the opposite of brave.'
        },
        
        // Data Interpretation questions
        {
          id: 'q-11',
          text: 'A pie chart shows: Sales A=40%, B=30%, C=20%, D=10%. If total sales are $1000, what are sales of B?',
          options: ['$200', '$300', '$400', '$500'],
          correctAnswer: 1,
          subject: 'Data Interpretation',
          explanation: '30% of $1000 = $300'
        },
        {
          id: 'q-12',
          text: 'In a bar chart, if Product A sold 50 units and Product B sold 75 units, what is the ratio A:B?',
          options: ['1:2', '2:3', '3:4', '1:3'],
          correctAnswer: 1,
          subject: 'Data Interpretation',
          explanation: '50:75 = 2:3 (dividing both by 25)'
        },
        
        // Additional mixed questions
        {
          id: 'q-13',
          text: 'If a shopkeeper offers 20% discount on marked price of $500, what is the selling price?',
          options: ['$400', '$420', '$450', '$480'],
          correctAnswer: 0,
          subject: 'Mathematics',
          explanation: 'Discount = 20% of 500 = $100. Selling price = 500 - 100 = $400'
        },
        {
          id: 'q-14',
          text: 'A can complete a work in 10 days, B in 15 days. Working together, in how many days can they complete it?',
          options: ['5 days', '6 days', '7 days', '8 days'],
          correctAnswer: 1,
          subject: 'Mathematics',
          explanation: 'Combined rate = 1/10 + 1/15 = 1/6. Time = 6 days'
        },
        {
          id: 'q-15',
          text: 'Choose the correctly spelled word:',
          options: ['Occassion', 'Occasion', 'Ocasion', 'Occation'],
          correctAnswer: 1,
          subject: 'Verbal Ability',
          explanation: 'The correct spelling is "Occasion" with double C and single S.'
        },
      ],
    };
  },

  submitTest: async (testId: string, answers: Record<string, number>): Promise<TestResult> => {
    await delay();
    const test = await mockApi.getTest(testId);
    const correctAnswers = Object.entries(answers).filter(
      ([qId, ans]) => test.questions.find(q => q.id === qId)?.correctAnswer === ans
    ).length;

    const result: TestResult = {
      id: Date.now().toString(),
      testId,
      score: (correctAnswers / test.questions.length) * 100,
      totalQuestions: test.questions.length,
      correctAnswers,
      timeTaken: 45,
      subjectBreakdown: [
        { subject: 'Mathematics', correct: 8, total: 10, accuracy: 80 },
      ],
      answers,
      completedAt: new Date().toISOString(),
    };

    mockStore.results.push(result);
    return result;
  },

  getTestResult: async (resultId: string): Promise<TestResult> => {
    await delay();
    const result = mockStore.results.find(r => r.id === resultId);
    if (!result) throw new Error('Result not found');
    return result;
  },

  // Leaderboard
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    await delay();
    return mockStore.leaderboard;
  },

  // Analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    await delay();
    return {
      subjectAccuracy: [
        { subject: 'Mathematics', accuracy: 85 },
        { subject: 'Logical Reasoning', accuracy: 78 },
        { subject: 'Verbal Ability', accuracy: 72 },
        { subject: 'Data Interpretation', accuracy: 90 },
      ],
      performanceOverTime: Array.from({ length: 10 }, (_, i) => ({
        date: new Date(Date.now() - (9 - i) * 86400000).toLocaleDateString(),
        score: 70 + Math.random() * 20,
      })),
      strengthWeakness: [
        { label: 'Strengths', value: 65 },
        { label: 'Weaknesses', value: 35 },
      ],
      avgTimePerQuestion: 2.5,
    };
  },

  // Profile
  getProfile: async (): Promise<User> => {
    await delay();
    if (!mockStore.currentUser) throw new Error('Not authenticated');
    return mockStore.currentUser;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    await delay();
    if (!mockStore.currentUser) throw new Error('Not authenticated');
    mockStore.currentUser = { ...mockStore.currentUser, ...data };
    return mockStore.currentUser;
  },

  // Tournaments
  getTournaments: async (levelFilter: string, statusFilter: string): Promise<Tournament[]> => {
    await delay();
    let filtered = mockStore.tournaments;
    
    if (levelFilter !== 'all') {
      filtered = filtered.filter(t => t.organizerType === levelFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    return filtered;
  },

  getTournament: async (id: string): Promise<Tournament> => {
    await delay();
    const tournament = mockStore.tournaments.find(t => t.id === id);
    if (!tournament) throw new Error('Tournament not found');
    return tournament;
  },

  registerTournament: async (id: string): Promise<void> => {
    await delay();
    const tournament = mockStore.tournaments.find(t => t.id === id);
    if (tournament) {
      tournament.isRegistered = true;
      tournament.participants += 1;
    }
  },
};
