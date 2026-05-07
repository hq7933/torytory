export type Category = {
  id: string;
  name: string;
  color: string;
  sort_order: number;
  created_at: string;
};

export type Menu = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  sold_out: boolean;
  frozen: boolean;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category;
};

export type Setting = {
  key: string;
  value: string | null;
  updated_at: string;
};
