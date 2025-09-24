export class CreateTaskDto {
  tname!: string;
  tdesc?: string;
  status?: number;
  dueDate?: string | Date;
}
