"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importStar(require("express"));
exports.app = (0, express_1.default)();
exports.app.use((0, express_1.json)());
const resolutions = [
    'P144',
    'P240',
    'P360',
    'P480',
    'P720',
    'P1080',
    'P1440',
    'P2160',
];
const videos = [
    {
        id: 0,
        title: 'string',
        author: 'string',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: '2023-12-04T16:26:41.674Z',
        publicationDate: '2023-12-04T16:26:41.674Z',
        availableResolutions: ['P144'],
    },
];
exports.app.get('/videos', (_req, res) => {
    res.send(videos);
});
exports.app.get('/videos/:id', (req, res) => {
    const videoId = +req.params.id;
    const findedVideo = videos.find(({ id }) => id === videoId);
    if (!findedVideo) {
        res.sendStatus(404);
        return;
    }
    res.send(findedVideo);
});
exports.app.post('/videos', (req, res) => {
    let error = {
        errorMessages: [],
    };
    let { title, author, availableResolutions } = req.body;
    if (!title ||
        typeof title !== 'string' ||
        !title.trim() ||
        title.trim().length > 40) {
        error.errorMessages.push({ message: 'Invalid title!', field: 'title' });
    }
    if (!author ||
        typeof author !== 'string' ||
        !author.trim() ||
        author.trim().length > 20) {
        error.errorMessages.push({ message: 'Invalid author!', field: 'author' });
    }
    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach((resolution) => {
            !resolutions.includes(resolution) &&
                error.errorMessages.push({
                    message: 'Invalid availableResolutions!',
                    field: 'availableResolutions',
                });
        });
    }
    else {
        availableResolutions = [];
    }
    if (error.errorMessages.length) {
        res.status(400).send(error);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +new Date(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions,
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
