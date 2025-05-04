export interface CommunityThread {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: {
      key: string;
    };
  };
}
