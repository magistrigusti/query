
const BASE_URL = 'http//localhost:3000';

export type TodoDto = {
  id: string;
  text: string;
  done: boolean;
};

export const todoListApi = {
  getLogoList: (
    { page }: { page: number }, 
    { signal }: { signal: AbortSignal }
  ) => {
    return (
      fetch(`${BASE_URL}/tasks?page=${page}`, {signal}).then(
        res => res.json() as Promise<TodoDto[]>
      )
    );
  }
}