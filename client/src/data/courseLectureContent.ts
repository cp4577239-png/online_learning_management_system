import { Course, Lecture } from '../types';

const distributedSystemsVideos = [
  {
    matches: ['cap theorem', 'pacelc'],
    url: 'https://www.youtube.com/watch?v=8UryASGBiR4',
  },
  {
    matches: ['saga', 'transaction'],
    url: 'https://www.youtube.com/watch?v=aDp99WDIM_4',
  },
  {
    matches: ['cach'],
    url: 'https://www.youtube.com/watch?v=Myp8z0ybdzM',
  },
  {
    matches: ['kafka', 'partition'],
    url: 'https://www.youtube.com/watch?v=y9BStKvVzSs',
  },
  {
    matches: ['circuit', 'fault tolerance', 'raft'],
    url: 'https://www.youtube.com/watch?v=4r8Mz3MMivY',
  },
];

const studyNotesByLecture: Record<string, string[]> = {
  lec_01_01: [
    'CAP applies when a network partition prevents nodes from communicating: a system must prioritize consistency or availability for that operation.',
    'Consistency means reads observe the latest successful write; availability means each request receives a response.',
    'PACELC adds the normal-operation trade-off: without a partition, systems still balance latency against consistency.',
  ],
  lec_01_02: [
    'A saga splits a cross-service transaction into local transactions coordinated by orchestration or choreography.',
    'Each committed step should have a compensating action for failures later in the workflow.',
    'Use idempotency keys and durable state so retries do not repeat external side effects.',
  ],
  lec_01_03: [
    'Cache-aside reads the cache first, loads misses from the source, then populates the cache.',
    'Write-through updates the cache and source together; it simplifies reads but adds write-path work.',
    'Use TTLs, request coalescing, and bounded stale data to reduce stampedes and stale-read risk.',
  ],
  lec_02_01: [
    'Kafka partitions provide parallelism; records with the same key are ordered within one partition.',
    'A consumer group assigns each partition to one consumer at a time, so adding consumers helps only up to the partition count.',
    'Monitor consumer lag and rebalance behavior, and use a dead-letter path for repeatedly failing records.',
  ],
  lec_02_02: [
    'A circuit breaker moves between closed, open, and half-open states to stop repeated calls to an unhealthy dependency.',
    'Pair it with timeouts, bounded retries, and bulkheads; retries alone can amplify an outage.',
    'Define a safe fallback and collect metrics for open-circuit duration and failed calls.',
  ],
};

const fallbackStudyNotes = [
  'Start with the problem the lecture is solving and identify its assumptions.',
  'Write down the main trade-off, then note which workload or failure condition changes the design choice.',
  'Review the lecture summary and test the idea with a small concrete example.',
];

export function getCourseLectureCount(course: Course): number {
  return course.sections.reduce((count, section) => count + section.lectures.length, 0);
}

export function getLectureVideoUrl(course: Course, lecture: Lecture): string {
  const isProductionCourse = course.slug === 'production-fullstack-typescript-react-nextjs'
    || course.title.startsWith('Production Full-Stack Architecture: Next.js, React 19');
  if (isProductionCourse && lecture.title.toLowerCase().includes('react server components')) {
    return 'https://media.w3.org/2010/05/sintel/trailer.mp4';
  }
  if (isProductionCourse && lecture.title.toLowerCase().includes('spacing')) {
    return 'https://www.youtube.com/watch?v=rnlADjRvJlc';
  }

  const isSampleCartoon = lecture.videoUrl.includes('gtv-videos-bucket/sample/');
  if (!isSampleCartoon || course.category !== 'System Architecture') return lecture.videoUrl;

  const title = lecture.title.toLowerCase();
  return distributedSystemsVideos.find(({ matches }) => matches.some((term) => title.includes(term)))?.url
    ?? 'https://www.youtube.com/watch?v=cQP8WApzIQQ';
}

export function getLectureStudyNotes(lecture: Lecture): string[] {
  return studyNotesByLecture[lecture.id] ?? fallbackStudyNotes;
}
