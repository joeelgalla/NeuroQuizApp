import { QuizItem } from '../types';
import dermatomesData from '../data/dermatomes.json';
import myotomesData from '../data/myotomes.json';
import majorNervesData from '../data/major-nerves.json';

export class ContentService {
  private static instance: ContentService;
  private allItems: QuizItem[] = [];

  private constructor() {
    this.loadData();
  }

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  private loadData() {
    this.allItems = [
      ...dermatomesData as QuizItem[],
      ...myotomesData as QuizItem[],
      ...majorNervesData as QuizItem[]
    ];
  }

  getItemsByTopic(topic: string): QuizItem[] {
    return this.allItems.filter(item => item.topic === topic);
  }

  getRandomItems(topic: string, count: number = 10): QuizItem[] {
    const topicItems = this.getItemsByTopic(topic);
    const shuffled = this.shuffleArray([...topicItems]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  shuffleOptions(item: QuizItem): QuizItem {
    return {
      ...item,
      options: this.shuffleArray([...item.options])
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getAllTopics(): string[] {
    const topics = [...new Set(this.allItems.map(item => item.topic))];
    return topics;
  }
}