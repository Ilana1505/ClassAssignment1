import request from "supertest";
import initApp from "../server_2";
import mongoose from "mongoose";
import PostModel from "../models/post_models";
import { Express } from "express";
import UserModel, { iUser } from "../models/user_models";

let app: Express;

type User = iUser & { token?: string };

const testUser: User = {
    email: "test@user.com",
    password: "testpassword",
};

beforeAll(async () => {
    app = await initApp();
    console.log("Before all tests");
    await PostModel.deleteMany();
    await UserModel.deleteMany();
    
    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send(testUser);
    testUser.token = res.body.token;
    testUser._id = res.body._id;  
    expect(testUser.token).toBeDefined();
});

afterAll(async () => {
    console.log("After all tests");
    await mongoose.connection.close();
});

let postId = "";

const invalidPost = {
    content: "Test content",
};

describe("Post test", () => {

    test("Test get all post", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Test Create Post", async () => {
        const response = await request(app)
            .post("/posts")
            .set("Authorization", "JWT " + testUser.token)  
            .send({
                title: "Test Post",
                content: "Test Content",
                sender: testUser._id, 
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("Test Post");
        expect(response.body.content).toBe("Test Content");
        postId = response.body._id;
    });

    test("Test adding invalid post", async () => {
        const response = await request(app)
            .post("/posts")
            .set("Authorization", `JWT ${testUser.token}`)  
            .send(invalidPost);
        expect(response.statusCode).not.toBe(201);
    });

    test("Test get all posts after adding", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("Test get post by id", async () => {
        const response = await request(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    });

    test("Test get post by id fail", async () => {
        const response = await request(app).get("/posts/6779946864cff57e00fb4694");
        expect(response.statusCode).toBe(404);
    });

    test("Test get post by sender", async () => {
        const response = await request(app).get("/posts?sender=" + testUser._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);  
        expect(response.body[0].title).toBe("Test Post");
        expect(response.body[0].content).toBe("Test Content");
    });

    test("Test update post", async () => {
        const response = await request(app).put("/posts/" + postId)
            .send({ title: "Update Title", content: "Updated Content" });
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("Update Title");
        expect(response.body.content).toBe("Updated Content");
    });

    test("Test delete post", async () => {
        const response = await request(app).delete("/posts/" + postId)
            .set("Authorization", `JWT ${testUser.token}`); 
        expect(response.statusCode).toBe(200);
        const responseGet = await request(app).get("/posts/" + postId);
        expect(responseGet.statusCode).toBe(404);
    });

    test("Test delete post not found", async () => {
        const response = await request(app).delete("/posts/1234567890")
            .set("Authorization", `JWT ${testUser.token}`); 
        expect(response.statusCode).toBe(404);
    });
});
