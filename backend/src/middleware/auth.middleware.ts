import express from "express";
import { verifyToken } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userRole?: string;
        }
    }
}

function extractToken(req: express.Request): string | null {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
        return header.substring("Bearer ".length);
    }
    return null;
}

export function authRequired(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ message: "Niste prijavljeni" });
    }
    try {
        const payload = verifyToken(token);
        req.userId = payload.userId;
        req.userRole = payload.role;
        next();
    } catch {
        return res.status(401).json({ message: "Nevažeći ili istekao token" });
    }
}

export function optionalAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = extractToken(req);
    if (token) {
        try {
            const payload = verifyToken(token);
            req.userId = payload.userId;
            req.userRole = payload.role;
        } catch {
        }
    }
    next();
}

export function requireRole(...roles: string[]) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            return res.status(403).json({ message: "Nemate dozvolu za ovu akciju" });
        }
        next();
    };
}
