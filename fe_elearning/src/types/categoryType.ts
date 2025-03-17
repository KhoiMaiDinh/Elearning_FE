export interface Category {
  parent_slug: string;
  slug: string;
  translations: {
    language: string;
    name: string;
    description: string;
  }[];
  parent?: Category;
  children?: Category[];
}
