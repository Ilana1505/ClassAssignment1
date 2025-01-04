import request from "supertest";
import initApp from "../server_2";
import mongoose from "mongoose";
import CommentModel from "../models/comment_models";
import { Express } from "express";

let app: Express;

beforeAll(async () => {    
    app = await initApp();       
    console.log("Before all tests"); 
    await CommentModel.deleteMany();
});

afterAll(async() => {          
    console.log("After all tests");  
    await mongoose.connection.close();       
}); 

let commentId = "";

const testComment = {
    comment: "Test title",
    postId: "abcdefgh",
    sender: "user123",
};
  
const invalidComment = {
    comment: "Test title",
};

describe("Comment test", () => {

    test("Test get all comment", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Test adding new comment", async () => {
        const response = await request(app).post("/comments").send(testComment);
        expect(response.statusCode).toBe(201);
        expect(response.body.comment).toBe(testComment.comment);
        expect(response.body.postId).toBe(testComment.postId);
        expect(response.body.sender).toBe(testComment.sender);
        commentId = response.body._id;  
    });

    test("Test adding invalid comment", async () => {
        const response = await request(app).post("/comments").send(invalidComment);
        expect(response.statusCode).not.toBe(201);
    });

    test("Test get all comments after adding", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("Test get comment by id", async () => {
        const response = await request(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(commentId);
    });

    test("Test get comment by sender", async () => {
        const response = await request(app).get("/comments?sender=" + testComment.sender);        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(testComment.sender);
    });

    test("Test get comments by sender fail", async () => {
        const response = await request(app).get("/comments?sender=nonexistentUser");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Test update comment", async () => {
        const response = await request(app).put("/comments/" + commentId)
            .send({ comment: "Update Comment" });
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe("Update Comment");
    });

    test("Test update comment missing fields", async () => {
        const response = await request(app).put("/comments/" + commentId).send({});
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Missing required fields");
    });

    test("Test update comment not found", async () => {
        const response = await request(app).put("/comments/123456789012345678901234")
            .send({ comment: "Another update" });
        expect(response.statusCode).toBe(404);
    });

    test("Test update comment - catch block", async () => {
        const response = await request(app)
            .put("/comments/invalid-id") // יזום שגיאה על ידי מזהה לא תקני
            .send({ comment: "Updated comment" });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message"); 
    });

    test("Test delete comment", async () => {
        const response = await request(app).delete("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
        const responseGet = await request(app).get("/comments/" + commentId);
        expect(responseGet.statusCode).toBe(404);
    });

    test("Test delete comment not found", async () => {
        const response = await request(app).delete("/comments/1234567890");
        expect(response.statusCode).toBe(404);
    });

    test("Test get comments by postId", async () => {
        const responseCreate = await request(app).post("/comments").send(testComment);
        expect(responseCreate.statusCode).toBe(201);

        const response = await request(app).get("/comments/post/" + testComment.postId);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1); 
        expect(response.body[0].postId).toBe(testComment.postId);
    });

    test("Test get comments by Id - catch block", async () => {
        const response = await request(app)
            .get("/comments/invalid-post-id") 
            .send();

        expect(response.statusCode).toBe(400); 
        expect(response.body).toHaveProperty("message"); 
    });
});
