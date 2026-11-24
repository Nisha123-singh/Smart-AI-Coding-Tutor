import { useEffect, useState } from 'react';
import { Check, Copy, Lightbulb, MessageSquare, Play } from 'lucide-react';
import { THEORY_TOPICS } from '../data/theory';
import { LANGUAGE_META } from '../data/tutorials';
import type { LanguageId } from '../types';

interface TheorySectionProps {
  selectedLanguage: LanguageId;
  onSelectLanguage: (lang: LanguageId) => void;
  onOpenInCodeLab: (language: LanguageId, code: string) => void;
  onAskTutorWithCode: (language: LanguageId, code: string) => void;
}

const LANGUAGES: LanguageId[] = ['python', 'java', 'cpp', 'sql'];

export function TheorySection({
  selectedLanguage,
  onSelectLanguage,
  onOpenInCodeLab,
  onAskTutorWithCode,
}: TheorySectionProps) {
  const topicsForLang = THEORY_TOPICS.filter((t) => t.language === selectedLanguage);
  const [activeTopicId, setActiveTopicId] = useState<string>(topicsForLang[0]?.id ?? '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const first = THEORY_TOPICS.find((t) => t.language === selectedLanguage);
    if (first && !topicsForLang.some((t) => t.id === activeTopicId)) {
      setActiveTopicId(first.id);
    }
  }, [selectedLanguage, topicsForLang, activeTopicId]);

  const activeTopic =
    topicsForLang.find((t) => t.id === activeTopicId) ?? topicsForLang[0];

  if (!activeTopic) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeTopic.exampleCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard permission denial
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header & Language Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Programming Theory
          </h1>
          <p className="text-sm text-slate-600">
            Core concepts, mental models, and key terminology for Python, Java, C++, and SQL.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Choose language theory"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start"
        >
          {LANGUAGES.map((lang) => {
            const active = lang === selectedLanguage;
            return (
              <button
                key={lang}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectLanguage(lang)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {LANGUAGE_META[lang].name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Zone Theory Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Topic Index */}
        <aside className="lg:col-span-4 space-y-2">
          <h2 className="text-xs font-semibold text-slate-500 px-1 pb-1">
            {LANGUAGE_META[selectedLanguage].name} Theory Topics
          </h2>
          {topicsForLang.map((topic) => {
            const selected = topic.id === activeTopic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer space-y-1 ${
                  selected
                    ? 'bg-white border-sky-600 ring-1 ring-sky-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs text-slate-500 tabular-nums">
                  Topic {topic.number}
                </div>
                <div className="text-sm font-semibold text-slate-900 leading-snug">
                  {topic.title}
                </div>
              </button>
            );
          })}
        </aside>

        {/* Right Theory Detail Card */}
        <article className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5 border-b border-slate-100 pb-5">
            <div className="text-xs font-medium text-slate-500">
              {LANGUAGE_META[selectedLanguage].name} Theory · Topic {activeTopic.number}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {activeTopic.title}
            </h2>
            <p className="text-sm text-slate-600">{activeTopic.summary}</p>
          </div>

          {/* Core Theory Points */}
          <div className="bg-sky-50/60 border border-sky-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Lightbulb className="w-4 h-4 text-sky-600" />
              <span>Core Theory Points</span>
            </div>
            <ul className="space-y-2.5 text-sm text-slate-700 list-disc pl-5 leading-relaxed">
              {activeTopic.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

          {/* Key Terms Glossary */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Key Terms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeTopic.keyTerms.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1"
                >
                  <div className="text-sm font-bold text-slate-900">{item.term}</div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Concept Code Example */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-900">
                Concept Example ({LANGUAGE_META[selectedLanguage].fileExtension})
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onAskTutorWithCode(selectedLanguage, activeTopic.exampleCode)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                  Ask AI Tutor
                </button>
                <button
                  type="button"
                  onClick={() => onOpenInCodeLab(selectedLanguage, activeTopic.exampleCode)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5" />
                  Try in Code Lab
                </button>
              </div>
            </div>

            <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 sm:p-5 overflow-x-auto text-sm font-mono leading-relaxed">
              <code>{activeTopic.exampleCode}</code>
            </pre>
          </div>
        </article>
      </div>
    </div>
  );
}
