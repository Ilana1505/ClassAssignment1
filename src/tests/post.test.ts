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

let postId = "";

const testPost = {
    title: "Test title",
    content: "Test content",
    sender: "user123",
  }; 
  
const invalidPost = {
    content: "Test content",
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

    test("Test get post by sender", async () => {
        const response = await request(app).get("/posts?sender=" + testPost.sender);        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(testPost.sender);
    });

    test("Test get posts by sender fail", async () => {
        const response = await request(app).get("/posts?sender=nonexistentUser");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);  
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

    test("Test update post", async () => {
        const response = await request(app).put("/posts/" + postId)
            .send({ title: "Update Title", content: "Updated Content" });
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("Update Title");
        expect(response.body.content).toBe("Updated Content");
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
