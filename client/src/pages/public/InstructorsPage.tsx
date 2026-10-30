import React from 'react';
import { Star, Users, BookOpen, ExternalLink, CheckCircle } from 'lucide-react';

interface InstructorsPageProps {
  navigate: (path: string) => void;
}

export const InstructorsPage: React.FC<InstructorsPageProps> = ({ navigate }) => {
  const instructors = [
    {
      id: 'inst_01',
      name: 'Dr. Sarah Chen',
      title: 'Ex-Staff Infrastructure Architect at Meta & Fellow at Distributed Labs',
      avatar: '/src/assets/images/instructor_sarah_chen_1793174975407.jpg',
      rating: 4.95,
      studentsCount: 38420,
      coursesCount: 3,
      specialty: 'Distributed Systems & High-Throughput Streaming',
      bio: 'Author of "Systems at Scale" and veteran distributed systems architect with over 15 years building planet-scale microservices, consensus protocols, and real-time streaming engines.',
    },
    {
      id: 'inst_02',
      name: 'Elena Rostova',
      title: 'Principal Design Technologist & Design Systems Consultant',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      rating: 4.88,
      studentsCount: 22100,
      coursesCount: 2,
      specialty: 'Production Design Tokens & WCAG AA Systems',
      bio: 'Design systems lead bridging the divide between Figma variable token architectures and production TypeScript UI components.',
    },
    {
      id: 'inst_03',
      name: 'Dr. Aris Thorne',
      title: 'AI Research Scientist & Quantitative Fellow',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      rating: 4.96,
      studentsCount: 31200,
      coursesCount: 4,
      specialty: 'PyTorch Deep Learning & Transformer Inference',
      bio: 'Former senior scientist in generative modeling with publications at NeurIPS and ICML. Passionate about demystifying autograd and tensor parallelization.',
    },
    {
      id: 'inst_04',
      name: 'Tariq Al-Mansoor',
      title: 'Principal SRE & Cloud Native Architect',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
      rating: 4.87,
      studentsCount: 18900,
      coursesCount: 2,
      specialty: 'Kubernetes Multi-Cluster GitOps & Vault Security',
      bio: 'Architected immutable infrastructure for global financial exchanges, specializing in zero-trust service meshes and automated blue-green cutovers.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 text-left transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="max-w-2xl">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
            Academic Faculty & Chairs
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Learn Directly From Industry Pioneers
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Every Learnova instructor is an active practitioner with verified architectural experience building production infrastructure at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {instructors.map((inst) => (
            <div
              key={inst.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm"
            >
              <div className="flex items-start gap-5 mb-4">
                <img
                  src={inst.avatar}
                  alt={inst.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Verified Faculty</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{inst.name}</h3>
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{inst.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1">
                    Focus: <strong className="text-slate-800 dark:text-slate-200">{inst.specialty}</strong>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {inst.bio}
              </p>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-mono tabular-nums">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-white">{inst.rating.toFixed(2)}</span>
                  </div>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">{inst.studentsCount.toLocaleString()}</strong> students
                  </div>
                </div>

                <button
                  onClick={() => navigate('/courses')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore Courses</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
