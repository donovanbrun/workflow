export default class Task {
  id: string = "";
  userId: string = "";
  creationDate: Date | undefined;
  modificationDate: Date | undefined;
  name: string = "";
  deadline: string = "";
  status: string = "";
  description: string = "";

  constructor(data: any) {
    Object.assign(this, data);
  }
}