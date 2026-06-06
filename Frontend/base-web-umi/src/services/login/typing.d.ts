// src/services/login/typing.d.ts
export declare namespace LoginSpace {
  interface LoginParams {
    email?: string;
    password?: string;
  }

  interface LoginResponse {
    token?: string;
    role?: 'ADMIN' | 'STUDENT' | string;
    name?: string;
  }

  interface CurrentUser {
    name?: string;
    role?: 'ADMIN' | 'STUDENT' | string;
    avatar?: string;
  }
}

// Bổ sung thêm Interface cho State để dùng chung
export interface AppInitialState {
  currentUser?: LoginSpace.CurrentUser;
  permissionLoading?: boolean;
}