const axios = require("axios");

const BACKEND_URL = "http://localhost:3000"

describe("Authentication", () => {
    test('User can signin when role is expicitly given', async () => {
        const username = "testNo1" + Math.random();
        const password = "123";
        const role = "admin";

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            role
        })
        expect(response.status).toBe(200);
    });

    test('User can signin when role is not given', async () => {
        const username = "testNo2" + Math.random();
        const password = "123";

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
        })
        expect(response.status).toBe(200);
    });

    test('User can signin only once', async () => {
        const username = "testNo3" + Math.random();
        const password = "test";

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        expect(response.status).toBe(200);

        await expect(axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
        type: "admin"
    })).rejects.toThrow("Request failed with status code 400");
    });
});