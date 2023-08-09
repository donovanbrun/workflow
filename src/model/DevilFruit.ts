export default class DevilFruit {
  id: number = 0;
  name: string = "";
  type: string = "";

  constructor(data: any) {
    Object.assign(this, data);
  }
}