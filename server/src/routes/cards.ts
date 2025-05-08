import { Router, Request, Response } from 'express';
import { prisma } from '../prismaClient';
import type { CardParams } from '../../../shared/interfaces';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

export const cardsRouter = Router();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        // Save images in the root 'public/uploads' directory
        const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads');  // This goes up two directories
        console.log('Upload path:', uploadPath);  // Check the final upload path

        // Ensure the directory exists
        if (!fs.existsSync(uploadPath)) {
            console.log('Creating uploads directory');
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); // Pass the corrected path to multer
    },
    filename: (_req, file, cb) => {
        // Use cardId for the filename
        cb(null, `${_req.params.cardId}.jpg`);
    },
});



export const upload = multer({ storage });


cardsRouter.get('/cards', async (_req: Request, res: Response): Promise<void> => {
    try {
        // Fetch cards, include join‐table entries, and pull the related records
        const cards = await prisma.card.findMany({
            include: {
                cardKeywords: {
                    include: { keyword: true }
                }
            }
        })

        // Optionally, flatten the relations into plain arrays:
        const result = cards.map(card => ({
            ...card,
            image_url: `${process.env.BASE_URL}/uploads/${card.id}.jpg`,
            keywords: card.cardKeywords.map(key => key.keyword)
        }))

        res.json(result)
    } catch (err) {
        console.error('Fetch cards error', err)
        res.status(500).json({ error: 'Failed to fetch cards' })
    }
})

cardsRouter.get('/card-data', async (_req: Request, res: Response): Promise<void> => {
    try {
        const [effects] = await Promise.all([
            prisma.keyword.findMany(),
        ]);
        res.json({ effects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch card data' });
    }
});


// Step 1: Create Card Route - No image handling here
// Step 1: Create Card Route (without image)
cardsRouter.post('/create-card', async (req, res) => {
    try {
        const {
            name,
            attack,
            defense,
            cost,
            type,
            color,
            subtype,
            rarity,
            effectName,
            effectType,
            effectText,
            keywordIds = [],
        } = req.body;

        // Prepare keyword relations
        const cardKeywords = (Array.isArray(keywordIds) ? keywordIds : [keywordIds]).map((id: number) => ({
            keyword: { connect: { id: Number(id) } },
        }));

        // Create card in DB (without the image)
        const createdCard = await prisma.card.create({
            data: {
                name,
                attack: attack ? Number(attack) : null,
                defense: defense ? Number(defense) : null,
                cost: Number(cost),
                type,
                color,
                subtype: subtype || null,
                rarity,
                effectName,
                effectType,
                effectText,
                cardKeywords: { create: cardKeywords },
            },
        });

        // Return the created card with its ID (no image yet)
        res.status(201).json({
            id: createdCard.id,
        });
    } catch (err) {
        console.error('Create card error', err);
        res.status(500).json({ error: 'Failed to create card' });
    }
});


cardsRouter.post('/upload-image/:cardId', upload.single('image'), async (_req: Request, res: Response): Promise<void> => {
    try {
        const { cardId } = _req.params;
        const imageFile = _req.file;

        if (!imageFile) {
            res.status(400).json({ error: 'Image file is required' });
            return; // Explicitly return after responding
        }

        // No need to update the database, just return the image URL
        const imageUrl = `/uploads/${cardId}.jpg`;

        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl, // The path to the image
        });
    } catch (err) {
        console.error('Image upload error', err);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
