import React from 'react';
import { ProfileContent } from '../../types/cms';
import { Server, Database, Code2, ShieldCheck } from 'lucide-react';

interface AboutSectionProps {
  profile: ProfileContent;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="py-20 border-b border-neutral-900 bg-neutral-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-900">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
              Engineering Background
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
              Pragmatic Systems Architect
            </h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-md mt-4 md:mt-0 leading-relaxed">
            Bridging robust backend foundations in Java Spring Boot with reactive client experiences in React and TypeScript.
          </p>
        </div>

        {/* Narrative & Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Story Column */}
          <div className="lg:col-span-7 space-y-6 text-neutral-300 text-base leading-relaxed">
            <p>
              {profile.bio}
            </p>
            <p className="text-neutral-400">
              {profile.extendedBio}
            </p>
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider mb-3">
                Core Architectural Convictions
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 font-mono text-sm mt-0.5">01.</span>
                  <div>
                    <strong className="text-neutral-200">Decoupled Freedom:</strong> Keeping the CMS backend independent of the presentation client enables headless distribution across web, mobile, and APIs without lock-in.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 font-mono text-sm mt-0.5">02.</span>
                  <div>
                    <strong className="text-neutral-200">Explicit Schema Contracts:</strong> Strongly typed DTOs and JPA repository queries guarantee deterministic behavior, preventing hidden N+1 bottlenecks.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 font-mono text-sm mt-0.5">03.</span>
                  <div>
                    <strong className="text-neutral-200">Stateless Security:</strong> Cryptographically signed JWT bearer tokens allow seamless scale across serverless nodes or distributed clusters.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Core Strengths Bento */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center mb-3">
                <Server className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-base font-semibold text-neutral-100 mb-1">Spring Boot & APIs</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Clean REST controllers, transactional services, and OpenAPI 3.0 specs tailored for high throughput.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center mb-3">
                <Code2 className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-base font-semibold text-neutral-100 mb-1">React & TypeScript</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Component hierarchy, custom state hooks, optimistic UI patterns, and zero layout shift styling.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center mb-3">
                <Database className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-base font-semibold text-neutral-100 mb-1">PostgreSQL & JPA</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Relational schema modeling, index optimization, polymorphic relationships, and data migrations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-base font-semibold text-neutral-100 mb-1">Custom CMS Core</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                In-house content engines with draft-to-publish workflows, media upload storage, and role permissions.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
