export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

export interface PaginatedData<T> {
    current_page: number
    data: T[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: {
        url?: string
        label: string
        active: boolean
    }[]
    next_page_url: any
    path: string
    per_page: number
    prev_page_url: any
    to: number
    total: number
};

export interface DatabaseObject {
    id:         number;
    created_at: string;
    updated_at: string;
};
