export interface User {
    id: number;
    username: string;
    password: string;
    instrument: string;
    role: 'player' | 'admin'; 
  }
  
  