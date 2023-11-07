export interface IProduct {
  id: number | null;
  name: string | null;
  description: string | null;
  price: number | null;
  availability: boolean | null;
}

export class Product implements IProduct {
  public id: number | null = null;
  public name: string | null = null;
  public description: string | null = null;
  public price: number | null = null;
  public availability: boolean | null = null;
}
