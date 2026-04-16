export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export class Tutorial {
  id?: number;
  title?: string;
  description?: string;
  published?: boolean;
  name?: string;
}
