import { Course, CourseCategory, Quiz } from '../types';

const questionsByCategory: Record<CourseCategory, Quiz['questions']> = {
  'System Architecture': [
    {
      id: 'architecture-q1',
      question: 'What does the CAP theorem describe during a network partition?',
      options: ['A trade-off between consistency and availability', 'A choice between storage and CPU', 'A guarantee of zero latency', 'A method for compressing requests'],
      correctOptionIndex: 0,
      explanation: 'During a partition, a distributed system must trade off immediate consistency against availability.',
    },
    {
      id: 'architecture-q2',
      question: 'Why are idempotency keys useful when retrying an API request?',
      options: ['They prevent duplicate side effects', 'They encrypt the response body', 'They increase database storage', 'They disable request timeouts'],
      correctOptionIndex: 0,
      explanation: 'A stable idempotency key lets the server recognize retries and avoid applying the same operation twice.',
    },
    {
      id: 'architecture-q3',
      question: 'What is a common purpose of a circuit breaker?',
      options: ['Stop repeated calls to a failing dependency', 'Store every response permanently', 'Replace service authentication', 'Increase the number of retries without limit'],
      correctOptionIndex: 0,
      explanation: 'A circuit breaker temporarily rejects calls to an unhealthy dependency so it can recover.',
    },
  ],
  'Data & AI': [
    {
      id: 'data-ai-q1',
      question: 'What is the main purpose of a training dataset?',
      options: ['Help a model learn patterns for a task', 'Encrypt model parameters', 'Guarantee that predictions are always correct', 'Replace model evaluation'],
      correctOptionIndex: 0,
      explanation: 'Training examples are used to adjust model parameters so the model learns patterns.',
    },
    {
      id: 'data-ai-q2',
      question: 'What does a validation set help measure?',
      options: ['How well a model generalizes during development', 'The size of the source-code repository', 'The speed of a network connection', 'The number of GPU vendors'],
      correctOptionIndex: 0,
      explanation: 'Validation data helps compare models and detect overfitting before final testing.',
    },
    {
      id: 'data-ai-q3',
      question: 'What is an embedding commonly used to represent?',
      options: ['Data as a numeric vector of learned features', 'A database backup schedule', 'A video playback timestamp', 'A cryptographic certificate'],
      correctOptionIndex: 0,
      explanation: 'Embeddings map items such as words or images into numeric vectors that capture useful relationships.',
    },
  ],
  'Cloud & DevOps': [
    {
      id: 'cloud-devops-q1',
      question: 'What is the primary benefit of infrastructure as code?',
      options: ['Provision infrastructure repeatably from versioned definitions', 'Remove the need for monitoring', 'Make every deployment manual', 'Store production credentials in source code'],
      correctOptionIndex: 0,
      explanation: 'Infrastructure as code makes environment changes reproducible, reviewable, and automatable.',
    },
    {
      id: 'cloud-devops-q2',
      question: 'What does a Kubernetes readiness probe indicate?',
      options: ['Whether a container should receive traffic', 'Whether a source file compiles', 'Whether a database has backups', 'Whether a node has been deleted'],
      correctOptionIndex: 0,
      explanation: 'Kubernetes uses readiness to decide whether a pod is ready to serve requests.',
    },
    {
      id: 'cloud-devops-q3',
      question: 'Why use a rolling deployment?',
      options: ['Update instances gradually while keeping the service available', 'Delete all replicas before every release', 'Disable health checks during release', 'Make deployments impossible to roll back'],
      correctOptionIndex: 0,
      explanation: 'A rolling deployment replaces instances in stages, reducing downtime and release risk.',
    },
  ],
  'UI/UX Design': [
    {
      id: 'uiux-q1',
      question: 'What is the purpose of a design token?',
      options: ['Store reusable design values such as color and spacing', 'Track a user password', 'Compress an image file', 'Measure network latency'],
      correctOptionIndex: 0,
      explanation: 'Design tokens keep shared visual values consistent across components and products.',
    },
    {
      id: 'uiux-q2',
      question: 'What does WCAG contrast guidance help improve?',
      options: ['Text readability for users with low vision', 'Database query speed', 'Video resolution', 'Server availability'],
      correctOptionIndex: 0,
      explanation: 'Sufficient contrast makes text and interface elements easier to perceive.',
    },
    {
      id: 'uiux-q3',
      question: 'Why should interactive controls have visible focus states?',
      options: ['To help keyboard users see which control is active', 'To hide the page title', 'To prevent responsive layouts', 'To disable screen readers'],
      correctOptionIndex: 0,
      explanation: 'Visible focus indicators help keyboard users track their position and navigate interfaces.',
    },
  ],
  Cybersecurity: [
    {
      id: 'security-q1',
      question: 'What is the principle of least privilege?',
      options: ['Give each identity only the access it needs', 'Share one administrator account with everyone', 'Keep access rights permanently', 'Disable audit logs'],
      correctOptionIndex: 0,
      explanation: 'Limiting permissions reduces the impact of mistakes and compromised accounts.',
    },
    {
      id: 'security-q2',
      question: 'Why should passwords be stored using a salted password hash?',
      options: ['To make recovery of original passwords harder after a database leak', 'To allow passwords to be emailed back to users', 'To remove the need for authentication', 'To share passwords between accounts'],
      correctOptionIndex: 0,
      explanation: 'A unique salt and a slow password-hashing function make stolen password databases harder to exploit.',
    },
    {
      id: 'security-q3',
      question: 'What is multi-factor authentication?',
      options: ['Using more than one type of proof to verify an identity', 'Reusing one password across several sites', 'Encrypting a public webpage', 'Disabling login alerts'],
      correctOptionIndex: 0,
      explanation: 'MFA combines factors such as something you know and something you have.',
    },
  ],
  'Software Engineering': [
    {
      id: 'software-q1',
      question: 'What is the purpose of a unit test?',
      options: ['Check a small unit of behavior in isolation', 'Replace all production monitoring', 'Deploy code to every user', 'Store user-uploaded files'],
      correctOptionIndex: 0,
      explanation: 'Unit tests verify individual functions or components independently.',
    },
    {
      id: 'software-q2',
      question: 'What does a type checker help catch?',
      options: ['Invalid use of values based on their declared types', 'A slow internet connection', 'A missing database backup', 'An expired domain name'],
      correctOptionIndex: 0,
      explanation: 'Static type checking can identify many incompatible values before the program runs.',
    },
    {
      id: 'software-q3',
      question: 'Why keep code changes small and focused?',
      options: ['They are easier to review, test, and troubleshoot', 'They eliminate the need for tests', 'They guarantee no bugs can occur', 'They prevent version control use'],
      correctOptionIndex: 0,
      explanation: 'Focused changes reduce review complexity and make failures easier to isolate.',
    },
  ],
};

export function getCourseQuiz(course: Course): Quiz {
  if (course.quiz?.questions.length) return course.quiz;

  return {
    id: `quiz-${course.id}`,
    courseId: course.id,
    title: `${course.category} Course Checkpoint`,
    description: `Review foundational ideas related to ${course.title}.`,
    timeLimitMinutes: 5,
    passingScorePercentage: 70,
    questions: questionsByCategory[course.category],
  };
}
