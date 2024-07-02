export interface ITodo {
    id: number;
    name: string;
    completed: boolean;
}

export const data : ITodo[] = [
    {id: 1 , name: "HTML" , completed: true},
    {id: 2 , name: "CSS" , completed: false},
    {id: 3 , name: "React" , completed: false},
]