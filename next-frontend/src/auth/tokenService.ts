class TokenService {
    #token: string | null = null;

    setToken(token: string) {
        this.#token = token;
    }

    getToken(): string | null {
        return this.#token;
    }

    clearToken() {
        this.#token = null;
    }

    isAuthenticated(): boolean {
        return !!this.#token;
    }
}

export const tokenService = new TokenService();
