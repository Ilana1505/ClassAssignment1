import request from "supertest";
import initApp from "../server_2";
import mongoose from "mongoose";
import { Express } from "express";
import userModel, { IUser } from "../models/user_models";

let app: Express;

beforeAll(async () => {             
    console.log("Before all tests");
    app = await initApp();
     await userModel.deleteMany({});
});

afterAll(async () => {          
    console.log("After all tests");  
    await mongoose.connection.close();       
}); 

const baseUrl = "/auth";

type User = IUser & { token?: string };

const testUser:User = {
    email: "test@user.com",
    password: "testpassword",
}

describe("Auth Tests", () => {
    test("Auth test register", async () => {
        const response = await request(app).post(baseUrl + "/register").send(testUser);
        expect(response.statusCode).toBe(200);
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

    test("Auth test me", async () => {
        const response = await request(app).post("/posts").send({
            title: "Test Post",  
            content: "Test Content",
            owner: "User123",      
        });
        expect(response.statusCode).not.toBe(201);
        const response2 = await request(app).post("/posts").set(
            { authorization: "JWT  " + testUser.token }
        ).send({
            title: "Test Post",  
            content: "Test Content",
            owner: "User123",      
        });
        expect(response2.statusCode).toBe(201);
    });

    
});