import request from "supertest";
import initApp from "../server_2";
import mongoose from "mongoose";
import PostModel from "../models/post_models";
import { Express } from "express";

let app: Express;

beforeAll(async () => {             
    app = await initApp();
    console.log("Before all tests"); 
    await PostModel.deleteMany();
});

afterAll(async () => {          
    console.log("After all tests");  
    await mongoose.connection.close();       
}); 

let postId: string = "";

const testPost = {
    title: "Test title",
    content: "Test content",
    sender: "user123",
};

const invalidPost = {
    title: "Test title",
    content: "Test content",
    // sender is missing
};

describe("Post test", () => {

    test("Test get all post", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Test adding new post", async () => {
        const response = await request(app).post("/posts").send(testPost);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(testPost.title);
        expect(response.body.content).toBe(testPost.content);
        expect(response.body.sender).toBe(testPost.sender);
        postId = response.body._id;
    });

    test("Test adding invalid post", async () => {
        const response = await request(app).post("/posts").send(invalidPost);
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

    test("Test get post by id - catch block", async () => {
        const invalidPostId = "invalid-id"; 
        const response = await request(app).get("/posts/" + invalidPostId);
        expect(response.statusCode).toBe(400); 
        expect(response.body).toHaveProperty("message"); 
    });

    test("Test get post by sender", async () => {
        const response = await request(app).get("/posts?sender=" + testPost.sender);        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(testPost.sender);
    });

    test("Test update post", async () => {
        const response = await request(app).put("/posts/" + postId)
            .send({ title: "Update Title", content: "Updated Content" });
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("Update Title");
        expect(response.body.content).toBe("Updated Content");
    });

    test("Test update post - post not found", async () => {
        const nonExistentPostId = "60f5b2f5f1d4c6f8a5b8e5d6"; 
        const response = await request(app)
            .put("/posts/" + nonExistentPostId)
            .send({ title: "Updated Title", content: "Updated Content" });
        expect(response.statusCode).toBe(404); 
        expect(response.body.message).toBe("Post not found"); 
    });
    
    test("Test update post - error during update", async () => {
        const invalidPostId = "invalid-id";
        const response = await request(app)
            .put("/posts/" + invalidPostId)
            .send({ title: "Updated Title", content: "Updated Content" });
        expect(response.statusCode).toBe(400); 
        expect(response.body).toHaveProperty("message"); 
    });

    test("Test update post missing fields", async () => {
        const response1 = await request(app).put("/posts/" + postId).send({ content: "Updated Content" });
        expect(response1.statusCode).toBe(400);
        expect(response1.body.message).toBe("Missing required fields");

        const response2 = await request(app).put("/posts/" + postId).send({ title: "Updated Title" });
        expect(response2.statusCode).toBe(400);
        expect(response2.body.message).toBe("Missing required fields");
    });

    test("Test delete post", async () => {
        const response = await request(app).delete("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        const responseGet = await request(app).get("/posts/" + postId);
        expect(responseGet.statusCode).toBe(404);
    });

    test("Test delete post not found", async () => {
        const response = await request(app).delete("/posts/1234567890");
        expect(response.statusCode).toBe(404);
    });
});
