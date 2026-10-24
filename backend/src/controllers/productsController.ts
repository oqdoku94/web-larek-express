import express from 'express';
import Product from '../models/products';

export const getAllProducts = (_req: express.Request, res: express.Response) => {
  Product.find({}).then((products) => {
    res.send({
      items: products,
      total: products.length,
    });
  })
    .catch((err) => { res.send(err); });
};

export const createProduct = (req: express.Request, res: express.Response) => {
  Product.create({
    title: req.body.title,
    image: {
      fileName: req.body.image.fileName,
      originalName: req.body.image.originalName,
    },
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
  }).then((r) => res.send(r))
    .catch((err) => res.status(400).send(err));
};
