import { Request, Response } from "express";
import { Model } from "mongoose";

interface PostFilter {
  postId?: string; // Optional filter by postId
  sender?: string; // Optional filter by sender
}

class BaseController <T>{
    model: Model<T>;
    constructor(model: Model<T>) {
        this.model = model;
    }
    
      async CreateItem(req: Request, res: Response) {
        try {
          const data = await this.model.create(req.body);
          res.status(201).send(data);
        } catch (error) {
          res.status(400);
          res.send(error);
        }
      }
    
      async GetAll(req: Request, res: Response) {
      console.log(req.query);
      console.log(req.params);
        const { sender } = req.query;  
        const { postId } = req.params;  
        try {
            const filter : PostFilter = {};
            if (sender) {
                filter.sender = sender as string;
            }
            if (postId) {
                filter.postId = postId as string;  
            }
            const data = await this.model.find(filter);
            res.send(data);
        } catch (error) {
            res.status(400).send(error);
        }
    }
    
    async GetById(req: Request, res: Response) {
        const Id = req.params.id;
        try {
            const data = await this.model.findById(Id);
            if (data) {
                res.send(data);
            } else {
                res.status(404).send("Id not found");
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async UpdateItem(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const data = await this.model.findByIdAndUpdate(id, req.body, { new: true });
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(404).send( "Item not found" );
            }
        } catch (error) {
             res.status(400).send(error);
        }
    }
    
    async DeleteItem(req: Request, res: Response) {
        const Id = req.params.id;
        try {
            await this.model.findByIdAndDelete(Id);
            res.status(200).send();
        } catch (error) {
            res.status(404).send(error);
        }
    }

}

const CreateController = <T>(model: Model<T>) => {
    return new BaseController(model);
}
export default CreateController;
