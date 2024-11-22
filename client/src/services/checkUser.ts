import { api } from './api';

export async function checkUser() {
    try {
        const response = await api.get('/user');

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}