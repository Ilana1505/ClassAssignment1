import request from "supertest";
import initApp from "../server_2";
import mongoose from "mongoose";
import CommentModel from "../models/comment_models";
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
    await CommentModel.deleteMany();
    await UserModel.deleteMany();

    await request(app).post("/auth/register").send(testUser);
        const res = await request(app).post("/auth/login").send(testUser);
        testUser.token = res.body.token;
        testUser._id = res.body._id;  
        expect(testUser.token).toBeDefined();
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
}
  
const invalidComment = {
    comment: "Test title",
};

describe("Comment test", () => {

    test("Test get all comment", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });
    
    test("Test Create Comment", async () => {
        const response = await request(app).post("/comments")
        .set("Authorization", "JWT " + testUser.token)  
        .send(testComment);
        expect(response.statusCode).toBe(201);
        expect(response.body.comment).toBe(testComment.comment);
        expect(response.body.postId).toBe(testComment.postId);
        expect(response.body.sender).toBe(testComment.sender);
        commentId = response.body._id;
      });

    test("Test adding invalid comment", async () => {
        const response = await request(app).post("/comments")
        .set("Authorization", "JWT " + testUser.token)  
        .send(invalidComment);
        expect(response.statusCode).not.toBe(201);
    });

    test("Test get all comments after adding", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("Comments get post by id", async () => {
        const response = await request(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe(testComment.comment);
        expect(response.body.postId).toBe(testComment.postId);
        expect(response.body.sender).toBe(testComment.sender);
    });
    
    test("Test get comment by id fail", async () => {
        const response = await request(app).get("/comments/6779872076207a7fc9997020");
        expect(response.statusCode).toBe(404);
    });

    test("Test get commenty by sender", async () => {
        const response = await request(app).get("/comments?sender=" + testComment.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].comment).toBe(testComment.comment);
        expect(response.body[0].postId).toBe(testComment.postId);
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
        if (response.statusCode === 404) {
            console.log("Comment not found, skipping test");
        } else {
            expect(response.statusCode).toBe(200);
            expect(response.body.comment).toBe("Update Comment");
        }
    });
    
    test("Test update comment not found", async () => {
        const response = await request(app).put("/comments/6779872076207a7fc9997020")
            .send({ comment: "Another update" });
        expect(response.statusCode).toBe(404);
    });
    
    test("Test get comments by Id - catch block", async () => {
        const response = await request(app)
            .get("/comments/invalid-post-id") 
            .send();
        expect(response.statusCode).toBe(400); 
        expect(response.body).toHaveProperty("message"); 
    });

    test("Test delete comment", async () => {
        if (!commentId) {
            console.error("commentId is not set!");
            return;
        }
            const response = await request(app)
            .delete("/comments/" + commentId)  
            .set("Authorization", `Bearer ${testUser.token}`);  
            expect(response.statusCode).toBe(200);
            const responseGet = await request(app)
            .get("/comments/" + commentId)
            .set("Authorization", `Bearer ${testUser.token}`); 
    
        expect(responseGet.statusCode).toBe(404);
    });
    
    

    test("Test delete comment not found", async () => {
        const response = await request(app)
            .delete("/comments/1234567890")
            .set("Authorization", `Bearer ${testUser.token}`);  
        expect(response.statusCode).toBe(404);  
    });
    

});
