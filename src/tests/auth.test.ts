import request from "supertest";
import initApp from "../server_2";
import mongoose from "mongoose";
import { Express } from "express";
import userModel, { iUser } from "../models/user_models";

let app: Express;

beforeAll(async () => {             
    console.log("Before all tests"); 
    app = await initApp();
    await userModel.deleteMany();
});

afterAll(async () => {          
    console.log("After all tests");  
    await mongoose.connection.close();       
}); 

const baseUrl = "/auth";

type User = iUser & { token?: string };

const testUser: User = {
    email: "test@user.com",
    password: "testpassword",
}

describe("Auth test", () => {
    test("Auth test register", async () => {
        const response = await request(app).post(baseUrl + "/register").send(testUser);
        expect(response.statusCode).toBe(200);
    });

    test("Auth test register missing password", async () => {
        const response = await request(app).post(baseUrl + "/register").send({
            email: "sender@example.com",
        });
        expect(response.statusCode).not.toBe(200);
    });

    test("Auth test register missing email", async () => {
        const response = await request(app).post(baseUrl + "/register").send({
            password: "password123",
        });
        expect(response.statusCode).not.toBe(200);
    });

    test("Auth test login", async () => {
        const response = await request(app).post(baseUrl + "/login").send(testUser);
        expect(response.statusCode).toBe(200);
        const token = response.body.token;
        expect(token).toBeDefined();
        expect(response.body._id).toBeDefined();
        testUser.token = token;
        testUser._id = response.body._id;
    });

    test("Auth test login invalid password", async () => {
        const response = await request(app).post(baseUrl + "/login").send({
            email: testUser.email,
            password: "wrongpassword",
        });
        expect(response.statusCode).not.toBe(200);
    });

    test("Auth test protected route with token", async () => {
        const loginResponse = await request(app).post(baseUrl + "/login").send(testUser);
        const token = loginResponse.body.token;

        const response = await request(app).post("/posts").set(
            { authorization: "JWT " + testUser.token }
        ).send({
            title: "Test Post",
            content: "Test Content",
            sender: "User123",
        });
        expect(response.statusCode).toBe(201);
    });

    test("Auth test protected route without token", async () => {
        const response = await request(app).post("/posts").send({
            title: "Test Post",
            content: "Test Content",
            sender: "User123",
        });
        expect(response.statusCode).not.toBe(201);
    });

    test("Auth test logout", async () => {
        const response = await request(app).post(baseUrl + "/logout").set({ authorization: "JWT " + testUser.token });
        expect(response.statusCode).toBe(200);
    });

 });
