export type StatusPenghuni = 'Active' | 'Leaving';

export class Penghuni {
  id!: string;
  name!: string;
  room!: string;
  phone!: string;
  moveInDate!: string;
  status!: StatusPenghuni;

  constructor(data: Penghuni) {
    Object.assign(this, data);
  }
}
