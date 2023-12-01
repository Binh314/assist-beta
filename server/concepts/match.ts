import OpenAI from "openai";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface SimilarityDoc extends BaseDoc {
  word1: string;
  word2: string;
  similarityScore: number;
}

export default class MatchConcept {
  public readonly similarities = new DocCollection<SimilarityDoc>("similarities");

  async getSimilarity(word1: string, word2: string) {
    word1 = word1.toLowerCase().trim();
    word2 = word2.toLowerCase().trim();

    const similarity = await this.similarities.readOne({
      $or: [
        { word1: word1, word2: word2 },
        { word1: word2, word2: word1 },
      ],
    });

    if (similarity) return similarity.similarityScore;

    const similarityScore = await this.calculateSimilarityScore(word1, word2);
    const _id = await this.similarities.createOne({ word1, word2, similarityScore });
    return similarityScore;
  }

  /**
   *
   * @returns array of similarity scores between all pairs of words between words1 and words2
   */
  async getSimilarities(words1: string[], words2: string[]) {
    const similarityScores = [];
    for (const word1 of words1) {
      for (const word2 of words2) {
        const similarityScore = this.getSimilarity(word1, word2);
        similarityScores.push(similarityScore);
      }
    }
    return similarityScores;
  }

  async calculateSimilarityScore(word1: string, word2: string) {
    const openai = new OpenAI({
      organization: "org-7mqWFFGa8zVxOyZdhgdNuTWh",
      apiKey: process.env.OPENAI_API_KEY,
    });
    const message = `from 0 to 100, how similar are the words "${word1}" and "${word2}". answer only with the number`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      temperature: 0,
      max_tokens: 1,
    });
    const similarityScoreString = response.choices[0].message.content;
    if (!similarityScoreString) return 0;
    return parseFloat(similarityScoreString);
  }
}
