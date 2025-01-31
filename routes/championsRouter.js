import { Router } from "express";
import { faker } from '@faker-js/faker';
import Champion from "../models/Champion.js";

const championsRouter = new Router();

championsRouter.get('/champions', async (req, res) => {
    const champions = await Champion.find({})
    res.json({
        "items": champions,
        "_links": {
            "self": {
                "href": `http://${process.env.selfLink}/champions`
            },
            "collection": {
                "href": `http://${process.env.selfLink}/champions`
            }
        }
    });
});

championsRouter.options('/champions', async (req, res) => {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    res.setHeader('Access-Control-Allow-Methods',"GET, POST, OPTIONS")
    res.status(204).send();
});

championsRouter.put('/champions/:id', async (req, res) => {
    const id = req.params.id;
    const { name, role, region, abilities, lore } = req.body;

    if (name && name.trim() !== "" && role && role.trim() !== "" && region && region.trim() !== "" && abilities && abilities.trim() !== "" && lore && lore.trim() !== "") {
        const updateChampion = await Champion.findByIdAndUpdate(id, {
            name,
            role,
            region,
            abilities,
            lore
        }, { new: true });
        res.json(updateChampion);
    } else {
        res.status(400).send();
    }
});

championsRouter.get('/champions/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const champion = await Champion.findById(id);
        if (champion) {
            res.json(champion);
        } else {
            res.status(404).send("Champion doesn't exist");
        }
    } catch (error) {
        res.status(500).send("Server error");
    }
});

championsRouter.options('/champions/:id', async (req, res) => {
    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS, PATCH");
    res.setHeader('Access-Control-Allow-Methods',"GET, PUT, DELETE, OPTIONS, PATCH")
    res.status(204).send();
});

championsRouter.delete('/champions/:id', async (req, res) => {
    const id = req.params.id;
    await Champion.findByIdAndDelete(id);
    res.status(204).send();
});

championsRouter.patch('/champions/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const updatedChampion = await Champion.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedChampion) {
            return res.status(404).send("Champion not found");
        }

        res.json(updatedChampion);
    } catch {
        res.status(400).send("Invalid update request");
    }
});

championsRouter.post('/champions', async (req, res) => {
    const seedAmount = req.body.amount;
    const method = req.body.method;

    if(method === "SEED"){
        await Champion.deleteMany({});

        for (let i = 0; i < seedAmount; i++) {
            let champion = new Champion({
                name: faker.person.fullName(),
                role: faker.person.jobTitle(),
                region: faker.location.country(),
                abilities: faker.lorem.sentence(),
                lore: faker.lorem.paragraph(),
            });
            await champion.save();
        }

        res.status(201).json({ message: "Champions seeded" });
    }

    const { name, role, region, abilities, lore } = req.body;
    if (name && name.trim() !== "" && role && role.trim() !== "" && region && region.trim() !== "" && abilities && abilities.trim() !== "" && lore && lore.trim() !== "") {
        const champion = new Champion({
            name,
            role,
            region,
            abilities,
            lore
        });
        await champion.save();
        res.status(201).json(champion);
    } else {
        res.status(400).send();
    }

});

export default championsRouter;
