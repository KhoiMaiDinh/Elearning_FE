export interface Preference {
  theme: string;
  categories: Category[];
  language: string;
}

export interface Category {
  translations: {
    language: string;
    name: string;
    description: string;
  }[];
  slug: string;
}
