import { connectToDatabase } from "./_connector";

export default async (req, res) => {
  const db = await connectToDatabase();
  const link = req.body && req.body.link;

  if (!link) {
    res.statusCode = 409;
    res.json({ error: 'no_link_found', error_description: 'No link found' });
    return;
  }

  const entry = await db.db('links_db').collection('links_collection').insertOne({ link });
  res.statusCode = 201;
  res.json({ short_link: `${process.env.VERCEL_URL}/r/${entry.insertedId}` });


}