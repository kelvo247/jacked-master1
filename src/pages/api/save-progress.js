import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, progress, progressHistory } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email or progress data' });
    }

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          progress,
          ...(progressHistory && { progressHistory }), // update if provided
        },
      },
      { new: true, upsert: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Progress saved!', user });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

