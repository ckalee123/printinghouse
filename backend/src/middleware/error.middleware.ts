import express from "express";
import multer from "multer";

export class AppError extends Error {
    status: number;
    constructor(message: string, status = 400) {
        super(message);
        this.status = status;
    }
}

export function errorMiddleware(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    let status = err instanceof AppError ? err.status : 500;
    if (err instanceof multer.MulterError) {
        status = 400;
    }
    if (status === 500) {
        console.error(err);
    }
    res.status(status).json({ message: err.message || "Greška na serveru" });
}

export function notFoundMiddleware(req: express.Request, res: express.Response) {
    res.status(404).json({ message: "Ruta ne postoji" });
}
