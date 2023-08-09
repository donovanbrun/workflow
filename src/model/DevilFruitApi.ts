export default class DevilFruitApi {
  id: number = 0;
  french_name: string = "";
  roman_name: string = "";
  type: string = "";
  description: string = "";
  filename: string = "";
  technical_file: string | undefined;

  constructor(data: any) {
    Object.assign(this, data);
  }
}