import { storage } from '../storage';

/**
 * Lightweight RAG: keyword-match against topic titles and lesson content.
 * Returns top-k matching passages { topicId, lessonId, title, snippet }.
 */
export async function searchRelevantTopics(query: string, topK = 3) {
  const topics = await storage.getAllTopics();
  const q = query.toLowerCase();
  const scored = [];
  for (const t of topics) {
    const titleScore = (t.title || '').toLowerCase().includes(q) ? 3 : 0;
    let bestLesson = null;
    let lessonScore = 0;
    if (t.content && Array.isArray(t.content.lessons)) {
      for (const L of t.content.lessons) {
        const cont = (L.content || '').toLowerCase();
        let s = 0;
        if (cont.includes(q)) s += 2;
        if ((L.title||'').toLowerCase().includes(q)) s += 2;
        if (s > lessonScore) { lessonScore = s; bestLesson = L; }
      }
    }
    const score = titleScore + lessonScore;
    if (score > 0) {
      scored.push({ score, topic: t, lesson: bestLesson });
    }
  }
  scored.sort((a,b)=>b.score - a.score);
  const results = scored.slice(0, topK).map(s=>{
    const snippet = s.lesson ? (s.lesson.content || '').slice(0,200) : (s.topic.description||'').slice(0,200);
    return { topicId: s.topic.id, topicTitle: s.topic.title, lessonId: s.lesson?.id || null, lessonTitle: s.lesson?.title || null, snippet };
  });
  return results;
}
